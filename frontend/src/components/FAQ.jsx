import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiPlus, FiMinus } from 'react-icons/fi'
import axios from 'axios'

/* ── Fallback FAQs shown while loading or on error ── */
const FALLBACK_FAQS = [
  {
    uuid: 'fallback-1',
    question: 'Where does LeadRadar get its lead and contact data?',
    answer: 'Our extraction engine aggregates real-time data from Google Maps, WHOIS records, professional networks, and local business directories to deliver verified decision-maker contact details.',
  },
  {
    uuid: 'fallback-2',
    question: 'How does the free trial work?',
    answer: "Launch your free workspace instantly with zero friction — no credit card required. Get immediate access to run your first scans and see the data before upgrading.",
  },
]

/* ── Skeleton ── */
function Skeleton() {
  return (
    <div className="flex flex-col gap-3">
      {[1, 2, 3, 4, 5].map(i => (
        <div
          key={i}
          className="skeleton rounded-2xl"
          style={{ height: '64px', opacity: 1 - i * 0.15 }}
        />
      ))}
    </div>
  )
}

/* ── Single FAQ item ── */
function FAQItem({ faq, index, isOpen, onToggle }) {
  return (
    <motion.div
      className="rounded-2xl overflow-hidden cursor-pointer"
      style={{
        background: isOpen ? '#AABBC5' : 'rgba(170,187,197,0.05)',
        border:     isOpen ? '1px solid rgba(255,255,255,0.20)' : '1px solid rgba(170,187,197,0.10)',
        boxShadow:  isOpen ? '0 8px 32px rgba(170,187,197,0.20), inset 0 1px 0 rgba(255,255,255,0.25)' : 'none',
        transition: 'background 0.4s ease, border 0.4s ease, box-shadow 0.4s ease',
      }}
      onClick={onToggle}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      {/* Question row */}
      <div className="flex items-center justify-between px-6 py-5 gap-4">
        <h3
          className="font-syne text-base md:text-lg font-bold leading-snug flex-1"
          style={{ color: isOpen ? '#212023' : '#FFFFFF' }}
        >
          {faq.question}
        </h3>
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300"
          style={{
            background: isOpen ? 'rgba(33,32,35,0.15)' : 'rgba(170,187,197,0.10)',
            border:     isOpen ? '1px solid rgba(33,32,35,0.12)' : '1px solid rgba(170,187,197,0.15)',
          }}
        >
          {isOpen
            ? <FiMinus size={14} color="#212023" />
            : <FiPlus  size={14} color="#AABBC5" />
          }
        </div>
      </div>

      {/* Answer */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <div
              className="px-6 pb-6"
              style={{ borderTop: '1px solid rgba(33,32,35,0.12)' }}
            >
              <p
                className="text-sm leading-relaxed pt-4"
                style={{ color: 'rgba(33,32,35,0.78)' }}
              >
                {faq.answer}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

/* ── Main export ── */
export default function FAQ() {
  const [faqs,      setFaqs]      = useState([])
  const [loading,   setLoading]   = useState(true)
  const [openIndex, setOpenIndex] = useState(0)

  useEffect(() => {
    axios.get('/api/v1/faqs')
      .then(res => {
        setFaqs(res.data.data)
        setLoading(false)
      })
      .catch(() => {
        // On error show fallback FAQs
        setFaqs(FALLBACK_FAQS)
        setLoading(false)
      })
  }, [])

  const toggle  = (i) => setOpenIndex(prev => prev === i ? null : i)
  const display = loading ? [] : faqs

  return (
    <section className="py-24 px-4 md:px-10" style={{ background: '#262626' }}>
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">

          {/* Left — sticky heading */}
          <motion.div
            className="flex flex-col gap-5 md:sticky md:top-32"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <span className="badge badge-casper w-fit">FAQ</span>
            <h2 className="font-syne text-4xl md:text-5xl font-black leading-tight tracking-tight text-white">
              Frequently asked<br />
              <span className="text-casper">questions.</span>
            </h2>
            <p className="text-base leading-relaxed text-dove max-w-sm">
              Everything you need to know about LeadRadar before you launch your first scan.
            </p>
            <a href="#get-started" className="btn-primary w-fit mt-2 px-6 py-3 rounded-xl text-sm">
              Launch Free Workspace
            </a>
          </motion.div>

          {/* Right — skeleton or accordion */}
          <div className="flex flex-col gap-3">
            {loading
              ? <Skeleton />
              : display.map((faq, i) => (
                  <FAQItem
                    key={faq.uuid}
                    faq={faq}
                    index={i}
                    isOpen={openIndex === i}
                    onToggle={() => toggle(i)}
                  />
                ))
            }
          </div>

        </div>
      </div>
    </section>
  )
}
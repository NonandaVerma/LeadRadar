import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { FiSearch, FiFilter, FiTrendingUp } from 'react-icons/fi'

const steps = [
  { icon: FiSearch,     title: 'Pick a Category & City', desc: 'Choose from 13 business categories — restaurants, salons, jewellers, coaching centres and more. Then type any Indian city.' },
  { icon: FiFilter,     title: 'We Find the Gap',        desc: 'LeadRadar scans OpenStreetMap for every matching business and flags those with no website — your warm pitch targets.' },
  { icon: FiTrendingUp, title: 'Export & Pitch',         desc: 'Download a formatted Excel sheet with name, address, phone, hours. Walk in with a proposal they cannot ignore.' },
]

function StepCard({ step, i }) {
  const ref    = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <motion.div ref={ref} className="glass-card rounded-2xl p-8 flex flex-col gap-5"
      initial={{ opacity: 0, y: 50, scale: 0.94 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.6, delay: i * 0.15, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="flex items-center justify-between">
        <motion.div className="w-12 h-12 rounded-xl flex items-center justify-center"
          style={{ background: 'rgba(170,187,197,0.1)', border: '1px solid rgba(170,187,197,0.18)' }}
          whileHover={{ scale: 1.1, background: 'rgba(170,187,197,0.2)' }}
          transition={{ type: 'spring', stiffness: 400 }}
        >
          <step.icon size={20} className="text-casper" />
        </motion.div>
        <span className="font-syne text-5xl font-black opacity-10 text-casper">
          {String(i + 1).padStart(2, '0')}
        </span>
      </div>
      <div>
        <h3 className="font-syne text-lg font-bold mb-2 text-white">{step.title}</h3>
        <p className="text-sm leading-relaxed text-casper/70">{step.desc}</p>
      </div>
    </motion.div>
  )
}

export default function HowItWorks() {
  const ref    = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <section id="how-it-works" className="py-28 px-6 bg-black-base">
      <div className="max-w-6xl mx-auto">
        <motion.div ref={ref}
          initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <p className="text-xs font-semibold tracking-widest uppercase mb-3 text-casper">The process</p>
          <h2 className="font-syne text-3xl md:text-5xl font-black mb-16 leading-tight text-white">
            Three steps to your<br /><span className="text-casper">next client.</span>
          </h2>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((step, i) => <StepCard key={i} step={step} i={i} />)}
        </div>
      </div>
    </section>
  )
}
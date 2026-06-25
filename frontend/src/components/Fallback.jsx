import { motion } from 'framer-motion'
import { FiSearch, FiMapPin, FiDownload } from 'react-icons/fi'

const hints = [
  { icon: FiSearch,   text: 'Pick a category then enter any city — Jodhpur, Jaipur, Udaipur, Mumbai' },
  { icon: FiMapPin,   text: 'Businesses without websites are highlighted as your pitch targets' },
  { icon: FiDownload, text: 'Export the full lead list as a formatted Excel file instantly' },
]

export default function Fallback() {
  return (
    <section id="results" className="py-24 px-6 bg-black-base">
      <div className="max-w-3xl mx-auto text-center flex flex-col items-center gap-8">

        <motion.div className="w-20 h-20 rounded-2xl flex items-center justify-center"
          style={{ background: 'rgba(170,187,197,0.08)', border: '1px solid rgba(170,187,197,0.15)' }}
          initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.1 }}
        >
          <FiSearch size={32} className="text-casper" />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
          <h3 className="font-syne text-2xl font-black mb-3 text-white">
            Your lead list starts with a city.
          </h3>
          <p className="text-sm leading-relaxed max-w-md mx-auto text-casper/70">
            Select a category, enter a city name above, and LeadRadar will find every
            local business with no website — ready to pitch.
          </p>
        </motion.div>

        <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-4">
          {hints.map((hint, i) => (
            <motion.div key={i} className="glass-card rounded-xl p-5 flex flex-col items-center gap-3 text-center"
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0,  scale: 1    }}
              transition={{ delay: 0.35 + i * 0.1, type: 'spring', stiffness: 260, damping: 22 }}
              whileHover={{ y: -4 }}
            >
              <div className="w-9 h-9 rounded-lg flex items-center justify-center"
                style={{ background: 'rgba(170,187,197,0.1)' }}>
                <hint.icon size={16} className="text-casper" />
              </div>
              <p className="text-xs leading-relaxed text-casper/70">{hint.text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
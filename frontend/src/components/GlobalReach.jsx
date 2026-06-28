import { motion } from 'framer-motion'
import Globe from './ui/globe'

export default function GlobalReach() {
  return (
    <section
      className="relative w-full overflow-hidden py-24"
      style={{ background: '#0e0e10', minHeight: '560px' }}
    >
      <div className="max-w-7xl mx-auto px-8 md:px-16 relative">

        {/* ── Globe — center-right, half cut ── */}
        <div
          className="absolute z-0"
          style={{
            right: '-200px',
            top: '50%',
            transform: 'translateY(-50%)',
            width: '720px',
            height: '720px',
          }}
        >
          {/* Left fade */}
          <div
            className="absolute inset-0 z-10 pointer-events-none"
            
          />
          {/* Bottom fade */}
          <div
            className="absolute inset-0 z-10 pointer-events-none"
           
          />
          <Globe className="w-full h-full" />
        </div>

        {/* ── Content — left, centered vertically ── */}
        <div className="relative z-10 max-w-lg flex flex-col gap-6 py-10">

          <motion.span
            className="badge badge-casper w-fit"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.5 }}
          >
            Borderless Prospecting
          </motion.span>

          <motion.h2
            className="font-syne text-4xl md:text-5xl lg:text-6xl font-black leading-tight tracking-tight text-white"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            Scale beyond your<br />
            <span className="text-casper">local zip code.</span>
          </motion.h2>

          <motion.p
            className="text-base leading-relaxed text-dove"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            Don't limit your pipeline to your own city. LeadRadar's global mapping
            engine lets you uncover offline businesses and close high-paying clients
            in London, Dubai, or New York — all from your current desk.
          </motion.p>

          <motion.div
            className="flex flex-wrap gap-4 mt-2"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <button className="btn-primary px-6 py-3 rounded-xl text-sm">
              Launch Global Scan
            </button>
            <button
              className="px-6 py-3 rounded-xl text-sm font-semibold text-white transition-all duration-200"
              style={{ border: '1px solid rgba(170,187,197,0.25)' }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(170,187,197,0.08)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              View Coverage Area
            </button>
          </motion.div>
        </div>

      </div>
    </section>
  )
}
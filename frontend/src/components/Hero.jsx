import { motion } from 'framer-motion'
import { FiMapPin } from 'react-icons/fi'
import heroBg from '../assets/heroBanner.avif'

const WORDS = ['Find', 'businesses', 'before', 'they', 'go', 'online.']

export default function Hero() {
  return (
    <section id="hero" className="relative min-h-screen flex flex-col items-center justify-center px-6 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${heroBg})` }} />
      <div className="absolute inset-0" style={{
        background: 'linear-gradient(to bottom, rgba(38,38,38,0.15) 0%, rgba(38,38,38,0.4) 40%, rgba(38,38,38,0.82) 70%, rgba(38,38,38,1) 100%)'
      }} />

      <div className="relative z-10 max-w-4xl w-full text-center flex flex-col items-center gap-7">

        {/* Eyebrow badge */}
        <motion.span
          className="badge badge-casper"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <FiMapPin size={11} className="mr-1.5" /> Local Business Intelligence
        </motion.span>

        {/* Word-by-word heading */}
        <h1 className="font-syne text-5xl md:text-7xl font-black leading-tight tracking-tight">
          {WORDS.map((word, i) => (
            <motion.span
              key={i}
              className="inline-block mr-[0.22em]"
              style={{ color: i === 4 ? '#AABBC5' : '#FFFFFF' }}
              initial={{ opacity: 0, y: 40, filter: 'blur(8px)' }}
              animate={{ opacity: 1, y: 0,  filter: 'blur(0px)' }}
              transition={{ duration: 0.55, delay: 0.25 + i * 0.09, ease: [0.16, 1, 0.3, 1] }}
            >
              {word}
            </motion.span>
          ))}
        </h1>

        {/* Subtitle */}
        <motion.p
          className="text-base md:text-lg font-light max-w-xl leading-relaxed text-casper/80"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.85 }}
        >
          LeadRadar scans any city for local businesses with zero web presence —
          your next freelance client is already waiting.
        </motion.p>

        {/* CTA button — scroll to how it works */}
        <motion.a
          href="#how-it-works"
          className="mt-2 px-8 py-4 rounded-2xl text-sm font-bold no-underline flex items-center gap-2"
          style={{ background: '#AABBC5', color: '#212023', boxShadow: '0 4px 24px rgba(170,187,197,0.35)' }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.1 }}
          whileHover={{ scale: 1.05, background: '#C2D4DC', boxShadow: '0 8px 32px rgba(170,187,197,0.45)' }}
          whileTap={{ scale: 0.97 }}
        >
          Get Started — It's Free
        </motion.a>

        {/* Hint */}
        <motion.p
          className="text-xs text-dove/70"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4 }}
        >
          No account needed to explore · Sign up to scan & export
        </motion.p>
      </div>

      {/* Scroll cue */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        transition={{ delay: 1.8 }}
      >
        <span className="text-xs tracking-widest uppercase text-casper">Scroll</span>
        <motion.div
          className="w-px h-8"
          style={{ background: 'linear-gradient(to bottom, #AABBC5, transparent)' }}
          animate={{ scaleY: [1, 0.5, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </motion.div>
    </section>
  )
}
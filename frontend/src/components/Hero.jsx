import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import heroBg from '../assets/heroBanner.jpg'
import { Link } from 'react-router-dom'
import { IoIosRocket } from "react-icons/io";

const HEADING = 'Detect the Invisible Market Before Your Competitors Do.'
const WORDS = HEADING.split(' ')  // Split into words for animation, keeping punctuation attached

export default function Hero() {
  const sectionRef = useRef(null)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  })

  // Parallax transforms — different depths for layered feel
  const bgY  = useTransform(scrollYProgress, [0, 1], ['0%', '30%'])
  const contentY   = useTransform(scrollYProgress, [0, 1], ['0%', '18%'])
  const subtitleY  = useTransform(scrollYProgress, [0, 1], ['0%', '10%'])
  const ctaY = useTransform(scrollYProgress, [0, 1], ['0%', '6%'])

  return (
    <section ref={sectionRef} id="hero" className="relative z-10 min-h-[160vh] flex flex-col items-center justify-center px-6 overflow-hidden rounded-b-[5rem] "  style={{ borderBottom: '1px solid rgba(170,187,197,0.15)' }}>
      {/* ── Background image with its own parallax layer ── */}
      <motion.div className="absolute bg-cover bg-center scale-110" style={{ backgroundImage: `url(${heroBg})`, y: bgY, inset: '-8px' }} />

      {/* ── Gradient overlay ── */}
      <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(38,38,38,0.10) 0%, rgba(38,38,38,0.38) 35%, rgba(38,38,38,0.75) 65%, rgba(38,38,38,0.88) 100%)'}}/>

      {/* ── Main content block ── */}
      <motion.div className="relative z-10 max-w-4xl w-full text-center flex flex-col items-center gap-8" style={{ y: contentY }} >
        <h1 className="font-syne text-4xl md:text-[4rem] lg:text-[4rem] font-black leading-[1.12] tracking-tight">
          { 
            WORDS.map((word, i) => {
            const isAccent = word === 'Invisible'
            return (
              <motion.span  key={i} className="inline-block mr-[0.22em]" style={{ color: isAccent ? '#AABBC5' : '#FFFFFF' }} initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7,  delay: 0.2 + i * 0.07,  ease: [0.25, 0.46, 0.45, 0.94], }}> { word }  </motion.span>
            )})
          }
        </h1>

        {/* Subtitle — its own parallax layer */}
        <motion.p className="text-base md:text-[1.075rem]  text-white  font-light max-w-2xl leading-relaxed" style={{ color: 'rgba(170,187,197,0.90)', y: subtitleY }} initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.75, delay: 0.85, ease: [0.25, 0.46, 0.45, 0.94] }} >
          LeadRadar is the ultimate prospecting engine that scans entire cities to pinpoint
          businesses with missing or weak digital footprints. Uncover hidden opportunities,
          extract verified decision-maker contacts, and deploy AI-driven proposals — all from
          one platform.
        </motion.p>

       {/* CTA block */}
        <motion.div className="flex flex-col items-center gap-5 mt-4" style={{ y: ctaY }} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 1.1, ease: [0.25, 0.46, 0.45, 0.94] }} >
          <Link to="/get-started" 
          className="cta-btn relative overflow-hidden inline-flex items-center gap-2 px-9 py-4 rounded-2xl text-sm font-bold no-underline select-none bg-casper text-darktext" style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.18)' }}>
            <span className="relative z-10 flex items-center gap-2">
              <span className="relative z-10 flex items-center gap-2">
                <IoIosRocket className="text-darktext text-base" />
                Launch Your Free Workspace
              </span>      
            </span>
          </Link>

          <p className="tracking-wide text-white/70"> Create an account in 30 seconds to run your first scan. </p>
        </motion.div>
      </motion.div>

      {/* ── Scroll cue ── */}
      <motion.div  className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2" initial={{ opacity: 0 }} animate={{ opacity: 0.55 }} transition={{ delay: 1.9 }}>
        <span className="font-medium tracking-[0.2em] uppercase" style={{ color: '#AABBC5' }}> Scroll </span>
        <motion.div className="w-px h-8" style={{ background: 'linear-gradient(to bottom, #AABBC5, transparent)' }} animate={{ scaleY: [1, 0.45, 1], opacity: [0.45, 1, 0.45] }} transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}/>
      </motion.div>

      <style>
        {`
          .cta-btn:hover .cta-sweep {
            transform: scaleX(1);
          }
          .cta-btn:active {
            transform: scale(0.975);
            transition: transform 0.1s ease;
          }
        `}
      </style>
    </section>
  )
}
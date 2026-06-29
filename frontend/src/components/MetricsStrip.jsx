import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { FiGlobe, FiSearch, FiZap, FiTarget } from 'react-icons/fi'


const METRICS = [
  {
    Icon: FiGlobe,
    number: 50,
    suffix: 'M+',
    label: 'Businesses Indexed',
  },
  {
    Icon: FiSearch,
    number: 25,
    suffix: '+',
    label: 'Digital Gaps Tracked',
  },
  {
    Icon: FiZap,
    number: 30,
    suffix: 's',
    prefix: '< ',
    label: 'Average Scan Time',
  },
  {
    Icon: FiTarget,
    number: 99,
    suffix: '%',
    label: 'Contact Accuracy',
  },
]

function useCounter(target, duration = 1800, started = false) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!started) return
    let rafId
    let startTime = null

    const step = (timestamp) => {
      if (!startTime) startTime = timestamp
      const elapsed = timestamp - startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 4)
      setCount(Math.floor(eased * target))
      if (progress < 1) {
        rafId = requestAnimationFrame(step)
      } 
      else {
        setCount(target)
      }
    }

    rafId = requestAnimationFrame(step)
    return () => cancelAnimationFrame(rafId)
  }, [started, target, duration])

  return count
}

function MetricItem({ Icon, number, suffix, label, started, index }) {
  const count = useCounter(number, 1600 + index * 120, started)

  return (
    <motion.div className="flex flex-col items-center gap-3 px-10 py-2" initial={{ opacity: 0, y: 20 }}
      animate={started ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.55,
        delay: index * 0.12,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
    >
      <Icon size={22} color="#AABBC5" />

      <div className="font-syne text-3xl md:text-4xl font-black tracking-tight leading-none text-white">
        <span className="text-white">  {count}{suffix}</span>
      </div>

      <p className="text-xs font-medium tracking-wide text-center text-casper"> {label} </p>
    </motion.div>
  )
}

export default function MetricsStrip() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <section className="w-full px-4 md:px-12 py-10">
      <motion.div ref={ref} className="mx-auto w-full max-w-5xl rounded-full flex flex-wrap items-center justify-around gap-y-8 py-10 px-4"
        style={{
          background: 'rgba(255,255,255,0.04)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          border: '1px solid rgba(170,187,197,0.12)',
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.06), 0 8px 40px rgba(0,0,0,0.35)',
        }}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.65, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        {METRICS.map((metric, i) => (
          <div key={i} className="flex items-center">
            <MetricItem {...metric} index={i} started={isInView} />

            {i < METRICS.length - 1 && (
              <div className="hidden md:block h-14 w-px bg-casper/10" />
            )}
          </div>
        ))}
      </motion.div>
    </section>
  )
}
import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import axios from 'axios'
import { FiRadio, FiFileText, FiUser, FiCpu, FiMail, FiTrello, FiBarChart2, FiStar, FiPhone } from 'react-icons/fi'

const ICON_MAP = { FiRadio, FiFileText, FiUser, FiCpu, FiMail, FiTrello, FiBarChart2, FiStar, FiPhone }

// stacked image carousel
function ImageStack({ features, active }) {
  const total = features.length
  if (total === 0) return null

  const indices = [
    (active - 1 + total) % total,
    active,
    (active + 1) % total,
  ]

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {indices.map((idx, stackPos) => {
        const isCenter = stackPos === 1
        const isLeft   = stackPos === 0
        return (
          <motion.div
            key={features[idx].uuid}
            className="absolute rounded-2xl overflow-hidden"
            style={{
              width:  isCenter ? '72%' : '58%',
              height: isCenter ? '85%' : '70%',
              zIndex: isCenter ? 10 : isLeft ? 5 : 4,
            }}
            animate={{
              x:       isCenter ? 0 : isLeft ? '-38%' : '38%',
              scale:   isCenter ? 1 : 0.88,
              opacity: isCenter ? 1 : 0.4,
              rotateY: isCenter ? 0 : isLeft ? 8 : -8,
              filter:  isCenter ? 'brightness(1)' : 'brightness(0.45)',
            }}
            transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <img src={features[idx].image_url} alt={features[idx].title} className="w-full h-full object-cover" loading="lazy" />
            { !isCenter && (
              <div className="absolute inset-0" style={{ background: 'rgba(14,14,16,0.5)' }} />
            )}
            {isCenter && (
              <div className="absolute inset-0 rounded-2xl pointer-events-none" style={{ border: '1px solid rgba(170,187,197,0.25)' }}  />
            )}
          </motion.div>
        )
      })}
    </div>
  )
}

// skeleton loader
function Skeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center min-h-120">
      {/* Image placeholder */}
      <div className="h-105 rounded-2xl skeleton" />
      {/* Content placeholders */}
      <div className="flex flex-col gap-5">
        <div className="skeleton h-12 w-12 rounded-xl" />
        <div className="skeleton h-4 w-16 rounded-full" />
        <div className="skeleton h-10 w-3/4 rounded-xl" />
        <div className="skeleton h-px w-full" />
        <div className="skeleton h-4 w-full rounded-full" />
        <div className="skeleton h-4 w-5/6 rounded-full" />
        <div className="skeleton h-4 w-4/6 rounded-full" />
        <div className="flex gap-2 mt-2">
          {[...Array(9)].map((_, i) => (
            <div key={i} className="skeleton h-2 w-6 rounded-full" />
          ))}
        </div>
      </div>
    </div>
  )
}

export default function FeatureShowcase() {
  const [features, setFeatures] = useState([])
  const [loading,  setLoading]  = useState(true)
  const [error,    setError]    = useState(null)
  const [active,   setActive]   = useState(0)
  const [paused,   setPaused]   = useState(false)
  const intervalRef             = useRef(null)


  useEffect(() => {
    axios.get('/api/v1/features')
      .then(res => {
        setFeatures(res.data.data)
        setLoading(false)
      })
      .catch(err => {
        console.error('Failed to load features:', err)
        setError('Failed to load features.')
        setLoading(false)
      })
  }, [])

  // auto play carousel 
  useEffect(() => {
    if (paused || features.length === 0) return
    intervalRef.current = setInterval(() => {
      setActive(p => (p + 1) % features.length)
    }, 3500)
    return () => clearInterval(intervalRef.current)
  }, [paused, active, features.length])

  const goTo = (i) => {
    clearInterval(intervalRef.current)
    setActive(i)
  }

  const prev = () => goTo((active - 1 + features.length) % features.length)
  const next = () => goTo((active + 1) % features.length)

  const getIcon = (iconKey) => ICON_MAP[iconKey] || FiRadio

  return (
    <section className="w-full py-24 px-4 md:px-10" style={{ background: '#0e0e10' }} onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <div className="max-w-7xl mx-auto flex flex-col gap-16">

        <div className="flex items-center gap-4">
          <div className="flex-1 divider-casper" />
          <p className=" font-bold uppercase tracking-[0.2em] text-casper"> Full Feature Set </p>
          <div className="flex-1 divider-casper" />
        </div>

        {loading && <Skeleton />}

        { error && (
          <p className="text-center text-dove text-sm">{error}</p>
        )}

        {/* ── Main layout ── */}
        {!loading && !error && features.length > 0 && (() => {
          const feature = features[active]
          const Icon    = getIcon(feature.icon_key)

          return (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center min-h-120">
              <div className="relative h-105 w-full" style={{ perspective: '1000px' }}>
                <ImageStack features={features} active={active} />
              </div>

              {/* Right — active feature content */}
              <div className="flex flex-col gap-6">
                <AnimatePresence mode="wait">
                  <motion.div key={feature.uuid} className="flex flex-col gap-5"
                    initial={{ opacity: 0, x: 24 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -24 }}
                    transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
                  >
                  
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center glass-logo">
                      <Icon size={22} color="#AABBC5" />
                    </div>

                    <p className="text-xs font-bold tracking-widest uppercase text-dove">
                      {String(active + 1).padStart(2, '0')} / {String(features.length).padStart(2, '0')}
                    </p>

                    <h3 className="font-syne text-3xl md:text-4xl font-black text-white leading-tight"> {feature.title} </h3>
                    <div className="divider-casper" />
                    <p className="text-base leading-relaxed text-dove"> {feature.description}  </p>
                  </motion.div>
                </AnimatePresence>

                {/* ── Dot indicators ── */}
                <div className="flex items-center gap-2 flex-wrap mt-2">
                  {features.map((_, i) => (
                    <button key={i} onClick={() => goTo(i)} className="rounded-full transition-all duration-300"
                      style={{
                        width: i === active ? '28px' : '7px',
                        height: '7px',
                        background: i === active ? '#AABBC5' : 'rgba(170,187,197,0.22)',
                      }}
                    />
                  ))}
                </div>

                {/* ── Prev / Next ── */}
                <div className="flex gap-3">
                  {[{ label: '←', fn: prev }, { label: '→', fn: next }].map(({ label, fn }) => (
                    <button key={label} onClick={fn} className="w-10 h-10 rounded-full flex items-center justify-center text-casper font-bold transition-all duration-200" style={{ border: '1px solid rgba(170,187,197,0.20)' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(170,187,197,0.08)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >  {label} </button>
                  ))}
                </div>
              </div>
            </div>
          )
        })()}

      </div>
    </section>
  )
}
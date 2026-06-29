import { useRef, useState, useEffect } from 'react'
import { motion, useInView } from 'framer-motion'
import axios from 'axios'
import { FiMap, FiTrendingUp, FiUser, FiLayers } from 'react-icons/fi'

const ICON_MAP = { FiMap, FiTrendingUp, FiUser, FiLayers }

function Skeleton() {
  return (
    <div className="flex gap-6 justify-center">
      {[1,2,3,4].map(i => (
        <div key={i} className="skeleton rounded-2xl shrink-0"  />
      ))}
    </div>
  )
}

// single card
function Card({ step, index, active, onClick }) {
  const { icon_key, tag, title, description } = step
  const Icon  = ICON_MAP[icon_key] || FiUser
  const isActive = index === active

  return (
    <div onClick={onClick} className="relative shrink-0 rounded-2xl p-7 flex flex-col gap-4 cursor-pointer select-none overflow-hidden"
      style={{
        width: '350px',
        background:  isActive ? '#AABBC5' : 'rgba(170,187,197,0.04)',
        border:      isActive ? '1px solid rgba(255,255,255,0.25)' : '1px solid rgba(170,187,197,0.10)',
        boxShadow:   isActive ? '0 12px 40px rgba(170,187,197,0.25), inset 0 1px 0 rgba(255,255,255,0.3)' : 'none',
        transform:   isActive ? 'scale(1)' : 'scale(0.96)',
        opacity:     isActive ? 1 : 0.5,
        transition:  'all 0.45s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      }}
    >
      {/* Shine sweep on active */}
      { isActive && (
        <div className="absolute inset-0 pointer-events-none" style={{
            background: 'linear-gradient(120deg, rgba(255,255,255,0) 40%, rgba(255,255,255,0.18) 50%, rgba(255,255,255,0) 60%)',
            animation: 'cardShine 3s ease-in-out infinite',
          }}
        />
      )}

      {/* Top row — icon + tag */}
      <div className="relative z-10 flex items-center justify-between">
        <Icon size={24} color={isActive ? '#212023' : '#676B6C'} style={{ transition: 'color 0.4s ease' }} />
        <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full"
          style={{
            background: isActive ? 'rgba(33,32,35,0.15)' : 'rgba(170,187,197,0.10)',
            color:      isActive ? '#212023' : '#676B6C',
            border:     isActive ? '1px solid rgba(33,32,35,0.12)' : '1px solid rgba(170,187,197,0.12)',
            transition: 'all 0.4s ease',
          }}
        > {tag} </span>
      </div>

      <h3 className="relative z-10 font-syne text-xl font-black leading-snug" style={{ color: isActive ? '#212023' : '#676B6C', transition: 'color 0.4s ease' }}>
        {title}
      </h3>
      
      {/* Description */}
      <div className="relative z-10 h-px w-full" style={{ background: isActive ? 'rgba(33,32,35,0.15)' : 'rgba(170,187,197,0.08)' }} />

      {/* Description */}
      <p className="relative z-10 text-sm leading-relaxed" style={{ color: isActive ? 'rgba(33,32,35,0.75)' : '#676B6C', transition: 'color 0.4s ease' }} >
        {description}
      </p>

      {/* Progress bar */}
      <div className="relative z-10 mt-auto">
        <div className="h-0.5 rounded-full" style={{ background: isActive ? 'rgba(33,32,35,0.15)' : 'rgba(170,187,197,0.08)' }}>
          {isActive && (
            <motion.div className="h-full rounded-full bg-[#212023]" initial={{ width: '0%' }} animate={{ width: '100%' }} transition={{ duration: 4, ease: 'linear' }}
            />
          )}
        </div>
      </div>

    </div>
  )
}


export default function WhoItsFor() {
  const ref      = useRef(null)
  const trackRef = useRef(null)
  const inView   = useInView(ref, { once: true, margin: '-60px' })

  const [steps,  setSteps]  = useState([])
  const [loading,setLoading]= useState(true)
  const [active, setActive] = useState(0)

  useEffect(() => {
    axios.get('/api/v1/how-it-works')
      .then(res => { 
        setSteps(res.data.data);
        console.log(res.data) 
        setLoading(false) 
      })
      .catch(() => setLoading(false))
  }, [])

  // auto advance slider 4sec
  useEffect(() => {
    if (steps.length === 0) return
    const timer = setInterval(() => {
      setActive(p => (p + 1) % steps.length)
    }, 4000)
    return () => clearInterval(timer)
  }, [steps.length, active])

  // center active card in track
  useEffect(() => {
    const track = trackRef.current
    if (!track) return
    const cardW  = 320
    const gap    = 24
    const trackW = track.clientWidth
    const offset = active * (cardW + gap) - trackW / 2 + cardW / 2
    track.scrollTo({ left: offset, behavior: 'smooth' })
  }, [active])

  const prev = () => setActive(p => (p - 1 + steps.length) % steps.length)
  const next = () => setActive(p => (p + 1) % steps.length)

  return (
    <section className="py-24 px-4 md:px-10" style={{ background: '#0e0e10' }}>
      <div className="max-w-7xl mx-auto flex flex-col gap-14">

        {/* Header */}
        <motion.div ref={ref} className="flex flex-col gap-4 max-w-2xl" initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}>
          <span className="badge-casper w-fit px-5 py-2 rounded-full">Who It's For</span>
          <h2 className="font-syne text-4xl md:text-5xl font-black leading-tight tracking-tight text-white">
            Engineered for <span className="text-casper">high-performing teams.</span>
          </h2>
          <p className="text-base leading-relaxed text-dove max-w-xl">
            LeadRadar adapts to your specific growth model, delivering the exact intelligence
            you need to scale your client base without the manual heavy lifting.
          </p>
        </motion.div>

        {/* Carousel — centered */}
        <div className="relative">
          <div
            ref={trackRef}
            className="flex gap-6 overflow-x-hidden pb-2"
            style={{ scrollbarWidth: 'none' }}
          >
            {/* Left spacer to center first card */}
            <div className="shrink-0" style={{ width: 'calc(50% - 160px)' }} />

            {loading
              ? <Skeleton />
              : steps.map((step, i) => (
                  <Card
                    key={i}
                    step={step}
                    index={i}
                    active={active}
                    onClick={() => setActive(i)}
                  />
                ))
            }

            {/* Right spacer */}
            <div className="flex-shrink-0" style={{ width: 'calc(50% - 160px)' }} />
          </div>

          {/* Edge fades */}
          <div className="absolute inset-y-0 left-0 w-24 pointer-events-none z-10"
            style={{ background: 'linear-gradient(to right, #0e0e10, transparent)' }} />
          <div className="absolute inset-y-0 right-0 w-24 pointer-events-none z-10"
            style={{ background: 'linear-gradient(to left, #0e0e10, transparent)' }} />
        </div>

        {/* Dots + nav — centered */}
        <div className="flex items-center justify-center gap-6">
          <button
            onClick={prev}
            className="w-9 h-9 rounded-full flex items-center justify-center text-casper font-bold transition-all"
            style={{ border: '1px solid rgba(170,187,197,0.20)' }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(170,187,197,0.08)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >←</button>

          <div className="flex items-center gap-2">
            {steps.map((_, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                className="rounded-full transition-all duration-300"
                style={{
                  width:      i === active ? '24px' : '6px',
                  height:     '6px',
                  background: i === active ? '#AABBC5' : 'rgba(170,187,197,0.25)',
                }}
              />
            ))}
          </div>

          <button
            onClick={next}
            className="w-9 h-9 rounded-full flex items-center justify-center text-casper font-bold transition-all"
            style={{ border: '1px solid rgba(170,187,197,0.20)' }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(170,187,197,0.08)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >→</button>
        </div>

      </div>
    </section>
  )
}
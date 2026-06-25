import { useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import { FiAlertCircle } from 'react-icons/fi'
import { setFilter, selectFilteredPlaces } from '../store/searchSlice'
import { CATEGORIES } from '../categories'
import BusinessCard from './BusinessCard'
import SkeletonCard from './SkeletonCard'
import Fallback from './Fallback'

const FILTERS = [
  { key: 'all',        label: 'All Results'   },
  { key: 'noWebsite',  label: '🎯 No Website' },
  { key: 'hasWebsite', label: '🌐 Has Website' },
]

function StatPill({ label, value, accent }) {
  const ref    = useRef(null)
  const inView = useInView(ref, { once: true })
  return (
    <motion.div ref={ref}
      className="flex flex-col items-center px-5 py-3 rounded-xl"
      style={{ background: 'rgba(170,187,197,0.07)', border: '1px solid rgba(170,187,197,0.12)' }}
      initial={{ opacity: 0, scale: 0.85 }}
      animate={inView ? { opacity: 1, scale: 1 } : {}}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      <span className="font-syne text-2xl font-black" style={{ color: accent || '#fff' }}>{value}</span>
      <span className="text-xs mt-0.5 text-dove">{label}</span>
    </motion.div>
  )
}

export default function Results() {
  const dispatch       = useDispatch()
  const { status, error, filter, city, category, total, noWebsite, hasWebsite, searchedOnce } = useSelector(s => s.search)
  const filteredPlaces = useSelector(selectFilteredPlaces)

  const isLoading = status === 'loading'
  const isFailed  = status === 'failed'
  const isSuccess = status === 'succeeded'

  if (!searchedOnce) return <Fallback />

  const catLabel = CATEGORIES.find(c => c.key === category)?.label || 'All Categories'

  return (
    <section id="results" className="py-20 px-6 bg-black-base">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5 mb-10">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
            <p className="text-xs font-semibold tracking-widest uppercase mb-1 text-casper">Scan results</p>
            <h2 className="font-syne text-3xl font-black text-white">
              {isLoading ? 'Scanning...' : isSuccess
                ? <><span className="text-casper">{noWebsite}</span> pitch targets in {city}</>
                : 'Results'
              }
            </h2>
            {isSuccess && <p className="text-sm mt-1 text-dove">Category: {catLabel}</p>}
          </motion.div>

          {isSuccess && (
            <div className="flex gap-3 flex-wrap">
              <StatPill label="Total"       value={total}      />
              <StatPill label="No Website"  value={noWebsite}  accent="#f87171" />
              <StatPill label="Has Website" value={hasWebsite} accent="#4ade80" />
            </div>
          )}
        </div>

        {/* Error */}
        <AnimatePresence>
          {isFailed && (
            <motion.div className="flex items-start gap-4 p-6 rounded-2xl mb-8"
              style={{ background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.18)' }}
              initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            >
              <FiAlertCircle size={20} color="#f87171" className="shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-sm" style={{ color: '#f87171' }}>Scan failed</p>
                <p className="text-sm mt-1" style={{ color: 'rgba(248,113,113,0.75)' }}>{error}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Filter tabs */}
        {isSuccess && (
          <motion.div className="flex gap-2 mb-8 flex-wrap"
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
          >
            {FILTERS.map(f => (
              <motion.button key={f.key} onClick={() => dispatch(setFilter(f.key))}
                className="px-4 py-2 rounded-lg text-sm font-medium"
                style={filter === f.key
                  ? { background: '#AABBC5', color: '#212023' }
                  : { background: 'rgba(170,187,197,0.07)', border: '1px solid rgba(170,187,197,0.15)', color: '#AABBC5' }
                }
                whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
              >
                {f.label}
              </motion.button>
            ))}
          </motion.div>
        )}

        {/* Skeletons */}
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} index={i} />)}
          </div>
        )}

        {/* Cards */}
        {isSuccess && filteredPlaces.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredPlaces.map((place, i) => <BusinessCard key={place.id || i} place={place} index={i} />)}
          </div>
        )}

        {/* Empty state */}
        {isSuccess && filteredPlaces.length === 0 && (
          <motion.div className="text-center py-20" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <p className="text-4xl mb-4">🔍</p>
            <p className="text-lg font-semibold text-white">No results for this filter</p>
            <p className="text-sm mt-1 text-dove">Try switching to "All Results"</p>
          </motion.div>
        )}

        {/* Attribution */}
        {isSuccess && (
          <motion.p className="text-xs mt-10 pt-6 text-dove"
            style={{ borderTop: '1px solid rgba(170,187,197,0.08)' }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
          >
            Data from OpenStreetMap contributors · City: {city} · Category: {catLabel}
          </motion.p>
        )}

      </div>
    </section>
  )
}
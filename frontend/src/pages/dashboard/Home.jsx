import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiSearch, FiBarChart2, FiTarget, FiTrendingUp, FiArrowRight } from 'react-icons/fi'
import { selectCurrentUser } from '../../store/authSlice'

const STAT_CARDS = [
  { label: 'Total Scans',      value: '—', icon: FiSearch,     color: '#AABBC5', desc: 'Cities scanned so far'       },
  { label: 'Leads Found',      value: '—', icon: FiTarget,     color: '#4ade80', desc: 'Businesses without websites' },
  { label: 'Leads Saved',      value: '—', icon: FiTrendingUp, color: '#f87171', desc: 'Saved to your analytics'     },
  { label: 'Categories Used',  value: '—', icon: FiBarChart2,  color: '#a78bfa', desc: 'Different categories scanned'},
]

function StatCard({ card, index }) {
  return (
    <motion.div
      className="glass-card rounded-2xl p-5 flex flex-col gap-3"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0  }}
      transition={{ delay: index * 0.08, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -3 }}
    >
      <div className="flex items-center justify-between">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ background: `${card.color}18` }}
        >
          <card.icon size={18} style={{ color: card.color }} />
        </div>
        <span className="text-xs text-dove">{card.desc}</span>
      </div>
      <div>
        <p className="font-syne text-3xl font-black text-white">{card.value}</p>
        <p className="text-sm text-dove mt-0.5">{card.label}</p>
      </div>
    </motion.div>
  )
}

export default function Home() {
  const user = useSelector(selectCurrentUser)

  return (
    <div className="flex flex-col gap-8 max-w-6xl">

      {/* Welcome banner */}
      <motion.div
        className="rounded-2xl p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
        style={{
          background:  'linear-gradient(135deg, rgba(170,187,197,0.12) 0%, rgba(170,187,197,0.04) 100%)',
          border:      '1px solid rgba(170,187,197,0.2)',
        }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0  }}
        transition={{ duration: 0.5 }}
      >
        <div>
          <p className="text-xs font-semibold tracking-widest uppercase text-casper mb-2">
            Welcome back
          </p>
          <h1 className="font-syne text-3xl font-black text-white mb-2">
            Hello, {user?.fullName?.split(' ')[0]}! 👋
          </h1>
          <p className="text-sm text-dove max-w-md leading-relaxed">
            Ready to find your next client? Scan any city for businesses with
            no web presence — then pitch them a website they can't refuse.
          </p>
        </div>

        <motion.div
          whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
        >
          <Link
            to="/dashboard/search"
            className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm no-underline whitespace-nowrap"
            style={{ background: '#AABBC5', color: '#212023', boxShadow: '0 4px 20px rgba(170,187,197,0.3)' }}
          >
            <FiSearch size={15} /> Start Scanning <FiArrowRight size={14} />
          </Link>
        </motion.div>
      </motion.div>

      {/* Stats grid */}
      <div>
        <p className="text-xs font-semibold tracking-widest uppercase text-casper mb-4">
          Your Stats
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {STAT_CARDS.map((card, i) => (
            <StatCard key={card.label} card={card} index={i} />
          ))}
        </div>
        <p className="text-xs text-dove mt-3">
          Stats will populate as you scan and save leads.
        </p>
      </div>

      {/* Quick actions */}
      <div>
        <p className="text-xs font-semibold tracking-widest uppercase text-casper mb-4">
          Quick Actions
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <motion.div whileHover={{ y: -3 }} transition={{ duration: 0.2 }}>
            <Link
              to="/dashboard/search"
              className="glass-card rounded-2xl p-5 flex items-center gap-4 no-underline group"
            >
              <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: 'rgba(170,187,197,0.1)' }}>
                <FiSearch size={20} className="text-casper" />
              </div>
              <div>
                <p className="font-syne font-bold text-white text-sm">Search Leads</p>
                <p className="text-xs text-dove mt-0.5">Scan a city for businesses without websites</p>
              </div>
              <FiArrowRight size={16} className="text-casper ml-auto" />
            </Link>
          </motion.div>

          <motion.div whileHover={{ y: -3 }} transition={{ duration: 0.2 }}>
            <Link
              to="/dashboard/analytics"
              className="glass-card rounded-2xl p-5 flex items-center gap-4 no-underline group"
            >
              <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: 'rgba(170,187,197,0.1)' }}>
                <FiBarChart2 size={20} className="text-casper" />
              </div>
              <div>
                <p className="font-syne font-bold text-white text-sm">View Analytics</p>
                <p className="text-xs text-dove mt-0.5">See your saved scans and lead history</p>
              </div>
              <FiArrowRight size={16} className="text-casper ml-auto" />
            </Link>
          </motion.div>
        </div>
      </div>

    </div>
  )
}
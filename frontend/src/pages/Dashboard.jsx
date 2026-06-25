import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiLogOut, FiTarget, FiSearch, FiUser } from 'react-icons/fi'
import { logout, selectCurrentUser } from '../store/authSlice'
import { swal } from '../utils/sweetalert'
import logo from '../assets/logo.png'

export default function Dashboard() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const user     = useSelector(selectCurrentUser)

  async function handleLogout() {
    const result = await swal.confirm('Log out?', 'You will be returned to the home page.')
    if (result.isConfirmed) {
      dispatch(logout())
      navigate('/')
    }
  }

  return (
    <div className="min-h-screen bg-black-base flex flex-col">

      {/* Dashboard navbar */}
      <header className="flex items-center justify-between px-6 py-4"
        style={{ borderBottom: '1px solid rgba(170,187,197,0.1)', background: 'rgba(38,38,38,0.95)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', position: 'sticky', top: 0, zIndex: 40 }}>
        <div className="flex items-center gap-2">
          <img src={logo} alt="LeadRadar" className="h-8 w-auto" />
          <span className="font-syne font-black text-lg text-white tracking-tight">
            Lead<span className="text-casper">Radar</span>
          </span>
        </div>

        <div className="flex items-center gap-4">
          {/* User info */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg"
            style={{ background: 'rgba(170,187,197,0.08)', border: '1px solid rgba(170,187,197,0.12)' }}>
            <FiUser size={13} className="text-casper" />
            <span className="text-sm text-white/80">{user?.fullName}</span>
          </div>

          {/* Logout */}
          <motion.button onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-dove hover:text-white transition-colors"
            style={{ border: '1px solid rgba(170,187,197,0.15)' }}
            whileHover={{ scale: 1.03, borderColor: 'rgba(170,187,197,0.3)' }}
            whileTap={{ scale: 0.97 }}
          >
            <FiLogOut size={14} /> Logout
          </motion.button>
        </div>
      </header>

      {/* Main content placeholder */}
      <main className="flex-1 flex items-center justify-center p-8">
        <motion.div className="text-center flex flex-col items-center gap-6 max-w-md"
          initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="w-20 h-20 rounded-2xl flex items-center justify-center"
            style={{ background: 'rgba(170,187,197,0.08)', border: '1px solid rgba(170,187,197,0.15)' }}>
            <FiSearch size={32} className="text-casper" />
          </div>

          <div>
            <h1 className="font-syne text-3xl font-black text-white mb-2">
              Welcome, {user?.fullName?.split(' ')[0]}!
            </h1>
            <p className="text-sm text-dove leading-relaxed">
              Your dashboard is being set up. Search, category filters,
              and lead results will live here.
            </p>
          </div>

          <div className="glass-card rounded-2xl p-6 w-full text-left flex flex-col gap-3">
            <p className="text-xs font-semibold tracking-widest uppercase text-casper">Your account</p>
            <div className="flex flex-col gap-2">
              {[
                { label: 'Name',   value: user?.fullName },
                { label: 'Email',  value: user?.email    },
                { label: 'Phone',  value: user?.phone    },
              ].map(row => (
                <div key={row.label} className="flex items-center justify-between">
                  <span className="text-xs text-dove">{row.label}</span>
                  <span className="text-sm text-white">{row.value || '—'}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  )
}
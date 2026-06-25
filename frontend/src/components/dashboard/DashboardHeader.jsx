import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiLogOut, FiUser, FiMenu } from 'react-icons/fi'
import { logout, selectCurrentUser } from '../../store/authSlice'
import { swal } from '../../utils/sweetalert'
import UserModal from './UserModal'
import logo from '../../assets/logo.png'

export default function DashboardHeader({ onToggleSidebar }) {
  const dispatch  = useDispatch()
  const navigate  = useNavigate()
  const user      = useSelector(selectCurrentUser)
  const [showModal, setShowModal] = useState(false)

  async function handleLogout() {
    const result = await swal.confirm('Log out?', 'Your session will be ended.')
    if (result.isConfirmed) {
      dispatch(logout())
      navigate('/')
    }
  }

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-5 py-3"
        style={{
          background:           'rgba(30,30,32,0.95)',
          backdropFilter:       'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom:         '1px solid rgba(170,187,197,0.1)',
          height:               '60px',
        }}
      >
        {/* Left — hamburger + logo */}
        <div className="flex items-center gap-3">
          <motion.button
            onClick={onToggleSidebar}
            className="flex items-center justify-center w-8 h-8 rounded-lg text-dove cursor-pointer"
            style={{ background: 'rgba(170,187,197,0.08)' }}
            whileHover={{ scale: 1.08, background: 'rgba(170,187,197,0.15)' }}
            whileTap={{ scale: 0.92 }}
          >
            <FiMenu size={16} />
          </motion.button>

          <a href="/" className="flex items-center gap-2 no-underline">
            <img src={logo} alt="LeadRadar" className="h-7 w-auto" />
            <span className="font-syne font-black text-base text-white tracking-tight hidden sm:block">
              Lead<span className="text-casper">Radar</span>
            </span>
          </a>
        </div>

        {/* Right — user btn + logout */}
        <div className="flex items-center gap-2">
          {/* User button — opens modal */}
          <motion.button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl cursor-pointer"
            style={{
              background: 'rgba(170,187,197,0.08)',
              border:     '1px solid rgba(170,187,197,0.15)',
            }}
            whileHover={{ scale: 1.03, background: 'rgba(170,187,197,0.14)' }}
            whileTap={{ scale: 0.97 }}
          >
            <div
              className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
              style={{ background: '#AABBC5', color: '#212023' }}
            >
              {user?.fullName?.charAt(0).toUpperCase()}
            </div>
            <span className="text-sm font-medium text-white hidden sm:block">
              {user?.fullName?.split(' ')[0]}
            </span>
            <FiUser size={13} className="text-casper" />
          </motion.button>

          {/* Logout button */}
          <motion.button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-medium cursor-pointer"
            style={{
              background: 'rgba(239,68,68,0.1)',
              border:     '1px solid rgba(239,68,68,0.2)',
              color:      '#f87171',
            }}
            whileHover={{ scale: 1.04, background: 'rgba(239,68,68,0.18)' }}
            whileTap={{ scale: 0.96 }}
          >
            <FiLogOut size={14} />
            <span className="hidden sm:inline">Logout</span>
          </motion.button>
        </div>
      </header>

      {/* User detail modal */}
      <UserModal isOpen={showModal} onClose={() => setShowModal(false)} />
    </>
  )
}
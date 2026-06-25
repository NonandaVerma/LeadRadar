import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from 'framer-motion'
import { FiMenu, FiX, FiUser, FiLogOut, FiGrid } from 'react-icons/fi'
import { logout, selectIsLoggedIn, selectCurrentUser } from '../store/authSlice'
import { swal } from '../utils/sweetalert'
import logo from '../assets/logo.png'

const navLinks = [
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Search',       href: '#search'       },
  { label: 'Results',      href: '#results'      },
]

// ── Standalone component — desktop auth buttons ────────────────────────────────
function DesktopAuthButtons({ isLoggedIn, user, onLogout }) {
  if (isLoggedIn) {
    return (
      <div className="flex items-center gap-3 shrink-0">
        {/* User pill */}
        <div
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg"
          style={{ background: 'rgba(170,187,197,0.08)', border: '1px solid rgba(170,187,197,0.15)' }}
        >
          <FiUser size={13} className="text-casper" />
          <span className="text-sm font-medium" style={{ color: 'rgba(255,255,255,0.8)' }}>
            {user?.fullName?.split(' ')[0]}
          </span>
        </div>

        {/* Dashboard */}
        <motion.div
          whileHover={{ scale: 1.05, y: -1 }} whileTap={{ scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 400, damping: 22 }}
        >
          <Link
            to="/dashboard"
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-[13.5px] font-bold no-underline"
            style={{ background: '#AABBC5', color: '#212023' }}
          >
            <FiGrid size={14} /> Dashboard
          </Link>
        </motion.div>

        {/* Logout */}
        <motion.button
          onClick={onLogout}
          className="flex items-center gap-2 px-3 py-2 rounded-xl text-[13px] font-medium cursor-pointer text-dove"
          style={{ border: '1px solid rgba(170,187,197,0.15)', background: 'transparent' }}
          whileHover={{ scale: 1.04, borderColor: 'rgba(170,187,197,0.4)' }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 400, damping: 22 }}
        >
          <FiLogOut size={14} /> Logout
        </motion.button>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2 shrink-0">
      {/* Login */}
      <motion.div
        whileHover={{ scale: 1.04, y: -1 }} whileTap={{ scale: 0.95 }}
        transition={{ type: 'spring', stiffness: 400, damping: 22 }}
      >
        <Link
          to="/login"
          className="flex items-center px-4 py-2 rounded-xl text-[13.5px] font-medium no-underline text-white"
          style={{ border: '1px solid rgba(170,187,197,0.25)', background: 'transparent' }}
        >
          Login
        </Link>
      </motion.div>

      {/* Sign Up */}
      <motion.div
        whileHover={{ scale: 1.05, y: -1 }} whileTap={{ scale: 0.95 }}
        transition={{ type: 'spring', stiffness: 400, damping: 22 }}
      >
        <Link
          to="/register"
          className="flex items-center px-4 py-2 rounded-xl text-[13.5px] font-bold no-underline"
          style={{ background: '#AABBC5', color: '#212023' }}
        >
          Sign Up
        </Link>
      </motion.div>
    </div>
  )
}

// ── Standalone component — mobile offcanvas auth section ───────────────────────
function MobileAuthSection({ isLoggedIn, user, onLogout, onClose }) {
  if (isLoggedIn) {
    return (
      <div
        className="flex flex-col gap-2 px-4 pt-2 pb-10"
        style={{ borderTop: '1px solid rgba(170,187,197,0.1)' }}
      >
        {/* User pill */}
        <div
          className="flex items-center gap-2 px-4 py-3 rounded-xl mb-1"
          style={{ background: 'rgba(170,187,197,0.06)' }}
        >
          <FiUser size={14} className="text-casper" />
          <span className="text-sm" style={{ color: 'rgba(255,255,255,0.8)' }}>{user?.fullName}</span>
        </div>

        {/* Dashboard */}
        <Link
          to="/dashboard"
          onClick={onClose}
          className="flex items-center justify-center gap-2 py-3.5 rounded-xl text-[15px] font-bold no-underline"
          style={{ background: '#AABBC5', color: '#212023' }}
        >
          <FiGrid size={15} /> Go to Dashboard
        </Link>

        {/* Logout */}
        <button
          onClick={onLogout}
          className="flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium text-dove cursor-pointer"
          style={{ border: '1px solid rgba(170,187,197,0.15)', background: 'transparent' }}
        >
          <FiLogOut size={14} /> Logout
        </button>
      </div>
    )
  }

  return (
    <div
      className="flex flex-col gap-2 px-4 pt-2 pb-10"
      style={{ borderTop: '1px solid rgba(170,187,197,0.1)' }}
    >
      <Link
        to="/register"
        onClick={onClose}
        className="flex items-center justify-center py-4 rounded-2xl text-[15px] font-bold no-underline"
        style={{ background: '#AABBC5', color: '#212023', boxShadow: '0 4px 20px rgba(170,187,197,0.3)' }}
      >
        Sign Up
      </Link>
      <Link
        to="/login"
        onClick={onClose}
        className="flex items-center justify-center py-3.5 rounded-xl text-[15px] font-medium no-underline text-white"
        style={{ border: '1px solid rgba(170,187,197,0.2)', background: 'transparent' }}
      >
        Login
      </Link>
    </div>
  )
}

// ── Main Navbar component ──────────────────────────────────────────────────────
export default function Navbar() {
  const [scrolled,   setScrolled]   = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const { scrollY } = useScroll()

  const dispatch   = useDispatch()
  const navigate   = useNavigate()
  const isLoggedIn = useSelector(selectIsLoggedIn)
  const user       = useSelector(selectCurrentUser)

  useMotionValueEvent(scrollY, 'change', (y) => setScrolled(y > 30))

  async function handleLogout() {
    const result = await swal.confirm('Log out?', 'You will be returned to the home page.')
    if (result.isConfirmed) {
      dispatch(logout())
      setMobileOpen(false)
      navigate('/')
    }
  }

  return (
    <>
      {/* Desktop navbar — md+ only */}
      <div className="hidden md:flex fixed top-0 inset-x-0 z-50 justify-center px-4 pt-5">
        <motion.nav
          className="glass-nav flex items-center justify-between gap-6 px-5 py-2.5 rounded-2xl w-full border border-solid"
          style={{ maxWidth: '1100px' }}
          animate={{
            background:  scrolled ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.04)',
            borderColor: scrolled ? 'rgba(170,187,197,0.32)' : 'rgba(170,187,197,0.14)',
            boxShadow:   scrolled
              ? '0 8px 40px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.1)'
              : '0 4px 20px rgba(0,0,0,0.1),  inset 0 1px 0 rgba(255,255,255,0.06)',
          }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
        >
          {/* Logo */}
          <motion.a
            href="/"
            className="flex items-center gap-2 shrink-0 no-underline"
            whileHover={{ scale: 1.04, y: -1 }} whileTap={{ scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 400, damping: 22 }}
          >
            <img src={logo} alt="LeadRadar" className="h-9 w-auto" />
            <span className="font-syne font-black text-[17px] text-white tracking-tight">
              Lead<span className="text-casper">Radar</span>
            </span>
          </motion.a>

          {/* Nav links */}
          <ul className="flex items-center gap-1 list-none m-0 p-0">
            {navLinks.map((link, i) => (
              <motion.li
                key={link.href}
                initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.07, type: 'spring', stiffness: 300 }}
              >
                <motion.a
                  href={link.href}
                  className="block px-4 py-2 rounded-xl text-[13.5px] font-medium no-underline text-white"
                  whileHover={{ y: -2, color: '#212023', background: '#AABBC5', boxShadow: '0 4px 14px rgba(170,187,197,0.25)' }}
                  whileTap={{ scale: 0.95, y: 0 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 22 }}
                >
                  {link.label}
                </motion.a>
              </motion.li>
            ))}
          </ul>

          {/* Auth buttons — passes props down, no hooks inside */}
          <DesktopAuthButtons
            isLoggedIn={isLoggedIn}
            user={user}
            onLogout={handleLogout}
          />
        </motion.nav>
      </div>

      {/* Mobile hamburger — below md only */}
      <motion.button
        className="flex md:hidden fixed z-[60] items-center justify-center w-11 h-11 rounded-xl text-white cursor-pointer glass-nav border border-[rgba(170,187,197,0.25)]"
        style={{ top: '20px', right: '20px', background: 'rgba(38,38,38,0.5)' }}
        onClick={() => setMobileOpen(o => !o)}
        whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.9 }}
        aria-label="Open menu"
      >
        <AnimatePresence mode="wait">
          <motion.span
            key={mobileOpen ? 'x' : 'menu'}
            className="flex"
            initial={{ opacity: 0, rotate: -80, scale: 0.6 }}
            animate={{ opacity: 1, rotate: 0,   scale: 1   }}
            exit={{    opacity: 0, rotate:  80,  scale: 0.6 }}
            transition={{ duration: 0.18 }}
          >
            {mobileOpen ? <FiX size={20} /> : <FiMenu size={20} />}
          </motion.span>
        </AnimatePresence>
      </motion.button>

      {/* Backdrop */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="flex md:hidden fixed inset-0 z-[55]"
            style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)', WebkitBackdropFilter: 'blur(4px)' }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={() => setMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Offcanvas panel */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="flex md:hidden fixed top-0 right-0 bottom-0 z-[60] flex-col"
            style={{
              width: '78vw', maxWidth: '320px',
              background: 'rgba(20,20,22,0.97)',
              backdropFilter: 'blur(32px)', WebkitBackdropFilter: 'blur(32px)',
              borderLeft: '1px solid rgba(170,187,197,0.18)',
              boxShadow: '-24px 0 64px rgba(0,0,0,0.65)',
            }}
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 320, damping: 34 }}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between px-6 pt-7 pb-5"
              style={{ borderBottom: '1px solid rgba(170,187,197,0.1)' }}
            >
              <a href="/" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 no-underline">
                <img src={logo} alt="LeadRadar" className="h-9 w-auto" />
                <span className="font-syne font-black text-lg text-white tracking-tight">
                  Lead<span className="text-casper">Radar</span>
                </span>
              </a>
              <motion.button
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-center w-9 h-9 rounded-xl text-casper cursor-pointer"
                style={{ background: 'rgba(170,187,197,0.08)', border: '1px solid rgba(170,187,197,0.15)' }}
                whileHover={{ scale: 1.1, background: 'rgba(170,187,197,0.16)' }}
                whileTap={{ scale: 0.9 }}
              >
                <FiX size={17} />
              </motion.button>
            </div>

            {/* Nav links */}
            <nav className="flex-1 flex flex-col gap-1 p-4">
              {navLinks.map((link, i) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center px-4 py-3.5 rounded-xl text-[15px] font-medium text-white no-underline"
                  initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.08 + i * 0.07, type: 'spring', stiffness: 300, damping: 28 }}
                  whileHover={{ x: 5, color: '#212023', background: '#AABBC5' }}
                  whileTap={{ scale: 0.97 }}
                >
                  {link.label}
                </motion.a>
              ))}
            </nav>

            {/* Auth section — passes props, no hooks inside */}
            <MobileAuthSection
              isLoggedIn={isLoggedIn}
              user={user}
              onLogout={handleLogout}
              onClose={() => setMobileOpen(false)}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
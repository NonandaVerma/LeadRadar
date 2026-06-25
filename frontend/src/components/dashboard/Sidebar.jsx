import { NavLink } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FiHome, FiSearch, FiBarChart2, FiChevronRight
} from 'react-icons/fi'

const menuItems = [
  { label: 'Home',         icon: FiHome,     path: '/dashboard'           },
  { label: 'Search Leads', icon: FiSearch,   path: '/dashboard/search'    },
  { label: 'Analytics',    icon: FiBarChart2,path: '/dashboard/analytics' },
]

const SIDEBAR_EXPANDED  = 220
const SIDEBAR_COLLAPSED = 60

export default function Sidebar({ isOpen }) {
  return (
    <motion.aside
      className="fixed left-0 bottom-0 z-30 flex flex-col"
      style={{
        top:        '60px',   // below fixed header
        background: 'rgba(24,24,26,0.98)',
        borderRight:'1px solid rgba(170,187,197,0.1)',
        overflow:   'hidden',
      }}
      animate={{ width: isOpen ? SIDEBAR_EXPANDED : SIDEBAR_COLLAPSED }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      {/* Nav items */}
      <nav className="flex flex-col gap-1 p-2 flex-1 mt-2">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/dashboard'}
            style={{ textDecoration: 'none' }}
          >
            {({ isActive }) => (
              <motion.div
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer relative"
                style={{
                  background:  isActive ? 'rgba(170,187,197,0.15)' : 'transparent',
                  color:       isActive ? '#AABBC5' : '#676B6C',
                  minHeight:   '42px',
                }}
                whileHover={{
                  background: isActive ? 'rgba(170,187,197,0.18)' : 'rgba(170,187,197,0.07)',
                  color:      '#AABBC5',
                }}
                transition={{ duration: 0.15 }}
                title={!isOpen ? item.label : undefined}
              >
                {/* Active indicator bar */}
                {isActive && (
                  <motion.div
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 rounded-full"
                    style={{ background: '#AABBC5' }}
                    layoutId="activeBar"
                  />
                )}

                {/* Icon */}
                <item.icon size={18} className="shrink-0" style={{ marginLeft: '2px' }} />

                {/* Label — only when expanded */}
                <AnimatePresence>
                  {isOpen && (
                    <motion.span
                      className="text-sm font-medium whitespace-nowrap overflow-hidden"
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: 'auto' }}
                      exit={{    opacity: 0, width: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Collapse indicator at bottom */}
      <div className="p-2 mb-2">
        <div
          className="flex items-center justify-center py-2 rounded-xl"
          style={{ color: 'rgba(103,107,108,0.5)' }}
        >
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <FiChevronRight size={14} />
          </motion.div>
        </div>
      </div>
    </motion.aside>
  )
}
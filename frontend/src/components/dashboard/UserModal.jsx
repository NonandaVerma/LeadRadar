import { useSelector } from 'react-redux'
import { motion, AnimatePresence } from 'framer-motion'
import { FiX, FiUser, FiMail, FiPhone, FiCalendar, FiShield } from 'react-icons/fi'
import { selectCurrentUser } from '../../store/authSlice'

function InfoRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-3 py-3"
      style={{ borderBottom: '1px solid rgba(170,187,197,0.08)' }}>
      <div
        className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
        style={{ background: 'rgba(170,187,197,0.1)' }}
      >
        <Icon size={14} className="text-casper" />
      </div>
      <div className="flex flex-col">
        <span className="text-xs text-dove">{label}</span>
        <span className="text-sm font-medium text-white mt-0.5">{value || '—'}</span>
      </div>
    </div>
  )
}

export default function UserModal({ isOpen, onClose }) {
  const user = useSelector(selectCurrentUser)

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-50"
            style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)', WebkitBackdropFilter: 'blur(4px)' }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className="fixed z-50 top-1/2 left-1/2 w-full"
            style={{ maxWidth: '400px', transform: 'translate(-50%, -50%)' }}
            initial={{ opacity: 0, scale: 0.92, y: 16 }}
            animate={{ opacity: 1, scale: 1,    y: 0  }}
            exit={{    opacity: 0, scale: 0.92, y: 16 }}
            transition={{ type: 'spring', stiffness: 320, damping: 28 }}
          >
            <div
              className="rounded-2xl overflow-hidden"
              style={{
                background:   'rgba(32,32,34,0.98)',
                border:       '1px solid rgba(170,187,197,0.18)',
                boxShadow:    '0 24px 64px rgba(0,0,0,0.6)',
                backdropFilter: 'blur(24px)',
              }}
            >
              {/* Modal header */}
              <div
                className="flex items-center justify-between px-6 py-4"
                style={{ borderBottom: '1px solid rgba(170,187,197,0.1)' }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg"
                    style={{ background: '#AABBC5', color: '#212023' }}
                  >
                    {user?.fullName?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-syne font-bold text-white text-sm">{user?.fullName}</p>
                    <p className="text-xs text-dove">Account Details</p>
                  </div>
                </div>
                <motion.button
                  onClick={onClose}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-dove cursor-pointer"
                  style={{ background: 'rgba(170,187,197,0.08)' }}
                  whileHover={{ scale: 1.1, background: 'rgba(170,187,197,0.16)' }}
                  whileTap={{ scale: 0.9 }}
                >
                  <FiX size={16} />
                </motion.button>
              </div>

              {/* Modal body */}
              <div className="px-6 py-2 pb-6">
                <InfoRow icon={FiUser}     label="Full Name"  value={user?.fullName} />
                <InfoRow icon={FiMail}     label="Email"      value={user?.email}    />
                <InfoRow icon={FiPhone}    label="Phone"      value={user?.phone}    />
                <InfoRow icon={FiShield}   label="User ID"    value={user?.userId}   />
              </div>

              {/* Modal footer */}
              <div
                className="px-6 py-3"
                style={{ borderTop: '1px solid rgba(170,187,197,0.08)', background: 'rgba(170,187,197,0.04)' }}
              >
                <p className="text-xs text-dove text-center">
                  Profile editing coming soon
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
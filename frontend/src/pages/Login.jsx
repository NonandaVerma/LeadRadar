import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { motion, AnimatePresence } from 'framer-motion'
import { FiMail, FiLock, FiEye, FiEyeOff, FiArrowRight, FiShield } from 'react-icons/fi'
import axios from 'axios'
import { setCredentials } from '../store/authSlice'
import { swal } from '../utils/sweetalert'
import logo from '../assets/logo.png'
import panelBg from '../assets/loginpanel.jpg'

// ── Left panel ─────────────────────────────────────────────────────────────────
function LeftPanel() {
  return (
    <div
      className="hidden lg:flex flex-col justify-between p-12 relative overflow-hidden"
      style={{ borderRight: '1px solid rgba(170,187,197,0.1)' }}
    >
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${panelBg})` }}
      />
      {/* Dark overlay */}
      <div
        className="absolute inset-0"
        style={{ background: 'linear-gradient(135deg, rgba(38,38,38,0.93) 0%, rgba(38,38,38,0.78) 100%)' }}
      />

      {/* Content — sits above bg */}
      <div className="relative z-10 flex flex-col justify-between h-full">

        {/* Logo */}
        <div className="flex items-center gap-2">
          <img src={logo} alt="LeadRadar" className="h-9 w-auto" />
          <span className="font-syne font-black text-xl text-white tracking-tight">
            Lead<span className="text-casper">Radar</span>
          </span>
        </div>

        {/* Center content */}
        <div className="flex flex-col gap-6">
          <h2 className="font-syne text-4xl font-black text-white leading-tight">
            Find businesses<br />
            <span className="text-casper">before</span> they go online.
          </h2>
          <p className="text-sm text-dove leading-relaxed max-w-xs">
            Scan any city for local businesses with zero web presence.
            Export leads and start pitching in minutes.
          </p>

          {/* Feature pills */}
          <div className="flex flex-col gap-3 mt-2">
            {['13 business categories', 'Excel export ready', '100% free — OpenStreetMap'].map((f, i) => (
              <motion.div
                key={i}
                className="flex items-center gap-3"
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + i * 0.1 }}
              >
                <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: '#AABBC5' }} />
                <span className="text-sm" style={{ color: 'rgba(255,255,255,0.7)' }}>{f}</span>
              </motion.div>
            ))}
          </div>
        </div>

        <p className="text-xs text-dove">© {new Date().getFullYear()} LeadRadar</p>
      </div>
    </div>
  )
}

// ── Shared submit button ───────────────────────────────────────────────────────
function SubmitBtn({ loading, label }) {
  return (
    <motion.button
      type="submit"
      disabled={loading}
      className="w-full py-3.5 rounded-xl text-sm font-bold disabled:opacity-50 flex items-center justify-center gap-2"
      style={{ background: '#AABBC5', color: '#212023' }}
      whileHover={{ scale: 1.02, background: '#C2D4DC' }}
      whileTap={{ scale: 0.97 }}
    >
      {loading
        ? <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
        : <>{label} <FiArrowRight size={14} /></>
      }
    </motion.button>
  )
}

// ── Shared input style ─────────────────────────────────────────────────────────
const inputCls = "w-full px-4 py-3.5 rounded-xl text-sm text-white outline-none transition-all duration-200 placeholder:text-dove"
const inputStyle = { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', caretColor: '#AABBC5' }

function focusInput(e)  { e.target.style.borderColor = 'rgba(170,187,197,0.6)' }
function blurInput(e)   { e.target.style.borderColor = 'rgba(255,255,255,0.1)' }

// ── Forgot password flow (3 steps) ────────────────────────────────────────────
function ForgotFlow({ onBack }) {
  const [step,        setStep]        = useState(1)
  const [email,       setEmail]       = useState('')
  const [pin,         setPin]         = useState('')
  const [newPass,     setNewPass]     = useState('')
  const [confirmPass, setConfirmPass] = useState('')
  const [loading,     setLoading]     = useState(false)

  async function sendPin(e) {
    e.preventDefault()
    setLoading(true)
    try {
      await axios.post('/api/v1/auth/forgot-password', { email })
      swal.success('PIN Sent!', 'Check your email for the 4-digit PIN.')
      setStep(2)
    } catch (err) {
      swal.error('Error', err.response?.data?.detail || 'Something went wrong.')
    } finally { setLoading(false) }
  }

  async function verifyPin(e) {
    e.preventDefault()
    setLoading(true)
    try {
      await axios.post('/api/v1/auth/verify-pin', { email, pin })
      setStep(3)
    } catch (err) {
      swal.error('Invalid PIN', err.response?.data?.detail || 'Incorrect PIN.')
    } finally { setLoading(false) }
  }

  async function resetPass(e) {
    e.preventDefault()
    if (newPass !== confirmPass) { swal.error('Passwords do not match'); return }
    setLoading(true)
    try {
      await axios.post('/api/v1/auth/reset-password', { email, pin, newPassword: newPass })
      await swal.success('Password Reset!', 'You can now log in with your new password.')
      onBack()
    } catch (err) {
      swal.error('Error', err.response?.data?.detail || 'Reset failed.')
    } finally { setLoading(false) }
  }

  const stepTitles   = ['Reset your password', 'Check your email',  'Almost there']
  const stepSubtitles = [
    'Enter your registered email to receive a PIN.',
    `We sent a 4-digit PIN to ${email}`,
    'Enter your new password below.',
  ]

  return (
    <motion.div
      className="flex flex-col gap-6"
      initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.35 }}
    >
      <div>
        <div className="flex items-center gap-2 mb-1">
          <FiShield size={14} className="text-casper" />
          <span className="text-xs font-semibold tracking-widest uppercase text-casper">
            {['Forgot Password', 'Enter PIN', 'New Password'][step - 1]}
          </span>
        </div>
        <h2 className="font-syne text-2xl font-black text-white">{stepTitles[step - 1]}</h2>
        <p className="text-sm text-dove mt-1">{stepSubtitles[step - 1]}</p>
      </div>

      {/* Step 1 — email */}
      {step === 1 && (
        <form onSubmit={sendPin} className="flex flex-col gap-4">
          <input
            type="email" placeholder="Registered email" value={email}
            onChange={e => setEmail(e.target.value)} required
            className={inputCls} style={inputStyle}
            onFocus={focusInput} onBlur={blurInput}
          />
          <SubmitBtn loading={loading} label="Send PIN" />
        </form>
      )}

      {/* Step 2 — pin */}
      {step === 2 && (
        <form onSubmit={verifyPin} className="flex flex-col gap-4">
          <input
            type="text" placeholder="4-digit PIN" maxLength={4} value={pin}
            onChange={e => setPin(e.target.value)} required
            className={inputCls}
            style={{ ...inputStyle, letterSpacing: '0.3em', fontSize: '22px', textAlign: 'center' }}
            onFocus={focusInput} onBlur={blurInput}
          />
          <SubmitBtn loading={loading} label="Verify PIN" />
          <button
            type="button" onClick={() => setStep(1)}
            className="text-xs text-dove hover:text-casper transition-colors text-center"
          >
            Resend PIN
          </button>
        </form>
      )}

      {/* Step 3 — new password */}
      {step === 3 && (
        <form onSubmit={resetPass} className="flex flex-col gap-4">
          <input
            type="password" placeholder="New password" value={newPass}
            onChange={e => setNewPass(e.target.value)} required
            className={inputCls} style={inputStyle}
            onFocus={focusInput} onBlur={blurInput}
          />
          <input
            type="password" placeholder="Confirm new password" value={confirmPass}
            onChange={e => setConfirmPass(e.target.value)} required
            className={inputCls} style={inputStyle}
            onFocus={focusInput} onBlur={blurInput}
          />
          <SubmitBtn loading={loading} label="Reset Password" />
        </form>
      )}

      <button
        onClick={onBack}
        className="text-xs text-dove hover:text-casper transition-colors text-left"
      >
        ← Back to login
      </button>
    </motion.div>
  )
}

// ── Main Login page ────────────────────────────────────────────────────────────
export default function Login() {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading,  setLoading]  = useState(false)
  const [forgot,   setForgot]   = useState(false)

  async function handleLogin(e) {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await axios.post('/api/v1/auth/login', { email, password })
      dispatch(setCredentials({
        token: res.data.token,
        user:  {
          userId:   res.data.userId,
          fullName: res.data.fullName,
          email:    res.data.email,
          phone:    res.data.phone,
        },
      }))
      await swal.success(`Welcome back, ${res.data.fullName.split(' ')[0]}!`)
      navigate('/dashboard')
    } catch (err) {
      swal.error('Login Failed', err.response?.data?.detail || 'Invalid credentials.')
    } finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-black-base">
      <LeftPanel />

      {/* Right panel */}
      <div className="flex items-center justify-center px-8 py-12">
        <div className="w-full max-w-sm">

          {/* Mobile logo — only on small screens */}
          <div className="flex items-center gap-2 mb-10 lg:hidden">
            <img src={logo} alt="LeadRadar" className="h-8 w-auto" />
            <span className="font-syne font-black text-lg text-white">
              Lead<span className="text-casper">Radar</span>
            </span>
          </div>

          <AnimatePresence mode="wait">
            {/* Forgot password flow */}
            {forgot ? (
              <ForgotFlow key="forgot" onBack={() => setForgot(false)} />
            ) : (
              /* Login form */
              <motion.div
                key="login"
                className="flex flex-col gap-6"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <div>
                  <p className="text-xs font-semibold tracking-widest uppercase text-casper mb-1">
                    Welcome back
                  </p>
                  <h1 className="font-syne text-3xl font-black text-white">Login</h1>
                  <p className="text-sm text-dove mt-1">
                    Enter your credentials to access your dashboard.
                  </p>
                </div>

                <form onSubmit={handleLogin} className="flex flex-col gap-4">
                  {/* Email */}
                  <div className="relative">
                    <FiMail size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-dove pointer-events-none" />
                    <input
                      type="email" placeholder="Email address" value={email}
                      onChange={e => setEmail(e.target.value)} required
                      className={`${inputCls} pl-11`} style={inputStyle}
                      onFocus={focusInput} onBlur={blurInput}
                    />
                  </div>

                  {/* Password */}
                  <div className="relative">
                    <FiLock size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-dove pointer-events-none" />
                    <input
                      type={showPass ? 'text' : 'password'}
                      placeholder="Password" value={password}
                      onChange={e => setPassword(e.target.value)} required
                      className={`${inputCls} pl-11 pr-11`} style={inputStyle}
                      onFocus={focusInput} onBlur={blurInput}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass(s => !s)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-dove hover:text-casper transition-colors"
                    >
                      {showPass ? <FiEyeOff size={15} /> : <FiEye size={15} />}
                    </button>
                  </div>

                  {/* Forgot link */}
                  <div className="flex justify-end -mt-1">
                    <button
                      type="button"
                      onClick={() => setForgot(true)}
                      className="text-xs text-casper hover:text-white transition-colors"
                    >
                      Forgot password?
                    </button>
                  </div>

                  <SubmitBtn loading={loading} label="Sign In" />
                </form>

                <p className="text-sm text-center text-dove">
                  Don't have an account?{' '}
                  <Link to="/register" className="text-casper font-medium hover:text-white transition-colors no-underline">
                    Create one
                  </Link>
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
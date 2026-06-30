import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiUser, FiMail, FiPhone, FiLock, FiEye, FiEyeOff } from 'react-icons/fi'
import axios from 'axios'
import { swal } from '../utils/sweetalert'
import logo from '../assets/logo.png'
import authBg from '../assets/registerBg.jpg'

function InputField({ icon: Icon, type = 'text', placeholder, value, onChange, rightEl }) {
  return (
    <div className="relative">
      <Icon size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white pointer-events-none" />
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required
        className="w-full pl-12 pr-12 py-4 rounded-xl text-sm text-white outline-none transition-all duration-200 bg-white/5 border border-white/10 placeholder:text-white focus:border-[#AABBC5]/60"
        style={{ caretColor: '#AABBC5' }}
      />
      {rightEl && <div className="absolute right-4 top-1/2 -translate-y-1/2">{rightEl}</div>}
    </div>
  )
}

export default function Register() {
  const navigate = useNavigate()
  const [form, setForm]         = useState({ fullName: '', email: '', phone: '', password: '', confirmPassword: '' })
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading]   = useState(false)

  function handleChange(field) {
    return e => setForm(f => ({ ...f, [field]: e.target.value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (form.password !== form.confirmPassword) {
      swal.error('Passwords do not match', 'Please make sure both password fields match.')
      return
    }
    setLoading(true)
    try {
      await axios.post('/api/v1/auth/register', {
        fullName: form.fullName,
        email:    form.email,
        phone:    form.phone,
        password: form.password,
      })
      await swal.success('Account Created!', 'Redirecting you to login...')
      navigate('/login')
    } catch (err) {
      swal.error('Registration Failed', err.response?.data?.detail || 'Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 relative overflow-hidden">

      {/* Background image — bg-top + nudged position so the building apex stays visible */}
      <div
        className="absolute inset-0 bg-cover"
        style={{ backgroundImage: `url(${authBg})`, backgroundPosition: '50% 15%' }}
      />

      {/* Lighter overlay — lets the architecture actually show through */}
      <div
        className="absolute inset-0"
        style={{ background: 'linear-gradient(135deg, rgba(14,14,16,0.55) 0%, rgba(14,14,16,0.70) 100%)' }}
      />

      {/* Glass form card — wider, more breathing room, real glassmorphism */}
      <motion.div
        className="relative z-10 w-full max-w-xl"
        initial={{ opacity: 0, y: 32, scale: 0.97 }}
        animate={{ opacity: 1, y: 0,  scale: 1    }}
        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      >
        <div
          className="rounded-3xl p-10 md:p-14 border border-[#AABBC5]/15"
          style={{
            background: 'rgba(255,255,255,0.06)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            boxShadow: '0 8px 40px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.08)',
          }}
        >

          {/* Logo */}
          <div className="flex items-center gap-2.5 mb-10">
            <img src={logo} alt="LeadRadar" className="h-9 w-auto" />
            <span className="font-syne font-black text-xl text-white tracking-tight">
              Lead<span className="text-casper">Radar</span>
            </span>
          </div>

          <h1 className="font-syne text-3xl font-black text-white mb-2">Create account</h1>
          <p className="text-sm text-white mb-10">Start finding leads for free — no credit card needed.</p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <InputField icon={FiUser}  placeholder="Full Name"     value={form.fullName} onChange={handleChange('fullName')} />
            <InputField icon={FiMail}  placeholder="Email address" value={form.email}    onChange={handleChange('email')}    type="email" />
            <InputField icon={FiPhone} placeholder="Phone number"  value={form.phone}    onChange={handleChange('phone')}    type="tel" />

            {/* Side-by-side passwords — wider form makes this work now */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <InputField
                icon={FiLock}
                type={showPass ? 'text' : 'password'}
                placeholder="Password"
                value={form.password}
                onChange={handleChange('password')}
                rightEl={
                  <button type="button" onClick={() => setShowPass(s => !s)} className="text-white hover:text-casper transition-colors">
                    {showPass ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                  </button>
                }
              />
              <InputField icon={FiLock} type="password" placeholder="Confirm Password" value={form.confirmPassword} onChange={handleChange('confirmPassword')} />
            </div>

            <motion.button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-xl text-sm font-bold mt-3 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 bg-[#AABBC5] text-[#212023]"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
            >
              {loading
                ? <><span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" /> Creating account...</>
                : 'Create Account'
              }
            </motion.button>
          </form>

          <p className="text-sm text-center text-white mt-8">
            Already have an account?{' '}
            <Link to="/login" className="text-casper font-medium hover:text-white transition-colors no-underline">
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}
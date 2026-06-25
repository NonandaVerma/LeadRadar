import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiUser, FiMail, FiPhone, FiLock, FiEye, FiEyeOff, FiTarget } from 'react-icons/fi'
import axios from 'axios'
import { swal } from '../utils/sweetalert'
import logo from '../assets/logo.png'

const BG = 'https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=1920'

function InputField({ icon: Icon, type = 'text', placeholder, value, onChange, rightEl }) {
  return (
    <div className="relative">
      <Icon size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-dove pointer-events-none" />
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required
        className="w-full pl-11 pr-11 py-3.5 rounded-xl text-sm text-white outline-none transition-all duration-200 bg-white/5 border border-white/10 placeholder:text-dove"
        onFocus={e  => e.target.style.borderColor = 'rgba(170,187,197,0.6)'}
        onBlur={e   => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
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
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${BG})` }} />
      <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(38,38,38,0.88) 0%, rgba(38,38,38,0.75) 100%)' }} />

      {/* Glass form card */}
      <motion.div
        className="relative z-10 w-full max-w-md"
        initial={{ opacity: 0, y: 32, scale: 0.97 }}
        animate={{ opacity: 1, y: 0,  scale: 1    }}
        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="glass-card rounded-3xl p-8 md:p-10">

          {/* Logo */}
          <div className="flex items-center gap-2 mb-8">
            <img src={logo} alt="LeadRadar" className="h-8 w-auto" />
            <span className="font-syne font-black text-lg text-white tracking-tight">
              Lead<span className="text-casper">Radar</span>
            </span>
          </div>

          <h1 className="font-syne text-2xl font-black text-white mb-1">Create account</h1>
          <p className="text-sm text-dove mb-8">Start finding leads for free — no credit card needed.</p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <InputField icon={FiUser}  placeholder="Full Name"     value={form.fullName} onChange={handleChange('fullName')} />
            <InputField icon={FiMail}  placeholder="Email address" value={form.email}    onChange={handleChange('email')}    type="email" />
            <InputField icon={FiPhone} placeholder="Phone number"  value={form.phone}    onChange={handleChange('phone')}    type="tel" />
            <InputField
              icon={FiLock}
              type={showPass ? 'text' : 'password'}
              placeholder="Password"
              value={form.password}
              onChange={handleChange('password')}
              rightEl={
                <button type="button" onClick={() => setShowPass(s => !s)} className="text-dove hover:text-casper transition-colors">
                  {showPass ? <FiEyeOff size={15} /> : <FiEye size={15} />}
                </button>
              }
            />
            <InputField icon={FiLock} type="password" placeholder="Confirm Password" value={form.confirmPassword} onChange={handleChange('confirmPassword')} />

            <motion.button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl text-sm font-bold mt-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              style={{ background: '#AABBC5', color: '#212023' }}
              whileHover={{ scale: 1.02, background: '#C2D4DC' }}
              whileTap={{ scale: 0.97 }}
            >
              {loading
                ? <><span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" /> Creating account...</>
                : 'Create Account'
              }
            </motion.button>
          </form>

          <p className="text-sm text-center text-dove mt-6">
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
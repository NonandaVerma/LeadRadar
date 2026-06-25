import { motion } from 'framer-motion'
import logo from '../assets/logo.png'

export default function Footer() {
  return (
    <footer className="py-10 px-6 bg-black-base" style={{ borderTop: '1px solid rgba(170,187,197,0.08)' }}>
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">

        {/* Logo with glass bg so it's visible on dark footer */}
        <motion.a href="#" className="glass-logo no-underline" whileHover={{ scale: 1.03 }}>
          <img src={logo} alt="LeadRadar" className="h-8 w-auto" />
          <span className="font-syne font-black text-base text-white tracking-tight"> LeadRadar </span>
        </motion.a>
        <p className="text-xs text-center text-dove">FastAPI + React · OpenStreetMap · Free forever </p>
        <p className="text-xs text-dove">© {new Date().getFullYear()} LeadRadar</p>
      </div>
    </footer>
  )
}
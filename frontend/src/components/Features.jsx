import { motion } from 'framer-motion'
import { MdOutlineRadar } from 'react-icons/md'
import { HiOutlineLocationMarker } from 'react-icons/hi'
import { RiContactsLine } from 'react-icons/ri'
import { TbTableExport } from 'react-icons/tb'
import { FiRadio, FiFileText, FiUser, FiCpu, FiMail, FiTrello, FiBarChart2, FiStar, FiPhone, FiCheckCircle } from 'react-icons/fi'

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: (i) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.55, delay: i * 0.09, ease: [0.25, 0.46, 0.45, 0.94] }
  })
}

// Card 1 - Visual hierrachy 
function ScanVisual() {
  const cards = [
    { label: 'Location', value: 'Mumbai, IN',      indent: 0 },
    { label: 'Category', value: 'Salons & Spas',   indent: 1 },
    { label: 'Filter',   value: 'Missing Website', indent: 2 },
  ]
  return (
    <div className="mt-auto pt-6 w-full flex flex-col gap-2">
      {cards.map((c, i) => (
        <motion.div key={i} className="flex items-center justify-between px-4 py-3 rounded-xl" style={{ marginLeft: `${c.indent * 14}px` }} initial={{ opacity: 0, x: -14 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 + i * 0.13, duration: 0.5 }}>
          <span className="text-xs font-medium text-white pl-3  border-l-3 border-casper" > {c.label} </span>
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-casper text-[#0e0e10]"> {c.value} </span>
        </motion.div>
      ))}
    </div>
  )
}

// Card 2 - Profile card 
function ContactVisual() {
  return (
    <div className="mt-auto pt-4 w-full">
      <div className="glass-card rounded-2xl p-4 flex flex-col gap-3">

        {/* Avatar row — circle dp */}
        <div className="flex items-center gap-3">
          <div className="font-syne font-black text-sm text-[#0e0e10] w-10 h-10 rounded-full flex items-center justify-center bg-casper shrink-0"> RK </div>
          <div>
            <p className="text-white text-sm font-semibold">Rajesh Kumar</p>
            <p className="text-dove text-xs">Owner · Apex Salon</p>
          </div>
          {/* Filled green verified pill */}
          <span className="ml-auto text-[10px] font-bold px-2.5 py-1 rounded-full bg-green-500 text-white flex items-center gap-1">
            <FiCheckCircle size={10} />
            Verified
          </span>
        </div>

        {/* Divider */}
        <div className="divider-casper" />
        {/* Email */}
        <div className="flex items-center justify-between text-xs">
          <span className="text-dove">Email</span>
          <div className="flex items-center gap-2">
            <span className="text-casper">rajesh@apexsalon.in</span>
            <span className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
              <FiCheckCircle size={11} className="text-white" />
            </span>
          </div>
        </div>

        {/* Phone */}
        <div className="flex items-center justify-between text-xs">
          <span className="text-dove">Phone</span>
          <div className="flex items-center gap-2">
            <span className="text-casper">+91 98201 XXXXX</span>
            <span className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
              <FiCheckCircle size={11} className="text-white" />
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

// Panel 3 — Radar map 
function RadarVisual() {
  const pings = [
    { top: '22%', left: '38%' },
    { top: '48%', left: '62%' },
    { top: '68%', left: '22%' },
    { top: '28%', left: '72%' },
    { top: '58%', left: '48%' },
  ]

  return (
    <div className="glass-card relative w-full h-48 mt-auto rounded-2xl overflow-hidden">

      {/* ── Map grid lines (lat/lon feel) ── */}
      {[1, 2, 3, 4].map(n => (
        <div key={`h${n}`} className="absolute w-full"
          style={{
            top: `${n * 20}%`,
            height: '1px',
            background: 'rgba(170,187,197,0.07)',
          }}
        />
      ))}
      {[1, 2, 3, 4].map(n => (
        <div key={`v${n}`} className="absolute h-full"
          style={{
            left: `${n * 20}%`,
            width: '1px',
            background: 'rgba(170,187,197,0.07)',
          }}
        />
      ))}

      {/* ── Radar concentric rings ── */}
      {[1, 2, 3].map(n => (
        <div key={n} className="absolute rounded-full"
          style={{
            border: `1px solid rgba(170,187,197,${0.18 - n * 0.04})`,
            inset: `${n * 13}%`,
          }}
        />
      ))}

      {/* ── Radar sweep fill (conic gradient) ── */}
      <motion.div className="absolute rounded-full"
        style={{
          inset: '13%',
          background: 'conic-gradient(from 0deg, rgba(170,187,197,0.18) 0deg, rgba(170,187,197,0.04) 60deg, transparent 90deg)',
        }}
        animate={{ rotate: [0, 360] }}  transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
      />

      {/* ── Sweep arm ── */}
      <motion.div
        className="absolute top-1/2 left-1/2 h-px origin-left"
        style={{
          width: '37%',
          background: 'linear-gradient(to right, #AABBC5, transparent)',
          boxShadow: '0 0 6px #AABBC5',
        }}
        animate={{ rotate: [0, 360] }} transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
      />

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-casper"  style={{ boxShadow: '0 0 10px 3px rgba(170,187,197,0.4)' }} />

      {pings.map((p, i) => (
        <div key={i} className="absolute" style={{ top: p.top, left: p.left }}>
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-50 bg-casper" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-casper" style={{ boxShadow: '0 0 6px #AABBC5' }} />
          </span>
        </div>
      ))}

      <div className="absolute bottom-2.5 left-3 text-[9px] font-bold tracking-widest text-casper uppercase opacity-60">
        Mumbai · Live Scan
      </div>
    </div>
  )
}

// Panel 4 — Export table  
function ExportVisual() {
  const rows = [
    { name: 'Apex Plumbers', gap: 'No Website',  score: '12', pillClass: 'bg-red-500 text-white' },
    { name: 'City Dental',   gap: 'No SEO',       score: '34', pillClass: 'bg-casper text-[#0e0e10]' },
    { name: 'Sunrise Salon', gap: 'Weak Social',  score: '41', pillClass: 'bg-amber-400 text-[#0e0e10]' },
  ]
  return (
    <div className="mt-auto pt-4 w-full flex flex-col gap-3">
      <div className="glass-card rounded-xl overflow-hidden">
        {/* Table header */}
        <div className="flex text-[10px] font-bold uppercase tracking-wider px-4 py-2.5 text-dove" style={{ borderBottom: '1px solid rgba(170,187,197,0.08)' }}>
          <span className="flex-1">Business</span>
          <span className="w-28">Gap Detected</span>
          <span className="w-12 text-right">Score</span>
        </div>

        {rows.map((r, i) => (
          <div key={i} className="flex items-center px-4 py-3 text-xs" style={{ borderBottom: i < rows.length - 1 ? '1px solid rgba(170,187,197,0.06)' : 'none' }}>
            <span className="flex-1 text-white font-semibold">{r.name}</span>
            <span className="w-28">
              <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${r.pillClass}`}>  {r.gap} </span>
            </span>
            <span className="w-12 text-right font-black text-casper"> {r.score} </span>
          </div>
        ))}
      </div>

      <button className="btn-primary w-full justify-center gap-2 py-3 rounded-xl text-sm">
        <TbTableExport size={15} /> Export to CSV
      </button>
    </div>
  )
}

const BENTO_PANELS = [
  {
    id: 1, col: 'md:col-span-2',
    Icon: MdOutlineRadar,
    heading: 'Hyper-Targeted Scanning',
    copy: 'Ditch manual Google Maps scrolling. Set your city, pick your industry, and let our engine isolate businesses with zero digital presence in seconds.',
    Visual: ScanVisual,
  },
  {
    id: 2, col: 'md:col-span-1',
    Icon: RiContactsLine,
    heading: 'Bypass the Gatekeeper',
    copy: 'Stop sending proposals to generic support emails. Get the exact phone numbers and emails of decision-makers who sign the checks.',
    Visual: ContactVisual,
  },
  {
    id: 3, col: 'md:col-span-1',
    Icon: HiOutlineLocationMarker,
    heading: 'City-Wide Mapping',
    copy: 'Dominate any local radius. Visualize where your highest-value targets are clustered and work through territories with unmatched precision.',
    Visual: RadarVisual,
  },
  {
    id: 4, col: 'md:col-span-2',
    Icon: TbTableExport,
    heading: 'Seamless Pipeline Integration',
    copy: 'Turn raw intel into a warm pipeline in seconds. Export perfectly formatted lead lists to your CRM or generate personalized outreach copy they cannot ignore.',
    Visual: ExportVisual,
  },
]

export default function Features() {
  return (
    <section className="w-full py-24 px-4 md:px-10" style={{ background: '#0e0e10' }}>
      <div className="max-w-7xl mx-auto flex flex-col gap-20">

        {/* ── Section Header ── */}
        <motion.div className="text-center flex flex-col gap-4 max-w-3xl mx-auto" variants={fadeUp} custom={0} initial="hidden" whileInView="show" viewport={{ once: true }} >
          <h2 className="font-syne text-4xl md:text-5xl font-black leading-tight tracking-tight text-white">
            An entire intelligence division, <span className="text-casper"> packed into one workflow.</span>
          </h2>
          <p className="text-base font-light leading-relaxed text-dove">
            LeadRadar goes beyond basic scraping. It equips you with the exact data, insights,
            and tools needed to turn offline businesses into high-paying clients.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {
            BENTO_PANELS.map((panel, i) => (
            <motion.div key={panel.id} className={`${panel.col} glass-card rounded-2xl p-6 flex flex-col gap-3 min-h-80`} variants={fadeUp} custom={i} initial="hidden" whileInView="show" viewport={{ once: true }} >
              <panel.Icon size={26} color="#AABBC5" />
              <h3 className="font-syne text-xl font-bold text-white leading-snug"> {panel.heading}  </h3>
              <p className="text-sm font-light leading-relaxed text-dove"> {panel.copy} </p>
              <panel.Visual />
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  )
}
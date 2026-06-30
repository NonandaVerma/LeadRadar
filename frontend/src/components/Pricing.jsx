import { motion } from 'framer-motion'
import { FiCheck } from 'react-icons/fi'

const PLANS = [
  {
    name: 'Starter',
    tagline: 'For independent freelancers',
    price: 29,
    yearlyPrice: 24,
    dailyPrice: '0.96',
    isPopular: true,
    cta: 'Choose Starter — $29/mo',
    features: [
      '500 Market Scans / month',
      '50 Verified Decision-Maker Lookups / month',
      '25 AI-Generated Proposals / month',
      'Standard Digital Health Reports',
      'Integrated Kanban CRM',
    ],
  },
  {
    name: 'Pro',
    tagline: 'For agencies & sales teams',
    price: 89,
    yearlyPrice: 74,
    dailyPrice: '2.96',
    isPopular: false,
    cta: 'Choose Pro — $89/mo',
    features: [
      'Unlimited Market Scans',
      '500 Verified Decision-Maker Lookups / month',
      'Unlimited AI Outreach & Call Scripts',
      'White-Label Audit Reports (your Agency Logo)',
      'Advanced CRM with Call Logging & Sentiment Analysis',
    ],
  },
]

function PlanCard({ plan, index }) {
  const { name, tagline, price, yearlyPrice, dailyPrice, isPopular, cta, features } = plan

  return (
    <motion.div
      className="relative rounded-2xl p-8 flex flex-col gap-6 overflow-visible"
      style={{
        background:           isPopular ? '#AABBC5' : 'rgba(170,187,197,0.06)',
        border:               isPopular ? '1px solid rgba(255,255,255,0.25)' : '1px solid rgba(170,187,197,0.15)',
        backdropFilter:       !isPopular ? 'blur(16px)' : 'none',
        WebkitBackdropFilter: !isPopular ? 'blur(16px)' : 'none',
        boxShadow:            isPopular
                                ? '0 16px 50px rgba(170,187,197,0.25), inset 0 1px 0 rgba(255,255,255,0.25)'
                                : 'inset 0 1px 0 rgba(255,255,255,0.04)',
      }}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
    

      {/* Plan name + tagline */}
      <div className="flex flex-col gap-1">
        <p
          className="text-xs font-bold uppercase tracking-widest"
          style={{ color: isPopular ? '#212023' : '#AABBC5' }}
        >
          {name}
        </p>
        <p
          className="text-xs"
          style={{ color: isPopular ? 'rgba(33,32,35,0.6)' : '#676B6C' }}
        >
          {tagline}
        </p>
      </div>

      {/* Price */}
      <div className="flex flex-col gap-1">
        <div className="flex items-baseline gap-2">
          <span
            className="font-syne text-5xl font-black tracking-tight"
            style={{ color: isPopular ? '#212023' : '#FFFFFF' }}
          >
            ${price}
          </span>
          <span
            className="text-sm font-medium"
            style={{ color: isPopular ? 'rgba(33,32,35,0.6)' : '#676B6C' }}
          >
            /mo
          </span>
        </div>
        <p
          className="text-xs"
          style={{ color: isPopular ? 'rgba(33,32,35,0.6)' : '#676B6C' }}
        >
          ${dailyPrice}/day or ${yearlyPrice}/mo billed yearly
        </p>
      </div>

      {/* CTA button */}
      {isPopular ? (
        <button
          className="w-full py-3.5 rounded-xl text-sm font-bold transition-all duration-200"
          style={{ background: '#212023', color: '#FFFFFF' }}
          onMouseEnter={e => e.currentTarget.style.background = '#000000'}
          onMouseLeave={e => e.currentTarget.style.background = '#212023'}
        >
          {cta}
        </button>
      ) : (
        <button
          className="w-full py-3.5 rounded-xl text-sm font-bold transition-all duration-200"
          style={{ border: '1px solid rgba(170,187,197,0.30)', color: '#FFFFFF' }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(170,187,197,0.08)'}
          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
        >
          {cta}
        </button>
      )}

      {/* Divider */}
      <div
        className="h-px w-full"
        style={{ background: isPopular ? 'rgba(33,32,35,0.12)' : 'rgba(170,187,197,0.08)' }}
      />

      {/* Feature list */}
      <ul className="flex flex-col gap-3.5">
        {features.map((feature, i) => (
          <li key={i} className="flex items-start gap-3">
            <span
              className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
              style={{
                background: isPopular ? 'rgba(33,32,35,0.15)' : 'rgba(170,187,197,0.10)',
              }}
            >
              <FiCheck size={11} color={isPopular ? '#212023' : '#AABBC5'} />
            </span>
            <span
              className="text-sm leading-relaxed"
              style={{ color: isPopular ? 'rgba(33,32,35,0.85)' : '#AABBC5' }}
            >
              {feature}
            </span>
          </li>
        ))}
      </ul>
    </motion.div>
  )
}

export default function Pricing() {
  return (
    <section id="pricing" className="py-24 px-4 md:px-10" style={{ background: '#0e0e10' }}>
      <div className="max-w-5xl mx-auto flex flex-col gap-16">

        {/* Header */}
        <motion.div
          className="text-center flex flex-col items-center gap-4 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <span className="badge badge-casper">Transparent Pricing</span>
          <h2 className="font-syne text-4xl md:text-5xl font-black leading-tight tracking-tight text-white">
            Scale your pipeline.{' '}
            <span className="text-casper">Skip the overhead.</span>
          </h2>
          <p className="text-base leading-relaxed text-dove max-w-lg">
            Choose the engine that fits your growth. All plans include full platform access
            and a risk-free 7-day trial. Cancel anytime.
          </p>
        </motion.div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
          {PLANS.map((plan, i) => (
            <PlanCard key={plan.name} plan={plan} index={i} />
          ))}
        </div>

      </div>
    </section>
  )
}
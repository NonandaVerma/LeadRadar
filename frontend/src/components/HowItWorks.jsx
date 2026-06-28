import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { FiMap, FiFileText, FiUser, FiCpu } from 'react-icons/fi'
import { CardContainer, CardBody, CardItem } from './ui/3d-card'

const steps = [
  {
    icon: FiMap,
    title: 'Map the Market',
    desc: 'Input your target city and industry. Our high-speed engine instantly sweeps the local grid, filtering out the noise to isolate high-value businesses with zero digital footprint. Experience lightning-fast, bottleneck-free scanning.',
  },
  {
    icon: FiFileText,
    title: 'Generate the Audit',
    desc: "Don't just guess what they need. LeadRadar automatically processes the data to generate shareable, comprehensive digital health reports. Expose missing websites, broken SEO, and weak reviews instantly.",
  },
  {
    icon: FiUser,
    title: 'Bypass the Gatekeeper',
    desc: "Generic support emails do not sign contracts. Our extraction layer aggregates verified contact data from across the web, handing you the direct emails and phone numbers of the actual decision-makers.",
  },
  {
    icon: FiCpu,
    title: 'Trigger AI Outreach',
    desc: 'Turn insights into action. Leverage integrated, on-demand AI to dynamically write highly personalized pitches, email sequences, and call scripts tailored precisely to the digital gaps you just uncovered.',
  },
]

function StepCard({ step, i }) {
  const ref    = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50, scale: 0.94 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.6, delay: i * 0.15, ease: [0.16, 1, 0.3, 1] }}
    >
      <CardContainer containerClassName="w-full h-full" className="w-full h-full">
        <CardBody className="glass-card rounded-2xl p-8 flex flex-col gap-5 w-full h-full cursor-default">

          <div className="flex items-center justify-between">
            <CardItem translateZ={60}>
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{
                  background: 'rgba(170,187,197,0.10)',
                  border: '1px solid rgba(170,187,197,0.20)',
                }}
              >
                <step.icon size={20} color="#AABBC5" />
              </div>
            </CardItem>

            <CardItem translateZ={20}>
              <span className="font-syne text-5xl font-black text-casper" style={{ opacity: 0.10 }}>
                {String(i + 1).padStart(2, '0')}
              </span>
            </CardItem>
          </div>

          <CardItem translateZ={45} className="w-full">
            <h3 className="font-syne text-lg font-bold text-white leading-snug">
              {step.title}
            </h3>
          </CardItem>

          <CardItem translateZ={25} className="w-full">
            <p className="text-sm leading-relaxed text-dove">
              {step.desc}
            </p>
          </CardItem>

        </CardBody>
      </CardContainer>
    </motion.div>
  )
}

export default function HowItWorks() {
  const ref    = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <section id="how-it-works" className="py-28 px-6 bg-black-base">
      <div className="max-w-6xl mx-auto">

        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <p className="text-xs font-semibold tracking-widest uppercase mb-3 text-casper">
            The process
          </p>
          <h2 className="font-syne text-3xl md:text-5xl font-black mb-16 leading-tight text-white">
            Four steps to your<br />
            <span className="text-casper">next high-paying client.</span>
          </h2>
        </motion.div>

        {/* 2x2 grid for 4 cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {steps.map((step, i) => (
            <StepCard key={i} step={step} i={i} />
          ))}
        </div>

      </div>
    </section>
  )
}
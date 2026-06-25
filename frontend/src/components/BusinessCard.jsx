import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { FiMapPin, FiPhone, FiClock, FiGlobe, FiExternalLink } from 'react-icons/fi'

const TYPE_EMOJI = {
  'Restaurant':'🍽️','Cafe':'☕','Bakery':'🥐','Fast Food':'🍔',
  'Bar':'🍻','Pub':'🍺','Ice Cream':'🍦','Food Court':'🏪',
  'Beauty':'💇','Hairdresser':'💇','Electronics':'📱','Mobile Phone':'📱',
  'Florist':'💐','Gift':'🎁','Jewelry':'💍','Jewellery':'💍',
  'Furniture':'🪑','Astrologer':'🔮','Prep School':'📚','College':'📚',
}

function InfoRow({ icon: Icon, text, dim }) {
  if (!text) return null
  return (
    <div className="flex items-start gap-3">
      <Icon size={13} className="mt-0.5 shrink-0 text-casper" />
      <span className={`text-sm leading-snug ${dim ? 'text-dove' : 'text-white/82'}`}>{text}</span>
    </div>
  )
}

export default function BusinessCard({ place, index }) {
  const ref    = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const emoji  = TYPE_EMOJI[place.type] || '🏠'

  return (
    <motion.div ref={ref} className="glass-card rounded-2xl p-6 flex flex-col gap-4"
      initial={{ opacity: 0, y: 55, scale: 0.93, filter: 'blur(4px)' }}
      animate={inView ? { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' } : {}}
      transition={{ duration: 0.55, delay: Math.min(index % 6 * 0.08, 0.45), ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -4 }}
    >
      {/* Badges */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <span className="badge badge-casper">{emoji} {place.type}</span>
        {place.hasWebsite
          ? <span className="badge badge-green">🌐 Has Website</span>
          : <span className="badge badge-red">❌ No Website</span>
        }
      </div>

      {/* Name */}
      <h3 className="font-syne text-lg font-bold leading-snug text-white">{place.name}</h3>

      <div className="divider-casper" />

      {/* Info rows */}
      <div className="flex flex-col gap-2.5">
        <InfoRow icon={FiMapPin} text={place.address || 'Address not listed'} dim={!place.address} />
        <InfoRow icon={FiPhone}  text={place.phone   || 'Phone not listed'}   dim={!place.phone}   />
        <InfoRow icon={FiClock}  text={place.hours   || 'Hours not listed'}   dim={!place.hours}   />
        {place.hasWebsite && <InfoRow icon={FiGlobe} text={place.website} />}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-2 flex-wrap gap-3"
        style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
        {!place.hasWebsite
          ? <p className="text-xs font-semibold text-casper">🎯 Pitch target</p>
          : <p className="text-xs text-dove">Already online</p>
        }
        {place.mapsUrl && (
          <motion.a href={place.mapsUrl} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold no-underline text-casper"
            style={{ background: 'rgba(170,187,197,0.1)', border: '1px solid rgba(170,187,197,0.18)' }}
            whileHover={{ scale: 1.05, background: 'rgba(170,187,197,0.2)', color: '#fff' }}
            whileTap={{ scale: 0.95 }}
          >
            <FiExternalLink size={12} /> View on Maps
          </motion.a>
        )}
      </div>
    </motion.div>
  )
}
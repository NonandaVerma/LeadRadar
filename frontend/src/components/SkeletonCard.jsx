import { motion } from 'framer-motion'

export default function SkeletonCard({ index = 0 }) {
  return (
    <motion.div className="glass-card rounded-2xl p-6 flex flex-col gap-4"
      initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07 }} aria-hidden="true"
    >
      <div className="flex items-center justify-between">
        <div className="skeleton h-5 w-28 rounded-full" />
        <div className="skeleton h-5 w-20 rounded-full" />
      </div>
      <div className="skeleton h-6 w-3/4 rounded" />
      <div className="divider-casper" />
      <div className="flex flex-col gap-3">
        {[1,2,3].map(n => (
          <div key={n} className="flex gap-3 items-center">
            <div className="skeleton h-3 w-3 rounded" />
            <div className="skeleton h-3 rounded" style={{ width: `${55 + n * 10}%` }} />
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between pt-2">
        <div className="skeleton h-5 w-20 rounded-full" />
        <div className="skeleton h-8 w-28 rounded-lg" />
      </div>
    </motion.div>
  )
}
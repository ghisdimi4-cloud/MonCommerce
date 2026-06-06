"use client"

import { motion } from "framer-motion"

export function StatsSection() {
  const stats = [
    { value: "500+", label: "Commerces actifs" },
    { value: "10M+", label: "De transactions gérées" },
    { value: "0", label: "Perte de données" },
    { value: "24/7", label: "Support client" },
  ]

  return (
    <section className="py-20 border-y border-slate-200 bg-slate-50 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 md:px-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {stats.map((stat, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="text-center"
            >
              <div className="text-4xl md:text-5xl font-bold text-slate-900 mb-2 font-['Plus_Jakarta_Sans']">
                {stat.value}
              </div>
              <div className="text-sm md:text-base text-slate-600 font-medium">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

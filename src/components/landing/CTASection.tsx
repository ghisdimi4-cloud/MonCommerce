"use client"

import { motion } from "framer-motion"
import Link from "next/link"

export function CTASection() {
  return (
    <section className="py-24 relative overflow-hidden bg-white">
      <div className="max-w-5xl mx-auto px-4 md:px-10">
        <div className="bg-primary-900 rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-600/30 rounded-full blur-[100px] pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-emerald-500/20 rounded-full blur-[100px] pointer-events-none"></div>
          
          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Prêt à développer votre commerce ?
            </h2>
            <p className="text-xl text-primary-100 mb-10 max-w-2xl mx-auto">
              Rejoignez les commerçants qui ont déjà digitalisé leur gestion. La configuration prend moins de 2 minutes.
            </p>
            
            <Link href="/signup">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white text-primary-900 px-10 py-5 rounded-2xl font-bold text-lg shadow-[0_0_30px_rgba(255,255,255,0.3)] hover:shadow-[0_0_50px_rgba(255,255,255,0.5)] transition-shadow duration-300"
              >
                Créer mon compte gratuitement
              </motion.button>
            </Link>
            <p className="mt-6 text-primary-200 text-sm">
              Aucune carte de crédit requise pour l'essai.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

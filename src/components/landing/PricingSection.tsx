"use client"

import { motion } from "framer-motion"
import { CheckCircle2 } from "lucide-react"

export function PricingSection() {
  return (
    <section id="pricing" className="py-32 relative bg-white">
      <div className="max-w-7xl mx-auto px-4 md:px-10">
        <div className="text-center max-w-2xl mx-auto mb-20">
          <h2 className="text-sm font-bold text-primary-600 tracking-wider uppercase mb-3">Tarifs simples</h2>
          <h3 className="text-4xl font-bold text-slate-900 mb-6">Investissez dans votre tranquillité d'esprit.</h3>
          <p className="text-lg text-slate-600">
            Un tarif unique et transparent. Pas de frais cachés, pas de surprises. Essayez gratuitement pendant 14 jours.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Free Plan */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-slate-50 rounded-3xl p-8 border border-slate-200"
          >
            <h4 className="text-2xl font-bold text-slate-900 mb-2">Essai Gratuit</h4>
            <p className="text-slate-500 mb-6">Idéal pour tester l'application</p>
            <div className="text-5xl font-bold text-slate-900 mb-8">
              0 <span className="text-xl text-slate-500 font-normal">FCFA / 14 jours</span>
            </div>
            
            <ul className="space-y-4 mb-8">
              <li className="flex items-center gap-3 text-slate-700">
                <CheckCircle2 className="w-5 h-5 text-primary-500 shrink-0" />
                Tableau de bord de base
              </li>
              <li className="flex items-center gap-3 text-slate-700">
                <CheckCircle2 className="w-5 h-5 text-primary-500 shrink-0" />
                Jusqu'à 50 produits
              </li>
              <li className="flex items-center gap-3 text-slate-700">
                <CheckCircle2 className="w-5 h-5 text-primary-500 shrink-0" />
                Suivi des dettes
              </li>
            </ul>

            <button className="w-full py-4 rounded-xl font-bold text-primary-700 bg-primary-50 hover:bg-primary-100 transition-colors">
              Commencer l'essai
            </button>
          </motion.div>

          {/* Pro Plan */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-slate-900 rounded-3xl p-8 border border-slate-800 shadow-[0_20px_40px_-15px_rgba(16,185,129,0.3)] relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 bg-primary text-white text-xs font-bold px-4 py-1.5 rounded-bl-xl">
              Plus Populaire
            </div>
            <h4 className="text-2xl font-bold text-white mb-2">Pro Business</h4>
            <p className="text-slate-400 mb-6">Pour les commerces qui veulent grandir</p>
            <div className="text-5xl font-bold text-white mb-8">
              5 000 <span className="text-xl text-slate-400 font-normal">FCFA / mois</span>
            </div>
            
            <ul className="space-y-4 mb-8">
              <li className="flex items-center gap-3 text-slate-300">
                <CheckCircle2 className="w-5 h-5 text-primary-400 shrink-0" />
                Tout en illimité (Produits, Ventes)
              </li>
              <li className="flex items-center gap-3 text-slate-300">
                <CheckCircle2 className="w-5 h-5 text-primary-400 shrink-0" />
                Assistant IA et Insights
              </li>
              <li className="flex items-center gap-3 text-slate-300">
                <CheckCircle2 className="w-5 h-5 text-primary-400 shrink-0" />
                Génération de factures PDF
              </li>
              <li className="flex items-center gap-3 text-slate-300">
                <CheckCircle2 className="w-5 h-5 text-primary-400 shrink-0" />
                Support prioritaire WhatsApp
              </li>
            </ul>

            <button className="w-full py-4 rounded-xl font-bold text-white bg-primary hover:bg-primary-hover shadow-lg shadow-primary/30 hover:shadow-primary/50 transition-all hover:-translate-y-1">
              Souscrire maintenant
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

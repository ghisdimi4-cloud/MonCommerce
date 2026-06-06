"use client"

import { motion } from "framer-motion"
import { Lightbulb, TrendingUp, AlertTriangle } from "lucide-react"

export function InsightsSection() {
  return (
    <section id="insights" className="py-32 relative bg-slate-900 overflow-hidden text-white">
      {/* Dark mode glow effects */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary-600/20 rounded-full blur-[150px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-[150px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 md:px-10 grid lg:grid-cols-2 gap-16 items-center relative z-10">
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-white font-medium text-sm mb-6">
            <span className="text-primary-400">✧</span> Propulsé par l'IA
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Plus qu'un gestionnaire,<br />votre conseiller personnel.</h2>
          <p className="text-lg text-slate-300 mb-8 leading-relaxed">
            Notre Intelligence Artificielle analyse vos données en arrière-plan pour vous fournir des recommandations concrètes (Insights). Elle détecte ce qu'un humain pourrait manquer.
          </p>

          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="mt-1 w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-6 h-6 text-warning" />
              </div>
              <div>
                <h4 className="text-xl font-bold mb-2">Prévention des ruptures</h4>
                <p className="text-slate-400">L'IA anticipe vos ventes et vous alerte avant que vous ne soyez à court de vos produits phares.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="mt-1 w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                <TrendingUp className="w-6 h-6 text-success" />
              </div>
              <div>
                <h4 className="text-xl font-bold mb-2">Analyse de rentabilité</h4>
                <p className="text-slate-400">Découvrez instantanément quels produits vous rapportent le plus et lesquels dorment en rayon.</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Mockup IA Panel */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-xl relative"
        >
          <div className="absolute -top-4 -right-4 bg-primary text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
            Généré automatiquement
          </div>

          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-full bg-primary-500/20 flex items-center justify-center">
              <Lightbulb className="w-5 h-5 text-primary-400" />
            </div>
            <div>
              <h4 className="font-bold text-lg">Insights Business</h4>
              <p className="text-xs text-slate-400">Basé sur vos 30 derniers jours</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-warning/20 flex items-center justify-center mt-0.5">
                  <span className="text-warning font-bold">!</span>
                </div>
                <div>
                  <h5 className="font-bold text-sm mb-1">Attention au stock "Eau Minérale"</h5>
                  <p className="text-xs text-slate-400">Vos ventes de ce produit ont augmenté de 40% à cause de la chaleur. Votre stock actuel sera épuisé dans 3 jours. Pensez à recommander.</p>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-success/20 flex items-center justify-center mt-0.5">
                  <span className="text-success font-bold">★</span>
                </div>
                <div>
                  <h5 className="font-bold text-sm mb-1">Opportunité de relance</h5>
                  <p className="text-xs text-slate-400">Le client "Marc Antoine" n'a rien acheté depuis 2 semaines alors qu'il venait tous les 3 jours. Envoyez-lui un message WhatsApp.</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

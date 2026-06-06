"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { BarChart3, TrendingUp, Box, ShieldCheck } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative pt-24 pb-32 overflow-hidden">
      {/* Decorative Blur Elements */}
      <div className="absolute top-20 -left-20 w-96 h-96 bg-primary-100 rounded-full blur-[100px] opacity-60 pointer-events-none -z-10"></div>
      <div className="absolute bottom-10 right-0 w-[500px] h-[500px] bg-blue-50 rounded-full blur-[120px] opacity-70 pointer-events-none -z-10"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-emerald-50 rounded-[100%] blur-[120px] opacity-40 pointer-events-none -z-10 rotate-12"></div>

      <div className="max-w-7xl mx-auto px-4 md:px-10 grid lg:grid-cols-2 gap-16 items-center">
        {/* Text Content */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative z-10"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-50 border border-primary-100 text-primary-700 font-medium text-sm mb-6 shadow-sm">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary-500"></span>
            </span>
            Nouveau: L'Assistant IA est disponible
          </div>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-slate-900 leading-[1.1] tracking-tight mb-6">
            Gérez votre commerce avec une <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-primary-400">simplicité absolue.</span>
          </h1>

          <p className="text-lg md:text-xl text-slate-600 mb-8 max-w-xl leading-relaxed">
            Ventes, stocks, dettes et clients. Oubliez les carnets papier et les tableaux Excel compliqués. Tout votre business dans votre poche, dopé à l'Intelligence Artificielle.
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <Link href="/signup" className="group">
              <motion.button 
                whileHover={{ scale: 1.02, translateY: -2 }}
                whileTap={{ scale: 0.98 }}
                className="bg-primary text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-[0_4px_20px_-2px_rgba(16,185,129,0.3)] hover:shadow-[0_8px_25px_-5px_rgba(16,185,129,0.4)] transition-all duration-300 flex items-center gap-2"
              >
                Démarrer gratuitement
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </motion.button>
            </Link>
            
            <button className="px-8 py-4 rounded-2xl font-bold text-slate-700 bg-white border border-slate-200 hover:border-primary-200 hover:bg-slate-50 transition-all duration-300 shadow-sm flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Voir la démo
            </button>
          </div>
          
          <div className="mt-10 flex items-center gap-6 text-sm text-slate-500 font-medium">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-primary-500" />
              100% Sécurisé
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-primary-500" />
              Sans engagement
            </div>
          </div>
        </motion.div>

        {/* Visual Content (Dashboard Mockup & Floating Elements) */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="relative"
        >
          {/* Main Mockup Card */}
          <div className="relative z-20 bg-white rounded-3xl p-6 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] border border-slate-100">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-primary-600" />
                </div>
                <div>
                  <div className="text-sm text-slate-500">Recette du jour</div>
                  <div className="text-xl font-bold text-slate-900">452 000 FCFA</div>
                </div>
              </div>
              <div className="px-3 py-1 bg-success/10 text-success text-xs font-bold rounded-full">
                +12.5%
              </div>
            </div>
            
            <div className="space-y-4">
              {[
                { name: "Vente #1024", amount: "45 000 FCFA", time: "Il y a 5 min", status: "Payé", color: "bg-success" },
                { name: "Vente #1023", amount: "12 500 FCFA", time: "Il y a 12 min", status: "Dette", color: "bg-warning" },
                { name: "Vente #1022", amount: "89 000 FCFA", time: "Il y a 1 heure", status: "Payé", color: "bg-success" }
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${item.color}`}></div>
                    <div>
                      <div className="text-sm font-semibold text-slate-900">{item.name}</div>
                      <div className="text-xs text-slate-500">{item.time}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-slate-900">{item.amount}</div>
                    <div className="text-xs text-slate-500">{item.status}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Floating Element 1 */}
          <motion.div 
            animate={{ y: [0, -15, 0] }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            className="absolute -top-10 -right-10 z-30 bg-white p-4 rounded-2xl shadow-[0_15px_30px_-10px_rgba(0,0,0,0.15)] border border-slate-100 flex items-center gap-4"
          >
            <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
              <Box className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs text-slate-500 font-medium">Alerte Stock</div>
              <div className="text-sm font-bold text-slate-900">iPhone 13 (2 restants)</div>
            </div>
          </motion.div>

          {/* Floating Element 2 */}
          <motion.div 
            animate={{ y: [0, 15, 0] }}
            transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 1 }}
            className="absolute -bottom-8 -left-8 z-30 bg-white p-4 rounded-2xl shadow-[0_15px_30px_-10px_rgba(0,0,0,0.15)] border border-slate-100 flex items-center gap-3"
          >
            <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-600">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-slate-500 font-medium">Croissance mensuelle</div>
              <div className="text-sm font-bold text-success">+ 24.8% vs mois dernier</div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

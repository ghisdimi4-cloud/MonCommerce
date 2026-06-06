"use client"

import { motion } from "framer-motion"
import { LayoutDashboard, Wallet, Users, FileText } from "lucide-react"

export function FeaturesSection() {
  const features = [
    {
      icon: <LayoutDashboard className="w-6 h-6 text-primary-600" />,
      title: "Tableau de Bord Intuitif",
      description: "Visualisez vos revenus, dépenses et bénéfices en temps réel avec des graphiques clairs. Prenez les bonnes décisions sans être un expert comptable."
    },
    {
      icon: <Wallet className="w-6 h-6 text-primary-600" />,
      title: "Gestion des Dettes Intelligente",
      description: "Fini les clients qui 'oublient' de payer. Suivez chaque crédit accordé et envoyez des rappels polis en un clic via WhatsApp."
    },
    {
      icon: <Users className="w-6 h-6 text-primary-600" />,
      title: "Fidélisation Client",
      description: "Historique d'achats, préférences, contacts. Connaissez vos meilleurs clients et offrez-leur une expérience personnalisée qui les fera revenir."
    },
    {
      icon: <FileText className="w-6 h-6 text-primary-600" />,
      title: "Factures Pro en 3 Secondes",
      description: "Générez des reçus et factures au format PDF avec votre logo, prêts à être imprimés ou envoyés directement sur le téléphone de votre client."
    }
  ]

  return (
    <section id="features" className="py-32 relative bg-white">
      <div className="max-w-7xl mx-auto px-4 md:px-10">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-sm font-bold text-primary-600 tracking-wider uppercase mb-3">Fonctionnalités Clés</h2>
          <h3 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">Tout ce dont vous avez besoin, <br className="hidden md:block" />rien de superflu.</h3>
          <p className="text-lg text-slate-600">
            Nous avons éliminé la complexité des logiciels de gestion traditionnels pour ne garder que l'essentiel, pensé spécifiquement pour la réalité de votre commerce.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-slate-50 rounded-3xl p-8 hover:bg-white hover:shadow-xl hover:-translate-y-2 transition-all duration-300 border border-transparent hover:border-slate-100 group"
            >
              <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                {feature.icon}
              </div>
              <h4 className="text-xl font-bold text-slate-900 mb-4">{feature.title}</h4>
              <p className="text-slate-600 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

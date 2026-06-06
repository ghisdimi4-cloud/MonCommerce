"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown } from "lucide-react"

export function FAQSection() {
  const [openIndex, setOpenIndex] = React.useState<number | null>(0)

  const faqs = [
    {
      question: "Ai-je besoin d'une connexion internet en permanence ?",
      answer: "L'application nécessite une connexion internet pour synchroniser vos données et générer les recommandations de l'IA, assurant ainsi qu'elles sont sauvegardées en toute sécurité sur le cloud."
    },
    {
      question: "Mes données sont-elles en sécurité ?",
      answer: "Absolument. Vos données sont cryptées et stockées sur des serveurs hautement sécurisés. Personne d'autre que vous n'y a accès. Fini la perte de carnets de comptes."
    },
    {
      question: "Comment puis-je envoyer les reçus à mes clients ?",
      answer: "Lors de chaque vente, vous pouvez générer un reçu au format PDF et l'envoyer directement via un lien WhatsApp ou le télécharger pour l'imprimer si vous disposez d'une imprimante thermique bluetooth."
    },
    {
      question: "Puis-je annuler mon abonnement ?",
      answer: "Oui, c'est sans engagement. Vous pouvez annuler votre abonnement à tout moment d'un simple clic."
    }
  ]

  return (
    <section id="faq" className="py-32 relative bg-slate-50">
      <div className="max-w-3xl mx-auto px-4 md:px-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-slate-900 mb-6">Questions Fréquentes</h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden cursor-pointer"
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
            >
              <div className="px-6 py-5 flex items-center justify-between">
                <h4 className="font-bold text-slate-900 text-lg">{faq.question}</h4>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-transform duration-300 ${openIndex === index ? 'rotate-180 bg-primary-50 text-primary' : 'bg-slate-50 text-slate-400'}`}>
                  <ChevronDown className="w-5 h-5" />
                </div>
              </div>
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-6 text-slate-600 leading-relaxed border-t border-slate-50 pt-4">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

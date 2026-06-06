"use client"

import { motion } from "framer-motion"
import { Star } from "lucide-react"

export function TestimonialsSection() {
  const testimonials = [
    {
      text: "Depuis que j'utilise MonCommerce, je ne perds plus de temps à faire les comptes le soir. Tout est clair, et j'ai même récupéré 50 000 FCFA de dettes oubliées !",
      author: "Aminata",
      role: "Gérante de Boutique",
      initial: "A"
    },
    {
      text: "L'intelligence artificielle m'a bluffé. Le système m'a prévenu que mon produit star allait être en rupture 3 jours avant. J'ai pu recommander à temps.",
      author: "Jean-Paul",
      role: "Propriétaire de Quincaillerie",
      initial: "J"
    },
    {
      text: "Envoyer les factures par WhatsApp a changé ma relation client. Ça fait tellement plus professionnel qu'un bout de papier griffonné.",
      author: "Sarah",
      role: "Vendeuse de Cosmétiques",
      initial: "S"
    }
  ]

  return (
    <section className="py-32 relative bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 md:px-10">
        <div className="text-center mb-20">
          <h2 className="text-sm font-bold text-primary-600 tracking-wider uppercase mb-3">Témoignages</h2>
          <h3 className="text-4xl font-bold text-slate-900 mb-6">Ils ont transformé leur commerce.</h3>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 relative"
            >
              <div className="text-primary-400 mb-6 flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-current" />
                ))}
              </div>
              <p className="text-slate-700 mb-8 italic relative z-10">
                "{testimonial.text}"
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold text-xl">
                  {testimonial.initial}
                </div>
                <div>
                  <h5 className="font-bold text-slate-900">{testimonial.author}</h5>
                  <p className="text-sm text-slate-500">{testimonial.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

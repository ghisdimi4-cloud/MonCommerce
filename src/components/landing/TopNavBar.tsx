"use client"

import Link from "next/link"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"

export function TopNavBar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="bg-white/95 backdrop-blur-md w-full sticky top-0 border-b border-slate-200 z-50 transition-all duration-300 shadow-sm" id="navbar">
      <div className="flex justify-between items-center w-full px-4 md:px-10 max-w-7xl mx-auto h-20">
        <Link href="/" className="flex items-center gap-2">
          {/* Logo icon substitute */}
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white font-bold">M</div>
          <span className="text-2xl font-bold text-slate-900">MonCommerce</span>
        </Link>
        <nav className="hidden md:flex items-center gap-8">
          <Link href="#features" className="text-slate-600 text-sm font-medium hover:text-primary transition-colors duration-200">Fonctionnalités</Link>
          <Link href="#insights" className="text-slate-600 text-sm font-medium hover:text-primary transition-colors duration-200">Insights</Link>
          <Link href="#pricing" className="text-slate-600 text-sm font-medium hover:text-primary transition-colors duration-200">Tarifs</Link>
          <Link href="#faq" className="text-slate-600 text-sm font-medium hover:text-primary transition-colors duration-200">FAQ</Link>
        </nav>
        <div className="hidden md:flex items-center gap-4">
          <Link href="/login">
            <Button variant="ghost" className="text-slate-900 font-medium hover:bg-slate-50 transition-colors">Connexion</Button>
          </Link>
          <Link href="/signup">
            <Button className="bg-primary text-white shadow-sm hover:bg-primary-hover transition-all hover:-translate-y-0.5">Démarrer gratuitement</Button>
          </Link>
        </div>
        <button 
          className="md:hidden text-slate-900 p-2"
          onClick={() => setIsOpen(!isOpen)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {isOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-slate-100 bg-white overflow-hidden"
          >
            <div className="px-4 py-6 space-y-6 flex flex-col">
              <Link href="#features" onClick={() => setIsOpen(false)} className="text-slate-600 font-medium hover:text-primary">Fonctionnalités</Link>
              <Link href="#insights" onClick={() => setIsOpen(false)} className="text-slate-600 font-medium hover:text-primary">Insights</Link>
              <Link href="#pricing" onClick={() => setIsOpen(false)} className="text-slate-600 font-medium hover:text-primary">Tarifs</Link>
              <Link href="#faq" onClick={() => setIsOpen(false)} className="text-slate-600 font-medium hover:text-primary">FAQ</Link>
              <div className="pt-4 border-t border-slate-100 flex flex-col gap-3">
                <Link href="/login" onClick={() => setIsOpen(false)}>
                  <Button variant="outline" className="w-full justify-center">Connexion</Button>
                </Link>
                <Link href="/signup" onClick={() => setIsOpen(false)}>
                  <Button className="w-full justify-center bg-primary hover:bg-primary-hover text-white">Démarrer gratuitement</Button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

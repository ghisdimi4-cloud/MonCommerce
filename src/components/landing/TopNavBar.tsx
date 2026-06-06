"use client"

import Link from "next/link"

import { Button } from "@/components/ui/button"

export function TopNavBar() {
  return (
    <header className="bg-white/95 backdrop-blur-md w-full sticky top-0 border-b border-slate-200 z-50 transition-all duration-300 shadow-sm" id="navbar">
      <div className="flex justify-between items-center w-full px-4 md:px-10 max-w-7xl mx-auto h-20">
        <div className="flex items-center gap-2">
          {/* Logo icon substitute */}
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white font-bold">M</div>
          <span className="text-2xl font-bold text-slate-900">MonCommerce</span>
        </div>
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
        <button className="md:hidden text-slate-900">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
    </header>
  )
}

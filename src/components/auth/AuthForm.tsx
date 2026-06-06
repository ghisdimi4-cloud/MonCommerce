"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ShieldCheck, Zap, BarChart3, TrendingUp, Loader2, ArrowRight } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { createClient } from "@/utils/supabase/client"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

export function AuthForm({ defaultTab = "login" }: { defaultTab?: "login" | "register" }) {
  const [activeTab, setActiveTab] = useState<"login" | "register">(defaultTab)
  
  // State for forms
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [storeName, setStoreName] = useState("")
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  
  const { toast } = useToast()
  const router = useRouter()
  const supabase = createClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      toast({
        title: "Connexion réussie",
        description: "Bienvenue sur MonCommerce !",
        type: "success"
      })
      
      router.push("/dashboard")
      router.refresh()
    } catch (error: any) {
      toast({
        title: "Erreur de connexion",
        description: error.message || "Identifiants invalides",
        type: "error"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      })

      if (error) throw error

      if (data.user) {
        await supabase.from('settings').insert([{
          user_id: data.user.id,
          companyName: storeName,
          phone: "À configurer",
          address: "À configurer",
          paymentMobileMoney: true,
          paymentCash: true,
          paymentCard: false
        }])
      }

      toast({
        title: "Boutique créée !",
        description: "Votre compte a été créé avec succès.",
        type: "success"
      })
      
      router.push("/dashboard")
      router.refresh()
    } catch (error: any) {
      toast({
        title: "Erreur d'inscription",
        description: error.message,
        type: "error"
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <div className="flex-1 flex flex-col lg:flex-row">
        
        {/* LEFT PANEL - ILLUSTRATION (Hidden on mobile) */}
        <div className="hidden lg:flex flex-1 bg-primary-50 relative overflow-hidden flex-col">
          {/* Logo */}
          <div className="p-8 relative z-20">
            <Link href="/" className="inline-flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center text-white font-bold group-hover:scale-105 transition-transform">M</div>
              <span className="text-xl font-bold text-slate-900 group-hover:text-primary-700 transition-colors">MonCommerce</span>
            </Link>
          </div>

          {/* Content */}
          <div className="flex-1 flex flex-col justify-center p-12 relative z-20 max-w-2xl mx-auto">
            <div className="inline-block px-3 py-1 bg-primary-100 text-primary-800 text-sm font-bold rounded-full mb-6 w-max">
              La solution de gestion intelligente
            </div>
            <h1 className="text-4xl xl:text-5xl font-bold text-slate-900 mb-6 leading-tight">
              Gérez votre commerce,<br />
              développez <span className="text-primary-600">votre succès.</span>
            </h1>
            <p className="text-slate-600 text-lg mb-12">
              MonCommerce vous aide à gérer vos ventes, stocks, clients et finances en toute simplicité. Où que vous soyez.
            </p>

            {/* Dashboard Mockup */}
            <div className="relative w-full h-[250px] bg-white rounded-t-3xl shadow-2xl border-t border-x border-white/40 p-6 backdrop-blur-xl bg-opacity-80 translate-y-12">
              <div className="flex items-center justify-between mb-4">
                <div className="font-bold text-slate-800">Vue d'ensemble</div>
                <div className="text-xs text-slate-500 flex items-center gap-1">Aujourd'hui <ChevronDownIcon className="w-3 h-3" /></div>
              </div>
              <div className="bg-slate-50 rounded-xl p-4 mb-4 flex justify-between items-end border border-slate-100">
                <div>
                  <div className="text-xs text-slate-500 mb-1">Ventes du jour</div>
                  <div className="text-2xl font-bold text-slate-900">125 500 FCFA</div>
                </div>
                <div className="text-xs font-bold text-success bg-success/10 px-2 py-1 rounded-full">+12%</div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                  <div className="text-xs text-slate-500 mb-1">Produits</div>
                  <div className="text-xl font-bold text-slate-900">128</div>
                </div>
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                  <div className="text-xs text-slate-500 mb-1">Clients</div>
                  <div className="text-xl font-bold text-slate-900">64</div>
                </div>
              </div>
            </div>
          </div>

          {/* Features below mockup */}
          <div className="bg-white/60 backdrop-blur-md p-8 relative z-20 border-t border-white/50">
            <div className="grid grid-cols-3 gap-6 max-w-2xl mx-auto">
              <div>
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center mb-3 shadow-sm text-primary-600">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-slate-900 text-sm mb-1">Sécurisé</h4>
                <p className="text-xs text-slate-500">Vos données sont protégées avec les meilleures normes.</p>
              </div>
              <div>
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center mb-3 shadow-sm text-primary-600">
                  <Zap className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-slate-900 text-sm mb-1">Rapide</h4>
                <p className="text-xs text-slate-500">Accédez à toutes vos informations en temps réel.</p>
              </div>
              <div>
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center mb-3 shadow-sm text-primary-600">
                  <BarChart3 className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-slate-900 text-sm mb-1">Intelligent</h4>
                <p className="text-xs text-slate-500">Des statistiques claires pour prendre les meilleures décisions.</p>
              </div>
            </div>
          </div>

          {/* Background decorations */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-200/50 rounded-full blur-[100px] -z-10 translate-x-1/3 -translate-y-1/3"></div>
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-emerald-300/30 rounded-full blur-[100px] -z-10 -translate-x-1/3 translate-y-1/3"></div>
        </div>

        {/* RIGHT PANEL - FORM */}
        <div className="flex-1 flex flex-col bg-white">
          {/* Mobile Logo Header */}
          <div className="lg:hidden p-4 border-b border-slate-100 flex items-center justify-between">
            <Link href="/" className="inline-flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center text-white font-bold">M</div>
              <span className="text-xl font-bold text-slate-900">MonCommerce</span>
            </Link>
          </div>

          <div className="flex-1 flex flex-col justify-center items-center p-6 sm:p-12">
            <div className="w-full max-w-[420px]">
              
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-slate-900 mb-2">Bienvenue sur MonCommerce</h2>
                <p className="text-slate-500">Connectez-vous ou créez un compte pour continuer</p>
              </div>

              {/* TABS */}
              <div className="flex border-b border-slate-200 mb-8">
                <button 
                  className={`flex-1 pb-4 text-center font-bold text-sm transition-colors relative ${activeTab === "login" ? "text-primary-600" : "text-slate-500 hover:text-slate-700"}`}
                  onClick={() => setActiveTab("login")}
                >
                  Connexion
                  {activeTab === "login" && (
                    <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600" />
                  )}
                </button>
                <button 
                  className={`flex-1 pb-4 text-center font-bold text-sm transition-colors relative ${activeTab === "register" ? "text-primary-600" : "text-slate-500 hover:text-slate-700"}`}
                  onClick={() => setActiveTab("register")}
                >
                  Inscription
                  {activeTab === "register" && (
                    <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600" />
                  )}
                </button>
              </div>

              {/* FORMS */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  {activeTab === "login" ? (
                    <form onSubmit={handleLogin} className="space-y-5">
                      <div className="space-y-1.5">
                        <Label htmlFor="email-login" className="text-slate-700 font-semibold">Adresse email</Label>
                        <div className="relative">
                          <Input
                            id="email-login"
                            type="email"
                            placeholder="Entrez votre adresse email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="pl-10 h-12 rounded-xl bg-white border-slate-200 focus:border-primary-500 focus:ring-primary-500/20"
                          />
                          <svg className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                        </div>
                      </div>
                      
                      <div className="space-y-1.5">
                        <Label htmlFor="password-login" className="text-slate-700 font-semibold">Mot de passe</Label>
                        <div className="relative">
                          <Input
                            id="password-login"
                            type={showPassword ? "text" : "password"}
                            placeholder="Entrez votre mot de passe"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="pl-10 pr-10 h-12 rounded-xl bg-white border-slate-200 focus:border-primary-500 focus:ring-primary-500/20"
                          />
                          <svg className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                          </svg>
                          <button 
                            type="button" 
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              {showPassword ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.29 3.29m0 0a10.05 10.05 0 015.188-1.583c4.478 0 8.268 2.943 9.542 7a10.025 10.025 0 01-4.132 5.411m0 0l-3.29-3.29" />
                              ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              )}
                              {!showPassword && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />}
                            </svg>
                          </button>
                        </div>
                        <div className="flex justify-end pt-1">
                          <Link href="#" className="text-sm font-bold text-primary-600 hover:text-primary-700">Mot de passe oublié ?</Link>
                        </div>
                      </div>

                      <Button 
                        type="submit" 
                        className="w-full h-12 rounded-xl text-white font-bold text-base bg-primary-600 hover:bg-primary-700 shadow-md shadow-primary-500/20 transition-all"
                        disabled={loading}
                      >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                          <span className="flex items-center gap-2"><LockIcon className="w-4 h-4" /> Se connecter</span>
                        )}
                      </Button>
                    </form>
                  ) : (
                    <form onSubmit={handleSignup} className="space-y-5">
                      <div className="space-y-1.5">
                        <Label htmlFor="store" className="text-slate-700 font-semibold">Nom de la boutique</Label>
                        <div className="relative">
                          <Input
                            id="store"
                            type="text"
                            placeholder="Ma Boutique"
                            value={storeName}
                            onChange={(e) => setStoreName(e.target.value)}
                            required
                            className="pl-10 h-12 rounded-xl bg-white border-slate-200 focus:border-primary-500 focus:ring-primary-500/20"
                          />
                          <svg className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                          </svg>
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <Label htmlFor="email-register" className="text-slate-700 font-semibold">Adresse email</Label>
                        <div className="relative">
                          <Input
                            id="email-register"
                            type="email"
                            placeholder="vous@entreprise.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="pl-10 h-12 rounded-xl bg-white border-slate-200 focus:border-primary-500 focus:ring-primary-500/20"
                          />
                          <svg className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                        </div>
                      </div>
                      
                      <div className="space-y-1.5">
                        <Label htmlFor="password-register" className="text-slate-700 font-semibold">Mot de passe</Label>
                        <div className="relative">
                          <Input
                            id="password-register"
                            type={showPassword ? "text" : "password"}
                            placeholder="Min. 6 caractères"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            minLength={6}
                            className="pl-10 pr-10 h-12 rounded-xl bg-white border-slate-200 focus:border-primary-500 focus:ring-primary-500/20"
                          />
                          <svg className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                          </svg>
                          <button 
                            type="button" 
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              {showPassword ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.29 3.29m0 0a10.05 10.05 0 015.188-1.583c4.478 0 8.268 2.943 9.542 7a10.025 10.025 0 01-4.132 5.411m0 0l-3.29-3.29" />
                              ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              )}
                              {!showPassword && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />}
                            </svg>
                          </button>
                        </div>
                      </div>

                      <Button 
                        type="submit" 
                        className="w-full h-12 rounded-xl text-white font-bold text-base bg-primary-600 hover:bg-primary-700 shadow-md shadow-primary-500/20 transition-all"
                        disabled={loading}
                      >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Créer mon compte"}
                      </Button>
                    </form>
                  )}
                </motion.div>
              </AnimatePresence>

              {/* SOCIAL LOGIN */}
              <div className="mt-8">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-200"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-slate-500">ou continuer avec</span>
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  <button className="w-full h-12 flex items-center justify-center gap-3 bg-white border border-slate-200 rounded-xl text-slate-700 font-bold hover:bg-slate-50 transition-colors">
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                    Continuer avec Google
                  </button>
                  <button className="w-full h-12 flex items-center justify-center gap-3 bg-white border border-slate-200 rounded-xl text-slate-700 font-bold hover:bg-slate-50 transition-colors">
                    <svg className="w-5 h-5 text-[#1877F2]" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                    Continuer avec Facebook
                  </button>
                </div>
              </div>

              {/* SWITCH TAB BOTTOM */}
              <div className="mt-8 text-center text-sm text-slate-600">
                {activeTab === "login" ? (
                  <>Pas encore de compte ? <button onClick={() => setActiveTab("register")} className="font-bold text-primary-600 hover:text-primary-700">Créer un compte</button></>
                ) : (
                  <>Vous avez déjà un compte ? <button onClick={() => setActiveTab("login")} className="font-bold text-primary-600 hover:text-primary-700">Se connecter</button></>
                )}
              </div>

            </div>
          </div>
          
          {/* Trust Banner Bottom */}
          <div className="bg-slate-50 border-t border-slate-200 py-4 px-6 mt-auto">
            <div className="max-w-md mx-auto flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 text-xs text-slate-500">
                <div className="w-8 h-8 rounded-full bg-success/10 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-4 h-4 text-success" />
                </div>
                Rejoignez des milliers de commerçants qui utilisent MonCommerce avec efficacité.
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <div className="flex -space-x-2">
                  <div className="w-6 h-6 rounded-full bg-slate-200 border-2 border-white"></div>
                  <div className="w-6 h-6 rounded-full bg-slate-300 border-2 border-white"></div>
                  <div className="w-6 h-6 rounded-full bg-slate-400 border-2 border-white"></div>
                </div>
                <div className="text-xs font-bold text-success bg-success/10 px-2 py-0.5 rounded-full">+10K</div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

function ChevronDownIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
  )
}

function LockIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
    </svg>
  )
}

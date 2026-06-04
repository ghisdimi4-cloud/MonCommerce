"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Store, ArrowLeft, Loader2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { createClient } from "@/utils/supabase/client"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function SignupPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [storeName, setStoreName] = useState("")
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()
  const router = useRouter()
  const supabase = createClient()

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      })

      if (error) throw error

      // Création des paramètres par défaut pour la nouvelle boutique
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
      
      router.push("/")
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
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gradient-to-br from-primary-50/50 to-slate-50/50 z-0" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 24 }}
        className="w-full max-w-md z-10"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-3 bg-white rounded-2xl shadow-sm border border-slate-100 mb-4">
            <Store className="h-8 w-8 text-primary-600" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Lancer votre boutique</h1>
          <p className="text-slate-500 mt-2">Rejoignez MonCommerce en quelques secondes</p>
        </div>

        <Card className="glass-card border-0 shadow-xl shadow-primary-500/5">
          <CardContent className="p-8">
            <form onSubmit={handleSignup} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="storeName">Nom de la boutique</Label>
                <Input
                  id="storeName"
                  type="text"
                  placeholder="Ma Super Boutique"
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                  required
                  className="bg-white/50 focus:bg-white transition-colors"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Adresse email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="vous@entreprise.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-white/50 focus:bg-white transition-colors"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Mot de passe (min. 6 caractères)</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="bg-white/50 focus:bg-white transition-colors"
                />
              </div>

              <Button 
                type="submit" 
                className="w-full h-12 bg-primary-500 hover:bg-primary-600 text-white rounded-xl text-lg font-medium shadow-primary-glow transition-all hover:scale-[1.02]"
                disabled={loading}
              >
                {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Créer ma boutique"}
              </Button>
            </form>

            <div className="mt-8 text-center text-sm text-slate-500">
              Vous avez déjà un compte ?{" "}
              <Link href="/login" className="text-primary-600 hover:text-primary-700 font-semibold inline-flex items-center gap-1 group">
                <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                Se connecter
              </Link>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

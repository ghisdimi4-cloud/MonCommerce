"use client"

import { motion } from "framer-motion"
import { Store, CreditCard, Bell, Shield, Rocket, Upload, Save } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { useAppStore } from "@/lib/store"
import { CustomDialog } from "@/components/ui/custom-dialog"
import { useState } from "react"

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
}

const item: any = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
}

export default function ParametresPage() {
  const { toast } = useToast()
  const { settings, updateSettings } = useAppStore()
  
  const [form, setForm] = useState({
    companyName: settings.companyName,
    phone: settings.phone,
    address: settings.address
  })

  const [dialogState, setDialogState] = useState({
    isOpen: false,
    type: 'confirm' as 'confirm' | 'prompt',
    title: '',
    description: '',
    variant: 'info' as 'info' | 'danger' | 'success',
    promptPlaceholder: '',
    action: (val?: string) => {}
  })

  const openDialog = (options: any) => setDialogState({ ...dialogState, ...options, isOpen: true })
  const closeDialog = () => setDialogState({ ...dialogState, isOpen: false })

  const handleSave = () => {
    updateSettings(form)
    toast({
      title: "Paramètres enregistrés",
      description: "Le profil de votre entreprise a été mis à jour.",
      type: "success"
    })
  }

  const handleToggle = (key: 'paymentMobileMoney' | 'paymentCash' | 'paymentCard') => {
    updateSettings({ [key]: !settings[key] })
    toast({
      title: "Mise à jour des paiements",
      description: `Le mode de paiement a été modifié.`,
    })
  }

  const handleProUpgrade = () => {
    toast({
      title: "Redirection vers l'offre Pro",
      description: "Chargement de la page d'abonnement...",
      type: "success"
    })
  }

  const handlePasswordChange = () => {
    openDialog({
      type: 'prompt',
      variant: 'info',
      title: 'Réinitialisation du mot de passe',
      description: 'Entrez votre adresse email pour recevoir un lien de réinitialisation :',
      promptPlaceholder: "exemple@email.com",
      action: (email?: string) => {
        if (email) {
          toast({
            title: "Email envoyé",
            description: "Un lien de réinitialisation a été envoyé à votre adresse.",
            type: "success"
          })
        }
      }
    })
  }

  const handleLogout = () => {
    openDialog({
      type: 'confirm',
      variant: 'danger',
      title: 'Déconnexion',
      description: 'Voulez-vous vraiment vous déconnecter ?',
      action: () => {
        toast({
          title: "Déconnexion réussie",
          description: "À bientôt sur MonCommerce !",
          type: "success"
        })
        // Usually would redirect to /login here
      }
    })
  }

  return (
    <div className="relative">
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="space-y-6 md:space-y-8 pb-20 relative z-10"
      >
        {/* Header */}
        <motion.div variants={item}>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Paramètres</h2>
          <p className="text-slate-500 mt-1">Gérez votre compte et les préférences de votre boutique.</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          
          <div className="lg:col-span-2 space-y-6">
            
            {/* Profil entreprise */}
            <motion.div variants={item}>
              <Card className="glass-card border-0 shadow-sm overflow-hidden">
                <div className="bg-slate-50/50 border-b border-slate-100/50 px-6 py-4">
                  <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                    <Store className="h-5 w-5 text-slate-400" /> Profil de l'entreprise
                  </h3>
                </div>
                <CardContent className="p-6 space-y-6">
                  <div className="flex items-center gap-6">
                    <div className="h-20 w-20 rounded-2xl bg-slate-100 border-2 border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-500 hover:text-primary-500 hover:border-primary-200 hover:bg-primary-50 transition-colors cursor-pointer">
                      <Upload className="h-6 w-6 mb-1" />
                      <span className="text-[10px] font-semibold uppercase">Logo</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-slate-900">Logo de la boutique</h4>
                      <p className="text-xs text-slate-500 mt-1">PNG, JPG jusqu'à 2MB. Format carré recommandé.</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Nom du commerce</Label>
                      <Input 
                        value={form.companyName}
                        onChange={e => setForm({...form, companyName: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Téléphone principal</Label>
                      <Input 
                        value={form.phone}
                        onChange={e => setForm({...form, phone: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Adresse physique</Label>
                    <Input 
                      value={form.address}
                      onChange={e => setForm({...form, address: e.target.value})}
                    />
                  </div>
                  <div className="flex justify-end pt-2">
                    <Button onClick={handleSave} className="rounded-xl bg-primary-500 hover:bg-primary-600 text-white shadow-primary-glow border-0 h-10 px-6">
                      <Save className="h-4 w-4 mr-2" /> Enregistrer
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Paiements */}
            <motion.div variants={item}>
              <Card className="glass-card border-0 shadow-sm overflow-hidden">
                <div className="bg-slate-50/50 border-b border-slate-100/50 px-6 py-4">
                  <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                    <CreditCard className="h-5 w-5 text-slate-400" /> Modes de paiement acceptés
                  </h3>
                </div>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border border-slate-200 rounded-xl bg-white/50">
                      <div>
                        <p className="font-medium text-slate-900">Mobile Money (Orange, MTN, Moov)</p>
                        <p className="text-xs text-slate-500">Accepter les paiements par téléphone</p>
                      </div>
                      <div onClick={() => handleToggle("paymentMobileMoney")} className={`h-6 w-11 rounded-full flex items-center p-1 cursor-pointer transition-colors ${settings.paymentMobileMoney ? 'bg-primary-500' : 'bg-slate-200'}`}>
                        <div className={`h-4 w-4 bg-white rounded-full shadow-sm transition-transform ${settings.paymentMobileMoney ? 'translate-x-5' : ''}`}></div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-4 border border-slate-200 rounded-xl bg-white/50">
                      <div>
                        <p className="font-medium text-slate-900">Cash / Espèces</p>
                        <p className="text-xs text-slate-500">Paiements physiques directs</p>
                      </div>
                      <div onClick={() => handleToggle("paymentCash")} className={`h-6 w-11 rounded-full flex items-center p-1 cursor-pointer transition-colors ${settings.paymentCash ? 'bg-primary-500' : 'bg-slate-200'}`}>
                        <div className={`h-4 w-4 bg-white rounded-full shadow-sm transition-transform ${settings.paymentCash ? 'translate-x-5' : ''}`}></div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-4 border border-slate-200 rounded-xl bg-slate-50/50">
                      <div>
                        <p className="font-medium text-slate-600">Cartes Bancaires (Stripe / Paystack)</p>
                        <p className="text-xs text-slate-400">Nécessite la configuration d'un compte marchand</p>
                      </div>
                      <div onClick={() => handleToggle("paymentCard")} className={`h-6 w-11 rounded-full flex items-center p-1 cursor-pointer transition-colors ${settings.paymentCard ? 'bg-primary-500' : 'bg-slate-200'}`}>
                        <div className={`h-4 w-4 bg-white rounded-full shadow-sm transition-transform ${settings.paymentCard ? 'translate-x-5' : ''}`}></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

          </div>

          <div className="space-y-6">
            
            {/* Pro Upgrade Card */}
            <motion.div variants={item}>
              <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8 shadow-xl shadow-slate-900/20 group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/20 rounded-full blur-3xl -mr-10 -mt-10 transition-all duration-700 group-hover:bg-primary-500/30 group-hover:scale-150"></div>
                <div className="relative z-10 flex flex-col gap-4">
                  <div className="p-3 bg-white/10 backdrop-blur-md rounded-2xl w-fit border border-white/10 shadow-sm">
                    <Rocket className="h-6 w-6 text-primary-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white tracking-tight">Passez à MonCommerce <span className="text-primary-400">Pro</span> 🚀</h3>
                    <p className="text-sm text-slate-400 mt-2 leading-relaxed">Débloquez la puissance totale de votre activité avec nos outils avancés conçus pour la croissance.</p>
                  </div>
                  <ul className="space-y-3 text-sm text-slate-300 font-medium my-2">
                    <li className="flex items-center gap-3">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" /> Multi-boutiques
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" /> Rapports IA avancés
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" /> Sauvegarde Cloud
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" /> Gestion des employés
                    </li>
                  </ul>
                  <Button onClick={handleProUpgrade} className="w-full bg-primary-500 hover:bg-primary-600 text-white border-0 shadow-primary-glow h-11 mt-2 text-sm font-bold rounded-xl transition-all duration-300 hover:-translate-y-1">
                    Découvrir l'offre
                  </Button>
                </div>
              </div>
            </motion.div>

            {/* Sécurité */}
            <motion.div variants={item}>
              <Card className="glass-card border-0 shadow-sm overflow-hidden">
                <div className="bg-slate-50/50 border-b border-slate-100/50 px-6 py-4">
                  <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                    <Shield className="h-5 w-5 text-slate-400" /> Sécurité
                  </h3>
                </div>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <Button onClick={handlePasswordChange} variant="outline" className="w-full justify-start h-11 rounded-xl text-slate-700 font-medium">
                      Changer le mot de passe
                    </Button>
                    <Button onClick={handleLogout} variant="outline" className="w-full justify-start h-11 rounded-xl text-danger hover:text-danger hover:bg-danger/5 font-medium border-danger/20">
                      Déconnexion
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

          </div>

        </div>
      </motion.div>

      <CustomDialog
        isOpen={dialogState.isOpen}
        onClose={closeDialog}
        onConfirm={dialogState.action}
        title={dialogState.title}
        description={dialogState.description}
        type={dialogState.type}
        variant={dialogState.variant}
        promptPlaceholder={dialogState.type === 'prompt' ? dialogState.promptPlaceholder : undefined}
      />
    </div>
  )
}

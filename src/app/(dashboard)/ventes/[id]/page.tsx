"use client"

import { useState, use } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowLeft, Edit, Trash2, MessageCircle, FileText, CheckCircle2, User, Clock, AlertCircle, X, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { CustomDialog } from "@/components/ui/custom-dialog"
import { useAppStore } from "@/lib/store"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { downloadInvoicePDF } from "@/lib/pdf"

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
}

const item: any = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
}

export default function VenteDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const { toast } = useToast()
  const { sales, clients, settings, updateSale, deleteSale, repayDebt, validateDraft, cancelSale } = useAppStore()
  
  const sale = sales.find(s => s.id === id) || sales[0]
  const client = clients.find(c => c.id === sale?.clientId)

  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false)
  const [editForm, setEditForm] = useState({
    status: sale?.status || "En attente",
    paymentMethod: sale?.paymentMethod || "Cash",
    date: sale?.date || ""
  })

  const handlePrintPDF = () => {
    if (!client) {
      toast({ title: "Erreur", description: "Impossible de générer le PDF sans client.", type: "error" })
      return
    }
    toast({
      title: "Génération du PDF",
      description: "Le téléchargement va démarrer dans un instant...",
      type: "success"
    })
    downloadInvoicePDF(sale, client, settings)
  }

  const handleWhatsApp = () => {
    if (client?.phone && client.phone !== "Non renseigné") {
      const formattedPhone = client.phone.replace(/[^0-9]/g, '')
      window.open(`https://wa.me/${formattedPhone}`, '_blank')
    } else {
      toast({
        title: "Numéro indisponible",
        description: "Ce client n'a pas de numéro de téléphone valide enregistré.",
        type: "error"
      })
    }
  }

  const handleDeleteClick = () => {
    setIsDeleteDialogOpen(true)
  }

  const handleConfirmDelete = () => {
    deleteSale(sale.id)
    toast({
      title: "Vente supprimée",
      description: "La vente a été supprimée avec succès.",
      type: "success"
    })
    router.push('/ventes')
  }

  const handleEditSave = () => {
    updateSale({ ...sale, ...editForm })
    setIsEditModalOpen(false)
    toast({
      title: "Modifications enregistrées",
      description: "Les informations de la vente ont été mises à jour.",
      type: "success"
    })
  }

  const handlePay = () => {
    updateSale({ ...sale, status: "Payé" })
    if (client && sale.paymentMethod === "Crédit") {
      repayDebt(client.id, sale.amount)
    }
    toast({
      title: "Paiement validé",
      description: "La vente a été marquée comme payée et la dette a été mise à jour.",
      type: "success"
    })
  }

  const handleValidateDraft = async () => {
    await validateDraft(sale.id)
    toast({
      title: "Brouillon validé",
      description: "La vente a été validée avec succès. Le stock a été déduit.",
      type: "success"
    })
  }

  const handleCancelSale = async () => {
    await cancelSale(sale.id)
    toast({
      title: "Vente annulée",
      description: "La vente a été annulée. Le stock et les dettes ont été restaurés.",
      type: "success"
    })
    setIsCancelDialogOpen(false)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Payé":
        return <Badge className="bg-success/10 text-success border-success/20 px-3 py-1 text-sm">Payé</Badge>
      case "En attente":
        return <Badge className="bg-warning/10 text-warning border-warning/20 px-3 py-1 text-sm">En attente</Badge>
      case "Brouillon":
        return <Badge className="bg-amber-100 text-amber-600 border-amber-200 px-3 py-1 text-sm">Brouillon</Badge>
      case "Annulée":
        return <Badge className="bg-danger/10 text-danger border-danger/20 px-3 py-1 text-sm">Annulée</Badge>
      case "Retard":
        return <Badge className="bg-danger/10 text-danger border-danger/20 px-3 py-1 text-sm">Retard</Badge>
      default:
        return <Badge className="bg-slate-100 text-slate-600 border-slate-200 px-3 py-1 text-sm">{status}</Badge>
    }
  }

  const getPaymentMethodBadge = (method: string) => {
    switch (method) {
      case "Mobile Money":
        return <span className="text-sm font-semibold text-amber-600 bg-amber-50 px-3 py-1 rounded-full">{method}</span>
      case "Cash":
        return <span className="text-sm font-semibold text-slate-600 bg-slate-100 px-3 py-1 rounded-full">{method}</span>
      case "Crédit":
        return <span className="text-sm font-semibold text-purple-600 bg-purple-50 px-3 py-1 rounded-full">{method}</span>
      default:
        return <span className="text-sm font-semibold text-slate-600 bg-slate-100 px-3 py-1 rounded-full">{method}</span>
    }
  }

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-6 md:space-y-8 pb-20 max-w-5xl mx-auto relative z-10 print:!p-0"
    >
      {/* Printable Invoice Section */}
      <div id="print-section" className="hidden print:block bg-white text-black min-h-screen p-8 text-sm w-full absolute top-0 left-0">
        <div className="flex justify-between items-start border-b border-gray-200 pb-8 mb-8">
          <div>
            <h1 className="text-4xl font-light tracking-wide text-gray-900 mb-2 uppercase">Facture</h1>
            <p className="text-gray-500 text-sm">INV-{sale.id.toUpperCase()}-000</p>
          </div>
          <div className="w-16 h-16 bg-black text-white flex items-center justify-center font-bold text-3xl rounded-md">
            M
          </div>
        </div>

        <div className="flex justify-between mb-12">
          <div className="w-1/2">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Émetteur</h3>
            <p className="font-bold text-gray-900 mb-1">{settings.companyName}</p>
            <p className="text-gray-600">contact@moncommerce.com</p>
            <p className="text-gray-600">{settings.address}</p>
          </div>
          <div className="w-1/2">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Facturé à</h3>
            <p className="font-bold text-gray-900 mb-1">{sale.client}</p>
            <p className="text-gray-600">{client?.phone || "Contact non renseigné"}</p>
          </div>
        </div>

        <div className="flex justify-between mb-12 border-b border-gray-200 pb-8">
          <div className="w-1/2">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Date d'émission</h3>
            <p className="font-medium text-gray-900">{sale.date}</p>
          </div>
          <div className="w-1/2">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Date d'échéance</h3>
            <p className="font-medium text-gray-900">{sale.date}</p>
          </div>
        </div>

        <div className="mb-16">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Détail des prestations</h3>
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="pb-3 text-sm font-medium text-gray-500 w-1/2">Description</th>
                <th className="pb-3 text-sm font-medium text-gray-500 text-center">Qté</th>
                <th className="pb-3 text-sm font-medium text-gray-500 text-right">PU</th>
                <th className="pb-3 text-sm font-medium text-gray-500 text-right">Montant</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {sale.items.map((item, idx) => (
                <tr key={idx}>
                  <td className="py-4 text-gray-900">{item.name}</td>
                  <td className="py-4 text-gray-600 text-center">{item.quantity}</td>
                  <td className="py-4 text-gray-600 text-right">{item.unitPrice.toLocaleString('fr-FR')} FCFA</td>
                  <td className="py-4 text-gray-900 font-medium text-right">{item.total.toLocaleString('fr-FR')} FCFA</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-end">
          <div className="w-1/2 max-w-sm">
            <div className="flex justify-between py-2 text-gray-600">
              <span>Sous-total HT</span>
              <span>{Math.round(sale.amount / 1.18).toLocaleString('fr-FR')} FCFA</span>
            </div>
            <div className="flex justify-between py-2 text-gray-600 border-b border-gray-200 mb-2">
              <span>TVA (18%)</span>
              <span>{Math.round(sale.amount - (sale.amount / 1.18)).toLocaleString('fr-FR')} FCFA</span>
            </div>
            <div className="flex justify-between py-3 text-lg font-bold text-gray-900">
              <span>Grand Total</span>
              <span>{sale.amount.toLocaleString('fr-FR')} FCFA</span>
            </div>
          </div>
        </div>
      </div>

      {/* Header & Actions */}
      <motion.div variants={item} className="flex flex-col md:flex-row md:items-center justify-between gap-4 no-print">
        <div className="flex items-center gap-4">
          <Link href="/ventes">
            <Button variant="ghost" size="icon" className="rounded-full bg-white shadow-sm border border-slate-100 hover:bg-slate-50">
              <ArrowLeft className="h-5 w-5 text-slate-600" />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">Vente #{sale.id.toUpperCase()}009</h2>
              {getStatusBadge(sale.status)}
            </div>
            <p className="text-slate-500 mt-1 font-medium">{sale.date} • {getPaymentMethodBadge(sale.paymentMethod)}</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {sale.status === "Brouillon" ? (
            <>
              <Button onClick={handleValidateDraft} className="bg-success/10 hover:bg-success/20 text-success border-0 shadow-none">
                <CheckCircle2 className="h-4 w-4 mr-2" /> Valider
              </Button>
              <Button onClick={handleDeleteClick} variant="outline" className="glass-card border-slate-200 text-danger hover:bg-danger/10 hover:text-danger gap-2">
                <Trash2 className="h-4 w-4" /> Supprimer
              </Button>
            </>
          ) : (
            <>
              {sale.status !== "Payé" && sale.status !== "Annulée" && (
                <Button onClick={handlePay} className="bg-success/10 hover:bg-success/20 text-success border-0 shadow-none">
                  <CheckCircle2 className="h-4 w-4 mr-2" /> Marquer payé
                </Button>
              )}
              {sale.status !== "Annulée" && (
                <Button onClick={() => setIsCancelDialogOpen(true)} variant="outline" className="glass-card border-slate-200 text-danger hover:bg-danger/10 hover:text-danger gap-2">
                  <X className="h-4 w-4 mr-1" /> Annuler la vente
                </Button>
              )}
              <Button onClick={handleWhatsApp} variant="outline" className="glass-card border-slate-200 text-green-600 hover:text-green-700 hover:bg-green-50 gap-2">
                <MessageCircle className="h-4 w-4" /> WhatsApp
              </Button>
              <Button onClick={handlePrintPDF} variant="outline" className="glass-card border-slate-200 text-slate-600 gap-2">
                <FileText className="h-4 w-4" /> Reçu PDF
              </Button>
            </>
          )}
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 no-print">
        
        {/* Main Info (Left Column) */}
        <div className="lg:col-span-2 space-y-6 md:space-y-8">
          
          {/* Produits Card */}
          <motion.div variants={item}>
            <Card className="glass-card border-0 shadow-sm overflow-hidden">
              <div className="bg-slate-50/50 border-b border-slate-100/50 px-6 py-4 flex justify-between items-center">
                <h3 className="font-semibold text-slate-800">Détail des articles</h3>
                <Button onClick={() => setIsEditModalOpen(true)} variant="ghost" size="sm" className="text-primary-600 hover:bg-primary-50 h-8">
                  <Edit className="h-3 w-3 mr-2" /> Modifier
                </Button>
              </div>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="text-xs text-slate-500 uppercase bg-slate-50/30 border-b border-slate-100/50">
                      <tr>
                        <th className="px-6 py-4 font-semibold">Produit</th>
                        <th className="px-6 py-4 font-semibold text-center">Qté</th>
                        <th className="px-6 py-4 font-semibold text-right">Prix U.</th>
                        <th className="px-6 py-4 font-semibold text-right">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100/50">
                      {sale.items.map((item, idx) => (
                        <tr key={idx} className="group hover:bg-slate-50/30 transition-colors">
                          <td className="px-6 py-4 font-medium text-slate-800">{item.name}</td>
                          <td className="px-6 py-4 text-center text-slate-600">{item.quantity}</td>
                          <td className="px-6 py-4 text-right text-slate-600">{item.unitPrice.toLocaleString('fr-FR')}</td>
                          <td className="px-6 py-4 text-right font-semibold text-slate-900">{item.total.toLocaleString('fr-FR')}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                {/* Totals Box */}
                <div className="bg-slate-50/50 p-6 flex justify-end">
                  <div className="w-full sm:w-1/2 lg:w-2/3 xl:w-1/2 space-y-3">
                    <div className="flex justify-between items-center text-sm font-medium text-slate-500">
                      <span>Sous-total</span>
                      <span>{sale.amount.toLocaleString('fr-FR')} FCFA</span>
                    </div>
                    <div className="flex justify-between items-center text-sm font-medium text-slate-500">
                      <span>Réduction</span>
                      <span>0 FCFA</span>
                    </div>
                    <div className="h-px bg-slate-200/60 my-2" />
                    <div className="flex justify-between items-center">
                      <span className="text-base font-semibold text-slate-700">Total payé</span>
                      <span className="text-2xl font-bold text-slate-900 tracking-tight">
                        {sale.amount.toLocaleString('fr-FR')} <span className="text-sm font-semibold text-slate-500">FCFA</span>
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

        </div>

        {/* Sidebar Info (Right Column) */}
        <div className="space-y-6 md:space-y-8">
          
          {/* Client Card */}
          <motion.div variants={item}>
            <Card className="glass-card border-0 shadow-sm overflow-hidden group">
              <div className="bg-slate-50/50 border-b border-slate-100/50 px-6 py-4">
                <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                  <User className="h-4 w-4 text-slate-400" /> Client
                </h3>
              </div>
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 text-white flex items-center justify-center font-bold text-lg shadow-sm shadow-primary-500/20 group-hover:scale-110 transition-transform">
                    {client?.avatar || "C"}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-lg group-hover:text-primary-600 transition-colors">{sale.client}</h4>
                    <p className="text-sm text-slate-500 font-medium">{client?.phone || "Non renseigné"}</p>
                  </div>
                </div>
                
                {client && client.debt > 0 && (
                  <div className="bg-danger/5 border border-danger/10 rounded-xl p-3 flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-danger shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-danger">Dette en cours</p>
                      <p className="text-sm text-danger/80">{client.debt.toLocaleString('fr-FR')} FCFA restants à payer au total.</p>
                    </div>
                  </div>
                )}
                
                <Button onClick={() => router.push('/clients')} className="w-full mt-4 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 shadow-sm rounded-xl">
                  Voir profil client
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Timeline Card */}
          <motion.div variants={item}>
            <Card className="glass-card border-0 shadow-sm overflow-hidden">
              <div className="bg-slate-50/50 border-b border-slate-100/50 px-6 py-4">
                <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                  <Clock className="h-4 w-4 text-slate-400" /> Historique
                </h3>
              </div>
              <CardContent className="p-6">
                <div className="space-y-6">
                  
                  {/* Event 1 */}
                  <div className="flex gap-4 relative">
                    <div className="absolute left-4 top-8 bottom-0 w-px bg-slate-200 -ml-px z-0"></div>
                    <div className="relative z-10 h-8 w-8 rounded-full bg-success/10 text-success flex items-center justify-center shrink-0 ring-4 ring-white">
                      <CheckCircle2 className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">Paiement reçu</p>
                      <p className="text-xs text-slate-500 font-medium mt-1">{sale.amount.toLocaleString('fr-FR')} FCFA par {sale.paymentMethod}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{sale.date} à 14:32</p>
                    </div>
                  </div>
                  
                  {/* Event 2 */}
                  <div className="flex gap-4 relative">
                    <div className="relative z-10 h-8 w-8 rounded-full bg-primary-50 text-primary-600 flex items-center justify-center shrink-0 ring-4 ring-white">
                      <FileText className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">Vente créée</p>
                      <p className="text-xs text-slate-500 font-medium mt-1">Par Dimitri (Admin)</p>
                      <p className="text-xs text-slate-400 mt-0.5">{sale.date} à 14:30</p>
                    </div>
                  </div>
                  
                </div>
              </CardContent>
            </Card>
          </motion.div>

        </div>

      </div>

      {/* Edit Sale Modal */}
      <AnimatePresence>
        {isEditModalOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsEditModalOpen(false)}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 24 }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md z-50 p-4"
            >
              <Card className="glass-card border-0 shadow-2xl shadow-primary-900/10 overflow-hidden">
                <div className="bg-white/80 border-b border-slate-100 px-6 py-4 flex justify-between items-center">
                  <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
                    <Edit className="h-5 w-5 text-primary-500" />
                    Modifier la vente
                  </h3>
                  <Button variant="ghost" size="icon" onClick={() => setIsEditModalOpen(false)} className="rounded-full h-8 w-8 hover:bg-slate-100">
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <CardContent className="p-6 space-y-4">
                  <div className="space-y-2">
                    <Label>Statut</Label>
                    <select 
                      className="flex h-10 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/30"
                      value={editForm.status}
                      onChange={e => setEditForm({...editForm, status: e.target.value})}
                    >
                      <option value="Payé">Payé</option>
                      <option value="En attente">En attente</option>
                      <option value="Retard">Retard</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label>Mode de paiement</Label>
                    <select 
                      className="flex h-10 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/30"
                      value={editForm.paymentMethod}
                      onChange={e => setEditForm({...editForm, paymentMethod: e.target.value})}
                    >
                      <option value="Cash">Cash</option>
                      <option value="Mobile Money">Mobile Money</option>
                      <option value="Carte">Carte</option>
                      <option value="Crédit">Crédit</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label>Date</Label>
                    <Input 
                      type="text"
                      value={editForm.date}
                      onChange={e => setEditForm({...editForm, date: e.target.value})}
                    />
                  </div>
                  <div className="pt-4 flex gap-3">
                    <Button variant="outline" className="flex-1 rounded-xl glass-card" onClick={() => setIsEditModalOpen(false)}>
                      Annuler
                    </Button>
                    <Button onClick={handleEditSave} className="flex-1 rounded-xl bg-primary-500 hover:bg-primary-600 text-white shadow-primary-glow border-0">
                      <Save className="h-4 w-4 mr-2" />
                      Enregistrer
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <CustomDialog
        isOpen={isCancelDialogOpen}
        onClose={() => setIsCancelDialogOpen(false)}
        onConfirm={handleCancelSale}
        title="Annuler la vente"
        description="Êtes-vous sûr de vouloir annuler cette vente ? Le stock sera restauré et la dette éventuelle du client sera corrigée."
        variant="danger"
        confirmText="Confirmer l'annulation"
      />

      <CustomDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Supprimer la vente"
        description="Êtes-vous sûr de vouloir supprimer cette vente ? Cette action est irréversible."
        variant="danger"
        confirmText="Supprimer"
      />

    </motion.div>
  )
}

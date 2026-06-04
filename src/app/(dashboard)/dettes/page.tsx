"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, Plus, Eye, Edit, Wallet, MessageCircle, AlertCircle, Phone, ArrowUpRight, CheckCircle2, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { useAppStore } from "@/lib/store"
import { Pagination } from "@/components/ui/pagination"
import { useToast } from "@/hooks/use-toast"

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
}

const item: any = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
}

export default function DettesPage() {
  const { clients, activities, repayDebt } = useAppStore()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedClient, setSelectedClient] = useState<any>(null)
  const [paymentAmount, setPaymentAmount] = useState("")
  const itemsPerPage = 10
  const { toast } = useToast()

  const clientsWithDebts = clients.filter(c => c.debt > 0)
  
  const filteredDebts = clientsWithDebts.filter((client) => {
    if (!searchTerm) return true
    return client.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
           client.phone.includes(searchTerm)
  })

  const totalPages = Math.ceil(filteredDebts.length / itemsPerPage)
  const currentDebts = filteredDebts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const totalDebt = clientsWithDebts.reduce((acc, curr) => acc + curr.debt, 0)

  const paiementsRecouvres = activities
    .filter(a => a.type === "Remboursement")
    .reduce((acc, curr) => {
      const val = parseInt(curr.amount.replace(/\D/g, '')) || 0;
      return acc + val;
    }, 0)

  const handlePayment = () => {
    if (!selectedClient) return
    const amount = parseInt(paymentAmount)
    if (isNaN(amount) || amount <= 0) {
      toast({ title: "Erreur", description: "Veuillez entrer un montant valide", type: "error" })
      return
    }

    repayDebt(selectedClient.id, amount)

    setIsModalOpen(false)
    setSelectedClient(null)
    setPaymentAmount("")

    toast({
      title: "Paiement enregistré",
      description: `Le solde du client a été mis à jour.`,
      type: "success"
    })
  }

  const handleReminder = (name: string) => {
    toast({
      title: "Relance WhatsApp",
      description: `Préparation du message de relance pour ${name}...`,
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
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Dettes & Crédits</h2>
          <p className="text-slate-500 mt-1">Suivez les impayés et relancez vos clients facilement.</p>
        </motion.div>

        {/* KPI Cards */}
        <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          <Card className="glass-card border-0 shadow-sm hover:-translate-y-1 hover:shadow-md transition-all duration-300 group border-l-4 border-l-danger">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-danger/10 text-danger rounded-xl group-hover:scale-110 transition-transform">
                  <Wallet className="h-5 w-5" />
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">Total des dettes</p>
                <h3 className="text-3xl font-bold text-danger mt-1">{totalDebt.toLocaleString('fr-FR')} <span className="text-sm text-slate-500">FCFA</span></h3>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card border-0 shadow-sm hover:-translate-y-1 hover:shadow-md transition-all duration-300 group border-l-4 border-l-warning">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-warning/10 text-warning rounded-xl group-hover:scale-110 transition-transform">
                  <AlertCircle className="h-5 w-5" />
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">Clients endettés</p>
                <h3 className="text-3xl font-bold text-warning mt-1">{clientsWithDebts.length}</h3>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card border-0 shadow-sm hover:-translate-y-1 hover:shadow-md transition-all duration-300 group border-l-4 border-l-success">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-success/10 text-success rounded-xl group-hover:scale-110 transition-transform">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">Paiements recouvrés (ce mois)</p>
                <h3 className="text-3xl font-bold text-success mt-1">{paiementsRecouvres.toLocaleString('fr-FR')} <span className="text-sm text-slate-500">FCFA</span></h3>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Search */}
        <motion.div variants={item} className="flex flex-col md:flex-row gap-4 items-center">
          <div className="relative w-full md:max-w-md group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-primary-500 transition-colors" />
            <Input 
              placeholder="🔍 Rechercher un client endetté..." 
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value)
                setCurrentPage(1)
              }}
              className="pl-10 h-12 bg-white/60 backdrop-blur-md border-slate-200/60 focus-visible:ring-primary-500/30 rounded-xl shadow-sm text-base transition-all"
            />
          </div>
        </motion.div>

        {/* Debts Table */}
        <motion.div variants={item}>
          <Card className="glass-card border-0 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-slate-500 uppercase bg-slate-50/50 border-b border-slate-100/50">
                  <tr>
                    <th className="px-6 py-4 font-semibold">Client</th>
                    <th className="px-6 py-4 font-semibold">Contact</th>
                    <th className="px-6 py-4 font-semibold">Date de la dette</th>
                    <th className="px-6 py-4 font-semibold text-right">Montant Dû</th>
                    <th className="px-6 py-4 font-semibold text-center">Actions rapides</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100/50">
                  {currentDebts.map((client) => (
                    <tr key={client.id} className="group hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-danger/10 text-danger flex items-center justify-center font-bold border border-danger/20 group-hover:scale-105 transition-transform shrink-0">
                            {client.avatar}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-900 group-hover:text-primary-600 transition-colors">{client.name}</p>
                            <p className="text-xs text-danger font-medium flex items-center gap-1 mt-0.5">
                              <AlertCircle className="h-3 w-3" /> À risque
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-600 font-medium">
                        <div className="flex items-center gap-2">
                          <Phone className="h-3.5 w-3.5 text-slate-400" />
                          {client.phone}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-500 font-medium">
                        {client.lastActivity}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="text-lg font-bold text-danger">{client.debt.toLocaleString('fr-FR')} FCFA</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-center items-center gap-2">
                          <Button 
                            onClick={() => {
                              setSelectedClient(client)
                              setIsModalOpen(true)
                            }}
                            className="bg-primary-50 hover:bg-primary-100 text-primary-700 shadow-sm border-0 h-8 text-xs font-semibold"
                          >
                            <ArrowUpRight className="h-3 w-3 mr-1" />
                            Encaisser
                          </Button>
                          <Button 
                            onClick={() => handleReminder(client.name)}
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-green-600 hover:bg-green-50 rounded-lg transition-colors bg-white border border-green-100 shadow-sm" 
                            title="Rappel WhatsApp"
                          >
                            <MessageCircle className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Pagination 
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              totalItems={filteredDebts.length}
              itemsPerPage={itemsPerPage}
            />
          </Card>
        </motion.div>
      </motion.div>

      {/* Payment Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 24 }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-sm z-50 p-4"
            >
              <Card className="glass-card border-0 shadow-2xl shadow-primary-900/10 overflow-hidden">
                <div className="bg-white/80 border-b border-slate-100 px-6 py-4 flex justify-between items-center">
                  <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
                    <Wallet className="h-5 w-5 text-primary-500" />
                    Enregistrer un paiement
                  </h3>
                  <Button variant="ghost" size="icon" onClick={() => setIsModalOpen(false)} className="rounded-full h-8 w-8 hover:bg-slate-100">
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <CardContent className="p-6 space-y-4">
                  <div className="space-y-2">
                    <Label>Montant payé (FCFA)</Label>
                    <Input 
                      type="number" 
                      placeholder="Ex: 15000" 
                      value={paymentAmount}
                      onChange={e => setPaymentAmount(e.target.value)}
                      className="text-lg font-semibold" 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Mode de paiement</Label>
                    <select className="flex h-10 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/30">
                      <option>Cash</option>
                      <option>Mobile Money</option>
                      <option>Carte</option>
                    </select>
                  </div>

                  <div className="pt-4">
                    <Button onClick={handlePayment} className="w-full rounded-xl bg-primary-500 hover:bg-primary-600 text-white shadow-primary-glow border-0 h-11">
                      Confirmer le paiement
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

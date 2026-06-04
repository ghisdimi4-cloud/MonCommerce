"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Search, Filter, Plus, FileDown, MoreHorizontal, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { useAppStore } from "@/lib/store"
import { generateAccountingReport } from "@/lib/excel-export"
import { downloadInvoicePDF } from "@/lib/pdf"
import { Pagination } from "@/components/ui/pagination"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
}

const item: any = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
}

export default function VentesPage() {
  const router = useRouter()
  const store = useAppStore()
  const { sales, clients, products, settings } = store
  const [activeFilter, setActiveFilter] = useState("Tous")
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10
  const { toast } = useToast()
  
  const filters = ["Tous", "Brouillon", "Payé", "En attente", "Annulée"]

  const filteredSales = sales.filter((sale) => {
    const matchesSearch = sale.client.toLowerCase().includes(searchTerm.toLowerCase()) || sale.id.toLowerCase().includes(searchTerm.toLowerCase())
    if (!matchesSearch) return false

    if (activeFilter === "Tous") return true
    if (activeFilter === "Payé") return sale.status === "Payé"
    if (activeFilter === "En attente") return sale.status === "En attente"
    if (activeFilter === "Brouillon") return sale.status === "Brouillon"
    if (activeFilter === "Annulée") return sale.status === "Annulée"
    if (activeFilter === "Crédit" || activeFilter === "Mobile Money") return sale.paymentMethod === activeFilter
    return true
  })

  // Pagination logic
  const totalPages = Math.ceil(filteredSales.length / itemsPerPage)
  const currentSales = filteredSales.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const handleExport = async () => {
    toast({
      title: "Génération du rapport",
      description: "Préparation du document Excel en cours...",
      type: "success"
    })
    try {
      await generateAccountingReport({ sales, clients, products, settings })
      toast({
        title: "Export réussi",
        description: "Le rapport financier a été téléchargé avec succès.",
        type: "success"
      })
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la création de l'export.",
        type: "error"
      })
    }
  }

  const handleNewAction = () => {
    router.push('/ventes/nouveau')
  }

  const handleFeatureDev = () => {
    toast({
      title: "Fonctionnalité Premium",
      description: "Cette action sera disponible dans la prochaine mise à jour.",
      type: "warning"
    })
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Payé":
        return <Badge className="bg-success/10 text-success border-success/20 hover:bg-success/20">Payé</Badge>
      case "En attente":
        return <Badge className="bg-warning/10 text-warning border-warning/20 hover:bg-warning/20">En attente</Badge>
      case "Brouillon":
        return <Badge className="bg-amber-100 text-amber-600 border-amber-200 hover:bg-amber-200">Brouillon</Badge>
      case "Annulée":
        return <Badge className="bg-danger/10 text-danger border-danger/20 hover:bg-danger/20">Annulée</Badge>
      case "Retard":
        return <Badge className="bg-danger/10 text-danger border-danger/20 hover:bg-danger/20">Retard</Badge>
      default:
        return <Badge className="bg-slate-100 text-slate-600 border-slate-200">{status}</Badge>
    }
  }

  const getPaymentMethodBadge = (method: string) => {
    switch (method) {
      case "Mobile Money":
        return <span className="text-xs font-medium bg-amber-100 text-amber-700 px-2 py-1 rounded-md">Mobile Money</span>
      case "Cash":
        return <span className="text-xs font-medium bg-slate-100 text-slate-700 px-2 py-1 rounded-md">Cash</span>
      case "Crédit":
        return <span className="text-xs font-medium bg-purple-100 text-purple-700 px-2 py-1 rounded-md">Crédit</span>
      case "Carte":
        return <span className="text-xs font-medium bg-blue-100 text-blue-700 px-2 py-1 rounded-md">Carte</span>
      default:
        return <span className="text-xs font-medium bg-slate-100 text-slate-600 px-2 py-1 rounded-md">{method}</span>
    }
  }

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-6 md:space-y-8 pb-20 relative z-10"
    >
      {/* Header */}
      <motion.div variants={item} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Historique des ventes</h2>
          <p className="text-slate-500 mt-1">Gérez et suivez toutes vos transactions.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button onClick={handleExport} variant="outline" className="glass-card text-slate-700 border-slate-200 hover:bg-slate-50 shadow-sm h-10 px-4 rounded-xl">
            <FileDown className="h-4 w-4 mr-2" />
            Exporter
          </Button>
          <Button onClick={handleNewAction} className="bg-primary-500 hover:bg-primary-600 text-white shadow-primary-glow border-0 h-10 px-4 rounded-xl hover:-translate-y-0.5 transition-all duration-300">
            <Plus className="h-4 w-4 mr-2" />
            Nouvelle Vente
          </Button>
        </div>
      </motion.div>

      {/* Search & Filters */}
      <motion.div variants={item} className="space-y-4">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="relative w-full md:max-w-md group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-primary-500 transition-colors" />
            <Input 
              placeholder="🔍 Rechercher une vente, un client..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-12 bg-white/60 backdrop-blur-md border-slate-200/60 focus-visible:ring-primary-500/30 rounded-xl shadow-sm text-base transition-all"
            />
          </div>
          <Button onClick={handleFeatureDev} variant="outline" className="w-full md:w-auto h-12 rounded-xl glass-card text-slate-600 gap-2">
            <Filter className="h-4 w-4" /> Filtres avancés
          </Button>
        </div>

        {/* Quick Filters */}
        <div className="flex flex-wrap gap-2">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => {
                setActiveFilter(filter)
                setCurrentPage(1)
              }}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                activeFilter === filter 
                  ? "bg-primary-50 text-primary-700 border border-primary-200 shadow-sm" 
                  : "bg-white/50 text-slate-600 border border-slate-200/50 hover:bg-white hover:shadow-sm"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Data Table */}
      <motion.div variants={item}>
        <Card className="glass-card border-0 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-500 uppercase bg-slate-50/50 border-b border-slate-100/50">
                <tr>
                  <th className="px-6 py-4 font-semibold">Client</th>
                  <th className="px-6 py-4 font-semibold">Date</th>
                  <th className="px-6 py-4 font-semibold">Paiement</th>
                  <th className="px-6 py-4 font-semibold">Statut</th>
                  <th className="px-6 py-4 font-semibold text-right">Montant</th>
                  <th className="px-6 py-4 font-semibold text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100/50">
                {currentSales.map((sale) => (
                  <tr 
                    key={sale.id} 
                    onClick={() => router.push(`/ventes/${sale.id}`)}
                    className="group hover:bg-slate-50/50 cursor-pointer transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-primary-50 text-primary-700 flex items-center justify-center font-bold border border-primary-100/50 shadow-sm group-hover:scale-105 transition-transform">
                          {sale.client.charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900 group-hover:text-primary-600 transition-colors">{sale.client}</p>
                          <p className="text-xs text-slate-500">Réf: #{sale.id.toUpperCase()}009</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600 font-medium">{sale.date}</td>
                    <td className="px-6 py-4">
                      {getPaymentMethodBadge(sale.paymentMethod)}
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(sale.status)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <p className="font-bold text-slate-900 text-base">{sale.amount.toLocaleString('fr-FR')} <span className="text-xs text-slate-500 font-medium">FCFA</span></p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center items-center gap-2" onClick={(e) => e.stopPropagation()}>
                        {sale.status !== "Brouillon" && sale.status !== "Annulée" && (
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => {
                              const client = clients.find(c => c.id === sale.clientId)
                              if (client) downloadInvoicePDF(sale, client, settings)
                            }}
                            className="h-8 w-8 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                            title="Télécharger Facture"
                          >
                            <FileDown className="h-4 w-4" />
                          </Button>
                        )}
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => router.push(`/ventes/${sale.id}`)}
                          className="h-8 w-8 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-lg">
                          <MoreHorizontal className="h-4 w-4" />
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
            totalItems={filteredSales.length}
            itemsPerPage={itemsPerPage}
          />
        </Card>
      </motion.div>
    </motion.div>
  )
}

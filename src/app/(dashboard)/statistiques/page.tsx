"use client"

import { motion } from "framer-motion"
import { BarChart3, TrendingUp, Download, PieChart, Users, Package } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { OverviewChart } from "@/components/dashboard/overview-chart"
import { BusinessInsights } from "@/components/dashboard/business-insights"
import { useToast } from "@/hooks/use-toast"
import { useAppStore } from "@/lib/store"
import { generateAccountingReport } from "@/lib/excel-export"

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
}

const item: any = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
}

export default function StatistiquesPage() {
  const { toast } = useToast()
  const store = useAppStore()
  const { sales, clients, products, settings } = store

  const validSales = sales.filter(s => s.status !== "Brouillon" && s.status !== "Annulée")

  const totalSales = validSales.reduce((acc, s) => acc + s.amount, 0)
  const totalBenefice = totalSales * 0.35 // Simulation

  let totalItems = 0
  const productSalesCount: Record<string, {name: string, category: string, totalAmount: number, totalQuantity: number}> = {}

  validSales.forEach(s => {
    s.items.forEach(i => {
      totalItems += i.quantity
      if (!productSalesCount[i.productId]) {
        const product = products.find(p => p.id === i.productId)
        productSalesCount[i.productId] = { 
          name: i.name, 
          category: product ? product.category : "Produit", 
          totalAmount: 0, 
          totalQuantity: 0 
        }
      }
      productSalesCount[i.productId].totalQuantity += i.quantity
      productSalesCount[i.productId].totalAmount += i.total
    })
  })

  const topProducts = Object.values(productSalesCount).sort((a, b) => b.totalAmount - a.totalAmount).slice(0, 3)
  const newClientsCount = clients.length

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

  const handlePeriodChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    toast({
      title: "Période modifiée",
      description: `Données mises à jour pour: ${e.target.value}`,
      type: "success"
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
        <motion.div variants={item} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Analytics & Rapports</h2>
            <p className="text-slate-500 mt-1">Analysez la performance de votre business en temps réel.</p>
          </div>
          <div className="flex items-center gap-3">
            <select onChange={handlePeriodChange} className="h-10 px-3 rounded-xl border border-slate-200 bg-white/60 backdrop-blur-md text-sm font-medium text-slate-700 shadow-sm outline-none focus:ring-2 focus:ring-primary-500/30">
              <option>Les 7 derniers jours</option>
              <option>Ce mois-ci</option>
              <option>Le mois dernier</option>
              <option>Cette année</option>
            </select>
            <Button onClick={handleExport} variant="outline" className="glass-card text-slate-700 border-slate-200 shadow-sm h-10 px-4 rounded-xl">
              <Download className="h-4 w-4 mr-2" />
              Exporter
            </Button>
          </div>
        </motion.div>

        {/* Top KPIs */}
        <motion.div variants={item} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          <Card className="glass-card border-0 shadow-sm hover:-translate-y-1 hover:shadow-md transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-primary-50 text-primary-600 rounded-lg">
                  <TrendingUp className="h-4 w-4" />
                </div>
                <h3 className="font-medium text-slate-500 text-sm">Chiffre d'affaires</h3>
              </div>
              <p className="text-2xl font-bold text-slate-900">{totalSales.toLocaleString('fr-FR')} <span className="text-sm font-medium text-slate-500">FCFA</span></p>
              <div className="mt-2 flex items-center text-xs font-medium text-success">
                <TrendingUp className="h-3 w-3 mr-1" /> +15% vs période préc.
              </div>
            </CardContent>
          </Card>
          
          <Card className="glass-card border-0 shadow-sm hover:-translate-y-1 hover:shadow-md transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                  <PieChart className="h-4 w-4" />
                </div>
                <h3 className="font-medium text-slate-500 text-sm">Bénéfice net estimé</h3>
              </div>
              <p className="text-2xl font-bold text-slate-900">{totalBenefice.toLocaleString('fr-FR')} <span className="text-sm font-medium text-slate-500">FCFA</span></p>
              <div className="mt-2 flex items-center text-xs font-medium text-success">
                <TrendingUp className="h-3 w-3 mr-1" /> +8% vs période préc.
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card border-0 shadow-sm hover:-translate-y-1 hover:shadow-md transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
                  <Package className="h-4 w-4" />
                </div>
                <h3 className="font-medium text-slate-500 text-sm">Articles vendus</h3>
              </div>
              <p className="text-2xl font-bold text-slate-900">{totalItems}</p>
              <div className="mt-2 flex items-center text-xs font-medium text-slate-400">
                Moyenne de 20 / jour
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card border-0 shadow-sm hover:-translate-y-1 hover:shadow-md transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
                  <Users className="h-4 w-4" />
                </div>
                <h3 className="font-medium text-slate-500 text-sm">Total clients</h3>
              </div>
              <p className="text-2xl font-bold text-slate-900">{newClientsCount}</p>
              <div className="mt-2 flex items-center text-xs font-medium text-success">
                <TrendingUp className="h-3 w-3 mr-1" /> +12% vs période préc.
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Main Charts & Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          
          <motion.div variants={item} className="lg:col-span-2 space-y-6">
            {/* Sales Chart */}
            <Card className="glass-card border-0 shadow-sm h-full">
              <div className="p-6 border-b border-slate-100/50 flex justify-between items-center">
                <div>
                  <h3 className="font-bold text-slate-900">Évolution des ventes</h3>
                  <p className="text-sm text-slate-500">Volume de ventes sur les 7 derniers jours</p>
                </div>
                <div className="p-2 bg-primary-50 text-primary-600 rounded-xl">
                  <BarChart3 className="h-5 w-5" />
                </div>
              </div>
              <CardContent className="p-4 pt-6 h-[350px]">
                <OverviewChart />
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={item} className="space-y-6">
            <BusinessInsights />
            
            {/* Top Products */}
            <Card className="glass-card border-0 shadow-sm">
              <div className="p-6 border-b border-slate-100/50">
                <h3 className="font-bold text-slate-900">Meilleurs Produits</h3>
              </div>
              <CardContent className="p-0">
                <div className="divide-y divide-slate-100/50">
                  {topProducts.map((p, i) => (
                    <div key={i} className="p-4 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
                      <div>
                        <p className="font-semibold text-slate-900 text-sm">{p.name}</p>
                        <p className="text-xs text-slate-500">{p.category}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-slate-900 text-sm">{p.totalAmount.toLocaleString('fr-FR')} FCFA</p>
                        <p className="text-xs text-success font-medium">{p.totalQuantity} vendus</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

        </div>
      </motion.div>
    </div>
  )
}

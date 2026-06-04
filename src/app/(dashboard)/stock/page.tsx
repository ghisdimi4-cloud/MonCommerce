"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { AlertTriangle, TrendingUp, PackageX, Boxes, ArrowUpRight, ArrowDownRight } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useAppStore } from "@/lib/store"
import { useToast } from "@/hooks/use-toast"
import { CustomDialog } from "@/components/ui/custom-dialog"

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
}

const item: any = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
}

export default function StockPage() {
  const [dialogState, setDialogState] = useState({
    isOpen: false,
    title: '',
    description: '',
    action: (val?: string) => {}
  })

  const openDialog = (options: any) => setDialogState({ ...dialogState, ...options, isOpen: true })
  const closeDialog = () => setDialogState({ ...dialogState, isOpen: false })
  const { toast } = useToast()
  const { products, sales, activities, restockProduct } = useAppStore()
  
  const lowStockProducts = products.filter(p => p.status === "Stock faible")
  const outOfStockProducts = products.filter(p => p.status === "Rupture")
  const totalStock = products.reduce((acc, curr) => acc + curr.stock, 0)
  const totalValue = products.reduce((acc, curr) => acc + (curr.stock * curr.price), 0)

  const handleRestock = (productId: string, productName: string) => {
    openDialog({
      title: 'Réapprovisionnement',
      description: `Entrez la quantité à commander pour "${productName}" :`,
      action: (val?: string) => {
        if (val && !isNaN(parseInt(val))) {
          restockProduct(productId, parseInt(val))
          toast({
            title: "Commande envoyée",
            description: `La commande de ${val} unités pour "${productName}" a été enregistrée.`,
            type: "success"
          })
        }
      }
    })
  }

  // Generate dynamic movements
  const recentMovements: any[] = []
  
  sales.slice(0, 10).forEach(sale => {
    sale.items.forEach(i => {
      recentMovements.push({
        id: `sale-${sale.id}-${i.productId}`,
        type: 'Vente',
        productName: i.name,
        date: sale.date,
        reference: `Par Vente #${sale.id.toUpperCase()}`,
        quantity: i.quantity,
        isEntry: false
      })
    })
  })

  activities.filter(a => a.type === "Réapprovisionnement").slice(0, 10).forEach(a => {
    const match = a.amount.match(/^\+(\d+)\s+(.*)$/)
    recentMovements.push({
      id: a.id,
      type: 'Réapprovisionnement',
      productName: match ? match[2] : 'Produit',
      date: a.date,
      reference: 'Achat Fournisseur',
      quantity: match ? parseInt(match[1]) : 0,
      isEntry: true
    })
  })

  // Take the first 6 elements to avoid a massive list
  const displayMovements = recentMovements.slice(0, 6)

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-6 md:space-y-8 pb-20"
    >
      {/* Header */}
      <motion.div variants={item}>
        <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Suivi du Stock</h2>
        <p className="text-slate-500 mt-1">Gérez vos inventaires et soyez alerté des ruptures.</p>
      </motion.div>

      {/* KPI Cards */}
      <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6">
        <Card className="glass-card border-0 shadow-sm hover:shadow-md transition-all duration-300 group">
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-xl group-hover:scale-110 transition-transform">
                <Boxes className="h-5 w-5" />
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Articles en stock</p>
              <h3 className="text-3xl font-bold text-slate-900 mt-1">{totalStock}</h3>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-0 shadow-sm hover:shadow-md transition-all duration-300 group">
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-primary-50 text-primary-600 rounded-xl group-hover:scale-110 transition-transform">
                <TrendingUp className="h-5 w-5" />
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Valeur du stock</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">{totalValue.toLocaleString('fr-FR')} <span className="text-sm text-slate-500">FCFA</span></h3>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-0 shadow-sm hover:-translate-y-1 hover:shadow-md transition-all duration-300 group cursor-pointer border-l-4 border-l-warning">
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-warning/10 text-warning rounded-xl group-hover:scale-110 transition-transform">
                <AlertTriangle className="h-5 w-5" />
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Stocks faibles</p>
              <h3 className="text-3xl font-bold text-warning mt-1">{lowStockProducts.length}</h3>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-0 shadow-sm hover:-translate-y-1 hover:shadow-md transition-all duration-300 group cursor-pointer border-l-4 border-l-danger">
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-danger/10 text-danger rounded-xl group-hover:scale-110 transition-transform">
                <PackageX className="h-5 w-5" />
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Ruptures</p>
              <h3 className="text-3xl font-bold text-danger mt-1">{outOfStockProducts.length}</h3>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
        {/* Alertes d'inventaire */}
        <motion.div variants={item} className="space-y-4">
          <h3 className="text-xl font-bold text-slate-900">Alertes prioritaires</h3>
          <div className="space-y-3">
            {outOfStockProducts.map(p => (
              <div key={p.id} className="glass-card p-4 rounded-2xl border-l-4 border-l-danger flex justify-between items-center bg-danger/5 group hover:bg-danger/10 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white rounded-lg shadow-sm text-danger group-hover:scale-110 transition-transform">
                    <PackageX className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-danger">{p.name}</h4>
                    <p className="text-sm text-slate-600">Produit complètement épuisé.</p>
                  </div>
                </div>
                <Badge onClick={() => handleRestock(p.id, p.name)} className="bg-white text-danger border-danger/20 cursor-pointer hover:bg-danger/10 transition-colors">Commander</Badge>
              </div>
            ))}
            {lowStockProducts.map(p => (
              <div key={p.id} className="glass-card p-4 rounded-2xl border-l-4 border-l-warning flex justify-between items-center bg-warning/5 group hover:bg-warning/10 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white rounded-lg shadow-sm text-warning group-hover:scale-110 transition-transform">
                    <AlertTriangle className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-warning">{p.name}</h4>
                    <p className="text-sm text-slate-600">Il ne reste que {p.stock} unités.</p>
                  </div>
                </div>
                <Badge onClick={() => handleRestock(p.id, p.name)} className="bg-white text-warning border-warning/20 cursor-pointer hover:bg-warning/10 transition-colors">Réappro.</Badge>
              </div>
            ))}
            {outOfStockProducts.length === 0 && lowStockProducts.length === 0 && (
              <div className="glass-card p-4 rounded-2xl border-l-4 border-l-success flex items-center gap-3 bg-success/5">
                <div className="p-2 bg-white rounded-lg shadow-sm text-success">
                  <Boxes className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="font-semibold text-success">Aucune alerte</h4>
                  <p className="text-sm text-slate-600">Tous vos stocks sont à un niveau optimal.</p>
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Mouvements récents */}
        <motion.div variants={item} className="space-y-4">
          <h3 className="text-xl font-bold text-slate-900">Mouvements récents</h3>
          <Card className="glass-card border-0 shadow-sm overflow-hidden">
            <div className="divide-y divide-slate-100/50">
              {displayMovements.length > 0 ? displayMovements.map((mov, i) => (
                <div key={mov.id + i} className="p-4 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={`h-10 w-10 rounded-xl flex items-center justify-center font-bold border ${mov.isEntry ? 'bg-success/10 text-success border-success/20' : 'bg-danger/10 text-danger border-danger/20'}`}>
                      {mov.isEntry ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">{mov.type} ({mov.productName})</p>
                      <p className="text-xs text-slate-500">{mov.date} • {mov.reference}</p>
                    </div>
                  </div>
                  <p className={`font-bold ${mov.isEntry ? 'text-success' : 'text-danger'}`}>
                    {mov.isEntry ? '+' : '-'}{mov.quantity} unité{mov.quantity > 1 ? 's' : ''}
                  </p>
                </div>
              )) : (
                <div className="p-6 text-center text-slate-500">
                  Aucun mouvement récent
                </div>
              )}
            </div>
          </Card>
        </motion.div>
      </div>

      <CustomDialog
        isOpen={dialogState.isOpen}
        onClose={closeDialog}
        onConfirm={dialogState.action}
        title={dialogState.title}
        description={dialogState.description}
        type="prompt"
        variant="success"
        promptPlaceholder="Ex: 50"
      />
    </motion.div>
  )
}

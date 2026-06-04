"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { motion } from "framer-motion"
import { Sparkles, TrendingUp, AlertCircle, ShoppingBag, ArrowDownRight, Crown } from "lucide-react"
import { useAppStore } from "@/lib/store"
import { useMemo } from "react"

export function BusinessInsights() {
  const { products, sales, clients } = useAppStore()

  const insights = useMemo(() => {
    const dynamicInsights = []

    // 1. Stock alerts
    const lowStockProduct = products.find(p => p.stock > 0 && p.stock <= 10)
    const outOfStockProduct = products.find(p => p.stock === 0)
    
    if (outOfStockProduct) {
      dynamicInsights.push({
        icon: AlertCircle,
        text: `Le produit “${outOfStockProduct.name}” est en rupture de stock`,
        color: "text-red-500",
        bgColor: "bg-red-100/50"
      })
    } else if (lowStockProduct) {
      dynamicInsights.push({
        icon: AlertCircle,
        text: `Le produit “${lowStockProduct.name}” sera bientôt en rupture (${lowStockProduct.stock} restants)`,
        color: "text-amber-500",
        bgColor: "bg-amber-100/50"
      })
    }

    // 2. Best selling product
    if (sales.length > 0) {
      const productSalesCount: Record<string, number> = {}
      sales.forEach(s => s.items.forEach(i => {
        productSalesCount[i.name] = (productSalesCount[i.name] || 0) + i.quantity
      }))
      const bestProduct = Object.entries(productSalesCount).sort((a, b) => b[1] - a[1])[0]
      if (bestProduct) {
        dynamicInsights.push({
          icon: ShoppingBag,
          text: `Le produit “${bestProduct[0]}” est votre meilleure vente (${bestProduct[1]} unités)`,
          color: "text-blue-600",
          bgColor: "bg-blue-100/50"
        })
      }
    }

    // 3. Best client
    if (clients.length > 0 && sales.length > 0) {
      const clientSpent: Record<string, number> = {}
      sales.forEach(s => {
        clientSpent[s.client] = (clientSpent[s.client] || 0) + s.amount
      })
      const bestClient = Object.entries(clientSpent).sort((a, b) => b[1] - a[1])[0]
      if (bestClient) {
        dynamicInsights.push({
          icon: Crown,
          text: `Votre meilleur client ${bestClient[0]} a dépensé ${bestClient[1].toLocaleString("fr-FR")} FCFA`,
          color: "text-purple-600",
          bgColor: "bg-purple-100/50"
        })
      }
    }

    // 4. Payment method insights
    if (sales.length > 0) {
      const mobileMoneySales = sales.filter(s => s.paymentMethod === "Mobile Money")
      const mmPercentage = Math.round((mobileMoneySales.length / sales.length) * 100)
      if (mmPercentage > 30) {
        dynamicInsights.push({
          icon: TrendingUp,
          text: `Mobile Money représente ${mmPercentage}% de vos paiements`,
          color: "text-primary-600",
          bgColor: "bg-primary-100/50"
        })
      }
    }

    // 5. Debt insight
    const totalDebt = clients.reduce((sum, c) => sum + c.debt, 0)
    if (totalDebt > 0) {
      dynamicInsights.push({
        icon: ArrowDownRight,
        text: `Vous avez ${totalDebt.toLocaleString("fr-FR")} FCFA en attente de recouvrement`,
        color: "text-warning",
        bgColor: "bg-warning/10"
      })
    }

    return dynamicInsights.slice(0, 5) // limit to 5
  }, [products, sales, clients])

  return (
    <Card className="glass-card border-0 hover:shadow-lg transition-shadow duration-300 overflow-hidden relative h-full">
      <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
        <Sparkles className="w-24 h-24 text-primary-500" />
      </div>
      <CardHeader className="pb-4 flex flex-row items-center gap-3 relative z-10">
        <div className="p-2.5 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl shadow-primary-glow">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <CardTitle className="text-lg font-bold text-slate-900 tracking-tight">Business Insights</CardTitle>
      </CardHeader>
      <CardContent className="relative z-10">
        <div className="space-y-4">
          {insights.length === 0 && (
             <p className="text-sm text-slate-500">Pas assez de données pour générer des insights pour le moment.</p>
          )}
          {insights.map((insight, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.15, duration: 0.5 }}
              className="flex items-start gap-3 group cursor-pointer hover:bg-slate-50/50 p-2 -mx-2 rounded-xl transition-colors"
            >
              <div className={`p-2 rounded-xl mt-0.5 ${insight.bgColor} ${insight.color} group-hover:scale-110 group-hover:shadow-sm transition-all`}>
                <insight.icon className="w-4 h-4" />
              </div>
              <p className="text-sm text-slate-700 leading-snug font-medium pt-1.5 group-hover:text-slate-900 transition-colors">
                {insight.text}
              </p>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

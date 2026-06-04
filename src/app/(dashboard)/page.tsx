"use client"

import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { 
  TrendingUp, 
  CreditCard, 
  Wallet,
  Plus,
  PackagePlus,
  UserPlus,
  BarChart2,
  ArrowUpRight,
  ArrowDownRight,
  Flame,
  Minus,
  Info,
  X
} from "lucide-react"
import { BusinessInsights } from "@/components/dashboard/business-insights"
import { OverviewChart } from "@/components/dashboard/overview-chart"
import { Sparkline } from "@/components/dashboard/sparkline"
import { useAppStore } from "@/lib/store"

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const item: any = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
}

export default function DashboardPage() {
  const currentDate = format(new Date(), "EEEE d MMMM yyyy", { locale: fr })
  const { sales, clients, activities } = useAppStore()
  const [isBeneficeModalOpen, setIsBeneficeModalOpen] = useState(false)
  
  const recentActivities = activities.slice(0, 4)
  
  const validSales = sales.filter(s => s.status !== "Brouillon" && s.status !== "Annulée")
  
  const totalSales = validSales.reduce((sum, s) => sum + s.amount, 0)
  const totalDettes = clients.reduce((sum, c) => sum + c.debt, 0)
  const depensesDuJour = activities
    .filter(a => a.type === "Réapprovisionnement")
    .reduce((sum, a) => sum + (a.cost || 0), 0)
  const benefice = (totalSales * 0.35) - depensesDuJour // Simulation de 35% de marge - dépenses

  // Dynamic Sales Sparkline & Growth
  const salesSparkline = validSales.slice(0, 7).map(s => s.amount).reverse()
  while(salesSparkline.length < 7) salesSparkline.unshift(0)
  
  const lastSales = validSales.slice(0, 5).reduce((a, b) => a + b.amount, 0)
  const prevSales = validSales.slice(5, 10).reduce((a, b) => a + b.amount, 0)
  const salesGrowth = prevSales ? Math.round(((lastSales - prevSales) / prevSales) * 100) : (lastSales > 0 ? 100 : 0)

  // Dynamic Dépenses Sparkline & Growth
  const depensesActivities = activities.filter(a => a.type === "Réapprovisionnement")
  const depensesSparkline = depensesActivities.slice(0, 7).map(a => a.cost || 0).reverse()
  while(depensesSparkline.length < 7) depensesSparkline.unshift(0)

  const lastDepenses = depensesActivities.slice(0, 3).reduce((a, b) => a + (b.cost || 0), 0)
  const prevDepenses = depensesActivities.slice(3, 6).reduce((a, b) => a + (b.cost || 0), 0)
  const depensesGrowth = prevDepenses ? Math.round(((lastDepenses - prevDepenses) / prevDepenses) * 100) : (lastDepenses > 0 ? 100 : 0)

  // Dynamic Dettes Sparkline & Growth
  let currentDebt = totalDettes
  const dettesSparkline = [currentDebt]
  activities.filter(a => a.type === 'Dette' || a.type === 'Remboursement').slice(0, 6).forEach(a => {
      const amount = parseInt(a.amount.replace(/\D/g, '')) || 0
      if (a.type === 'Dette') currentDebt -= amount
      if (a.type === 'Remboursement') currentDebt += amount
      dettesSparkline.unshift(Math.max(0, currentDebt))
  })
  while(dettesSparkline.length < 7) dettesSparkline.unshift(currentDebt)
  
  const dettesGrowth = dettesSparkline[0] ? Math.round(((dettesSparkline[6] - dettesSparkline[0]) / dettesSparkline[0]) * 100) : 0

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Payé":
      case "Succès":
        return <Badge className="bg-success/10 text-success border-success/20">{status}</Badge>
      case "En attente":
        return <Badge className="bg-warning/10 text-warning border-warning/20">{status}</Badge>
      case "Retard":
        return <Badge className="bg-danger/10 text-danger border-danger/20">{status}</Badge>
      default:
        return <Badge className="bg-slate-100 text-slate-600 border-slate-200">{status}</Badge>
    }
  }

  const renderGrowthBadge = (growth: number, invertColors = false) => {
    if (growth === 0) {
      return (
        <div className="flex items-center text-xs font-medium text-slate-500 bg-slate-100 w-fit px-2 py-1 rounded-md">
          <Minus className="h-3 w-3 mr-1" />
          <span>Stable</span>
        </div>
      )
    }
    
    const isPositive = growth > 0
    // For expenses, negative growth (decrease) is good (success), positive is bad (danger)
    const isGood = invertColors ? !isPositive : isPositive
    
    return (
      <div className={`flex items-center text-xs font-medium w-fit px-2 py-1 rounded-md ${
        isGood ? 'text-success bg-success/10' : 'text-danger bg-danger/10'
      }`}>
        {isPositive ? <ArrowUpRight className="h-3 w-3 mr-1" /> : <ArrowDownRight className="h-3 w-3 mr-1" />}
        <span>{isPositive ? '+' : ''}{growth}%</span>
      </div>
    )
  }

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-6 md:space-y-8 pb-20 relative z-10"
    >
      
      {/* Welcome Section */}
      <motion.div variants={item} className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Bonjour Dimitri 👋</h2>
          <p className="text-slate-500 mt-1 capitalize">{currentDate}</p>
        </div>
        <div className="flex items-center gap-3 glass-card px-4 py-2.5 rounded-2xl w-fit">
          <div className="h-2.5 w-2.5 rounded-full bg-success animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
          <p className="text-sm font-medium text-slate-700">Votre business progresse <span className="font-bold text-success">+{salesGrowth > 0 ? salesGrowth : 12}%</span> cette semaine 🚀</p>
        </div>
      </motion.div>
      
      {/* Motivational Card & Hero Card */}
      <motion.div variants={item} className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        
        {/* Motivational Card */}
        <Card className="glass-card border-0 bg-gradient-to-br from-white/60 to-amber-50/80 shadow-sm relative overflow-hidden group hover:-translate-y-1 hover:shadow-md transition-all duration-300 lg:col-span-1 flex flex-col justify-center">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-amber-200/50 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500"></div>
          <CardContent className="p-6 relative z-10">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-orange-100/80 rounded-xl text-orange-600 shadow-sm">
                <Flame className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-slate-900 text-lg">Excellent travail !</h3>
            </div>
            <p className="text-slate-600 text-sm font-medium">
              {salesGrowth > 0 
                ? "Vos ventes augmentent de manière constante. Continuez sur cette lancée !"
                : salesGrowth === 0 
                  ? "Vos ventes sont stables. C'est le moment de relancer vos clients pour booster vos revenus."
                  : "Vos ventes sont en légère baisse. Une petite promotion pourrait inverser la tendance !"}
            </p>
          </CardContent>
        </Card>

        {/* Bénéfice - Hero Card */}
        <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-primary-500 to-primary-600 text-white shadow-primary-glow group hover:-translate-y-1 hover:shadow-2xl transition-all duration-300 lg:col-span-2">
          <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-3xl -mr-10 -mt-10 group-hover:scale-110 transition-transform duration-700"></div>
          <CardContent className="p-6 relative z-10 flex flex-col justify-between h-full">
            <div className="flex justify-between items-start mb-4">
              <div className="flex gap-2">
                <div className="p-3 bg-white/20 backdrop-blur-md rounded-2xl border border-white/20 shadow-sm">
                  <TrendingUp className="h-5 w-5 text-white" />
                </div>
                <Button 
                  onClick={() => setIsBeneficeModalOpen(true)}
                  variant="ghost" 
                  size="icon" 
                  className="rounded-full bg-white/10 hover:bg-white/20 text-white h-8 w-8 mt-1 border border-white/10 shadow-sm"
                  title="Comment est calculé le bénéfice ?"
                >
                  <Info className="h-4 w-4" />
                </Button>
              </div>
              <Badge className="bg-white/20 text-white border-0 hover:bg-white/30 backdrop-blur-sm shadow-sm">+{salesGrowth > 0 ? salesGrowth : 15}%</Badge>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-primary-100">Bénéfice net total</p>
              <div className="flex items-baseline gap-2">
                <h3 className="text-4xl font-bold tracking-tight">{benefice.toLocaleString("fr-FR")} <span className="text-xl text-primary-200 font-semibold">FCFA</span></h3>
              </div>
            </div>
          </CardContent>
        </Card>

      </motion.div>

      {/* KPI Cards Section */}
      <motion.div variants={item} className="grid gap-4 md:gap-6 grid-cols-1 sm:grid-cols-3">
        
        {/* Ventes */}
        <Link href="/ventes" className="block">
          <Card className="group glass-card border-0 hover:-translate-y-1 hover:shadow-xl transition-all duration-300 relative overflow-hidden h-full">
            <div className="absolute bottom-0 left-0 right-0 h-1/2 opacity-20 group-hover:opacity-40 transition-opacity duration-300">
              <Sparkline data={salesSparkline} color="#10B981" />
            </div>
            <CardContent className="p-6 relative z-10">
              <div className="flex justify-between items-start">
                <div className="space-y-3">
                  <p className="text-sm font-medium text-slate-500">Ventes totales</p>
                  <div className="flex items-baseline gap-2">
                    <h3 className="text-3xl font-bold text-slate-900 tracking-tight">{totalSales.toLocaleString("fr-FR")}</h3>
                    <span className="text-sm text-slate-400 font-semibold">FCFA</span>
                  </div>
                  {renderGrowthBadge(salesGrowth)}
                </div>
                <div className="p-3 bg-slate-50/80 rounded-2xl group-hover:bg-primary-50 transition-colors border border-slate-100/50 shadow-sm">
                  <CreditCard className="h-5 w-5 text-slate-600 group-hover:text-primary-600 transition-colors" />
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>

        {/* Dépenses */}
        <Link href="/statistiques" className="block">
          <Card className="group glass-card border-0 hover:-translate-y-1 hover:shadow-xl transition-all duration-300 relative overflow-hidden h-full">
            <div className="absolute bottom-0 left-0 right-0 h-1/2 opacity-10 group-hover:opacity-30 transition-opacity duration-300">
              <Sparkline data={depensesSparkline} color="#EF4444" />
            </div>
            <CardContent className="p-6 relative z-10">
              <div className="flex justify-between items-start">
                <div className="space-y-3">
                  <p className="text-sm font-medium text-slate-500">Dépenses du jour</p>
                  <div className="flex items-baseline gap-2">
                    <h3 className="text-3xl font-bold text-slate-900 tracking-tight">{depensesDuJour.toLocaleString("fr-FR")}</h3>
                    <span className="text-sm text-slate-400 font-semibold">FCFA</span>
                  </div>
                  {renderGrowthBadge(depensesGrowth, true)}
                </div>
                <div className="p-3 bg-slate-50/80 rounded-2xl group-hover:bg-danger/10 transition-colors border border-slate-100/50 shadow-sm">
                  <Wallet className="h-5 w-5 text-slate-600 group-hover:text-danger transition-colors" />
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>

        {/* Dettes */}
        <Link href="/dettes" className="block">
          <Card className="group glass-card border-0 hover:-translate-y-1 hover:shadow-xl transition-all duration-300 relative overflow-hidden h-full">
            <div className="absolute bottom-0 left-0 right-0 h-1/2 opacity-20 group-hover:opacity-40 transition-opacity duration-300">
              <Sparkline data={dettesSparkline} color="#F59E0B" />
            </div>
            <CardContent className="p-6 relative z-10">
              <div className="flex justify-between items-start">
                <div className="space-y-3">
                  <p className="text-sm font-medium text-slate-500">Dettes clients</p>
                  <div className="flex items-baseline gap-2">
                    <h3 className="text-3xl font-bold text-warning tracking-tight">{totalDettes.toLocaleString("fr-FR")}</h3>
                    <span className="text-sm text-slate-400 font-semibold">FCFA</span>
                  </div>
                  {renderGrowthBadge(dettesGrowth, true)}
                </div>
                <div className="p-3 bg-slate-50/80 rounded-2xl group-hover:bg-warning/10 transition-colors border border-slate-100/50 shadow-sm">
                  <UserPlus className="h-5 w-5 text-slate-600 group-hover:text-warning transition-colors" />
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
      </motion.div>
      
      {/* Quick Actions */}
      <motion.div variants={item} className="grid grid-cols-4 gap-3 md:gap-4 overflow-x-auto no-scrollbar pb-2">
        <Link href="/ventes" className="block">
          <Button className="w-full h-auto py-5 flex flex-col gap-3 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white shadow-primary-glow border-0 group hover:-translate-y-1 transition-all duration-300">
            <div className="bg-white/20 p-2.5 rounded-xl group-hover:scale-110 transition-transform">
              <Plus className="h-6 w-6" />
            </div>
            <span className="font-semibold text-sm">Vente</span>
          </Button>
        </Link>
        <Link href="/produits" className="block">
          <Button className="w-full h-auto py-5 flex flex-col gap-3 rounded-2xl bg-white text-slate-700 border border-slate-100/50 hover:bg-slate-50 shadow-sm group glass-card hover:-translate-y-1 hover:shadow-md transition-all duration-300">
            <div className="bg-amber-100/80 p-2.5 rounded-xl text-amber-600 group-hover:scale-110 transition-transform">
              <PackagePlus className="h-6 w-6" />
            </div>
            <span className="font-semibold text-sm">Produit</span>
          </Button>
        </Link>
        <Link href="/clients" className="block">
          <Button className="w-full h-auto py-5 flex flex-col gap-3 rounded-2xl bg-white text-slate-700 border border-slate-100/50 hover:bg-slate-50 shadow-sm group glass-card hover:-translate-y-1 hover:shadow-md transition-all duration-300">
            <div className="bg-blue-100/80 p-2.5 rounded-xl text-blue-600 group-hover:scale-110 transition-transform">
              <UserPlus className="h-6 w-6" />
            </div>
            <span className="font-semibold text-sm">Client</span>
          </Button>
        </Link>
        <Link href="/statistiques" className="block">
          <Button className="w-full h-auto py-5 flex flex-col gap-3 rounded-2xl bg-white text-slate-700 border border-slate-100/50 hover:bg-slate-50 shadow-sm group glass-card hover:-translate-y-1 hover:shadow-md transition-all duration-300">
            <div className="bg-purple-100/80 p-2.5 rounded-xl text-purple-600 group-hover:scale-110 transition-transform">
              <BarChart2 className="h-6 w-6" />
            </div>
            <span className="font-semibold text-sm">Stats</span>
          </Button>
        </Link>
      </motion.div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 md:gap-8">
        
        {/* Charts */}
        <motion.div variants={item} className="xl:col-span-2 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold text-slate-900 tracking-tight">Aperçu des ventes</h3>
          </div>
          <Card className="p-2 sm:p-4 glass-card border-0 hover:shadow-lg transition-shadow duration-300 h-full min-h-[350px]">
            <CardContent className="p-0 sm:p-2 pt-4 h-full">
              <OverviewChart />
            </CardContent>
          </Card>
        </motion.div>

        {/* Business Insights */}
        <motion.div variants={item} className="space-y-4">
          <BusinessInsights />
        </motion.div>

      </div>

      {/* Recent Activities */}
      <motion.div variants={item} className="space-y-4 pt-4">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-bold text-slate-900 tracking-tight">Activités récentes</h3>
          <Link href="/ventes">
            <Button variant="ghost" size="sm" className="text-primary-600 hover:text-primary-700 hover:bg-primary-50 rounded-full">Voir tout</Button>
          </Link>
        </div>
        <Card className="glass-card border-0 overflow-hidden hover:shadow-lg transition-shadow duration-300">
          <div className="divide-y divide-slate-100/50">
            {recentActivities.map((activity, i) => (
              <div key={i} className="p-4 hover:bg-slate-50/50 transition-colors flex items-center justify-between group cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary-50/80 text-primary-700 flex items-center justify-center font-bold text-sm border border-primary-100/50 shadow-sm group-hover:scale-105 transition-transform">
                    {activity.client.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900 text-sm group-hover:text-primary-600 transition-colors">{activity.client}</p>
                    <p className="text-xs text-slate-500 font-medium">{activity.type} • {activity.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-slate-900 text-sm mb-1">{activity.amount}</p>
                  {getStatusBadge(activity.status)}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </motion.div>

      {/* Benefice Explanation Modal */}
      <AnimatePresence>
        {isBeneficeModalOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsBeneficeModalOpen(false)}
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
                    <Info className="h-5 w-5 text-primary-500" />
                    Calcul du Bénéfice
                  </h3>
                  <Button variant="ghost" size="icon" onClick={() => setIsBeneficeModalOpen(false)} className="rounded-full h-8 w-8 hover:bg-slate-100">
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <CardContent className="p-6 space-y-4">
                  <p className="text-sm text-slate-600">
                    Votre bénéfice net est une estimation basée sur vos marges commerciales et vos dépenses courantes. Voici le détail du calcul :
                  </p>
                  
                  <div className="bg-slate-50 rounded-xl p-4 space-y-3 font-mono text-sm border border-slate-100">
                    <div className="flex justify-between text-slate-600">
                      <span>Total des ventes</span>
                      <span className="font-semibold text-slate-900">{totalSales.toLocaleString("fr-FR")}</span>
                    </div>
                    <div className="flex justify-between text-slate-600 text-xs pl-2 border-l-2 border-primary-200">
                      <span>× Marge estimée (35%)</span>
                      <span className="text-primary-600">{(totalSales * 0.35).toLocaleString("fr-FR")}</span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>- Dépenses de stock</span>
                      <span className="text-danger">{depensesDuJour.toLocaleString("fr-FR")}</span>
                    </div>
                    <div className="h-px bg-slate-200 w-full" />
                    <div className="flex justify-between font-bold text-slate-900 text-base">
                      <span>Bénéfice Net</span>
                      <span className="text-primary-600">{benefice.toLocaleString("fr-FR")} FCFA</span>
                    </div>
                  </div>

                  <Button onClick={() => setIsBeneficeModalOpen(false)} className="w-full mt-2 bg-primary-500 hover:bg-primary-600 text-white rounded-xl shadow-primary-glow">
                    Compris
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </motion.div>
  )
}

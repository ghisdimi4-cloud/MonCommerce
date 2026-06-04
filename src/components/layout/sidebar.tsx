"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useAppStore } from "@/lib/store"
import { 
  LayoutDashboard, 
  ShoppingCart, 
  Package, 
  Boxes, 
  Users, 
  CreditCard, 
  BarChart3, 
  Settings,
  Rocket,
  LogOut
} from "lucide-react"

const routes = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/" },
  { label: "Ventes", icon: ShoppingCart, href: "/ventes" },
  { label: "Produits", icon: Package, href: "/produits" },
  { label: "Stock", icon: Boxes, href: "/stock" },
  { label: "Clients", icon: Users, href: "/clients" },
  { label: "Dettes", icon: CreditCard, href: "/dettes" },
  { label: "Statistiques", icon: BarChart3, href: "/statistiques" },
  { label: "Paramètres", icon: Settings, href: "/parametres" },
]

export function Sidebar() {
  const pathname = usePathname()
  const { logout, userEmail } = useAppStore()

  return (
    <div className="space-y-4 py-4 flex flex-col h-full bg-white/80 backdrop-blur-xl border-r border-slate-100/50 shadow-[2px_0_12px_rgba(0,0,0,0.02)]">
      <div className="px-4 py-4 flex-1 flex flex-col">
        <Link href="/" className="flex items-center pl-2 mb-10 group">
          <div className="h-8 w-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center mr-3 shadow-sm shadow-primary-500/20 group-hover:shadow-primary-500/40 group-hover:scale-105 transition-all duration-300">
            <span className="text-white font-bold text-lg">M</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight group-hover:text-primary-600 transition-colors">MonCommerce</h1>
        </Link>
        <div className="space-y-1.5 flex-1">
          {routes.map((route) => {
            const isActive = pathname === route.href
            return (
              <Link
                key={route.href}
                href={route.href}
                className={cn(
                  "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer rounded-xl transition-all duration-200",
                  isActive 
                    ? "bg-primary-50/80 text-primary-700 shadow-sm shadow-primary-500/5 font-semibold" 
                    : "text-slate-500 hover:text-slate-900 hover:bg-slate-50 hover:shadow-sm"
                )}
              >
                <div className="flex items-center flex-1">
                  <route.icon 
                    className={cn(
                      "h-5 w-5 mr-3 transition-colors", 
                      isActive ? "text-primary-600" : "text-slate-400 group-hover:text-slate-600"
                    )} 
                  />
                  {route.label}
                </div>
              </Link>
            )
          })}
        </div>

        {/* Pro Upgrade Card & Logout */}
        <div className="mt-auto pt-6 space-y-4">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 p-4 shadow-lg shadow-slate-900/10 group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-primary-500/20 rounded-full blur-2xl -mr-8 -mt-8 transition-all group-hover:bg-primary-500/30 group-hover:scale-110"></div>
            <div className="relative z-10 flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <Rocket className="h-5 w-5 text-primary-400" />
                <h3 className="font-semibold text-white">SaaS Cloud</h3>
              </div>
              <ul className="space-y-1.5 text-xs text-slate-300 font-medium">
                <li className="flex items-center gap-1.5">
                  <div className="h-1 w-1 rounded-full bg-primary-400" /> Données privées
                </li>
                <li className="flex items-center gap-1.5">
                  <div className="h-1 w-1 rounded-full bg-primary-400" /> Multi-appareils
                </li>
              </ul>
            </div>
          </div>
          
          <div className="pt-4 flex items-center justify-between gap-3 border-t border-slate-200/60 mt-4">
            <div className="flex flex-col flex-1 min-w-0">
              <span className="text-xs font-bold text-slate-900">Connecté</span>
              <span className="text-[11px] text-slate-500 truncate mt-0.5 font-medium" title={userEmail || ""}>
                {userEmail || "Chargement..."}
              </span>
            </div>
            <Button 
              variant="ghost" 
              size="icon"
              className="h-9 w-9 text-slate-400 hover:text-danger-600 hover:bg-danger-50 transition-colors rounded-xl flex-shrink-0"
              onClick={logout}
              title="Se déconnecter"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

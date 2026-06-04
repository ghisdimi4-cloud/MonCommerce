import { MobileNav } from "@/components/layout/mobile-nav"
import { Bell, Search } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Header() {
  return (
    <header className="sticky top-0 z-40 w-full glass border-b border-slate-100/50">
      <div className="flex h-16 items-center px-4 md:px-8 justify-between">
        <div className="flex items-center gap-3 md:hidden">
          <MobileNav />
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center shadow-sm">
              <span className="text-white font-bold text-sm">M</span>
            </div>
            <h1 className="text-lg font-bold text-slate-900 tracking-tight">MonCommerce</h1>
          </div>
        </div>

        {/* Global Search Bar (Desktop) */}
        <div className="hidden md:flex flex-1 max-w-md relative group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-slate-400 group-focus-within:text-primary-500 transition-colors" />
          </div>
          <input
            type="text"
            placeholder="Rechercher produits, clients, ventes..."
            className="block w-full pl-10 pr-3 py-2 border border-slate-200 rounded-full leading-5 bg-slate-50/50 text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-4 focus:ring-primary-500/10 focus:border-primary-400 shadow-sm focus:shadow-md transition-all duration-300 sm:text-sm hover:bg-white"
          />
        </div>
        
        <div className="flex items-center gap-3 ml-auto">
          {/* Mobile Search Icon */}
          <Button variant="ghost" size="icon" className="md:hidden text-slate-500 hover:bg-slate-100 rounded-full h-10 w-10">
            <Search className="h-5 w-5" />
          </Button>
          
          <Button variant="ghost" size="icon" className="relative text-slate-500 hover:bg-slate-100 rounded-full h-10 w-10 transition-colors hover:text-slate-900">
            <Bell className="h-5 w-5" />
            <span className="absolute top-2 right-2.5 h-2 w-2 rounded-full bg-danger ring-2 ring-white"></span>
          </Button>
          <div className="h-8 w-8 shrink-0 overflow-hidden rounded-full bg-gradient-to-br from-primary-50 to-primary-100 border border-primary-200 flex items-center justify-center font-bold text-primary-700 shadow-sm cursor-pointer hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 ml-1">
            M
          </div>
        </div>
      </div>
    </header>
  )
}

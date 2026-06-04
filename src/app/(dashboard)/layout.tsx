import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import { StoreProvider } from "@/lib/store"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <StoreProvider>
      <div className="flex h-screen bg-slate-50 text-foreground overflow-hidden selection:bg-primary-100 selection:text-primary-900 relative">
        {/* Subtle Background Blobs for Glassmorphism */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-100/40 rounded-full blur-3xl pointer-events-none -z-10"></div>
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-blue-50/50 rounded-full blur-3xl pointer-events-none -z-10"></div>

        <div className="hidden md:flex w-64 flex-col fixed inset-y-0 z-50">
          <Sidebar />
        </div>
        <div className="md:pl-64 flex flex-col flex-1 w-full h-full overflow-hidden z-10">
          <Header />
          <main className="flex-1 overflow-y-auto overflow-x-hidden no-scrollbar">
            <div className="max-w-7xl mx-auto p-4 md:p-8">
              {children}
            </div>
          </main>
        </div>
      </div>
    </StoreProvider>
  )
}

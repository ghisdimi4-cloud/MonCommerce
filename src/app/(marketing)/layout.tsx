import { TopNavBar } from "@/components/landing/TopNavBar"
import { Footer } from "@/components/landing/Footer"

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col font-sans">
      <TopNavBar />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  )
}

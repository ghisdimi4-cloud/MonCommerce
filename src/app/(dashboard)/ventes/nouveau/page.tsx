"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ArrowLeft, Plus, Trash2, Save, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { DatePicker } from "@/components/ui/date-picker"
import { useAppStore } from "@/lib/store"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
}

const item: any = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
}

export default function NouvelleVentePage() {
  const router = useRouter()
  const { toast } = useToast()
  const { clients, products, recordSale } = useAppStore()

  const [clientId, setClientId] = useState("")
  const [date, setDate] = useState<Date>(new Date())
  const [paymentMethod, setPaymentMethod] = useState("cash")
  const [lines, setLines] = useState([{ id: 1, productId: "", quantity: 1, price: 0 }])
  const [discount, setDiscount] = useState(0)

  const handleSaveSale = (isDraft = false) => {
    if (!clientId) {
      toast({ title: "Erreur", description: "Veuillez sélectionner un client", type: "error" })
      return
    }

    const client = clients.find(c => c.id === clientId)
    if (!client) return

    const validLines = lines.filter(l => l.productId !== "")
    if (validLines.length === 0) {
      toast({ title: "Erreur", description: "Veuillez ajouter au moins un produit", type: "error" })
      return
    }

    const total = validLines.reduce((acc, line) => acc + (line.price * line.quantity), 0) - discount

    const newSale = {
      id: `v${Date.now()}`,
      client: client.name,
      clientId: client.id,
      amount: total,
      status: isDraft ? "Brouillon" : (paymentMethod === "credit" ? "En attente" : "Payé"),
      date: date.toLocaleDateString('fr-FR'),
      paymentMethod: paymentMethod === "cash" ? "Cash" : paymentMethod === "mobile_money" ? "Mobile Money" : paymentMethod === "carte" ? "Carte" : "Crédit",
      items: validLines.map(l => {
        const p = products.find(prod => prod.id === l.productId)
        return {
          productId: l.productId,
          name: p ? p.name : "Produit Inconnu",
          quantity: l.quantity,
          unitPrice: l.price,
          total: l.price * l.quantity
        }
      })
    }

    recordSale(newSale)

    toast({
      title: isDraft ? "Brouillon enregistré" : "Vente enregistrée",
      description: isDraft ? "Le brouillon a été sauvegardé." : "La transaction a été ajoutée avec succès.",
      type: "success"
    })
    
    router.push('/ventes')
  }

  const handleAddLine = () => {
    setLines([...lines, { id: Date.now(), productId: "", quantity: 1, price: 0 }])
  }

  const handleRemoveLine = (id: number) => {
    if (lines.length > 1) {
      setLines(lines.filter(line => line.id !== id))
    }
  }

  const handleProductChange = (id: number, productId: string) => {
    const product = products.find(p => p.id === productId)
    setLines(lines.map(line => 
      line.id === id ? { ...line, productId, price: product ? product.price : 0 } : line
    ))
  }

  const handleQuantityChange = (id: number, quantity: number) => {
    setLines(lines.map(line => line.id === id ? { ...line, quantity } : line))
  }

  const handlePriceChange = (id: number, price: number) => {
    setLines(lines.map(line => line.id === id ? { ...line, price } : line))
  }

  const subtotal = lines.reduce((acc, line) => acc + (line.price * line.quantity), 0)
  const total = subtotal - discount

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-6 md:space-y-8 pb-20 max-w-4xl mx-auto"
    >
      {/* Header */}
      <motion.div variants={item} className="flex items-center gap-4">
        <Link href="/ventes">
          <Button variant="ghost" size="icon" className="rounded-full bg-white shadow-sm border border-slate-100 hover:bg-slate-50">
            <ArrowLeft className="h-5 w-5 text-slate-600" />
          </Button>
        </Link>
        <div>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Enregistrer une vente</h2>
          <p className="text-slate-500 mt-1">Saisissez les détails de la transaction.</p>
        </div>
      </motion.div>

      <form className="space-y-6">
        {/* Infos de base */}
        <motion.div variants={item}>
          <Card className="glass-card border-0 shadow-sm">
            <div className="bg-slate-50/50 border-b border-slate-100/50 px-6 py-4 rounded-t-xl">
              <h3 className="font-semibold text-slate-800">Informations générales</h3>
            </div>
            <CardContent className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="client">Client</Label>
                <select 
                  id="client" 
                  value={clientId}
                  onChange={(e) => setClientId(e.target.value)}
                  className="flex h-11 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/30 transition-all duration-200"
                >
                  <option value="">Sélectionner un client...</option>
                  {clients.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                  <option value="new">+ Ajouter un nouveau client</option>
                </select>
              </div>
              
              <div className="space-y-2 relative">
                <Label htmlFor="date">Date de vente</Label>
                <DatePicker 
                  value={date}
                  onChange={(newDate) => setDate(newDate)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="payment">Mode de paiement</Label>
                <select 
                  id="payment" 
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="flex h-11 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/30 transition-all duration-200"
                >
                  <option value="cash">Cash</option>
                  <option value="mobile_money">Mobile Money</option>
                  <option value="carte">Carte Bancaire</option>
                  <option value="credit">Crédit (À payer)</option>
                </select>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Produits */}
        <motion.div variants={item}>
          <Card className="glass-card border-0 shadow-sm">
            <div className="bg-slate-50/50 border-b border-slate-100/50 px-6 py-4 flex justify-between items-center rounded-t-xl">
              <h3 className="font-semibold text-slate-800">Produits vendus</h3>
            </div>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left min-w-[800px]">
                  <thead className="text-xs text-slate-500 uppercase bg-slate-50/30 border-b border-slate-100/50">
                    <tr>
                      <th className="px-6 py-4 font-semibold w-5/12">Produit</th>
                      <th className="px-6 py-4 font-semibold w-2/12">Quantité</th>
                      <th className="px-6 py-4 font-semibold w-2/12">Prix U. (FCFA)</th>
                      <th className="px-6 py-4 font-semibold w-2/12 text-right">Total</th>
                      <th className="px-6 py-4 font-semibold w-1/12 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100/50">
                    {lines.map((line) => (
                      <tr key={line.id} className="group hover:bg-slate-50/30 transition-colors">
                        <td className="px-6 py-4">
                          <select 
                            value={line.productId}
                            onChange={(e) => handleProductChange(line.id, e.target.value)}
                            className="flex h-10 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/30 transition-all duration-200"
                          >
                            <option value="">Choisir un produit...</option>
                            {products.map(p => (
                              <option key={p.id} value={p.id}>{p.name} - {p.stock} en stock</option>
                            ))}
                          </select>
                        </td>
                        <td className="px-6 py-4">
                          <Input 
                            type="number" 
                            min="1" 
                            value={line.quantity} 
                            onChange={(e) => handleQuantityChange(line.id, parseInt(e.target.value) || 0)}
                            className="h-10 text-center" 
                          />
                        </td>
                        <td className="px-6 py-4">
                          <Input 
                            type="number" 
                            min="0" 
                            value={line.price} 
                            onChange={(e) => handlePriceChange(line.id, parseInt(e.target.value) || 0)}
                            className="h-10 text-right" 
                          />
                        </td>
                        <td className="px-6 py-4 text-right font-semibold text-slate-900">
                          {(line.price * line.quantity).toLocaleString('fr-FR')}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <Button 
                            type="button"
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handleRemoveLine(line.id)}
                            disabled={lines.length === 1}
                            className="text-slate-400 hover:text-danger hover:bg-danger/10 disabled:opacity-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="p-4 border-t border-slate-100/50">
                <Button 
                  type="button"
                  variant="outline" 
                  onClick={handleAddLine}
                  className="text-primary-600 border-primary-200 hover:bg-primary-50 bg-white rounded-xl h-10 border-dashed w-full sm:w-auto"
                >
                  <Plus className="h-4 w-4 mr-2" /> Ajouter une ligne
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Totals & Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div variants={item}>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="notes">Notes (Optionnel)</Label>
                <textarea 
                  id="notes" 
                  placeholder="Informations supplémentaires..."
                  className="flex min-h-[100px] w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/30 transition-all duration-200 resize-none"
                />
              </div>
            </div>
          </motion.div>

          <motion.div variants={item}>
            <Card className="glass-card border-0 shadow-sm overflow-hidden bg-gradient-to-br from-white to-slate-50/80">
              <CardContent className="p-6 space-y-4">
                <div className="flex justify-between items-center text-sm font-medium text-slate-500">
                  <span>Sous-total</span>
                  <span>{subtotal.toLocaleString('fr-FR')} FCFA</span>
                </div>
                
                <div className="flex justify-between items-center text-sm font-medium">
                  <span className="text-slate-500">Réduction</span>
                  <div className="w-32">
                    <Input 
                      type="number" 
                      min="0"
                      value={discount} 
                      onChange={(e) => setDiscount(parseInt(e.target.value) || 0)}
                      className="h-8 text-right bg-white/50" 
                    />
                  </div>
                </div>

                <div className="h-px bg-slate-200/60 my-4" />

                <div className="flex justify-between items-end">
                  <span className="text-base font-semibold text-slate-700">Total Final</span>
                  <span className="text-3xl font-bold text-primary-600 tracking-tight">
                    {total.toLocaleString('fr-FR')} <span className="text-base font-semibold text-primary-400">FCFA</span>
                  </span>
                </div>

                <div className="pt-6 grid grid-cols-2 gap-3">
                  <Button onClick={() => handleSaveSale(true)} variant="outline" type="button" className="h-12 rounded-xl text-slate-600 glass-card">
                    <Save className="h-4 w-4 mr-2" /> Brouillon
                  </Button>
                  <Button type="button" onClick={() => handleSaveSale(false)} className="h-12 rounded-xl bg-primary-500 hover:bg-primary-600 text-white shadow-primary-glow border-0 hover:-translate-y-0.5 transition-all duration-300">
                    <Send className="h-4 w-4 mr-2" /> Enregistrer
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

      </form>
    </motion.div>
  )
}

"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { Client, Product, Sale, Activity } from "./mock-data"
import { supabase } from "./supabase"

export type Settings = {
  companyName: string
  phone: string
  address: string
  paymentMobileMoney: boolean
  paymentCash: boolean
  paymentCard: boolean
}

type StoreContextType = {
  userEmail: string | null
  clients: Client[]
  products: Product[]
  sales: Sale[]
  activities: Activity[]
  settings: Settings
  updateSettings: (settings: Partial<Settings>) => void
  addClient: (client: Client) => void
  addProduct: (product: Product) => void
  updateClient: (client: Client) => void
  updateProduct: (product: Product) => void
  updateSale: (sale: Sale) => void
  deleteClient: (id: string) => void
  deleteProduct: (id: string) => void
  deleteSale: (id: string) => void
  recordSale: (sale: Sale) => void
  validateDraft: (saleId: string) => Promise<void>
  cancelSale: (saleId: string) => Promise<void>
  repayDebt: (clientId: string, amount: number) => void
  restockProduct: (productId: string, quantity: number) => void
  logout: () => Promise<void>
}

const StoreContext = createContext<StoreContextType | undefined>(undefined)

const defaultSettings: Settings = {
  companyName: "MonCommerce App",
  phone: "+225 00 00 00 00",
  address: "Abidjan, Côte d'Ivoire",
  paymentMobileMoney: true,
  paymentCash: true,
  paymentCard: false
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [clients, setClients] = useState<Client[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [sales, setSales] = useState<Sale[]>([])
  const [activities, setActivities] = useState<Activity[]>([])
  const [settings, setSettings] = useState<Settings>(defaultSettings)

  useEffect(() => {
    const fetchData = async () => {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setUserEmail(user.email ?? null)
      }

      try {
        const [
          { data: dbClients },
          { data: dbProducts },
          { data: dbSales },
          { data: dbActivities },
          { data: dbSettings }
        ] = await Promise.all([
          supabase.from('clients').select('*').order('name'),
          supabase.from('products').select('*').order('name'),
          supabase.from('sales').select('*, items:sale_items(*)').order('date', { ascending: false }),
          supabase.from('activities').select('*').order('id', { ascending: false }).limit(20),
          supabase.from('settings').select('*').eq('id', 1).single()
        ])

        if (dbClients) {
          setClients(dbClients.map((c: any) => ({ ...c, lastActivity: c.lastactivity || c.lastActivity })))
        }
        if (dbProducts) {
          setProducts(dbProducts.map((p: any) => ({ ...p, purchasePrice: p.purchaseprice || p.purchasePrice })))
        }
        if (dbSales) setSales(dbSales)
        if (dbActivities) setActivities(dbActivities)
        if (dbSettings) {
          setSettings({
            companyName: dbSettings.companyName || dbSettings.companyname,
            phone: dbSettings.phone,
            address: dbSettings.address,
            paymentMobileMoney: dbSettings.paymentMobileMoney !== undefined ? dbSettings.paymentMobileMoney : dbSettings.paymentmobilemoney,
            paymentCash: dbSettings.paymentCash !== undefined ? dbSettings.paymentCash : dbSettings.paymentcash,
            paymentCard: dbSettings.paymentCard !== undefined ? dbSettings.paymentCard : dbSettings.paymentcard
          })
        }
      } catch (error) {
        console.error("Erreur de chargement Supabase:", error)
      }
    }
    fetchData()
  }, [])

  const updateSettings = async (newSettings: Partial<Settings>) => {
    const merged = { ...settings, ...newSettings }
    setSettings(merged)
    // Au cas où le DB l'a mis en minuscule, on envoie les deux pour être sûr
    await supabase.from('settings').update({
      companyName: merged.companyName,
      phone: merged.phone,
      address: merged.address,
      paymentMobileMoney: merged.paymentMobileMoney,
      paymentCash: merged.paymentCash,
      paymentCard: merged.paymentCard
    }).eq('id', 1)
  }

  const addClient = async (client: Client) => {
    setClients((prev) => [client, ...prev])
    const newActivity = { id: `act_${Date.now()}`, client: client.name, type: "Nouveau Client", amount: "-", status: "Succès", date: "A l'instant" }
    setActivities(prev => [newActivity, ...prev])

    const { lastActivity, ...rest } = client
    await supabase.from('clients').insert([{ ...rest, lastactivity: lastActivity }])
    await supabase.from('activities').insert([newActivity])
  }
  
  const addProduct = async (product: Product) => {
    setProducts((prev) => [product, ...prev])
    const newActivity = { id: `act_${Date.now()}`, client: "Système", type: "Nouveau Produit", amount: product.name, status: "Succès", date: "A l'instant", cost: 0 }
    setActivities(prev => [newActivity, ...prev])

    const { purchasePrice, unit, ...rest } = product
    await supabase.from('products').insert([{ ...rest, purchaseprice: purchasePrice }])
    await supabase.from('activities').insert([newActivity])
  }

  const updateClient = async (updated: Client) => {
    setClients((prev) => prev.map(c => c.id === updated.id ? updated : c))
    const { lastActivity, ...rest } = updated
    await supabase.from('clients').update({ ...rest, lastactivity: lastActivity }).eq('id', updated.id)
  }
  
  const updateProduct = async (updated: Product) => {
    setProducts((prev) => prev.map(p => p.id === updated.id ? updated : p))
    const { purchasePrice, unit, ...rest } = updated
    await supabase.from('products').update({ ...rest, purchaseprice: purchasePrice }).eq('id', updated.id)
  }
  
  const updateSale = async (updated: Sale) => {
    setSales((prev) => prev.map(s => s.id === updated.id ? updated : s))
    await supabase.from('sales').update({ status: updated.status, paymentMethod: updated.paymentMethod }).eq('id', updated.id)
  }

  const deleteClient = async (id: string) => {
    setClients((prev) => prev.filter(c => c.id !== id))
    await supabase.from('clients').delete().eq('id', id)
  }
  
  const deleteProduct = async (id: string) => {
    setProducts((prev) => prev.filter(p => p.id !== id))
    await supabase.from('products').delete().eq('id', id)
  }
  
  const deleteSale = async (id: string) => {
    setSales((prev) => prev.filter(s => s.id !== id))
    await supabase.from('sales').delete().eq('id', id)
  }

  const recordSale = async (sale: Sale) => {
    setSales(prev => [sale, ...prev])
    
    // Save to DB first
    const saleData = { id: sale.id, client: sale.client, clientId: sale.clientId, amount: sale.amount, status: sale.status, date: sale.date, paymentMethod: sale.paymentMethod }
    await supabase.from('sales').insert([saleData])
    
    if (sale.items.length > 0) {
      const itemsToInsert = sale.items.map(i => ({ id: `si_${Date.now()}_${Math.random().toString().slice(2, 7)}`, saleId: sale.id, productId: i.productId, name: i.name, quantity: i.quantity, unitPrice: i.unitPrice, total: i.total }))
      await supabase.from('sale_items').insert(itemsToInsert)
    }

    if (sale.status === "Brouillon") {
      return // On s'arrête là pour les brouillons (pas d'impact stock/dette)
    }

    const updatedProducts = products.map(p => {
      const item = sale.items.find(i => i.productId === p.id)
      if (item) {
        const newStock = Math.max(0, p.stock - item.quantity)
        return { ...p, stock: newStock, status: newStock === 0 ? "Rupture" : newStock < 10 ? "Stock faible" : "Disponible" }
      }
      return p
    })
    setProducts(updatedProducts)
    
    if (sale.items.length > 0) {
      for (const item of sale.items) {
        const prod = updatedProducts.find(p => p.id === item.productId)
        if (prod) {
          await supabase.from('products').update({ stock: prod.stock, status: prod.status }).eq('id', prod.id)
        }
      }
    }

    const existingClient = clients.find(c => c.id === sale.clientId)
    if (existingClient) {
      const cDebt = sale.paymentMethod === "Crédit" ? existingClient.debt + sale.amount : existingClient.debt
      setClients(prev => prev.map(c => c.id === sale.clientId ? { ...c, lastActivity: "A l'instant", debt: cDebt } : c))
      await supabase.from('clients').update({ lastactivity: "A l'instant", debt: cDebt }).eq('id', existingClient.id)
    } else if (sale.clientId) {
      setClients(prev => [{ id: sale.clientId, name: sale.client, phone: "Non renseigné", debt: sale.paymentMethod === "Crédit" ? sale.amount : 0, lastActivity: "A l'instant", avatar: sale.client.slice(0,2).toUpperCase() }, ...prev])
      await supabase.from('clients').insert([{ id: sale.clientId, name: sale.client, phone: "Non renseigné", debt: sale.paymentMethod === "Crédit" ? sale.amount : 0, lastactivity: "A l'instant", avatar: sale.client.slice(0,2).toUpperCase() }])
    }

    const newActivity: Activity = {
      id: `act_${Date.now()}`,
      client: sale.client,
      type: sale.paymentMethod === "Crédit" ? "Dette" : "Vente",
      amount: `${sale.amount.toLocaleString("fr-FR")} FCFA`,
      status: sale.paymentMethod === "Crédit" ? "En attente" : "Payé",
      date: "A l'instant"
    }
    setActivities(prev => [newActivity, ...prev])
    await supabase.from('activities').insert([newActivity])
  }

  const validateDraft = async (saleId: string) => {
    const sale = sales.find(s => s.id === saleId)
    if (!sale || sale.status !== "Brouillon") return

    const newStatus = sale.paymentMethod === "Crédit" ? "En attente" : "Payé"
    
    setSales(prev => prev.map(s => s.id === saleId ? { ...s, status: newStatus } : s))
    await supabase.from('sales').update({ status: newStatus }).eq('id', saleId)

    const updatedProducts = products.map(p => {
      const item = sale.items.find(i => i.productId === p.id)
      if (item) {
        const newStock = Math.max(0, p.stock - item.quantity)
        return { ...p, stock: newStock, status: newStock === 0 ? "Rupture" : newStock < 10 ? "Stock faible" : "Disponible" }
      }
      return p
    })
    setProducts(updatedProducts)
    
    if (sale.items.length > 0) {
      for (const item of sale.items) {
        const prod = updatedProducts.find(p => p.id === item.productId)
        if (prod) {
          await supabase.from('products').update({ stock: prod.stock, status: prod.status }).eq('id', prod.id)
        }
      }
    }

    const existingClient = clients.find(c => c.id === sale.clientId)
    if (existingClient) {
      const cDebt = sale.paymentMethod === "Crédit" ? existingClient.debt + sale.amount : existingClient.debt
      setClients(prev => prev.map(c => c.id === sale.clientId ? { ...c, lastActivity: "A l'instant", debt: cDebt } : c))
      await supabase.from('clients').update({ lastactivity: "A l'instant", debt: cDebt }).eq('id', existingClient.id)
    }

    const newActivity: Activity = {
      id: `act_${Date.now()}`,
      client: sale.client,
      type: sale.paymentMethod === "Crédit" ? "Dette" : "Vente",
      amount: `${sale.amount.toLocaleString("fr-FR")} FCFA`,
      status: newStatus,
      date: "A l'instant"
    }
    setActivities(prev => [newActivity, ...prev])
    await supabase.from('activities').insert([newActivity])
  }

  const cancelSale = async (saleId: string) => {
    const sale = sales.find(s => s.id === saleId)
    if (!sale || sale.status === "Brouillon" || sale.status === "Annulée") return

    setSales(prev => prev.map(s => s.id === saleId ? { ...s, status: "Annulée" } : s))
    await supabase.from('sales').update({ status: "Annulée" }).eq('id', saleId)

    const updatedProducts = products.map(p => {
      const item = sale.items.find(i => i.productId === p.id)
      if (item) {
        const newStock = p.stock + item.quantity
        return { ...p, stock: newStock, status: newStock === 0 ? "Rupture" : newStock < 10 ? "Stock faible" : "Disponible" }
      }
      return p
    })
    setProducts(updatedProducts)
    
    if (sale.items.length > 0) {
      for (const item of sale.items) {
        const prod = updatedProducts.find(p => p.id === item.productId)
        if (prod) {
          await supabase.from('products').update({ stock: prod.stock, status: prod.status }).eq('id', prod.id)
        }
      }
    }

    if (sale.paymentMethod === "Crédit") {
      const existingClient = clients.find(c => c.id === sale.clientId)
      if (existingClient) {
        const cDebt = Math.max(0, existingClient.debt - sale.amount)
        setClients(prev => prev.map(c => c.id === sale.clientId ? { ...c, lastActivity: "A l'instant", debt: cDebt } : c))
        await supabase.from('clients').update({ lastactivity: "A l'instant", debt: cDebt }).eq('id', existingClient.id)
      }
    }

    const newActivity: Activity = {
      id: `act_${Date.now()}`,
      client: sale.client,
      type: "Annulation",
      amount: `${sale.amount.toLocaleString("fr-FR")} FCFA`,
      status: "Annulée",
      date: "A l'instant"
    }
    setActivities(prev => [newActivity, ...prev])
    await supabase.from('activities').insert([newActivity])
  }

  const repayDebt = async (clientId: string, amount: number) => {
    let clientName = "Client"
    let newDebt = 0
    setClients(prev => prev.map(c => {
      if (c.id === clientId) {
        clientName = c.name
        newDebt = Math.max(0, c.debt - amount)
        return { ...c, debt: newDebt, lastActivity: "A l'instant" }
      }
      return c
    }))
    
    const newActivity: Activity = {
      id: `act_${Date.now()}`,
      client: clientName,
      type: "Remboursement",
      amount: `${amount.toLocaleString("fr-FR")} FCFA`,
      status: "Payé",
      date: "A l'instant"
    }
    setActivities(prev => [newActivity, ...prev])

    await supabase.from('clients').update({ debt: newDebt, lastactivity: "A l'instant" }).eq('id', clientId)
    await supabase.from('activities').insert([newActivity])
  }

  const restockProduct = async (productId: string, quantity: number) => {
    let productName = "Produit"
    let cost = 0
    let newStock = 0
    let newStatus = "Disponible"
    
    setProducts(prev => prev.map(p => {
      if (p.id === productId) {
        productName = p.name
        cost = p.purchasePrice * quantity
        newStock = p.stock + quantity
        newStatus = newStock === 0 ? "Rupture" : newStock < 10 ? "Stock faible" : "Disponible"
        return { ...p, stock: newStock, status: newStatus }
      }
      return p
    }))

    const newActivity: Activity = {
      id: `act_${Date.now()}`,
      client: "Système",
      type: "Réapprovisionnement",
      amount: `+${quantity} ${productName}`,
      status: "Succès",
      date: "A l'instant",
      cost
    }
    setActivities(prev => [newActivity, ...prev])

    await supabase.from('products').update({ stock: newStock, status: newStatus }).eq('id', productId)
    await supabase.from('activities').insert([newActivity])
  }

  const logout = async () => {
    await supabase.auth.signOut()
    setClients([])
    setProducts([])
    setSales([])
    setActivities([])
    setSettings(defaultSettings)
    window.location.href = "/login"
  }

  return (
    <StoreContext.Provider value={{ 
      userEmail, clients, products, sales, activities, settings,
      updateSettings, addClient, updateClient, addProduct, updateProduct, 
      updateSale, deleteClient, deleteProduct, deleteSale, recordSale, 
      validateDraft, cancelSale, repayDebt, restockProduct, logout
    }}>
      {children}
    </StoreContext.Provider>
  )
}

export function useAppStore() {
  const context = useContext(StoreContext)
  if (context === undefined) {
    throw new Error("useAppStore must be used within a StoreProvider")
  }
  return context
}

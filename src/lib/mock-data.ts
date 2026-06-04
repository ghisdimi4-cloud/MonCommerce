export type Activity = {
  id: string
  client: string
  type: string
  amount: string
  status: string
  date: string
  cost?: number
}

export type Client = {
  id: string
  name: string
  phone: string
  debt: number
  lastActivity: string
  avatar: string
}

export type Product = {
  id: string
  name: string
  price: number
  purchasePrice: number
  stock: number
  category: string
  status: string
  image: string
}

export type SaleItem = {
  productId: string
  name: string
  quantity: number
  unitPrice: number
  total: number
}

export type Sale = {
  id: string
  client: string
  clientId: string
  amount: number
  status: string
  date: string
  paymentMethod: string
  items: SaleItem[]
}

export const mockClients: Client[] = Array.from({ length: 25 }).map((_, i) => ({
  id: `c${i + 1}`,
  name: `Client ${i + 1}`,
  phone: `+225 0${Math.floor(Math.random() * 9)} ${Math.floor(Math.random() * 90 + 10)} ${Math.floor(Math.random() * 90 + 10)} ${Math.floor(Math.random() * 90 + 10)}`,
  debt: Math.random() > 0.7 ? Math.floor(Math.random() * 50) * 1000 : 0,
  lastActivity: `${Math.floor(Math.random() * 28 + 1)}/03/2026`,
  avatar: `C${i + 1}`.slice(0, 2),
}))

// Override some with realistic names
mockClients[0] = { id: "c1", name: "Jean Dupont", phone: "+225 01 02 03 04 05", debt: 0, lastActivity: "Auj, 14:30", avatar: "J" }
mockClients[1] = { id: "c2", name: "Marie Claire", phone: "+225 05 06 07 08 09", debt: 25000, lastActivity: "Auj, 09:15", avatar: "M" }
mockClients[2] = { id: "c3", name: "Paul Koffi", phone: "+225 07 08 09 10 11", debt: 150000, lastActivity: "Hier, 16:45", avatar: "P" }
mockClients[3] = { id: "c4", name: "Fatou Diop", phone: "+221 77 123 45 67", debt: 15000, lastActivity: "10/03/2026", avatar: "F" }
mockClients[4] = { id: "c5", name: "Client Anonyme", phone: "Non renseigné", debt: 0, lastActivity: "12/03/2026", avatar: "C" }
mockClients[5] = { id: "c6", name: "Aminata Diallo", phone: "+225 08 11 22 33", debt: 5000, lastActivity: "09/03/2026", avatar: "A" }

const categories = ["Alimentation", "Cosmétique", "Mode", "Électronique", "Maison"]
export const mockProducts: Product[] = Array.from({ length: 25 }).map((_, i) => {
  const stock = Math.floor(Math.random() * 50)
  return {
    id: `p${i + 1}`,
    name: `Produit Test ${i + 1}`,
    price: Math.floor(Math.random() * 20 + 1) * 500,
    purchasePrice: Math.floor(Math.random() * 10 + 1) * 300,
    stock,
    category: categories[Math.floor(Math.random() * categories.length)],
    status: stock === 0 ? "Rupture" : stock < 10 ? "Stock faible" : "Disponible",
    image: ""
  }
})

// Override some realistic products
mockProducts[0] = { id: "p1", name: "Savon Noir", price: 1500, purchasePrice: 1000, stock: 15, category: "Cosmétique", status: "Disponible", image: "" }
mockProducts[1] = { id: "p2", name: "Huile de Palme (1L)", price: 2500, purchasePrice: 1800, stock: 3, category: "Alimentation", status: "Stock faible", image: "" }
mockProducts[2] = { id: "p3", name: "Riz Parfumé (25kg)", price: 18000, purchasePrice: 15000, stock: 0, category: "Alimentation", status: "Rupture", image: "" }
mockProducts[3] = { id: "p4", name: "Tissu Wax", price: 6000, purchasePrice: 4000, stock: 45, category: "Mode", status: "Disponible", image: "" }
mockProducts[4] = { id: "p5", name: "Beurre de Karité", price: 3000, purchasePrice: 2000, stock: 20, category: "Cosmétique", status: "Disponible", image: "" }

export const mockSales: Sale[] = Array.from({ length: 25 }).map((_, i) => {
  const p1 = mockProducts[Math.floor(Math.random() * mockProducts.length)]
  const p2 = mockProducts[Math.floor(Math.random() * mockProducts.length)]
  const q1 = Math.floor(Math.random() * 5) + 1
  const q2 = Math.floor(Math.random() * 3) + 1
  
  return {
    id: `v${i + 5}`, // start after manual overrides
    client: mockClients[Math.floor(Math.random() * mockClients.length)].name,
    clientId: mockClients[Math.floor(Math.random() * mockClients.length)].id,
    amount: (p1.price * q1) + (p2.price * q2),
    status: Math.random() > 0.8 ? "Retard" : Math.random() > 0.6 ? "En attente" : "Payé",
    date: `${Math.floor(Math.random() * 28 + 1).toString().padStart(2, '0')}/03/2026`,
    paymentMethod: ["Cash", "Mobile Money", "Carte", "Crédit"][Math.floor(Math.random() * 4)],
    items: [
      { productId: p1.id, name: p1.name, quantity: q1, unitPrice: p1.price, total: p1.price * q1 },
      { productId: p2.id, name: p2.name, quantity: q2, unitPrice: p2.price, total: p2.price * q2 }
    ]
  }
})

// Insert overrides at beginning
mockSales.unshift(
  { 
    id: "v1", 
    client: "Jean Dupont", 
    clientId: "c1",
    amount: 18000, 
    status: "Payé", 
    date: "15/03/2026", 
    paymentMethod: "Mobile Money",
    items: [
      { productId: "p3", name: "Riz Parfumé (25kg)", quantity: 1, unitPrice: 18000, total: 18000 }
    ]
  },
  { 
    id: "v2", 
    client: "Marie Claire", 
    clientId: "c2",
    amount: 25000, 
    status: "En attente", 
    date: "14/03/2026", 
    paymentMethod: "Crédit",
    items: [
      { productId: "p4", name: "Tissu Wax", quantity: 4, unitPrice: 6000, total: 24000 },
      { productId: "p1", name: "Savon Noir", quantity: 1, unitPrice: 1000, total: 1000 }
    ]
  },
  { 
    id: "v3", 
    client: "Client Anonyme", 
    clientId: "c5",
    amount: 4500, 
    status: "Payé", 
    date: "14/03/2026", 
    paymentMethod: "Cash",
    items: [
      { productId: "p1", name: "Savon Noir", quantity: 3, unitPrice: 1500, total: 4500 }
    ]
  },
  { 
    id: "v4", 
    client: "Paul Koffi", 
    clientId: "c3",
    amount: 150000, 
    status: "Retard", 
    date: "10/03/2026", 
    paymentMethod: "Crédit",
    items: [
      { productId: "p3", name: "Riz Parfumé (25kg)", quantity: 5, unitPrice: 18000, total: 90000 },
      { productId: "p4", name: "Tissu Wax", quantity: 10, unitPrice: 6000, total: 60000 }
    ]
  }
)

export const mockActivities: Activity[] = [
  { id: "a1", client: "Jean Dupont", type: "Vente", amount: "18 000 FCFA", status: "Payé", date: "Auj, 14:30" },
  { id: "a2", client: "Marie Claire", type: "Dette", amount: "25 000 FCFA", status: "En attente", date: "Auj, 09:15" },
  { id: "a3", client: "Client Anonyme", type: "Vente", amount: "4 500 FCFA", status: "Payé", date: "Hier, 16:45" },
  { id: "a4", client: "Paul Koffi", type: "Dette", amount: "150 000 FCFA", status: "Retard", date: "10/03/2026" },
]

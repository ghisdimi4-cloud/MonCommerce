"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, Plus, MoreHorizontal, Eye, Edit, Trash2, UserPlus, X, Save, MessageCircle, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { useAppStore } from "@/lib/store"
import { generateAccountingReport } from "@/lib/excel-export"
import { Pagination } from "@/components/ui/pagination"
import { useToast } from "@/hooks/use-toast"
import { FileDown } from "lucide-react"

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
}

const item: any = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
}

export default function ClientsPage() {
  const store = useAppStore()
  const { clients, sales, products, settings, addClient, updateClient } = store
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [selectedClient, setSelectedClient] = useState<any>(null)

  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10
  const { toast } = useToast()

  const [newClient, setNewClient] = useState({
    name: "", phone: "", debt: ""
  })
  
  const [editClientForm, setEditClientForm] = useState({
    id: "", name: "", phone: "", debt: ""
  })

  const filteredClients = clients.filter((client) => {
    if (!searchTerm) return true
    return client.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
           client.phone.includes(searchTerm) ||
           client.id.toLowerCase().includes(searchTerm.toLowerCase())
  })

  const totalPages = Math.ceil(filteredClients.length / itemsPerPage)
  const currentClients = filteredClients.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const handleSave = () => {
    if (!newClient.name || !newClient.phone) {
      toast({ title: "Erreur", description: "Veuillez remplir le nom et le téléphone", type: "error" })
      return
    }

    addClient({
      id: `c${Date.now()}`,
      name: newClient.name,
      phone: newClient.phone,
      debt: parseInt(newClient.debt) || 0,
      lastActivity: "À l'instant",
      avatar: newClient.name.substring(0, 2).toUpperCase()
    })

    setIsModalOpen(false)
    setNewClient({ name: "", phone: "", debt: "" })
    
    toast({
      title: "Client enregistré",
      description: "Le client a été ajouté avec succès à votre base de données.",
      type: "success"
    })
  }

  const handleExport = async () => {
    toast({
      title: "Génération du rapport",
      description: "Préparation du document Excel en cours...",
      type: "success"
    })
    try {
      await generateAccountingReport({ sales, clients, products, settings })
      toast({
        title: "Export réussi",
        description: "Le rapport financier a été téléchargé avec succès.",
        type: "success"
      })
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la création de l'export.",
        type: "error"
      })
    }
  }

  const handleFeatureDev = () => {
    toast({
      title: "Fonctionnalité Premium",
      description: "Cette action sera disponible dans la prochaine mise à jour.",
      type: "warning"
    })
  }

  const handleWhatsApp = (phone: string) => {
    if (phone && phone !== "Non renseigné") {
      const formattedPhone = phone.replace(/[^0-9]/g, '')
      window.open(`https://wa.me/${formattedPhone}`, '_blank')
    } else {
      toast({
        title: "Numéro invalide",
        description: "Ce client n'a pas de numéro de téléphone valide.",
        type: "error"
      })
    }
  }

  const openEditModal = (client: any) => {
    setEditClientForm({
      id: client.id,
      name: client.name,
      phone: client.phone,
      debt: client.debt.toString()
    })
    setIsEditModalOpen(true)
  }

  const handleEditSave = () => {
    if (!editClientForm.name) {
      toast({ title: "Erreur", description: "Le nom est requis.", type: "error" })
      return
    }
    
    const clientToUpdate = clients.find(c => c.id === editClientForm.id)
    if (clientToUpdate) {
      updateClient({
        ...clientToUpdate,
        name: editClientForm.name,
        phone: editClientForm.phone,
        debt: parseInt(editClientForm.debt) || 0
      })
    }

    setIsEditModalOpen(false)
    toast({
      title: "Client mis à jour",
      description: "Les informations du client ont été modifiées avec succès.",
      type: "success"
    })
  }

  const openViewModal = (client: any) => {
    setSelectedClient(client)
    setIsViewModalOpen(true)
  }

  return (
    <div className="relative">
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="space-y-6 md:space-y-8 pb-20 relative z-10"
      >
        {/* Header */}
        <motion.div variants={item} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Clients</h2>
            <p className="text-slate-500 mt-1">Gérez vos clients, historiques et dettes.</p>
          </div>
          <div className="flex items-center gap-3">
            <Button onClick={handleExport} variant="outline" className="glass-card text-slate-700 border-slate-200 hover:bg-slate-50 shadow-sm h-10 px-4 rounded-xl">
              <FileDown className="h-4 w-4 mr-2" />
              Exporter
            </Button>
            <Button 
              onClick={() => setIsModalOpen(true)}
              className="bg-primary-500 hover:bg-primary-600 text-white shadow-primary-glow border-0 h-10 px-4 rounded-xl hover:-translate-y-0.5 transition-all duration-300"
            >
              <Plus className="h-4 w-4 mr-2" />
              Nouveau Client
            </Button>
          </div>
        </motion.div>

        {/* Search */}
        <motion.div variants={item} className="flex flex-col md:flex-row gap-4 items-center">
          <div className="relative w-full md:max-w-md group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-primary-500 transition-colors" />
            <Input 
              placeholder="🔍 Rechercher un client, un numéro..." 
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value)
                setCurrentPage(1)
              }}
              className="pl-10 h-12 bg-white/60 backdrop-blur-md border-slate-200/60 focus-visible:ring-primary-500/30 rounded-xl shadow-sm text-base transition-all"
            />
          </div>
        </motion.div>

        {/* Data Table */}
        <motion.div variants={item}>
          <Card className="glass-card border-0 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-slate-500 uppercase bg-slate-50/50 border-b border-slate-100/50">
                  <tr>
                    <th className="px-6 py-4 font-semibold">Client</th>
                    <th className="px-6 py-4 font-semibold">Contact</th>
                    <th className="px-6 py-4 font-semibold text-center">Achats</th>
                    <th className="px-6 py-4 font-semibold text-right">Dette Totale</th>
                    <th className="px-6 py-4 font-semibold">Dernière activité</th>
                    <th className="px-6 py-4 font-semibold text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100/50">
                  {currentClients.map((client) => (
                    <tr key={client.id} className="group hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 text-white flex items-center justify-center font-bold shadow-sm shadow-primary-500/20 group-hover:scale-105 transition-transform shrink-0">
                            {client.avatar}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-900 group-hover:text-primary-600 transition-colors">{client.name}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-600 font-medium">
                        {client.phone}
                      </td>
                      <td className="px-6 py-4 text-center font-semibold text-slate-700">
                        {Math.floor(Math.random() * 10) + 1}
                      </td>
                      <td className="px-6 py-4 text-right">
                        {client.debt > 0 ? (
                          <div className="inline-flex items-center gap-1.5 bg-danger/10 text-danger px-2.5 py-1 rounded-lg">
                            <AlertCircle className="h-3.5 w-3.5" />
                            <span className="font-bold">{client.debt.toLocaleString('fr-FR')} FCFA</span>
                          </div>
                        ) : (
                          <span className="text-slate-400 font-medium">Aucune dette</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-slate-500 font-medium">
                        {client.lastActivity}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-center items-center gap-2">
                          <Button onClick={() => handleWhatsApp(client.phone)} variant="ghost" size="icon" className="h-8 w-8 text-green-600 hover:bg-green-50 rounded-lg transition-colors" title="WhatsApp">
                            <MessageCircle className="h-4 w-4" />
                          </Button>
                          <Button onClick={() => openViewModal(client)} variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button onClick={() => openEditModal(client)} variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Pagination 
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              totalItems={filteredClients.length}
              itemsPerPage={itemsPerPage}
            />
          </Card>
        </motion.div>
      </motion.div>

      {/* Premium Modal for Add Client */}
      <AnimatePresence>
        {isModalOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 24 }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg z-50 p-4"
            >
              <Card className="glass-card border-0 shadow-2xl shadow-primary-900/10 overflow-hidden">
                <div className="bg-white/80 border-b border-slate-100 px-6 py-4 flex justify-between items-center">
                  <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
                    <UserPlus className="h-5 w-5 text-primary-500" />
                    Nouveau Client
                  </h3>
                  <Button variant="ghost" size="icon" onClick={() => setIsModalOpen(false)} className="rounded-full h-8 w-8 hover:bg-slate-100">
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <CardContent className="p-6 space-y-4">
                  
                  <div className="space-y-2">
                    <Label>Nom complet</Label>
                    <Input 
                      placeholder="Ex: Jean Dupont" 
                      value={newClient.name}
                      onChange={e => setNewClient({...newClient, name: e.target.value})}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Téléphone</Label>
                      <Input 
                        placeholder="+225 01 02 03 04" 
                        value={newClient.phone}
                        onChange={e => setNewClient({...newClient, phone: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>WhatsApp</Label>
                      <Input placeholder="Idem téléphone" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Adresse</Label>
                    <Input placeholder="Quartier, Ville..." />
                  </div>

                  <div className="space-y-2">
                    <Label>Notes (Optionnel)</Label>
                    <textarea 
                      placeholder="Préférences, remarques..."
                      className="flex min-h-[80px] w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/30 transition-all duration-200 resize-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Dette initiale (FCFA)</Label>
                    <Input 
                      type="number" 
                      placeholder="0" 
                      value={newClient.debt}
                      onChange={e => setNewClient({...newClient, debt: e.target.value})}
                    />
                  </div>

                  <div className="pt-4 flex gap-3">
                    <Button variant="outline" className="flex-1 rounded-xl glass-card" onClick={() => setIsModalOpen(false)}>
                      Annuler
                    </Button>
                    <Button onClick={handleSave} className="flex-1 rounded-xl bg-primary-500 hover:bg-primary-600 text-white shadow-primary-glow border-0">
                      <Save className="h-4 w-4 mr-2" />
                      Enregistrer
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Edit Client Modal */}
      <AnimatePresence>
        {isEditModalOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsEditModalOpen(false)}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 24 }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg z-50 p-4"
            >
              <Card className="glass-card border-0 shadow-2xl shadow-primary-900/10 overflow-hidden">
                <div className="bg-white/80 border-b border-slate-100 px-6 py-4 flex justify-between items-center">
                  <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
                    <Edit className="h-5 w-5 text-primary-500" />
                    Modifier Client
                  </h3>
                  <Button variant="ghost" size="icon" onClick={() => setIsEditModalOpen(false)} className="rounded-full h-8 w-8 hover:bg-slate-100">
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <CardContent className="p-6 space-y-4">
                  
                  <div className="space-y-2">
                    <Label>Nom complet</Label>
                    <Input 
                      value={editClientForm.name}
                      onChange={e => setEditClientForm({...editClientForm, name: e.target.value})}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Téléphone</Label>
                      <Input 
                        value={editClientForm.phone}
                        onChange={e => setEditClientForm({...editClientForm, phone: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Dette (FCFA)</Label>
                      <Input 
                        type="number" 
                        value={editClientForm.debt}
                        onChange={e => setEditClientForm({...editClientForm, debt: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="pt-4 flex gap-3">
                    <Button variant="outline" className="flex-1 rounded-xl glass-card" onClick={() => setIsEditModalOpen(false)}>
                      Annuler
                    </Button>
                    <Button onClick={handleEditSave} className="flex-1 rounded-xl bg-primary-500 hover:bg-primary-600 text-white shadow-primary-glow border-0">
                      <Save className="h-4 w-4 mr-2" />
                      Enregistrer
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* View Client Modal */}
      <AnimatePresence>
        {isViewModalOpen && selectedClient && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsViewModalOpen(false)}
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
                    Détails Client
                  </h3>
                  <Button variant="ghost" size="icon" onClick={() => setIsViewModalOpen(false)} className="rounded-full h-8 w-8 hover:bg-slate-100">
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <CardContent className="p-6 space-y-4">
                  <div className="text-center pb-4">
                    <div className="h-16 w-16 mx-auto rounded-full bg-gradient-to-br from-primary-500 to-primary-600 text-white flex items-center justify-center font-bold text-2xl shadow-sm shadow-primary-500/20 mb-3">
                      {selectedClient.avatar}
                    </div>
                    <h4 className="font-bold text-xl text-slate-900">{selectedClient.name}</h4>
                    <p className="text-slate-500 text-sm">{selectedClient.phone}</p>
                  </div>
                  
                  <div className="bg-slate-50 rounded-xl p-4 space-y-3 text-sm border border-slate-100">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Dernière activité</span>
                      <span className="font-semibold text-slate-900">{selectedClient.lastActivity}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Dette en cours</span>
                      <span className={`font-semibold ${selectedClient.debt > 0 ? 'text-danger' : 'text-slate-900'}`}>{selectedClient.debt.toLocaleString('fr-FR')} FCFA</span>
                    </div>
                  </div>
                  
                  <Button onClick={() => setIsViewModalOpen(false)} className="w-full mt-2 bg-primary-500 hover:bg-primary-600 text-white rounded-xl shadow-primary-glow">
                    Fermer
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

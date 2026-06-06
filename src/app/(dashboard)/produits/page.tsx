"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, Plus, MoreHorizontal, Eye, Edit, Trash2, Package, Image as ImageIcon, X, Save, PackagePlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { useAppStore } from "@/lib/store"
import { generateAccountingReport } from "@/lib/excel-export"
import { CustomDialog } from "@/components/ui/custom-dialog"
import { Pagination } from "@/components/ui/pagination"
import { useToast } from "@/hooks/use-toast"

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
}

const item: any = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
}

const getProductImageUrl = (product: any) => {
  if (product.image) return product.image;
  
  const name = (product.name || "").toLowerCase();
  const category = (product.category || "").toLowerCase();
  
  // 1. PACKS & BOUTEILLES (Boisson, bouteille, cannette, eau, jus...)
  // Placé en premier pour que "Boisson sucrerie" soit identifié comme boisson avant "sucre"
  if (/(pack|boisson|bouteille|cannette|canette|eau|jus|bière|liqueur|coca|soda|vin)/.test(name)) {
    return "https://images.unsplash.com/photo-1606854428728-5fe3eea23475?w=200&h=200&fit=crop";
  }

  // 2. SACS (Maïs, sucre, riz, farine...)
  // Utilisation d'espaces ou début/fin de chaîne pour éviter "sucrerie"
  if (/(^|\s)(sac|maïs|mais|sucre|riz|farine|blé|haricot|mil|sorgho|ciment)(\s|$)/.test(name)) {
    return "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=200&h=200&fit=crop";
  }
  
  // 3. CARTONS (Tomates, spaghetti, pâtes, savon, boîte...)
  if (/(carton|tomate|spaghetti|pâte|savon|boîte|conserve|lait)/.test(name) && !/(lait de beauté)/.test(name)) {
    return "https://images.unsplash.com/photo-1587293852726-70cdb56c2866?w=200&h=200&fit=crop";
  }
  
  // 4. Cosmétique (Pommade, parfum, etc.)
  if (category.includes('cosmétique') || /(crème|pommade|parfum|beauté|lotion)/.test(name)) {
    return "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=200&h=200&fit=crop";
  }
  
  // 5. Défaut / Autres conditionnements (Boîte générique propre)
  return "https://images.unsplash.com/photo-1605600659873-d808a1d8f1d3?w=200&h=200&fit=crop";
}

export default function ProduitsPage() {
  const store = useAppStore()
  const { products, sales, clients, settings, addProduct, restockProduct, updateProduct, deleteProduct } = store
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<any>(null)
  
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10
  const { toast } = useToast()

  const [newProduct, setNewProduct] = useState({
    name: "", category: "Alimentation", price: "", purchasePrice: "", stock: ""
  })
  
  const [editProductForm, setEditProductForm] = useState({
    id: "", name: "", category: "", price: "", purchasePrice: "", stock: ""
  })

  const [dialogState, setDialogState] = useState({
    isOpen: false,
    type: 'confirm' as 'confirm' | 'prompt',
    title: '',
    description: '',
    variant: 'info' as 'info' | 'danger' | 'success',
    promptPlaceholder: '',
    action: (val?: string) => {}
  })

  const openDialog = (options: any) => setDialogState({ ...dialogState, ...options, isOpen: true })
  const closeDialog = () => setDialogState({ ...dialogState, isOpen: false })

  const filteredProducts = products.filter((product) => {
    if (!searchTerm) return true
    return product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
           product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
           product.id.toLowerCase().includes(searchTerm.toLowerCase())
  })

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage)
  const currentProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const handleSave = () => {
    if (!newProduct.name || !newProduct.price || !newProduct.stock) {
      toast({ title: "Erreur", description: "Veuillez remplir les champs requis", type: "error" })
      return
    }

    addProduct({
      id: `p${Date.now()}`,
      name: newProduct.name,
      category: newProduct.category,
      price: parseInt(newProduct.price),
      purchasePrice: parseInt(newProduct.purchasePrice) || 0,
      stock: parseInt(newProduct.stock),
      status: parseInt(newProduct.stock) > 10 ? "Disponible" : parseInt(newProduct.stock) > 0 ? "Stock faible" : "Rupture",
      image: ""
    })

    setIsModalOpen(false)
    setNewProduct({ name: "", category: "Alimentation", price: "", purchasePrice: "", stock: "" })
    
    toast({
      title: "Produit enregistré",
      description: "Le produit a été ajouté à votre catalogue avec succès.",
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

  const handleDelete = (id: string, name: string) => {
    openDialog({
      type: 'confirm',
      variant: 'danger',
      title: 'Supprimer le produit',
      description: `Voulez-vous vraiment supprimer le produit "${name}" ? Cette action est irréversible.`,
      action: () => {
        deleteProduct(id)
        toast({
          title: "Produit supprimé",
          description: `Le produit "${name}" a été retiré.`,
          type: "success"
        })
      }
    })
  }

  const openEditModal = (product: any) => {
    setEditProductForm({
      id: product.id,
      name: product.name,
      category: product.category,
      price: product.price.toString(),
      purchasePrice: (product.purchasePrice || 0).toString(),
      stock: product.stock.toString()
    })
    setIsEditModalOpen(true)
  }

  const handleEditSave = () => {
    if (!editProductForm.name || !editProductForm.price || !editProductForm.stock) {
      toast({ title: "Erreur", description: "Veuillez remplir les champs requis", type: "error" })
      return
    }

    updateProduct({
      id: editProductForm.id,
      name: editProductForm.name,
      category: editProductForm.category,
      price: parseInt(editProductForm.price),
      purchasePrice: parseInt(editProductForm.purchasePrice) || 0,
      stock: parseInt(editProductForm.stock),
      status: parseInt(editProductForm.stock) > 10 ? "Disponible" : parseInt(editProductForm.stock) > 0 ? "Stock faible" : "Rupture",
      image: ""
    })

    setIsEditModalOpen(false)
    toast({
      title: "Produit modifié",
      description: "Les modifications ont été enregistrées.",
      type: "success"
    })
  }

  const openViewModal = (product: any) => {
    setSelectedProduct(product)
    setIsViewModalOpen(true)
  }

  const handleRestock = (productId: string, productName: string) => {
    openDialog({
      type: 'prompt',
      variant: 'success',
      title: 'Réapprovisionnement',
      description: `Entrez la quantité à ajouter pour "${productName}" :`,
      promptPlaceholder: "Ex: 10",
      action: (val?: string) => {
        if (val && !isNaN(parseInt(val))) {
          restockProduct(productId, parseInt(val))
          toast({
            title: "Stock mis à jour",
            description: `Le stock de "${productName}" a été réapprovisionné.`,
            type: "success"
          })
        }
      }
    })
  }
  
  const getStockBadge = (status: string) => {
    switch (status) {
      case "Disponible":
        return <Badge className="bg-success/10 text-success border-success/20">Disponible</Badge>
      case "Stock faible":
        return <Badge className="bg-warning/10 text-warning border-warning/20">Stock faible</Badge>
      case "Rupture":
        return <Badge className="bg-danger/10 text-danger border-danger/20">Rupture</Badge>
      default:
        return <Badge className="bg-slate-100 text-slate-600 border-slate-200">{status}</Badge>
    }
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
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Produits</h2>
            <p className="text-slate-500 mt-1">Gérez votre catalogue et vos stocks.</p>
          </div>
          <Button 
            onClick={() => setIsModalOpen(true)}
            className="bg-primary-500 hover:bg-primary-600 text-white shadow-primary-glow border-0 h-10 px-4 rounded-xl hover:-translate-y-0.5 transition-all duration-300"
          >
            <Plus className="h-4 w-4 mr-2" />
            Ajouter un produit
          </Button>
        </motion.div>

        {/* Search */}
        <motion.div variants={item} className="flex flex-col md:flex-row gap-4 items-center">
          <div className="relative w-full md:max-w-md group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-primary-500 transition-colors" />
            <Input 
              placeholder="🔍 Rechercher un produit, une catégorie..." 
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
                    <th className="px-6 py-4 font-semibold">Produit</th>
                    <th className="px-6 py-4 font-semibold">Catégorie</th>
                    <th className="px-6 py-4 font-semibold text-right">Prix Achat</th>
                    <th className="px-6 py-4 font-semibold text-right">Prix Vente</th>
                    <th className="px-6 py-4 font-semibold text-center">Stock</th>
                    <th className="px-6 py-4 font-semibold text-center">Statut</th>
                    <th className="px-6 py-4 font-semibold text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100/50">
                  {currentProducts.map((product) => (
                    <tr key={product.id} className="group hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-xl bg-slate-100 text-slate-400 flex items-center justify-center border border-slate-200/50 group-hover:scale-105 transition-transform shrink-0 overflow-hidden">
                            {product.image ? (
                              <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
                            ) : (
                              <img src={getProductImageUrl(product)} alt={product.name} className="h-full w-full object-cover" />
                            )}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-900 group-hover:text-primary-600 transition-colors">{product.name}</p>
                            <p className="text-xs text-slate-500">Réf: {product.id.toUpperCase()}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-600 font-medium">{product.category}</td>
                      <td className="px-6 py-4 text-right text-slate-500 font-medium">{product.purchasePrice?.toLocaleString('fr-FR')} FCFA</td>
                      <td className="px-6 py-4 text-right font-bold text-slate-900">{product.price.toLocaleString('fr-FR')} FCFA</td>
                      <td className="px-6 py-4 text-center font-semibold text-slate-700">{product.stock}</td>
                      <td className="px-6 py-4 text-center">
                        {getStockBadge(product.status)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-center items-center gap-2">
                          <Button onClick={() => handleRestock(product.id, product.name)} variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-success hover:bg-success/10 rounded-lg transition-colors" title="Réapprovisionner">
                            <PackagePlus className="h-4 w-4" />
                          </Button>
                          <Button onClick={() => openViewModal(product)} variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button onClick={() => openEditModal(product)} variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button onClick={() => handleDelete(product.id, product.name)} variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-danger hover:bg-danger/10 rounded-lg transition-colors">
                            <Trash2 className="h-4 w-4" />
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
              totalItems={filteredProducts.length}
              itemsPerPage={itemsPerPage}
            />
          </Card>
        </motion.div>
      </motion.div>

      {/* Premium Modal for Add Product */}
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
                    <Package className="h-5 w-5 text-primary-500" />
                    Nouveau Produit
                  </h3>
                  <Button variant="ghost" size="icon" onClick={() => setIsModalOpen(false)} className="rounded-full h-8 w-8 hover:bg-slate-100">
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <CardContent className="p-6 space-y-4 max-h-[80vh] overflow-y-auto no-scrollbar">
                  {/* Image Upload Mock */}
                  <div className="flex justify-center mb-6">
                    <div className="h-24 w-24 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 flex flex-col items-center justify-center text-slate-400 hover:text-primary-500 hover:border-primary-200 hover:bg-primary-50 transition-colors cursor-pointer">
                      <ImageIcon className="h-8 w-8 mb-1" />
                      <span className="text-[10px] font-semibold uppercase">Image</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Nom du produit</Label>
                    <Input 
                      placeholder="Ex: Riz Parfumé" 
                      value={newProduct.name}
                      onChange={e => setNewProduct({...newProduct, name: e.target.value})}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Prix de vente (FCFA)</Label>
                      <Input 
                        type="number" 
                        placeholder="0" 
                        value={newProduct.price}
                        onChange={e => setNewProduct({...newProduct, price: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Prix d'achat (Optionnel)</Label>
                      <Input 
                        type="number" 
                        placeholder="0" 
                        value={newProduct.purchasePrice}
                        onChange={e => setNewProduct({...newProduct, purchasePrice: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Stock initial</Label>
                      <Input 
                        type="number" 
                        placeholder="0" 
                        value={newProduct.stock}
                        onChange={e => setNewProduct({...newProduct, stock: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Catégorie</Label>
                      <select 
                        className="flex h-10 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/30"
                        value={newProduct.category}
                        onChange={e => setNewProduct({...newProduct, category: e.target.value})}
                      >
                        <option>Cosmétique</option>
                        <option>Alimentation</option>
                        <option>Mode</option>
                        <option>Électronique</option>
                      </select>
                    </div>
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

      {/* Edit Product Modal */}
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
                    Modifier Produit
                  </h3>
                  <Button variant="ghost" size="icon" onClick={() => setIsEditModalOpen(false)} className="rounded-full h-8 w-8 hover:bg-slate-100">
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <CardContent className="p-6 space-y-4 max-h-[80vh] overflow-y-auto no-scrollbar">
                  <div className="space-y-2">
                    <Label>Nom du produit</Label>
                    <Input 
                      value={editProductForm.name}
                      onChange={e => setEditProductForm({...editProductForm, name: e.target.value})}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Prix de vente (FCFA)</Label>
                      <Input 
                        type="number" 
                        value={editProductForm.price}
                        onChange={e => setEditProductForm({...editProductForm, price: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Prix d'achat (Optionnel)</Label>
                      <Input 
                        type="number" 
                        value={editProductForm.purchasePrice}
                        onChange={e => setEditProductForm({...editProductForm, purchasePrice: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Stock</Label>
                      <Input 
                        type="number" 
                        value={editProductForm.stock}
                        onChange={e => setEditProductForm({...editProductForm, stock: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Catégorie</Label>
                      <select 
                        className="flex h-10 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/30"
                        value={editProductForm.category}
                        onChange={e => setEditProductForm({...editProductForm, category: e.target.value})}
                      >
                        <option>Cosmétique</option>
                        <option>Alimentation</option>
                        <option>Mode</option>
                        <option>Électronique</option>
                      </select>
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

      {/* View Product Modal */}
      <AnimatePresence>
        {isViewModalOpen && selectedProduct && (
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
                    <Package className="h-5 w-5 text-primary-500" />
                    Détails
                  </h3>
                  <Button variant="ghost" size="icon" onClick={() => setIsViewModalOpen(false)} className="rounded-full h-8 w-8 hover:bg-slate-100">
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <CardContent className="p-6 space-y-4">
                  <div className="text-center pb-4">
                    <div className="h-16 w-16 mx-auto rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center border border-slate-200/50 mb-3 overflow-hidden">
                      {selectedProduct.image ? (
                        <img src={selectedProduct.image} alt={selectedProduct.name} className="h-full w-full object-cover" />
                      ) : (
                        <img src={getProductImageUrl(selectedProduct)} alt={selectedProduct.name} className="h-full w-full object-cover" />
                      )}
                    </div>
                    <h4 className="font-bold text-xl text-slate-900">{selectedProduct.name}</h4>
                    <p className="text-slate-500 text-sm">{selectedProduct.category}</p>
                    <div className="mt-2">{getStockBadge(selectedProduct.status)}</div>
                  </div>
                  
                  <div className="bg-slate-50 rounded-xl p-4 space-y-3 text-sm border border-slate-100">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Prix de vente</span>
                      <span className="font-semibold text-slate-900">{selectedProduct.price.toLocaleString('fr-FR')} FCFA</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Prix d'achat</span>
                      <span className="font-semibold text-slate-900">{selectedProduct.purchasePrice?.toLocaleString('fr-FR') || 0} FCFA</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Stock actuel</span>
                      <span className="font-semibold text-slate-900">{selectedProduct.stock} unités</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Marge brute</span>
                      <span className="font-semibold text-success">{((selectedProduct.price - (selectedProduct.purchasePrice || 0))).toLocaleString('fr-FR')} FCFA</span>
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

      <CustomDialog
        isOpen={dialogState.isOpen}
        onClose={closeDialog}
        onConfirm={dialogState.action}
        title={dialogState.title}
        description={dialogState.description}
        type={dialogState.type}
        variant={dialogState.variant}
        promptPlaceholder={dialogState.type === 'prompt' ? "Quantité..." : undefined}
      />
    </div>
  )
}

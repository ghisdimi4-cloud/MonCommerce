"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, Plus, MoreHorizontal, Eye, Edit, Trash2, Package, Image as ImageIcon, X, Save, PackagePlus, ShoppingBasket, Wine, Sparkles, Smartphone, Pill, Box, Bell, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { useAppStore } from "@/lib/store"
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

const getCategoryIcon = (category: string) => {
  const cat = category.toLowerCase();
  if (cat.includes('alimentation')) return <ShoppingBasket className="w-5 h-5" />;
  if (cat.includes('boisson')) return <Wine className="w-5 h-5" />;
  if (cat.includes('cosmétique')) return <Sparkles className="w-5 h-5" />;
  if (cat.includes('électronique')) return <Smartphone className="w-5 h-5" />;
  if (cat.includes('pharmacie') || cat.includes('médicament')) return <Pill className="w-5 h-5" />;
  return <Package className="w-5 h-5" />;
};

const getCategoryIconColor = (category: string) => {
  const cat = category.toLowerCase();
  if (cat.includes('alimentation')) return "text-green-600";
  if (cat.includes('boisson')) return "text-purple-600";
  if (cat.includes('cosmétique')) return "text-pink-600";
  if (cat.includes('électronique')) return "text-blue-600";
  if (cat.includes('pharmacie')) return "text-red-600";
  return "text-slate-600";
};

const getCategoryColorClass = (category: string) => {
  const cat = category.toLowerCase();
  if (cat.includes('alimentation')) return "from-green-50 to-green-100 text-green-700";
  if (cat.includes('boisson')) return "from-purple-50 to-purple-100 text-purple-700";
  if (cat.includes('cosmétique')) return "from-pink-50 to-pink-100 text-pink-700";
  if (cat.includes('électronique')) return "from-blue-50 to-blue-100 text-blue-700";
  if (cat.includes('pharmacie')) return "from-red-50 to-red-100 text-red-700";
  return "from-slate-50 to-slate-100 text-slate-700";
};

// --- ANCIENNE LOGIQUE DE FALLBACK LOCALE CONSERVÉE POUR LES PRODUITS DE DÉMO ---
const getLocalFallbackImage = (product: any) => {
  const name = (product.name || "").toLowerCase();
  const category = (product.category || "").toLowerCase();
  
  // 1. Matches très spécifiques pour les produits de démonstration du client
  if (name.includes("coca-cola") || name.includes("coca cola")) return "/images/products/coca_cola.png";
  if (name.includes("farine de blé") || name.includes("farine de ble")) return "/images/products/farine.png";
  if (name.includes("riz parfumé") || name.includes("riz parfume")) return "/images/products/riz.png";
  if (name === "sucre" || name.includes("sac de sucre")) return "/images/products/sucre.png";
  if (name.includes("tomate en boîte gino") || name.includes("tomate gino") || name === "gino") return "/images/products/tomate.png";
  if (name.includes("vin château de france") || name.includes("vin chateau")) return "/images/products/vin.png";

  // 2. Fallbacks génériques par défaut
  if (/(pack|boisson|bouteille|cannette|canette|eau|jus|bière|liqueur|soda|vin)/.test(name)) return "/images/packaging/bottles.png";
  if (/(^|\s)(sac|maïs|mais|sucre|riz|farine|blé|haricot|mil|sorgho|ciment)(\s|$)/.test(name)) return "/images/packaging/sacks.png";
  if (/(carton|tomate|spaghetti|pâte|savon|boîte|conserve|lait)/.test(name) && !/(lait de beauté)/.test(name)) return "/images/packaging/cartons.png";
  if (category.includes('cosmétique') || /(crème|pommade|parfum|beauté|lotion)/.test(name)) return "/images/packaging/cosmetics.png";
  return null;
}

const ProductImage = ({ product }: { product: any }) => {
  const [imgError, setImgError] = useState(false);
  const localFallback = getLocalFallbackImage(product);
  
  // Utiliser l'image IA générée, sinon le fallback local, sinon erreur
  const displayImage = product.image && product.image !== "loading" && product.image !== "error" 
    ? product.image 
    : (localFallback && !imgError ? localFallback : null);

  const showPremiumPlaceholder = !displayImage || product.image === "error" || imgError;

  if (showPremiumPlaceholder || product.image === "loading") {
    return (
      <div className={`h-full w-full bg-gradient-to-br ${getCategoryColorClass(product.category)} flex items-center justify-center relative shadow-inner group-hover:scale-105 transition-transform duration-300`}>
        {product.image === "loading" ? (
          <div className="absolute inset-0 flex items-center justify-center bg-white/40 backdrop-blur-[2px] z-20">
            <Loader2 className="w-5 h-5 animate-spin text-primary-600" />
          </div>
        ) : null}
        <span className="font-extrabold text-3xl opacity-10 absolute pointer-events-none">{product.name.charAt(0).toUpperCase()}</span>
        <div className="z-10 opacity-70 group-hover:opacity-100 transition-opacity drop-shadow-sm">
           {getCategoryIcon(product.category)}
        </div>
      </div>
    )
  }

  return (
    <img 
      src={displayImage} 
      alt={product.name} 
      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" 
      onError={() => setImgError(true)} 
      loading="lazy" 
    />
  );
}

export default function ProduitsPage() {
  const store = useAppStore()
  const { products, addProduct, restockProduct, updateProduct, deleteProduct } = store
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<any>(null)
  
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10
  const { toast } = useToast()

  const [newProduct, setNewProduct] = useState({
    name: "", category: "Alimentation", price: "", purchasePrice: "", stock: "", unit: "Unité"
  })
  
  const [editProductForm, setEditProductForm] = useState({
    id: "", name: "", category: "", price: "", purchasePrice: "", stock: "", unit: "Unité"
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

  // Statistiques
  const totalStockValue = products.reduce((acc, p) => acc + (p.purchasePrice * p.stock), 0);
  const categoriesCount = new Set(products.map(p => p.category)).size;
  const lowStockCount = products.filter(p => p.stock > 0 && p.stock <= 10).length + products.filter(p => p.stock === 0).length;

  // Inference de l'unité basée sur le nom et la catégorie
  const inferUnit = (name: string, category: string) => {
    const n = name.toLowerCase();
    if (/(sac|riz|maïs|sucre|farine|ciment)/.test(n)) return "Sac";
    if (/(boîte|conserve|tomate)/.test(n)) return "Boîte";
    if (/(pack|boisson|eau)/.test(n)) return "Pack";
    if (/(bouteille|vin|liqueur)/.test(n)) return "Bouteille";
    if (/(carton)/.test(n)) return "Carton";
    return "Unité";
  }

  const handleSave = async () => {
    if (!newProduct.name || !newProduct.price || !newProduct.stock) {
      toast({ title: "Erreur", description: "Veuillez remplir les champs requis", type: "error" })
      return
    }

    const productId = `p${Date.now()}`;
    const autoUnit = newProduct.unit === "Unité" ? inferUnit(newProduct.name, newProduct.category) : newProduct.unit;

    // 1. Ajouter le produit avec le placeholder de chargement
    const productData = {
      id: productId,
      name: newProduct.name,
      category: newProduct.category,
      price: parseInt(newProduct.price),
      purchasePrice: parseInt(newProduct.purchasePrice) || 0,
      stock: parseInt(newProduct.stock),
      unit: autoUnit,
      status: parseInt(newProduct.stock) > 10 ? "Disponible" : parseInt(newProduct.stock) > 0 ? "Stock faible" : "Rupture",
      image: "loading"
    };

    addProduct(productData);

    setIsModalOpen(false)
    setNewProduct({ name: "", category: "Alimentation", price: "", purchasePrice: "", stock: "", unit: "Unité" })
    
    toast({
      title: "Génération en cours...",
      description: "Votre produit a été ajouté. L'IA génère le visuel premium en arrière-plan.",
      type: "success"
    })

    // 2. Appel à l'API de génération d'image
    try {
      const res = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productName: productData.name, category: productData.category })
      });
      
      if (!res.ok) throw new Error("API call failed");
      const data = await res.json();
      
      if (data.imageUrl) {
        // Mettre à jour le produit avec la nouvelle URL
        updateProduct({ ...productData, image: data.imageUrl });
        toast({
          title: "Image générée ! ✨",
          description: "Le visuel premium a été ajouté à votre produit.",
          type: "success"
        });
      } else {
        updateProduct({ ...productData, image: "error" });
      }
    } catch (error) {
      console.error(error);
      updateProduct({ ...productData, image: "error" });
    }
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
      stock: product.stock.toString(),
      unit: product.unit || "Unité"
    })
    setIsEditModalOpen(true)
  }

  const handleEditSave = () => {
    if (!editProductForm.name || !editProductForm.price || !editProductForm.stock) {
      toast({ title: "Erreur", description: "Veuillez remplir les champs requis", type: "error" })
      return
    }

    const existingProduct = products.find(p => p.id === editProductForm.id);

    updateProduct({
      id: editProductForm.id,
      name: editProductForm.name,
      category: editProductForm.category,
      price: parseInt(editProductForm.price),
      purchasePrice: parseInt(editProductForm.purchasePrice) || 0,
      stock: parseInt(editProductForm.stock),
      unit: editProductForm.unit,
      status: parseInt(editProductForm.stock) > 10 ? "Disponible" : parseInt(editProductForm.stock) > 0 ? "Stock faible" : "Rupture",
      image: existingProduct?.image || ""
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

  const getStockBadge = (stock: number) => {
    if (stock > 10) return (
      <span className="inline-flex items-center text-sm font-medium text-slate-700 bg-white px-2 py-1 rounded-md shadow-sm border border-slate-100">
        <span className="w-2 h-2 rounded-full bg-success mr-2"></span>En stock
      </span>
    );
    if (stock > 0) return (
      <span className="inline-flex items-center text-sm font-medium text-amber-700 bg-amber-50 px-2 py-1 rounded-md shadow-sm border border-amber-100">
        <span className="w-2 h-2 rounded-full bg-warning mr-2"></span>Stock faible
      </span>
    );
    return (
      <span className="inline-flex items-center text-sm font-medium text-red-700 bg-red-50 px-2 py-1 rounded-md shadow-sm border border-red-100">
        <span className="w-2 h-2 rounded-full bg-danger mr-2"></span>Rupture
      </span>
    );
  }

  return (
    <div className="relative">
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="space-y-6 md:space-y-8 pb-20 relative z-10"
      >
        {/* Header & Stats Cards */}
        <div className="flex flex-col gap-6">
          <motion.div variants={item} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Produits</h2>
              <p className="text-slate-500 mt-1">Gérez tous les produits de votre commerce</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input 
                  placeholder="Rechercher un produit..." 
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value)
                    setCurrentPage(1)
                  }}
                  className="pl-9 h-10 bg-white border-slate-200 focus-visible:ring-primary-500/30 rounded-lg shadow-sm"
                />
              </div>
              <Button variant="outline" className="h-10 bg-white shadow-sm border-slate-200">
                <Search className="h-4 w-4 mr-2" />
                Filtrer
              </Button>
              <Button 
                onClick={() => setIsModalOpen(true)}
                className="bg-[#0EA76B] hover:bg-[#0c8d5a] text-white shadow-sm border-0 h-10 px-4 rounded-lg"
              >
                <Plus className="h-4 w-4 mr-2" />
                Ajouter un produit
              </Button>
            </div>
          </motion.div>

          <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="glass-card border-0 shadow-sm">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center text-green-600 border border-green-100">
                  <Package className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">Total produits</p>
                  <p className="text-2xl font-bold text-slate-900">{products.length}</p>
                  <p className="text-xs text-green-600 font-medium">+12 ce mois</p>
                </div>
              </CardContent>
            </Card>
            <Card className="glass-card border-0 shadow-sm">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center text-orange-600 border border-orange-100">
                  <Box className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">Valeur du stock</p>
                  <p className="text-2xl font-bold text-slate-900">{totalStockValue.toLocaleString('fr-FR')} FCFA</p>
                  <p className="text-xs text-green-600 font-medium">+8.5%</p>
                </div>
              </CardContent>
            </Card>
            <Card className="glass-card border-0 shadow-sm">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 border border-blue-100">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">Catégories</p>
                  <p className="text-2xl font-bold text-slate-900">{categoriesCount}</p>
                  <p className="text-xs text-green-600 font-medium">+2 ce mois</p>
                </div>
              </CardContent>
            </Card>
            <Card className="glass-card border-0 shadow-sm">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-pink-50 flex items-center justify-center text-pink-600 border border-pink-100">
                  <Bell className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">Alertes stock</p>
                  <p className="text-2xl font-bold text-slate-900">{lowStockCount}</p>
                  <p className="text-xs text-purple-600 font-medium">À surveiller</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Data Table */}
        <motion.div variants={item}>
          <Card className="bg-white border-0 shadow-sm rounded-2xl overflow-hidden">
            <div className="overflow-x-auto w-full">
              <table className="w-full text-sm text-left min-w-[900px]">
                <thead className="text-xs text-slate-500 uppercase bg-white border-b border-slate-100/50">
                  <tr>
                    <th className="px-6 py-5 font-semibold tracking-wider">Produit</th>
                    <th className="px-6 py-5 font-semibold tracking-wider">Catégorie</th>
                    <th className="px-6 py-5 font-semibold text-right tracking-wider">Prix Achat</th>
                    <th className="px-6 py-5 font-semibold text-right tracking-wider">Prix Vente</th>
                    <th className="px-6 py-5 font-semibold text-center tracking-wider">Stock</th>
                    <th className="px-6 py-5 font-semibold text-right tracking-wider">Valeur Stock</th>
                    <th className="px-6 py-5 font-semibold text-center tracking-wider">Statut</th>
                    <th className="px-6 py-5 font-semibold text-center tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {currentProducts.map((product) => (
                    <tr key={product.id} className="group hover:bg-slate-50/50 transition-colors bg-white">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="h-14 w-14 rounded-full flex items-center justify-center border-2 border-white shadow-md group-hover:shadow-xl group-hover:scale-105 transition-all duration-300 shrink-0 overflow-hidden bg-slate-50 ring-1 ring-slate-100">
                            <ProductImage product={product} />
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 group-hover:text-primary-600 transition-colors text-[15px]">{product.name}</p>
                            <p className="text-xs text-slate-500 mt-0.5">Réf: {product.id.toUpperCase()}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                           <span className={getCategoryIconColor(product.category)}>{getCategoryIcon(product.category)}</span>
                           <span className="text-slate-600 font-medium">{product.category}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right text-slate-500 font-medium">{product.purchasePrice?.toLocaleString('fr-FR')} FCFA</td>
                      <td className="px-6 py-4 text-right font-bold text-[#0EA76B]">{product.price.toLocaleString('fr-FR')} FCFA</td>
                      <td className="px-6 py-4 text-center">
                        <div className="font-bold text-slate-800 text-base">{product.stock}</div>
                        <div className="text-xs text-slate-400 font-medium">{product.unit || "Unité"}</div>
                      </td>
                      <td className="px-6 py-4 text-right font-medium text-slate-600">
                        {((product.purchasePrice || product.price) * product.stock).toLocaleString('fr-FR')} FCFA
                      </td>
                      <td className="px-6 py-4 text-center">
                        {getStockBadge(product.stock)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-center items-center gap-1">
                          <Button onClick={() => handleRestock(product.id, product.name)} variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-success hover:bg-success/10 rounded-lg transition-colors" title="Réapprovisionner">
                            <PackagePlus className="h-4 w-4" />
                          </Button>
                          <Button onClick={() => openViewModal(product)} variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors" title="Voir détails">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button onClick={() => openEditModal(product)} variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors border border-transparent hover:border-slate-200" title="Modifier">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button onClick={() => handleDelete(product.id, product.name)} variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-danger hover:bg-danger/10 rounded-lg transition-colors" title="Supprimer">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="border-t border-slate-100 px-6 py-4 bg-slate-50/50">
              <Pagination 
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                totalItems={filteredProducts.length}
                itemsPerPage={itemsPerPage}
              />
            </div>
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
              <Card className="bg-white border-0 shadow-2xl shadow-primary-900/10 overflow-hidden rounded-2xl">
                <div className="bg-white border-b border-slate-100 px-6 py-4 flex justify-between items-center">
                  <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
                    <Package className="h-5 w-5 text-primary-500" />
                    Nouveau Produit
                  </h3>
                  <Button variant="ghost" size="icon" onClick={() => setIsModalOpen(false)} className="rounded-full h-8 w-8 hover:bg-slate-100">
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <CardContent className="p-6 space-y-5 max-h-[80vh] overflow-y-auto no-scrollbar">
                  <div className="flex justify-center mb-2">
                    <div className="h-28 w-28 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 flex flex-col items-center justify-center text-slate-400">
                      <Sparkles className="h-8 w-8 mb-2 text-primary-400" />
                      <span className="text-[10px] font-semibold uppercase text-center px-2">Visuel IA<br/>Automatique</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="font-semibold text-slate-700">Nom du produit</Label>
                    <Input 
                      placeholder="Ex: Riz Parfumé" 
                      className="h-11 rounded-xl bg-slate-50 border-slate-200 focus-visible:ring-primary-500/30"
                      value={newProduct.name}
                      onChange={e => setNewProduct({...newProduct, name: e.target.value})}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="font-semibold text-slate-700">Prix d'achat (FCFA)</Label>
                      <Input 
                        type="number" 
                        placeholder="0" 
                        className="h-11 rounded-xl bg-slate-50 border-slate-200 focus-visible:ring-primary-500/30"
                        value={newProduct.purchasePrice}
                        onChange={e => setNewProduct({...newProduct, purchasePrice: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="font-semibold text-slate-700">Prix de vente (FCFA)</Label>
                      <Input 
                        type="number" 
                        placeholder="0" 
                        className="h-11 rounded-xl bg-slate-50 border-slate-200 focus-visible:ring-primary-500/30 border-l-4 border-l-primary-500"
                        value={newProduct.price}
                        onChange={e => setNewProduct({...newProduct, price: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="font-semibold text-slate-700">Stock initial</Label>
                      <Input 
                        type="number" 
                        placeholder="0" 
                        className="h-11 rounded-xl bg-slate-50 border-slate-200 focus-visible:ring-primary-500/30"
                        value={newProduct.stock}
                        onChange={e => setNewProduct({...newProduct, stock: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="font-semibold text-slate-700">Unité</Label>
                      <select 
                        className="flex h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/30"
                        value={newProduct.unit}
                        onChange={e => setNewProduct({...newProduct, unit: e.target.value})}
                      >
                        <option>Unité</option>
                        <option>Sac</option>
                        <option>Carton</option>
                        <option>Pack</option>
                        <option>Boîte</option>
                        <option>Bouteille</option>
                        <option>Kg</option>
                        <option>Litre</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="font-semibold text-slate-700">Catégorie</Label>
                    <select 
                      className="flex h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/30"
                      value={newProduct.category}
                      onChange={e => setNewProduct({...newProduct, category: e.target.value})}
                    >
                      <option>Alimentation</option>
                      <option>Boissons</option>
                      <option>Cosmétique</option>
                      <option>Pharmacie</option>
                      <option>Électronique</option>
                      <option>Mode</option>
                    </select>
                  </div>

                  <div className="pt-4 flex gap-3">
                    <Button variant="outline" className="flex-1 rounded-xl h-12" onClick={() => setIsModalOpen(false)}>
                      Annuler
                    </Button>
                    <Button onClick={handleSave} className="flex-1 rounded-xl h-12 bg-[#0EA76B] hover:bg-[#0c8d5a] text-white shadow-md border-0">
                      <Save className="h-5 w-5 mr-2" />
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
              <Card className="bg-white border-0 shadow-2xl shadow-primary-900/10 overflow-hidden rounded-2xl">
                <div className="bg-white border-b border-slate-100 px-6 py-4 flex justify-between items-center">
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
                      <Label>Prix d'achat (Optionnel)</Label>
                      <Input 
                        type="number" 
                        value={editProductForm.purchasePrice}
                        onChange={e => setEditProductForm({...editProductForm, purchasePrice: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Prix de vente (FCFA)</Label>
                      <Input 
                        type="number" 
                        value={editProductForm.price}
                        onChange={e => setEditProductForm({...editProductForm, price: e.target.value})}
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
                        <option>Alimentation</option>
                        <option>Boissons</option>
                        <option>Cosmétique</option>
                        <option>Pharmacie</option>
                        <option>Électronique</option>
                        <option>Mode</option>
                      </select>
                    </div>
                  </div>

                  <div className="pt-4 flex gap-3">
                    <Button variant="outline" className="flex-1 rounded-xl" onClick={() => setIsEditModalOpen(false)}>
                      Annuler
                    </Button>
                    <Button onClick={handleEditSave} className="flex-1 rounded-xl bg-primary-500 hover:bg-primary-600 text-white shadow-md border-0">
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

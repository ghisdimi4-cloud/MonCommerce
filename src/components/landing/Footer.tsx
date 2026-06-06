export function Footer() {
  return (
    <footer className="bg-slate-50 border-t border-slate-200 py-16">
      <div className="max-w-7xl mx-auto px-4 md:px-10">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center text-white font-bold">M</div>
              <span className="text-2xl font-bold text-slate-900">MonCommerce</span>
            </div>
            <p className="text-slate-500 max-w-sm">
              L'outil de gestion pensé pour simplifier le quotidien des commerçants et propulser leurs ventes.
            </p>
          </div>
          
          <div>
            <h5 className="font-bold text-slate-900 mb-6">Produit</h5>
            <ul className="space-y-4">
              <li><a href="#features" className="text-slate-500 hover:text-primary-600 transition-colors">Fonctionnalités</a></li>
              <li><a href="#pricing" className="text-slate-500 hover:text-primary-600 transition-colors">Tarifs</a></li>
              <li><a href="#insights" className="text-slate-500 hover:text-primary-600 transition-colors">Intelligence Artificielle</a></li>
            </ul>
          </div>
          
          <div>
            <h5 className="font-bold text-slate-900 mb-6">Contact</h5>
            <ul className="space-y-4">
              <li><a href="#" className="text-slate-500 hover:text-primary-600 transition-colors">Support WhatsApp</a></li>
              <li><a href="#" className="text-slate-500 hover:text-primary-600 transition-colors">hello@moncommerce.app</a></li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-500">
          <div>© 2026 MonCommerce. Tous droits réservés.</div>
          <div className="flex gap-6">
            <a href="#" className="hover:text-primary-600 transition-colors">Conditions d'utilisation</a>
            <a href="#" className="hover:text-primary-600 transition-colors">Confidentialité</a>
          </div>
        </div>
      </div>
    </footer>
  )
}

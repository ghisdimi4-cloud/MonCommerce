import ExcelJS from 'exceljs'
import { saveAs } from 'file-saver'
import { Sale, Client, Product } from './mock-data'
import { Settings } from './store'

type GlobalExportData = {
  sales: Sale[]
  clients: Client[]
  products: Product[]
  settings: Settings
}

const formatCurrency = (value: number) => {
  return Math.round(value).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " FCFA"
}

export const generateAccountingReport = async (data: GlobalExportData) => {
  const { sales, clients, products, settings } = data
  const workbook = new ExcelJS.Workbook()

  workbook.creator = settings.companyName
  workbook.created = new Date()

  const headerFill: ExcelJS.FillPattern = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FF0F172A' } // Slate 900
  }
  const headerFont = {
    color: { argb: 'FFFFFFFF' },
    bold: true
  }

  // ==========================================
  // 1. FEUILLE : RÉSUMÉ
  // ==========================================
  const validSales = sales.filter(s => s.status !== "Brouillon" && s.status !== "Annulée")
  const totalSales = validSales.reduce((acc, s) => acc + s.amount, 0)
  const totalBenefice = totalSales * 0.35 // Simulation
  const totalDettes = clients.reduce((acc, c) => acc + c.debt, 0)

  const summarySheet = workbook.addWorksheet('Résumé')
  summarySheet.columns = [
    { header: '', key: 'col1', width: 30 },
    { header: '', key: 'col2', width: 30 },
  ]

  summarySheet.mergeCells('A1:B1')
  const titleCell = summarySheet.getCell('A1')
  titleCell.value = `${settings.companyName.toUpperCase()} - RAPPORT FINANCIER`
  titleCell.font = { size: 16, bold: true, color: { argb: 'FF10B981' } }
  titleCell.alignment = { vertical: 'middle', horizontal: 'center' }
  summarySheet.getRow(1).height = 40

  summarySheet.getCell('A3').value = "Date d'édition:"
  summarySheet.getCell('B3').value = new Date().toLocaleDateString('fr-FR')
  
  summarySheet.getCell('A5').value = "Chiffre d'Affaires Global:"
  summarySheet.getCell('B5').value = formatCurrency(totalSales)
  summarySheet.getCell('B5').font = { bold: true }

  summarySheet.getCell('A6').value = "Bénéfice Estimé:"
  summarySheet.getCell('B6').value = formatCurrency(totalBenefice)

  summarySheet.getCell('A7').value = "Nombre de Ventes Réalisées:"
  summarySheet.getCell('B7').value = validSales.length

  summarySheet.getCell('A8').value = "Nombre Total de Clients:"
  summarySheet.getCell('B8').value = clients.length

  summarySheet.getCell('A9').value = "Total des Dettes Actives:"
  summarySheet.getCell('B9').value = formatCurrency(totalDettes)
  summarySheet.getCell('B9').font = { color: { argb: 'FFEF4444' }, bold: true }

  // ==========================================
  // 2. FEUILLE : VENTES
  // ==========================================
  const salesSheet = workbook.addWorksheet('Ventes')
  salesSheet.columns = [
    { header: 'N° Vente', key: 'id', width: 15 },
    { header: 'Date', key: 'date', width: 15 },
    { header: 'Client', key: 'client', width: 25 },
    { header: 'Produits', key: 'items', width: 40 },
    { header: 'Paiement', key: 'method', width: 15 },
    { header: 'Statut', key: 'status', width: 15 },
    { header: 'Montant TTC', key: 'amount', width: 20 },
  ]

  salesSheet.getRow(1).fill = headerFill
  salesSheet.getRow(1).font = headerFont
  salesSheet.autoFilter = 'A1:G1'

  sales.forEach((sale, index) => {
    // Transform JSON items into readable string
    const itemsText = sale.items.map(i => `${i.quantity}x ${i.name}`).join(' \n ')
    
    const row = salesSheet.addRow({
      id: sale.id.toUpperCase(),
      date: sale.date,
      client: sale.client,
      items: itemsText,
      method: sale.paymentMethod,
      status: sale.status,
      amount: formatCurrency(sale.amount)
    })

    // Alternating rows
    if (index % 2 === 1) {
      row.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF8FAFC' } }
    }

    // Status formatting
    const statusCell = row.getCell('status')
    statusCell.font = { bold: true }
    switch (sale.status) {
      case 'Payé': statusCell.font.color = { argb: 'FF10B981' }; break; // Vert
      case 'En attente': statusCell.font.color = { argb: 'FFF59E0B' }; break; // Orange
      case 'Annulée': statusCell.font.color = { argb: 'FFEF4444' }; break; // Rouge
      case 'Brouillon': statusCell.font.color = { argb: 'FF94A3B8' }; break; // Gris
    }

    row.getCell('items').alignment = { wrapText: true }
  })

  // ==========================================
  // 3. FEUILLE : CLIENTS
  // ==========================================
  const clientsSheet = workbook.addWorksheet('Clients')
  clientsSheet.columns = [
    { header: 'Nom du Client', key: 'name', width: 30 },
    { header: 'Téléphone', key: 'phone', width: 20 },
    { header: 'Dernière Activité', key: 'lastAct', width: 20 },
    { header: 'Dette Actuelle', key: 'debt', width: 20 },
  ]
  clientsSheet.getRow(1).fill = headerFill
  clientsSheet.getRow(1).font = headerFont
  clientsSheet.autoFilter = 'A1:D1'

  clients.forEach((client, index) => {
    const row = clientsSheet.addRow({
      name: client.name,
      phone: client.phone || 'N/A',
      lastAct: client.lastActivity || 'N/A',
      debt: formatCurrency(client.debt)
    })
    if (index % 2 === 1) row.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF8FAFC' } }
    if (client.debt > 0) row.getCell('debt').font = { color: { argb: 'FFEF4444' }, bold: true }
  })

  // ==========================================
  // 4. FEUILLE : DETTES
  // ==========================================
  const debtClients = clients.filter(c => c.debt > 0)
  const debtsSheet = workbook.addWorksheet('Dettes en cours')
  debtsSheet.columns = [
    { header: 'Client', key: 'name', width: 30 },
    { header: 'Téléphone', key: 'phone', width: 20 },
    { header: 'Reste à Payer', key: 'debt', width: 25 },
  ]
  debtsSheet.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF7F1D1D' } } // Dark Red
  debtsSheet.getRow(1).font = headerFont
  debtsSheet.autoFilter = 'A1:C1'

  debtClients.forEach((client, index) => {
    const row = debtsSheet.addRow({
      name: client.name,
      phone: client.phone || 'N/A',
      debt: formatCurrency(client.debt)
    })
    if (index % 2 === 1) row.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFEF2F2' } }
  })

  // ==========================================
  // 5. FEUILLE : STOCK
  // ==========================================
  const stockSheet = workbook.addWorksheet('Inventaire Stock')
  stockSheet.columns = [
    { header: 'Produit', key: 'name', width: 30 },
    { header: 'Catégorie', key: 'category', width: 20 },
    { header: 'Statut', key: 'status', width: 15 },
    { header: 'Quantité dispo', key: 'qty', width: 15 },
    { header: 'Prix unitaire', key: 'price', width: 20 },
    { header: 'Valeur totale', key: 'total', width: 20 },
  ]
  stockSheet.getRow(1).fill = headerFill
  stockSheet.getRow(1).font = headerFont
  stockSheet.autoFilter = 'A1:F1'

  products.forEach((prod, index) => {
    const row = stockSheet.addRow({
      name: prod.name,
      category: prod.category,
      status: prod.status,
      qty: prod.stock,
      price: formatCurrency(prod.price),
      total: formatCurrency(prod.stock * prod.price)
    })
    if (index % 2 === 1) row.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF8FAFC' } }
    
    const qtyCell = row.getCell('qty')
    if (prod.stock <= 5) qtyCell.font = { color: { argb: 'FFEF4444' }, bold: true }
  })

  // Génération et téléchargement
  const buffer = await workbook.xlsx.writeBuffer()
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
  const dateStr = new Date().toLocaleDateString('fr-FR').replace(/\//g, '-')
  saveAs(blob, `Rapport_Global_${settings.companyName.replace(/[^a-zA-Z0-9]/g, '_')}_${dateStr}.xlsx`)
}

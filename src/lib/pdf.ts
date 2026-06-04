import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

// Type d'une vente (correspond au store)
type SaleItem = {
  productId: string
  name: string
  quantity: number
  unitPrice: number
  total: number
}

type Sale = {
  id: string
  client: string
  clientId: string
  amount: number
  status: string
  date: string
  paymentMethod: string
  items: SaleItem[]
}

type Client = {
  id: string
  name: string
  phone: string
  debt: number
}

type Settings = {
  companyName: string
  phone: string
  address: string
}

const formatCurrency = (value: number) => {
  return Math.round(value).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

export const downloadInvoicePDF = (sale: Sale, client: Client | undefined, settings: Settings) => {
  const doc = new jsPDF()

  // --- COULEURS ---
  const primaryColor = [16, 185, 129] // Emerald 500
  const textColor = [51, 65, 85] // Slate 700

  // --- HEADER ---
  // Logo placeholder (ou initiales)
  doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2])
  doc.rect(14, 15, 15, 15, 'F')
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  doc.text(settings.companyName.charAt(0).toUpperCase(), 18, 25)

  // Title "FACTURE"
  doc.setTextColor(15, 23, 42) // Slate 900
  doc.setFontSize(24)
  doc.text('FACTURE', 130, 25)

  // Invoice Details
  doc.setFontSize(10)
  doc.setTextColor(textColor[0], textColor[1], textColor[2])
  doc.setFont('helvetica', 'normal')
  doc.text(`N°: INV-${sale.id.toUpperCase()}-000`, 130, 32)
  doc.text(`Date: ${sale.date}`, 130, 38)
  doc.text(`Paiement: ${sale.paymentMethod}`, 130, 44)
  doc.text(`Statut: ${sale.status}`, 130, 50)

  // --- COMPANY INFO ---
  doc.setFontSize(12)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(15, 23, 42)
  doc.text(settings.companyName, 14, 45)
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(textColor[0], textColor[1], textColor[2])
  doc.text(settings.address || "Adresse non renseignée", 14, 51)
  doc.text(settings.phone || "Téléphone non renseigné", 14, 57)

  // --- CLIENT INFO ---
  doc.setFontSize(10)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(148, 163, 184) // Slate 400
  doc.text("FACTURE À", 14, 75)
  
  doc.setFontSize(12)
  doc.setTextColor(15, 23, 42)
  doc.text(sale.client, 14, 82)
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(textColor[0], textColor[1], textColor[2])
  doc.text(client?.phone || "Numéro non renseigné", 14, 88)

  // --- TABLE (ITEMS) ---
  const tableColumn = ["Description", "Quantité", "Prix unitaire (FCFA)", "Total (FCFA)"]
  const tableRows = []

  sale.items.forEach(item => {
    const row = [
      item.name,
      item.quantity.toString(),
      formatCurrency(item.unitPrice),
      formatCurrency(item.total)
    ]
    tableRows.push(row)
  })

  autoTable(doc, {
    startY: 100,
    head: [tableColumn],
    body: tableRows,
    theme: 'plain',
    headStyles: {
      fillColor: [248, 250, 252], // Slate 50
      textColor: [100, 116, 139], // Slate 500
      fontStyle: 'bold',
      halign: 'left'
    },
    bodyStyles: {
      textColor: textColor,
      lineColor: [226, 232, 240], // Slate 200
      lineWidth: { bottom: 0.1 }
    },
    columnStyles: {
      0: { cellWidth: 80 },
      1: { halign: 'center' },
      2: { halign: 'right' },
      3: { halign: 'right', fontStyle: 'bold', textColor: [15, 23, 42] }
    },
    margin: { top: 10 }
  })

  // --- TOTALS ---
  // @ts-ignore - jspdf-autotable adds lastAutoTable to doc
  const finalY = doc.lastAutoTable.finalY || 100

  doc.setFontSize(10)
  doc.setTextColor(textColor[0], textColor[1], textColor[2])
  const subtotal = Math.round(sale.amount / 1.18)
  const tva = Math.round(sale.amount - subtotal)

  doc.text("Sous-total HT", 130, finalY + 15)
  doc.text(`${formatCurrency(subtotal)} FCFA`, 196, finalY + 15, { align: 'right' })

  doc.text("TVA (18%)", 130, finalY + 22)
  doc.text(`${formatCurrency(tva)} FCFA`, 196, finalY + 22, { align: 'right' })

  // Ligne de séparation
  doc.setDrawColor(226, 232, 240)
  doc.line(130, finalY + 26, 196, finalY + 26)

  doc.setFontSize(12)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(15, 23, 42)
  doc.text("TOTAL TTC", 130, finalY + 34)
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2])
  doc.text(`${formatCurrency(sale.amount)} FCFA`, 196, finalY + 34, { align: 'right' })

  // --- FOOTER ---
  const pageHeight = doc.internal.pageSize.height
  doc.setFontSize(8)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(148, 163, 184) // Slate 400
  doc.text("Merci pour votre confiance !", 105, pageHeight - 15, { align: 'center' })
  doc.text(`Document généré par MonCommerce le ${new Date().toLocaleDateString('fr-FR')}`, 105, pageHeight - 10, { align: 'center' })

  // Open the PDF in a new tab (allows viewing, printing, downloading)
  const blob = doc.output('blob')
  const blobUrl = URL.createObjectURL(blob)
  window.open(blobUrl, '_blank')
}

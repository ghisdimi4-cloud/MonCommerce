"use client"

import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

import { useAppStore } from "@/lib/store"

export function OverviewChart() {
  const { sales } = useAppStore()
  const validSales = sales.filter(s => s.status !== "Brouillon" && s.status !== "Annulée")

  const data = validSales.reduce((acc, sale) => {
    let dayIndex = new Date().getDay()
    if (sale.date && sale.date.includes('/')) {
      const [d, m, y] = sale.date.split('/')
      if (d && m && y) {
        const dateObj = new Date(parseInt(y), parseInt(m) - 1, parseInt(d))
        if (!isNaN(dateObj.getTime())) {
          dayIndex = dateObj.getDay()
        }
      }
    } else if (sale.date.includes('Hier')) {
      dayIndex = new Date(Date.now() - 86400000).getDay()
    }
    
    // JS getDay(): 0 = Sunday, 1 = Monday. We want 0 = Monday, 6 = Sunday.
    const idx = dayIndex === 0 ? 6 : dayIndex - 1
    if (idx >= 0 && idx <= 6) {
      acc[idx].total += sale.amount
    }
    return acc
  }, [
    { name: "Lun", total: 0 },
    { name: "Mar", total: 0 },
    { name: "Mer", total: 0 },
    { name: "Jeu", total: 0 },
    { name: "Ven", total: 0 },
    { name: "Sam", total: 0 },
    { name: "Dim", total: 0 },
  ])

  return (
    <ResponsiveContainer width="100%" height={350}>
      <AreaChart data={data} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis
          dataKey="name"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tick={{ fill: '#888888' }}
          dy={10}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `${value / 1000}k`}
          tick={{ fill: '#888888' }}
        />
        <Tooltip
          contentStyle={{ 
            backgroundColor: '#ffffff', 
            borderRadius: '12px',
            border: 'none',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.04), 0 4px 6px -4px rgba(0, 0, 0, 0.02)',
            color: '#0F172A',
            fontWeight: 600,
          }}
          itemStyle={{ color: '#10B981' }}
          formatter={(value: any) => [`${(value || 0).toLocaleString('fr-FR')} FCFA`, 'Ventes']}
          labelStyle={{ color: '#64748B', fontWeight: 500, marginBottom: '4px' }}
        />
        <Area
          type="monotone"
          dataKey="total"
          stroke="#10B981"
          strokeWidth={3}
          fillOpacity={1}
          fill="url(#colorTotal)"
          activeDot={{ r: 6, fill: "#10B981", stroke: "#ffffff", strokeWidth: 2 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}

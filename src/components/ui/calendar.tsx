import React, { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  isSameMonth,
  isSameDay,
  addDays,
} from 'date-fns'
import { fr } from 'date-fns/locale'

export interface CalendarProps {
  selectedDate?: Date
  onSelectDate: (date: Date) => void
}

export function Calendar({ selectedDate, onSelectDate }: CalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(selectedDate || new Date())

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1))
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1))

  const renderHeader = () => {
    return (
      <div className="flex justify-between items-center mb-4 px-2">
        <button
          onClick={(e) => { e.preventDefault(); prevMonth(); }}
          className="p-2 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
        >
          <ChevronLeft className="h-4 w-4 text-slate-600" />
        </button>
        <h2 className="text-base font-bold text-slate-900 capitalize">
          {format(currentMonth, 'MMMM yyyy', { locale: fr })}
        </h2>
        <button
          onClick={(e) => { e.preventDefault(); nextMonth(); }}
          className="p-2 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
        >
          <ChevronRight className="h-4 w-4 text-slate-600" />
        </button>
      </div>
    )
  }

  const renderDays = () => {
    const days = []
    const startDate = startOfWeek(currentMonth, { weekStartsOn: 1 }) // Monday

    for (let i = 0; i < 7; i++) {
      days.push(
        <div key={i} className="text-center font-medium text-sm text-slate-400 py-2">
          {format(addDays(startDate, i), 'eeeeee', { locale: fr })}
        </div>
      )
    }
    return <div className="grid grid-cols-7 mb-2">{days}</div>
  }

  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth)
    const monthEnd = endOfMonth(monthStart)
    const startDate = startOfWeek(monthStart, { weekStartsOn: 1 })
    const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 })

    const rows = []
    let days = []
    let day = startDate
    let formattedDate = ''

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        formattedDate = format(day, 'd')
        const cloneDay = day
        const isSelected = selectedDate && isSameDay(day, selectedDate)
        const isCurrentMonth = isSameMonth(day, monthStart)

        days.push(
          <div
            key={day.toString()}
            className="flex justify-center items-center h-10 w-10 mx-auto"
          >
            <button
              onClick={(e) => { e.preventDefault(); onSelectDate(cloneDay); }}
              className={`
                h-10 w-10 rounded-xl flex items-center justify-center text-sm font-medium transition-all
                ${!isCurrentMonth ? 'text-slate-300' : 'text-slate-800'}
                ${isSelected ? 'bg-blue-500 text-white shadow-md' : 'hover:bg-slate-100'}
              `}
            >
              {formattedDate}
            </button>
          </div>
        )
        day = addDays(day, 1)
      }
      rows.push(
        <div className="grid grid-cols-7 gap-1" key={day.toString()}>
          {days}
        </div>
      )
      days = []
    }
    return <div>{rows}</div>
  }

  return (
    <div className="bg-white p-4 rounded-3xl w-[320px] shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] border border-slate-100">
      {renderHeader()}
      {renderDays()}
      {renderCells()}
    </div>
  )
}

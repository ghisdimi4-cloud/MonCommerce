import { useState, useEffect } from 'react'

export interface Toast {
  id: string
  title: string
  description?: string
  type?: 'default' | 'success' | 'error' | 'warning'
}

let toasts: Toast[] = []
let listeners: ((toasts: Toast[]) => void)[] = []

const emitChange = () => {
  listeners.forEach((listener) => listener(toasts))
}

export const toast = ({ title, description, type = 'default' }: Omit<Toast, 'id'>) => {
  const id = Math.random().toString(36).substr(2, 9)
  const newToast = { id, title, description, type }
  toasts = [...toasts, newToast]
  emitChange()

  setTimeout(() => {
    toasts = toasts.filter((t) => t.id !== id)
    emitChange()
  }, 3000)
}

export function useToast() {
  const [currentToasts, setCurrentToasts] = useState<Toast[]>(toasts)

  useEffect(() => {
    listeners.push(setCurrentToasts)
    return () => {
      listeners = listeners.filter((l) => l !== setCurrentToasts)
    }
  }, [])

  return { toasts: currentToasts, toast }
}

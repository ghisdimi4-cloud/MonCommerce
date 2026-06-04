import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AlertTriangle, Check, X, Info } from 'lucide-react'
import { Button } from './button'
import { Input } from './input'

export interface CustomDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (value?: string) => void
  title: string
  description: string
  type?: 'confirm' | 'prompt'
  variant?: 'danger' | 'warning' | 'info' | 'success'
  promptLabel?: string
  promptPlaceholder?: string
  confirmText?: string
  cancelText?: string
}

export function CustomDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  type = 'confirm',
  variant = 'info',
  promptLabel,
  promptPlaceholder,
  confirmText = "Confirmer",
  cancelText = "Annuler"
}: CustomDialogProps) {
  const [inputValue, setInputValue] = React.useState('')

  const getIcon = () => {
    switch (variant) {
      case 'danger': return <div className="h-12 w-12 rounded-full bg-danger/10 text-danger flex items-center justify-center mb-4 mx-auto"><AlertTriangle className="h-6 w-6" /></div>
      case 'warning': return <div className="h-12 w-12 rounded-full bg-warning/10 text-warning flex items-center justify-center mb-4 mx-auto"><AlertTriangle className="h-6 w-6" /></div>
      case 'success': return <div className="h-12 w-12 rounded-full bg-success/10 text-success flex items-center justify-center mb-4 mx-auto"><Check className="h-6 w-6" /></div>
      default: return <div className="h-12 w-12 rounded-full bg-primary-50 text-primary-500 flex items-center justify-center mb-4 mx-auto"><Info className="h-6 w-6" /></div>
    }
  }

  const getConfirmButtonClass = () => {
    switch (variant) {
      case 'danger': return "bg-danger hover:bg-danger/90 text-white border-0"
      case 'warning': return "bg-warning hover:bg-warning/90 text-white border-0"
      case 'success': return "bg-success hover:bg-success/90 text-white border-0"
      default: return "bg-primary-500 hover:bg-primary-600 text-white border-0 shadow-primary-glow"
    }
  }

  const handleConfirm = () => {
    onConfirm(type === 'prompt' ? inputValue : undefined)
    setInputValue('')
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100]"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 24 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-sm z-[101] p-4"
          >
            <div className="glass-card border-0 shadow-2xl shadow-slate-900/10 rounded-2xl overflow-hidden bg-white/95">
              <div className="p-6 text-center">
                {getIcon()}
                <h3 className="text-xl font-bold text-slate-900 mb-2">{title}</h3>
                <p className="text-sm text-slate-500 mb-6">{description}</p>

                {type === 'prompt' && (
                  <div className="mb-6 text-left">
                    {promptLabel && <label className="block text-sm font-medium text-slate-700 mb-2">{promptLabel}</label>}
                    <Input
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder={promptPlaceholder}
                      className="w-full text-center"
                      autoFocus
                      onKeyDown={(e) => e.key === 'Enter' && handleConfirm()}
                    />
                  </div>
                )}

                <div className="flex gap-3 mt-2">
                  <Button variant="outline" className="flex-1 rounded-xl glass-card text-slate-700" onClick={onClose}>
                    {cancelText}
                  </Button>
                  <Button className={`flex-1 rounded-xl ${getConfirmButtonClass()}`} onClick={handleConfirm}>
                    {confirmText}
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

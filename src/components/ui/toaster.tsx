"use client"

import { useToast } from "@/hooks/use-toast"
import { motion, AnimatePresence } from "framer-motion"
import { CheckCircle2, AlertCircle, Info, XCircle } from "lucide-react"

export function Toaster() {
  const { toasts } = useToast()

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 w-full max-w-sm pointer-events-none">
      <AnimatePresence>
        {toasts.map((t) => {
          const isSuccess = t.type === 'success'
          const isError = t.type === 'error'
          const isWarning = t.type === 'warning'
          
          return (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
              className="bg-white/80 backdrop-blur-xl border border-white/40 shadow-premium p-4 rounded-2xl pointer-events-auto flex gap-3 items-start relative overflow-hidden group"
            >
              <div className={`mt-0.5 rounded-full p-1 
                ${isSuccess ? 'bg-success/10 text-success' : 
                  isError ? 'bg-danger/10 text-danger' : 
                  isWarning ? 'bg-warning/10 text-warning' : 
                  'bg-primary-100/50 text-primary-600'}`}
              >
                {isSuccess && <CheckCircle2 className="w-5 h-5" />}
                {isError && <XCircle className="w-5 h-5" />}
                {isWarning && <AlertCircle className="w-5 h-5" />}
                {!isSuccess && !isError && !isWarning && <Info className="w-5 h-5" />}
              </div>
              <div>
                <h4 className="text-sm font-semibold text-slate-900">{t.title}</h4>
                {t.description && <p className="text-sm text-slate-500 mt-1">{t.description}</p>}
              </div>
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>
  )
}

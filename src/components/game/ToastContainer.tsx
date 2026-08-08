import { motion, AnimatePresence } from 'framer-motion'

export interface ToastItem {
  id: string
  type: 'xp' | 'achievement'
  message: string
}

interface ToastContainerProps {
  toasts: ToastItem[]
}

export function ToastContainer({ toasts }: ToastContainerProps) {
  return (
    <div className="toast-container">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            className={`toast ${toast.type}`}
            initial={{ opacity: 0, x: 80 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 80 }}
          >
            {toast.message}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}

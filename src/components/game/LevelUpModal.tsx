import { motion, AnimatePresence } from 'framer-motion'

interface LevelUpModalProps {
  level: number
  title: string
  onClose: () => void
}

export function LevelUpModal({ level, title, onClose }: LevelUpModalProps) {
  return (
    <AnimatePresence>
      <motion.div
        className="modal-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="modal"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🎉</div>
          <h2>Niveau {level} !</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>
            Vous êtes maintenant <strong>{title}</strong>
          </p>
          <button className="btn btn-primary" onClick={onClose}>Continuer</button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

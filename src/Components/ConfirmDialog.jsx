import { AnimatePresence, motion } from 'framer-motion'

export default function ConfirmDialog({
  isOpen,
  title = 'Confirm Action',
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'danger',
  onConfirm,
  onCancel,
  loading = false,
}) {
  if (!isOpen) return null

  const confirmStyles =
    variant === 'danger'
      ? 'bg-red-500 hover:bg-red-600 text-white'
      : 'bg-cyan-500 hover:bg-cyan-400 text-slate-900'

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={onCancel}
          />

          {/* Dialog */}
          <motion.div
            className="relative z-10 w-full max-w-md bg-[#0f1729] border border-white/10 rounded-2xl p-6 shadow-2xl"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', duration: 0.3 }}
          >
            {/* Icon */}
            {variant === 'danger' && (
              <div className="w-12 h-12 rounded-full bg-red-500/15 border border-red-500/30 flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                </svg>
              </div>
            )}

            <h3 className="text-lg font-semibold text-white text-center mb-2">{title}</h3>
            {message && (
              <p className="text-white/60 text-sm text-center mb-6">{message}</p>
            )}

            <div className="flex gap-3">
              <button
                onClick={onCancel}
                disabled={loading}
                className="flex-1 px-4 py-2.5 rounded-xl border border-white/15 text-white/70 hover:bg-white/5 hover:text-white transition text-sm font-medium disabled:opacity-50"
              >
                {cancelLabel}
              </button>
              <button
                onClick={onConfirm}
                disabled={loading}
                className={`flex-1 px-4 py-2.5 rounded-xl font-medium text-sm transition flex items-center justify-center gap-2 disabled:opacity-50 ${confirmStyles}`}
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                ) : null}
                {confirmLabel}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

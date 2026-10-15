export default function LoadingSpinner({ size = 'md', label = 'Loading…' }) {
  const sizeClass = {
    sm: 'w-5 h-5 border-2',
    md: 'w-8 h-8 border-2',
    lg: 'w-12 h-12 border-2',
  }[size]

  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <div className={`${sizeClass} border-cyan-500 border-t-transparent rounded-full animate-spin`} />
      {label && <p className="text-white/40 text-sm">{label}</p>}
    </div>
  )
}

export function PageLoader() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <LoadingSpinner size="lg" />
    </div>
  )
}

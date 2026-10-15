export default function StatusBadge({ status }) {
  const styles = {
    published: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    draft:     'bg-amber-500/15 text-amber-400 border-amber-500/30',
    enabled:   'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    disabled:  'bg-red-500/15 text-red-400 border-red-500/30',
    featured:  'bg-cyan-500/15 text-cyan-400 border-cyan-500/30',
  }

  const labels = {
    published: 'Published',
    draft:     'Draft',
    enabled:   'Enabled',
    disabled:  'Disabled',
    featured:  'Featured',
  }

  const dots = {
    published: 'bg-emerald-400',
    draft:     'bg-amber-400',
    enabled:   'bg-emerald-400',
    disabled:  'bg-red-400',
    featured:  'bg-cyan-400',
  }

  const key = status?.toLowerCase()
  const style = styles[key] || 'bg-white/10 text-white/60 border-white/20'
  const label = labels[key] || status

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${style}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dots[key] || 'bg-white/40'}`} />
      {label}
    </span>
  )
}

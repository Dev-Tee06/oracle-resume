export default function EmptyState({
  icon,
  title,
  description,
  action,
}) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
      {icon && (
        <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-5 text-white/30 text-2xl">
          {icon}
        </div>
      )}
      <h3 className="text-white font-semibold text-lg mb-2">{title}</h3>
      {description && (
        <p className="text-white/50 text-sm max-w-xs mb-6">{description}</p>
      )}
      {action && action}
    </div>
  )
}

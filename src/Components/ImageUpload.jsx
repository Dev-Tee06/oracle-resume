import { useRef, useState } from 'react'
import { validateImageFile } from '../lib/utils'

export default function ImageUpload({
  label = 'Upload Image',
  value,           // existing image URL
  onChange,        // (file, previewUrl) => void
  onRemove,        // () => void
  multiple = false,
  hint,
  error: externalError,
}) {
  const inputRef = useRef(null)
  const [preview, setPreview] = useState(null)
  const [dragOver, setDragOver] = useState(false)
  const [error, setError] = useState(null)

  const displayImage = preview || value

  function handleFile(file) {
    const err = validateImageFile(file)
    if (err) { setError(err); return }
    setError(null)
    const url = URL.createObjectURL(file)
    setPreview(url)
    onChange?.(file, url)
  }

  function handleInputChange(e) {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
    // Reset so same file can be re-selected
    e.target.value = ''
  }

  function handleDrop(e) {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files?.[0]
    if (file) handleFile(file)
  }

  function handleRemove() {
    setPreview(null)
    setError(null)
    onRemove?.()
  }

  const dropErr = externalError || error

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-white/70">{label}</label>
      )}

      {displayImage ? (
        <div className="relative group">
          <img
            src={displayImage}
            alt="Preview"
            className="w-full h-48 object-cover rounded-xl border border-white/10"
          />
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition rounded-xl flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="px-3 py-2 bg-white/15 hover:bg-white/25 text-white text-xs rounded-lg border border-white/20 transition"
            >
              Replace
            </button>
            <button
              type="button"
              onClick={handleRemove}
              className="px-3 py-2 bg-red-500/30 hover:bg-red-500/50 text-red-300 text-xs rounded-lg border border-red-500/30 transition"
            >
              Remove
            </button>
          </div>
        </div>
      ) : (
        <div
          role="button"
          tabIndex={0}
          className={`
            relative flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed
            h-36 cursor-pointer transition-all
            ${dragOver
              ? 'border-cyan-400 bg-cyan-500/5'
              : 'border-white/15 bg-white/3 hover:border-white/30 hover:bg-white/5'}
            ${dropErr ? 'border-red-500/50' : ''}
          `}
          onClick={() => inputRef.current?.click()}
          onKeyDown={(e) => e.key === 'Enter' && inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
        >
          <div className="text-white/30">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <p className="text-white/50 text-sm">
            <span className="text-cyan-400">Click to upload</span> or drag & drop
          </p>
          <p className="text-white/30 text-xs">JPEG, PNG, WebP — max 10MB</p>
        </div>
      )}

      {hint && !dropErr && (
        <p className="text-white/40 text-xs">{hint}</p>
      )}
      {dropErr && (
        <p className="text-red-400 text-xs">{dropErr}</p>
      )}

      <input
        ref={inputRef}
        type="file"
        className="hidden"
        accept=".jpg,.jpeg,.png,.webp"
        multiple={multiple}
        onChange={handleInputChange}
      />
    </div>
  )
}


export function GalleryUpload({ images = [], onAdd, onRemove, onMoveUp, onMoveDown, onAltChange }) {
  const inputRef = useRef(null)
  const [error, setError] = useState(null)

  function handleFiles(fileList) {
    setError(null)
    Array.from(fileList).forEach(file => {
      const err = validateImageFile(file)
      if (err) { setError(err); return }
      const url = URL.createObjectURL(file)
      onAdd?.(file, url)
    })
  }

  function handleInputChange(e) {
    if (e.target.files) handleFiles(e.target.files)
    e.target.value = ''
  }

  function handleDrop(e) {
    e.preventDefault()
    if (e.dataTransfer.files) handleFiles(e.dataTransfer.files)
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-3">
        {images.map((img, idx) => (
          <div key={img.id || idx} className="relative group w-32">
            <img
              src={img.preview || img.public_url}
              alt={img.alt_text || `Gallery image ${idx + 1}`}
              className="w-32 h-24 object-cover rounded-lg border border-white/10"
            />
            {/* Overlay controls */}
            <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition rounded-lg flex flex-col items-center justify-center gap-1">
              <div className="flex gap-1">
                <button type="button" onClick={() => onMoveUp?.(idx)} disabled={idx === 0}
                  className="p-1 text-white/70 hover:text-white disabled:opacity-30 transition">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                  </svg>
                </button>
                <button type="button" onClick={() => onMoveDown?.(idx)} disabled={idx === images.length - 1}
                  className="p-1 text-white/70 hover:text-white disabled:opacity-30 transition">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <button type="button" onClick={() => onRemove?.(idx)}
                  className="p-1 text-red-400 hover:text-red-300 transition">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            {/* Alt text */}
            <input
              type="text"
              placeholder="Alt text…"
              value={img.alt_text || ''}
              onChange={(e) => onAltChange?.(idx, e.target.value)}
              className="mt-1 w-full text-xs bg-white/5 border border-white/10 rounded px-1.5 py-1 text-white placeholder-white/30 focus:outline-none focus:border-cyan-500/50"
            />
          </div>
        ))}

        {/* Add more button */}
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          className="w-32 h-24 rounded-lg border-2 border-dashed border-white/15 flex flex-col items-center justify-center gap-1 text-white/30 hover:border-white/30 hover:text-white/50 transition cursor-pointer"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span className="text-xs">Add</span>
        </button>
      </div>

      {error && <p className="text-red-400 text-xs">{error}</p>}

      <input
        ref={inputRef}
        type="file"
        className="hidden"
        accept=".jpg,.jpeg,.png,.webp"
        multiple
        onChange={handleInputChange}
      />
    </div>
  )
}

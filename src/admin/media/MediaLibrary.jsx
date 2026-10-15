import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { supabase, STORAGE_BUCKET } from '../../lib/supabase'
import { generateStoragePath } from '../../lib/utils'
import { PageLoader } from '../../Components/LoadingSpinner'
import ConfirmDialog from '../../Components/ConfirmDialog'
import EmptyState from '../../Components/EmptyState'
import { FiImage, FiTrash2, FiCopy } from 'react-icons/fi'

export default function MediaLibrary() {
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(true)
  const [deleteId, setDeleteId] = useState(null)
  const [deletePath, setDeletePath] = useState(null)
  const [deleting, setDeleting] = useState(false)
  const [toast, setToast] = useState(null)
  const [selected, setSelected] = useState(null)
  const [savingAlt, setSavingAlt] = useState(false)
  const [replacingImage, setReplacingImage] = useState(false)
  const [replaceError, setReplaceError] = useState(null)
  const [error, setError] = useState(null)
  const replaceInput = useRef(null)

  function showToast(msg) {
    setToast(msg)
    setTimeout(() => setToast(null), 2500)
  }

  useEffect(() => {
    async function load() {
      const { data, error: loadError } = await supabase
        .from('portfolio_images')
        .select('*, project:portfolio_projects!portfolio_images_project_id_fkey(title)')
        .order('created_at', { ascending: false })
      if (loadError) setError(`Could not load media: ${loadError.message}`)
      setImages(data || [])
      setLoading(false)
    }
    load()
  }, [])

  async function saveAltText() {
    if (!selected) return
    setSavingAlt(true)
    const { error: updateError } = await supabase
      .from('portfolio_images')
      .update({ alt_text: selected.alt_text || '' })
      .eq('id', selected.id)
    setSavingAlt(false)
    if (updateError) { setError(`Could not save image details: ${updateError.message}`); return }
    setImages(prev => prev.map(image => image.id === selected.id ? selected : image))
    showToast('Image details saved.')
  }

  async function replaceSelectedImage(event) {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file || !selected) return
    setReplaceError(null)

    if (file.size > 1024 * 1024) {
      setReplaceError('Image must be 1 MB or smaller.')
      return
    }
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setReplaceError('Use a JPEG, PNG, or WebP image.')
      return
    }
    if (!selected.project_id) {
      setReplaceError('This image is not linked to a project and cannot be replaced here.')
      return
    }

    setReplacingImage(true)
    const nextPath = generateStoragePath(selected.project_id, file.name)
    try {
      const { error: uploadError } = await supabase.storage
        .from(STORAGE_BUCKET)
        .upload(nextPath, file, { upsert: false, contentType: file.type })
      if (uploadError) throw uploadError

      const { data: publicData } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(nextPath)
      const { error: updateError } = await supabase
        .from('portfolio_images')
        .update({ storage_path: nextPath, public_url: publicData.publicUrl })
        .eq('id', selected.id)
      if (updateError) {
        await supabase.storage.from(STORAGE_BUCKET).remove([nextPath])
        throw updateError
      }

      const updatedImage = { ...selected, storage_path: nextPath, public_url: publicData.publicUrl }
      await supabase.storage.from(STORAGE_BUCKET).remove([selected.storage_path])
      setSelected(updatedImage)
      setImages(prev => prev.map(image => image.id === selected.id ? updatedImage : image))
      showToast('Image replaced.')
    } catch (replaceFailure) {
      setReplaceError(`Could not replace image: ${replaceFailure.message}`)
    } finally {
      setReplacingImage(false)
    }
  }

  async function handleDelete() {
    setDeleting(true)
    const { error } = await supabase.from('portfolio_images').delete().eq('id', deleteId)
    if (!error && deletePath) {
      await supabase.storage.from(STORAGE_BUCKET).remove([deletePath])
    }
    setImages(prev => prev.filter(i => i.id !== deleteId))
    setSelected(null)
    setDeleteId(null)
    setDeletePath(null)
    setDeleting(false)
    showToast('Image deleted.')
  }

  function copyUrl(url) {
    navigator.clipboard.writeText(url).then(() => showToast('URL copied!'))
  }

  if (loading) return <PageLoader />

  return (
    <div className="space-y-6 max-w-6xl">
      <div>
        <h1 className="text-2xl font-bold text-white">Media Library</h1>
        <p className="text-white/40 text-sm mt-1">{images.length} image{images.length !== 1 ? 's' : ''} across all projects.</p>
      </div>

      {error && <div role="alert" className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{error}</div>}

      {images.length === 0 ? (
        <EmptyState
          icon={<FiImage />}
          title="No media yet"
          description="Images uploaded to projects will appear here."
        />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
          {images.map(img => (
            <motion.div
              key={img.id}
              whileHover={{ scale: 1.02 }}
              onClick={() => setSelected(img)}
              className={`relative cursor-pointer rounded-xl overflow-hidden border transition ${
                selected?.id === img.id ? 'border-cyan-500' : 'border-white/8 hover:border-white/20'
              }`}
            >
              <img
                src={img.public_url}
                alt={img.alt_text || 'Portfolio image'}
                className="w-full h-32 object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent opacity-0 hover:opacity-100 transition">
                <div className="absolute bottom-2 left-2 right-2">
                  <p className="text-white text-xs truncate">{img.project?.title || 'No project'}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Selected image sidebar */}
      {selected && (
        <div className="fixed right-0 top-0 bottom-0 w-72 bg-[#0a0f1e] border-l border-white/5 z-50 overflow-y-auto p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-white font-semibold text-sm">Image Details</h3>
            <button onClick={() => setSelected(null)} className="text-white/40 hover:text-white transition text-lg">×</button>
          </div>

          <img src={selected.public_url} alt={selected.alt_text || ''} className="w-full rounded-xl object-cover border border-white/10" />

          <div className="space-y-2">
            <p className="text-white/50 text-xs">Replace image · JPEG, PNG, or WebP · max 1 MB</p>
            <input
              ref={replaceInput}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={replaceSelectedImage}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => replaceInput.current?.click()}
              disabled={replacingImage}
              className="w-full px-3 py-2 rounded-xl border border-white/10 text-white/70 hover:bg-white/5 transition text-sm disabled:opacity-50"
            >
              {replacingImage ? 'Uploading…' : 'Choose replacement image'}
            </button>
            {replaceError && <p role="alert" className="text-red-400 text-xs">{replaceError}</p>}
          </div>

          <div className="space-y-2 text-xs">
            <div>
              <p className="text-white/40 mb-0.5">Project</p>
              <p className="text-white">{selected.project?.title || '—'}</p>
            </div>
            <div>
              <p className="text-white/40 mb-0.5">Alt text</p>
              <input
                value={selected.alt_text || ''}
                onChange={event => setSelected(current => ({ ...current, alt_text: event.target.value }))}
                className="w-full px-2 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-500/50"
                aria-label="Image alt text"
              />
            </div>
            <div>
              <p className="text-white/40 mb-0.5">URL</p>
              <p className="text-white/70 break-all line-clamp-3">{selected.public_url}</p>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <button
              onClick={saveAltText}
              disabled={savingAlt}
              className="flex items-center justify-center gap-2 px-3 py-2 rounded-xl border border-cyan-500/20 text-cyan-300 hover:bg-cyan-500/10 transition text-sm disabled:opacity-50"
            >
              {savingAlt ? 'Saving…' : 'Save image details'}
            </button>
            {selected.project_id && (
              <Link
                to={`/admin/projects/${selected.project_id}/edit`}
                className="flex items-center justify-center gap-2 px-3 py-2 rounded-xl border border-white/10 text-white/60 hover:bg-white/5 hover:text-white transition text-sm"
              >
                Edit project and gallery
              </Link>
            )}
            <button
              onClick={() => copyUrl(selected.public_url)}
              className="flex items-center gap-2 px-3 py-2 rounded-xl border border-white/10 text-white/60 hover:bg-white/5 hover:text-white transition text-sm"
            >
              <FiCopy className="w-4 h-4" /> Copy URL
            </button>
            <button
              onClick={() => { setDeleteId(selected.id); setDeletePath(selected.storage_path) }}
              className="flex items-center gap-2 px-3 py-2 rounded-xl border border-red-500/20 text-red-400/70 hover:bg-red-500/10 hover:text-red-400 transition text-sm"
            >
              <FiTrash2 className="w-4 h-4" /> Delete Image
            </button>
          </div>
        </div>
      )}

      <ConfirmDialog
        isOpen={!!deleteId}
        title="Delete Image"
        message="This will permanently delete the image from storage. Any project referencing it will lose the image."
        confirmLabel="Delete"
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => { setDeleteId(null); setDeletePath(null) }}
      />

      {toast && (
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-6 right-6 px-4 py-3 rounded-xl bg-[#0f1729] border border-white/10 text-white shadow-lg text-sm font-medium z-50"
        >
          {toast}
        </motion.div>
      )}
    </div>
  )
}

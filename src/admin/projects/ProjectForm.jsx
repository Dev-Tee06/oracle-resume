import { useEffect, useState, useCallback } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { supabase, STORAGE_BUCKET } from '../../lib/supabase'
import { slugify, generateStoragePath } from '../../lib/utils'
import ImageUpload, { GalleryUpload } from '../../Components/ImageUpload'
import ConfirmDialog from '../../Components/ConfirmDialog'
import { PageLoader } from '../../Components/LoadingSpinner'
import { FiSave, FiArrowLeft, FiAlertCircle } from 'react-icons/fi'
const CATEGORIES = ['Anniversary', 'Birthday', 'Flyer', 'Logo', 'Branding', 'Social Media', 'Video', 'Other']

function Field({ label, required, error, hint, children, id }) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-sm font-medium text-white/70">
        {label}{required && <span className="text-red-400 ml-1">*</span>}
      </label>
      {children}
      {hint && !error && <p className="text-white/35 text-xs">{hint}</p>}
      {error && <p className="text-red-400 text-xs">{error}</p>}
    </div>
  )
}

const inputClass = "w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 text-sm focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 transition"

export default function ProjectForm() {
  const { id } = useParams()
  const isEdit = !!id
  const navigate = useNavigate()

  const [loading, setLoading] = useState(isEdit)
  const [saving, setSaving] = useState(false)
  const [errors, setErrors] = useState({})
  const [globalError, setGlobalError] = useState(null)
  const [successMsg, setSuccessMsg] = useState(null)
  const [showLeaveConfirm, setShowLeaveConfirm] = useState(false)
  const [isDirty, setIsDirty] = useState(false)

  // Form fields
  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [slugManual, setSlugManual] = useState(false)
  const [shortDesc, setShortDesc] = useState('')
  const [fullDesc, setFullDesc] = useState('')
  const [category, setCategory] = useState('')
  const [customCategory, setCustomCategory] = useState('')
  const [technologies, setTechnologies] = useState('')
  const [clientName, setClientName] = useState('')
  const [projectDate, setProjectDate] = useState('')
  const [liveUrl, setLiveUrl] = useState('')
  const [sourceUrl, setSourceUrl] = useState('')
  const [isFeatured, setIsFeatured] = useState(false)
  const [status, setStatus] = useState('draft')
  const [sortOrder, setSortOrder] = useState(0)

  // Images
  const [coverFile, setCoverFile] = useState(null)          // pending new cover file
  const [coverPreview, setCoverPreview] = useState(null)    // preview URL
  const [existingCoverId, setExistingCoverId] = useState(null)
  const [existingCoverUrl, setExistingCoverUrl] = useState(null)
  const [removeCover, setRemoveCover] = useState(false)

  const [galleryImages, setGalleryImages] = useState([])    // { id?, storage_path?, public_url?, alt_text, sort_order, file?, preview?, isNew? }

  // Load existing project
  const loadProject = useCallback(async () => {
    if (!isEdit) return
    setLoading(true)
    const { data: project, error: projErr } = await supabase
      .from('portfolio_projects')
      .select('*, cover_image:portfolio_images!fk_cover_image(*)')
      .eq('id', id)
      .single()

    if (projErr || !project) {
      setGlobalError('Project not found.')
      setLoading(false)
      return
    }

    setTitle(project.title || '')
    setSlug(project.slug || '')
    setSlugManual(true)
    setShortDesc(project.short_description || '')
    setFullDesc(project.full_description || '')
    setCategory(CATEGORIES.includes(project.category) ? project.category : (project.category ? 'Other' : ''))
    setCustomCategory(CATEGORIES.includes(project.category) ? '' : (project.category || ''))
    setTechnologies((project.technologies || []).join(', '))
    setClientName(project.client_name || '')
    setProjectDate(project.project_date ? project.project_date.slice(0, 7) : '')
    setLiveUrl(project.live_url || '')
    setSourceUrl(project.source_url || '')
    setIsFeatured(project.is_featured || false)
    setStatus(project.status || 'draft')
    setSortOrder(project.sort_order || 0)

    if (project.cover_image) {
      setExistingCoverId(project.cover_image.id)
      setExistingCoverUrl(project.cover_image.public_url)
    }

    // Load gallery images
    const { data: gallery } = await supabase
      .from('portfolio_images')
      .select('*')
      .eq('project_id', id)
      .neq('id', project.cover_image_id || 'none')
      .order('sort_order', { ascending: true })

    setGalleryImages(gallery || [])
    setLoading(false)
  }, [id, isEdit])

  useEffect(() => { loadProject() }, [loadProject])

  // Auto-slug from title
  useEffect(() => {
    if (!slugManual && title) {
      setSlug(slugify(title))
    }
  }, [title, slugManual])

  function markDirty() { setIsDirty(true) }

  function validate() {
    const errs = {}
    if (!title.trim()) errs.title = 'Title is required.'
    if (!slug.trim()) errs.slug = 'Slug is required.'
    if (liveUrl && !isValidUrl(liveUrl)) errs.liveUrl = 'Enter a valid URL.'
    if (sourceUrl && !isValidUrl(sourceUrl)) errs.sourceUrl = 'Enter a valid URL.'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  function isValidUrl(url) {
    try { new URL(url); return true } catch { return false }
  }

  async function uploadImage(file, projectId) {
    const path = generateStoragePath(projectId, file.name)
    const { error } = await supabase.storage.from(STORAGE_BUCKET).upload(path, file, { upsert: false })
    if (error) throw new Error(`Upload failed: ${error.message}`)
    const { data: { publicUrl } } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(path)
    return { path, publicUrl }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!validate()) return

    setSaving(true)
    setGlobalError(null)
    setSuccessMsg(null)

    const effectiveCategory = category === 'Other' ? customCategory : category
    const techArray = technologies.split(',').map(t => t.trim()).filter(Boolean)
    const projectDateFormatted = projectDate ? projectDate + '-01' : null

    try {
      let projectId = id

      const projectData = {
        title: title.trim(),
        slug: slug.trim(),
        short_description: shortDesc.trim() || null,
        full_description: fullDesc.trim() || null,
        category: effectiveCategory || null,
        technologies: techArray,
        client_name: clientName.trim() || null,
        project_date: projectDateFormatted,
        live_url: liveUrl.trim() || null,
        source_url: sourceUrl.trim() || null,
        is_featured: isFeatured,
        status,
        sort_order: Number(sortOrder) || 0,
        updated_at: new Date().toISOString(),
      }

      if (!isEdit) {
        // Create project first (no cover yet)
        const { data: newProject, error: createErr } = await supabase
          .from('portfolio_projects')
          .insert({ ...projectData })
          .select('id')
          .single()

        if (createErr) throw new Error(createErr.message)
        projectId = newProject.id
      } else {
        const { error: updateErr } = await supabase
          .from('portfolio_projects')
          .update(projectData)
          .eq('id', id)

        if (updateErr) throw new Error(updateErr.message)
      }

      // Handle cover image
      let newCoverId = isEdit ? existingCoverId : null

      if (removeCover && existingCoverId) {
        // Remove old cover
        const { data: oldImg } = await supabase.from('portfolio_images').select('storage_path').eq('id', existingCoverId).single()
        await supabase.from('portfolio_images').delete().eq('id', existingCoverId)
        if (oldImg?.storage_path) await supabase.storage.from(STORAGE_BUCKET).remove([oldImg.storage_path])
        newCoverId = null
      }

      if (coverFile) {
        const { path, publicUrl } = await uploadImage(coverFile, projectId)
        const { data: imgRecord, error: imgErr } = await supabase
          .from('portfolio_images')
          .insert({ project_id: projectId, storage_path: path, public_url: publicUrl, alt_text: title, sort_order: -1 })
          .select('id')
          .single()
        if (imgErr) throw new Error(imgErr.message)
        newCoverId = imgRecord.id
      }

      // Update cover_image_id on project
      const { error: coverUpdateError } = await supabase
        .from('portfolio_projects')
        .update({ cover_image_id: newCoverId })
        .eq('id', projectId)
      if (coverUpdateError) throw new Error(coverUpdateError.message)

      // Handle gallery images
      // Upload new ones
      const newGalleryItems = galleryImages.filter(img => img.isNew && img.file)
      for (const img of newGalleryItems) {
        const { path, publicUrl } = await uploadImage(img.file, projectId)
        const { error: galleryInsertError } = await supabase.from('portfolio_images').insert({
          project_id: projectId,
          storage_path: path,
          public_url: publicUrl,
          alt_text: img.alt_text || '',
          sort_order: img.sort_order || 0,
        })
        if (galleryInsertError) throw new Error(galleryInsertError.message)
      }

      // Update sort_order + alt_text for existing gallery images
      const existingGallery = galleryImages.filter(img => !img.isNew && img.id)
      for (const img of existingGallery) {
        const { error: galleryUpdateError } = await supabase.from('portfolio_images')
          .update({ sort_order: img.sort_order, alt_text: img.alt_text || '' })
          .eq('id', img.id)
        if (galleryUpdateError) throw new Error(galleryUpdateError.message)
      }

      setIsDirty(false)
      setSuccessMsg(isEdit ? 'Project updated successfully.' : 'Project created successfully.')

      if (!isEdit) {
        setTimeout(() => navigate(`/admin/projects/${projectId}/edit`), 1000)
      } else {
        loadProject()
      }
    } catch (err) {
      setGlobalError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  // Gallery handlers
  function handleGalleryAdd(file, preview) {
    setGalleryImages(prev => [
      ...prev,
      { isNew: true, file, preview, alt_text: '', sort_order: prev.length }
    ])
    markDirty()
  }

  async function handleGalleryRemove(idx) {
    const img = galleryImages[idx]
    if (!img.isNew && img.id) {
      const { data } = await supabase.from('portfolio_images').select('storage_path').eq('id', img.id).single()
      await supabase.from('portfolio_images').delete().eq('id', img.id)
      if (data?.storage_path) await supabase.storage.from(STORAGE_BUCKET).remove([data.storage_path])
    }
    setGalleryImages(prev => prev.filter((_, i) => i !== idx).map((img, i) => ({ ...img, sort_order: i })))
    markDirty()
  }

  function handleGalleryMoveUp(idx) {
    if (idx === 0) return
    setGalleryImages(prev => {
      const next = [...prev]
      ;[next[idx - 1], next[idx]] = [next[idx], next[idx - 1]]
      return next.map((img, i) => ({ ...img, sort_order: i }))
    })
    markDirty()
  }

  function handleGalleryMoveDown(idx) {
    setGalleryImages(prev => {
      if (idx === prev.length - 1) return prev
      const next = [...prev]
      ;[next[idx], next[idx + 1]] = [next[idx + 1], next[idx]]
      return next.map((img, i) => ({ ...img, sort_order: i }))
    })
    markDirty()
  }

  function handleGalleryAltChange(idx, value) {
    setGalleryImages(prev => prev.map((img, i) => i === idx ? { ...img, alt_text: value } : img))
    markDirty()
  }

  if (loading) return <PageLoader />

  const displayCoverUrl = removeCover ? null : (coverPreview || existingCoverUrl)

  return (
    <div className="max-w-4xl space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => isDirty ? setShowLeaveConfirm(true) : navigate('/admin/projects')}
          className="p-2 rounded-xl text-white/40 hover:text-white hover:bg-white/5 transition"
          aria-label="Back to projects"
        >
          <FiArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-white">{isEdit ? 'Edit Project' : 'New Project'}</h1>
          <p className="text-white/40 text-sm mt-0.5">{isEdit ? 'Update project details and images.' : 'Fill in the details for your new project.'}</p>
        </div>
      </div>

      {globalError && (
        <div className="flex items-start gap-2 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
          <FiAlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
          {globalError}
        </div>
      )}
      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm">
          ✓ {successMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} onChange={markDirty} className="space-y-6" noValidate>
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left column: main details */}
          <div className="lg:col-span-2 space-y-5">
            <div className="bg-[#0f1729] border border-white/8 rounded-2xl p-6 space-y-5">
              <h2 className="text-white font-semibold text-sm uppercase tracking-wider opacity-60">Project Details</h2>

              <Field label="Title" required id="proj-title" error={errors.title}>
                <input id="proj-title" type="text" value={title} onChange={e => { setTitle(e.target.value); markDirty() }}
                  className={inputClass} placeholder="e.g. Anniversary Card Design" />
              </Field>

              <Field label="Slug (URL)" required id="proj-slug" error={errors.slug} hint="Auto-generated from title. Customize if needed.">
                <input id="proj-slug" type="text" value={slug}
                  onChange={e => { setSlug(e.target.value); setSlugManual(true); markDirty() }}
                  className={inputClass} placeholder="anniversary-card-design" />
              </Field>

              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Category" id="proj-category">
                  <select id="proj-category" value={category} onChange={e => { setCategory(e.target.value); markDirty() }} className={inputClass}>
                    <option value="">Select category…</option>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </Field>

                {category === 'Other' && (
                  <Field label="Custom Category" id="proj-custom-cat">
                    <input id="proj-custom-cat" type="text" value={customCategory}
                      onChange={e => { setCustomCategory(e.target.value); markDirty() }}
                      className={inputClass} placeholder="e.g. Motion Graphics" />
                  </Field>
                )}

                <Field label="Client / Organization" id="proj-client">
                  <input id="proj-client" type="text" value={clientName}
                    onChange={e => { setClientName(e.target.value); markDirty() }}
                    className={inputClass} placeholder="e.g. BelleAura Cosmetics" />
                </Field>

                <Field label="Project Date" id="proj-date" hint="Month and year">
                  <input id="proj-date" type="month" value={projectDate}
                    onChange={e => { setProjectDate(e.target.value); markDirty() }}
                    className={inputClass} />
                </Field>
              </div>

              <Field label="Short Description" id="proj-short-desc" hint="Shown on portfolio cards (max 200 chars)">
                <textarea id="proj-short-desc" value={shortDesc} rows={2}
                  onChange={e => { setShortDesc(e.target.value); markDirty() }}
                  className={inputClass} maxLength={200}
                  placeholder="A brief overview of the project…" />
              </Field>

              <Field label="Full Description / Case Study" id="proj-full-desc">
                <textarea id="proj-full-desc" value={fullDesc} rows={6}
                  onChange={e => { setFullDesc(e.target.value); markDirty() }}
                  className={inputClass}
                  placeholder="Describe the project, process, outcome…" />
              </Field>

              <Field label="Technologies / Tools" id="proj-tech" hint="Comma-separated: Photoshop, Illustrator, Premiere Pro">
                <input id="proj-tech" type="text" value={technologies}
                  onChange={e => { setTechnologies(e.target.value); markDirty() }}
                  className={inputClass} placeholder="Photoshop, Illustrator, Premiere Pro" />
              </Field>
            </div>

            {/* Links */}
            <div className="bg-[#0f1729] border border-white/8 rounded-2xl p-6 space-y-5">
              <h2 className="text-white font-semibold text-sm uppercase tracking-wider opacity-60">External Links</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Live Project URL" id="proj-live-url" error={errors.liveUrl}>
                  <input id="proj-live-url" type="url" value={liveUrl}
                    onChange={e => { setLiveUrl(e.target.value); markDirty() }}
                    className={inputClass} placeholder="https://…" />
                </Field>
                <Field label="Source Code URL" id="proj-source-url" error={errors.sourceUrl}>
                  <input id="proj-source-url" type="url" value={sourceUrl}
                    onChange={e => { setSourceUrl(e.target.value); markDirty() }}
                    className={inputClass} placeholder="https://github.com/…" />
                </Field>
              </div>
            </div>

            {/* Gallery */}
            <div className="bg-[#0f1729] border border-white/8 rounded-2xl p-6 space-y-4">
              <h2 className="text-white font-semibold text-sm uppercase tracking-wider opacity-60">Gallery Images</h2>
              <p className="text-white/40 text-xs">Additional images for the project gallery. Reorder using the arrows.</p>
              <GalleryUpload
                images={galleryImages}
                onAdd={handleGalleryAdd}
                onRemove={handleGalleryRemove}
                onMoveUp={handleGalleryMoveUp}
                onMoveDown={handleGalleryMoveDown}
                onAltChange={handleGalleryAltChange}
              />
            </div>
          </div>

          {/* Right column: sidebar */}
          <div className="space-y-5">
            {/* Publish settings */}
            <div className="bg-[#0f1729] border border-white/8 rounded-2xl p-5 space-y-4">
              <h2 className="text-white font-semibold text-sm uppercase tracking-wider opacity-60">Publishing</h2>

              <Field label="Status" id="proj-status">
                <select id="proj-status" value={status} onChange={e => { setStatus(e.target.value); markDirty() }} className={inputClass}>
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </Field>

              <Field label="Display Order" id="proj-order" hint="Lower numbers appear first">
                <input id="proj-order" type="number" value={sortOrder} min={0}
                  onChange={e => { setSortOrder(e.target.value); markDirty() }}
                  className={inputClass} />
              </Field>

              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" id="proj-featured" checked={isFeatured}
                  onChange={e => { setIsFeatured(e.target.checked); markDirty() }}
                  className="w-4 h-4 rounded border-white/20 bg-white/5 text-cyan-500 focus:ring-cyan-500/30" />
                <div>
                  <p className="text-white text-sm font-medium">Featured Project</p>
                  <p className="text-white/40 text-xs">Appears in homepage selected work</p>
                </div>
              </label>

              <button
                id="proj-save-btn"
                type="submit"
                disabled={saving}
                className="w-full py-3 rounded-xl font-semibold bg-gradient-to-r from-[#045496] to-[#05d1ed] text-white hover:opacity-90 transition flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {saving ? <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> : <FiSave className="w-4 h-4" />}
                {saving ? 'Saving…' : (status === 'published' ? 'Save & Publish' : 'Save Draft')}
              </button>
            </div>

            {/* Cover image */}
            <div className="bg-[#0f1729] border border-white/8 rounded-2xl p-5 space-y-4">
              <h2 className="text-white font-semibold text-sm uppercase tracking-wider opacity-60">Cover Image</h2>
              <ImageUpload
                label=""
                value={displayCoverUrl}
                onChange={(file, url) => { setCoverFile(file); setCoverPreview(url); setRemoveCover(false); markDirty() }}
                onRemove={() => { setCoverFile(null); setCoverPreview(null); setRemoveCover(true); markDirty() }}
                hint="Recommended: 16:9 ratio, min 800px wide"
              />
            </div>
          </div>
        </div>
      </form>

      {/* Leave confirmation */}
      <ConfirmDialog
        isOpen={showLeaveConfirm}
        title="Discard Changes?"
        message="You have unsaved changes. Are you sure you want to leave?"
        confirmLabel="Discard"
        cancelLabel="Keep Editing"
        onConfirm={() => navigate('/admin/projects')}
        onCancel={() => setShowLeaveConfirm(false)}
      />
    </div>
  )
}

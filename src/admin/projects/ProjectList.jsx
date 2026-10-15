import { useEffect, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { supabase, STORAGE_BUCKET } from '../../lib/supabase'
import { LEGACY_PORTFOLIO_PROJECTS } from '../../lib/legacyPortfolioAssets'
import { generateStoragePath, timeAgo, truncate } from '../../lib/utils'
import StatusBadge from '../../Components/StatusBadge'
import ConfirmDialog from '../../Components/ConfirmDialog'
import { PageLoader } from '../../Components/LoadingSpinner'
import EmptyState from '../../Components/EmptyState'
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiPackage, FiImage, FiEye, FiEyeOff, FiUploadCloud } from 'react-icons/fi'

export default function ProjectList() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterCategory, setFilterCategory] = useState('all')
  const [categories, setCategories] = useState([])

  const [deleteId, setDeleteId] = useState(null)
  const [deleteTitle, setDeleteTitle] = useState('')
  const [deleting, setDeleting] = useState(false)

  const [toastMsg, setToastMsg] = useState(null)
  const [importing, setImporting] = useState(false)

  function showToast(msg, isError = false) {
    setToastMsg({ msg, isError })
    setTimeout(() => setToastMsg(null), 3500)
  }

  const loadProjects = useCallback(async () => {
    setLoading(true)
    setError(null)
    const { data, error } = await supabase
      .from('portfolio_projects')
      .select(`
        id, title, slug, category, status, is_featured, sort_order, updated_at,
        cover_image:portfolio_images!fk_cover_image(public_url, alt_text)
      `)
      .order('sort_order', { ascending: true })
      .order('updated_at', { ascending: false })

    if (error) { setError(`Failed to load projects: ${error.message}`); setLoading(false); return }

    setProjects(data || [])
    const cats = [...new Set((data || []).map(p => p.category).filter(Boolean))]
    setCategories(cats)
    setLoading(false)
  }, [])

  useEffect(() => { loadProjects() }, [loadProjects])

  async function importCurrentImages() {
    setImporting(true)
    setError(null)
    let uploadedCount = 0
    let skippedGroups = 0

    try {
      for (const [projectIndex, legacyProject] of LEGACY_PORTFOLIO_PROJECTS.entries()) {
        let { data: project, error: projectLookupError } = await supabase
          .from('portfolio_projects')
          .select('id, cover_image_id')
          .eq('slug', legacyProject.slug)
          .maybeSingle()
        if (projectLookupError) throw projectLookupError

        if (!project) {
          const { data, error: createError } = await supabase
            .from('portfolio_projects')
            .insert({
              title: legacyProject.title,
              slug: legacyProject.slug,
              category: legacyProject.category,
              short_description: legacyProject.short_description,
              technologies: ['Adobe Photoshop', 'Adobe Illustrator'],
              status: 'published',
              is_featured: true,
              sort_order: projectIndex,
            })
            .select('id, cover_image_id')
            .single()
          if (createError) throw createError
          project = data
        }

        const { data: existingImages, error: imagesError } = await supabase
          .from('portfolio_images')
          .select('id, storage_path, sort_order')
          .eq('project_id', project.id)
          .order('sort_order', { ascending: true })
        if (imagesError) throw imagesError

        // Avoid duplicating galleries imported by the existing migration script
        // or previously added by an editor.
        if (existingImages.length && !existingImages.some(image => image.storage_path.includes('/legacy-'))) {
          skippedGroups += 1
          continue
        }

        let firstImageId = existingImages.find(image => image.sort_order === 0)?.id || null
        for (const [imageIndex, imageUrl] of legacyProject.files.entries()) {
          const extension = new URL(imageUrl, window.location.href).pathname.split('.').pop() || 'jpg'
          const storagePath = `projects/${project.id}/legacy-${imageIndex}.${extension}`
          const { data: existingImage, error: imageLookupError } = await supabase
            .from('portfolio_images')
            .select('id')
            .eq('storage_path', storagePath)
            .maybeSingle()
          if (imageLookupError) throw imageLookupError

          let imageRecord = existingImage
          if (!imageRecord) {
            const response = await fetch(imageUrl)
            if (!response.ok) throw new Error(`Could not read an existing image (${response.status}).`)
            const file = await response.blob()
            const { error: uploadError } = await supabase.storage
              .from(STORAGE_BUCKET)
              .upload(storagePath, file, { upsert: true, contentType: file.type || 'image/jpeg' })
            if (uploadError) throw uploadError
            const { data: publicData } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(storagePath)
            const { data, error: imageInsertError } = await supabase
              .from('portfolio_images')
              .insert({
                project_id: project.id,
                storage_path: storagePath,
                public_url: publicData.publicUrl,
                alt_text: `${legacyProject.category} design ${imageIndex + 1}`,
                sort_order: imageIndex,
              })
              .select('id')
              .single()
            if (imageInsertError) throw imageInsertError
            imageRecord = data
            uploadedCount += 1
          }
          if (imageIndex === 0) firstImageId = imageRecord.id
        }

        if (!project.cover_image_id && firstImageId) {
          const { error: coverError } = await supabase
            .from('portfolio_projects')
            .update({ cover_image_id: firstImageId })
            .eq('id', project.id)
          if (coverError) throw coverError
        }
      }

      await loadProjects()
      showToast(uploadedCount
        ? `Imported ${uploadedCount} existing images. Edit them from their projects or the Media Library.`
        : `Existing image galleries are already available. ${skippedGroups} project groups were left unchanged.`)
    } catch (importError) {
      const hint = importError.code === '42501' || /row-level security/i.test(importError.message)
        ? ' Apply supabase/migrations/006_allow_signed_in_content_edits.sql in the Supabase SQL Editor, then retry.'
        : ''
      setError(`Could not import the existing images: ${importError.message}.${hint}`)
    } finally {
      setImporting(false)
    }
  }

  async function toggleStatus(project) {
    const newStatus = project.status === 'published' ? 'draft' : 'published'
    const { error } = await supabase
      .from('portfolio_projects')
      .update({ status: newStatus, updated_at: new Date().toISOString() })
      .eq('id', project.id)

    if (error) { showToast('Failed to update status.', true); return }
    setProjects(prev => prev.map(p => p.id === project.id ? { ...p, status: newStatus } : p))
    showToast(`"${project.title}" ${newStatus === 'published' ? 'published' : 'unpublished'}.`)
  }

  async function handleDelete() {
    setDeleting(true)
    // Get images to delete from storage
    const { data: images } = await supabase
      .from('portfolio_images')
      .select('storage_path')
      .eq('project_id', deleteId)

    const { error } = await supabase
      .from('portfolio_projects')
      .delete()
      .eq('id', deleteId)

    if (error) {
      showToast('Failed to delete project.', true)
      setDeleting(false)
      setDeleteId(null)
      return
    }

    // Remove images from storage (best-effort, don't block on failure)
    if (images?.length) {
      await supabase.storage.from('portfolio-images').remove(images.map(i => i.storage_path))
    }

    setProjects(prev => prev.filter(p => p.id !== deleteId))
    showToast(`"${deleteTitle}" deleted.`)
    setDeleteId(null)
    setDeleting(false)
  }

  const filtered = projects.filter(p => {
    const matchesSearch = !search || p.title.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = filterStatus === 'all' || p.status === filterStatus
    const matchesCategory = filterCategory === 'all' || p.category === filterCategory
    return matchesSearch && matchesStatus && matchesCategory
  })

  if (loading) return <PageLoader />

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Portfolio Projects</h1>
          <p className="text-white/40 text-sm mt-1">{projects.length} project{projects.length !== 1 ? 's' : ''} total</p>
        </div>
        <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={importCurrentImages}
          disabled={importing}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/10 text-white/70 hover:bg-white/5 hover:text-white text-sm transition disabled:opacity-50"
        >
          <FiUploadCloud className="w-4 h-4" />
          {importing ? 'Importing images…' : 'Import current images'}
        </button>
        <Link
          id="project-list-new-btn"
          to="/admin/projects/new"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#045496] to-[#05d1ed] text-white font-medium text-sm hover:opacity-90 transition shrink-0"
        >
          <FiPlus className="w-4 h-4" />
          Add Project
        </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-48">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
          <input
            type="search"
            placeholder="Search projects…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-[#0f1729] border border-white/8 text-white placeholder-white/30 text-sm focus:outline-none focus:border-cyan-500/50 transition"
          />
        </div>

        {/* Status filter */}
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-3 py-2.5 rounded-xl bg-[#0f1729] border border-white/8 text-white/70 text-sm focus:outline-none focus:border-cyan-500/50"
        >
          <option value="all">All statuses</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
        </select>

        {/* Category filter */}
        {categories.length > 0 && (
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-3 py-2.5 rounded-xl bg-[#0f1729] border border-white/8 text-white/70 text-sm focus:outline-none focus:border-cyan-500/50"
          >
            <option value="all">All categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        )}
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{error}</div>
      )}

      {/* Table */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={<FiPackage />}
          title={search || filterStatus !== 'all' ? 'No matching projects' : 'No projects yet'}
          description={search || filterStatus !== 'all' ? 'Try adjusting your search or filters.' : 'Add your first portfolio project to get started.'}
          action={
            !search && filterStatus === 'all' && (
              <Link to="/admin/projects/new" className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-sm hover:bg-cyan-500/20 transition">
                <FiPlus className="w-4 h-4" /> Add Project
              </Link>
            )
          }
        />
      ) : (
        <div className="bg-[#0f1729] border border-white/8 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="text-left text-white/40 text-xs font-medium px-4 py-3 w-12" />
                  <th className="text-left text-white/40 text-xs font-medium px-4 py-3">Project</th>
                  <th className="text-left text-white/40 text-xs font-medium px-4 py-3 hidden sm:table-cell">Category</th>
                  <th className="text-left text-white/40 text-xs font-medium px-4 py-3">Status</th>
                  <th className="text-left text-white/40 text-xs font-medium px-4 py-3 hidden md:table-cell">Updated</th>
                  <th className="px-4 py-3 text-right text-white/40 text-xs font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filtered.map((project) => (
                  <motion.tr
                    key={project.id}
                    layout
                    className="hover:bg-white/2 transition group"
                  >
                    {/* Cover thumbnail */}
                    <td className="px-4 py-3">
                      <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-white/5 border border-white/10 flex items-center justify-center">
                        <FiImage className="w-6 h-6 text-white/35" />
                        {project.cover_image?.public_url && (
                          <img
                            src={project.cover_image.public_url}
                            alt={project.cover_image.alt_text || project.title}
                            loading="lazy"
                            onError={event => { event.currentTarget.style.display = 'none' }}
                            className="absolute inset-0 w-full h-full object-cover"
                          />
                        )}
                      </div>
                    </td>

                    {/* Title */}
                    <td className="px-4 py-3">
                      <p className="text-white text-sm font-medium">{project.title}</p>
                      {project.is_featured && (
                        <span className="text-xs text-cyan-400/70">Featured</span>
                      )}
                    </td>

                    {/* Category */}
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <span className="text-white/40 text-xs">{project.category || '—'}</span>
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3">
                      <StatusBadge status={project.status} />
                    </td>

                    {/* Updated */}
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className="text-white/40 text-xs">{timeAgo(project.updated_at)}</span>
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        {/* Toggle publish */}
                        <button
                          onClick={() => toggleStatus(project)}
                          title={project.status === 'published' ? 'Unpublish' : 'Publish'}
                          className="p-2 rounded-lg text-white/30 hover:text-amber-400 hover:bg-amber-500/10 transition"
                        >
                          {project.status === 'published'
                            ? <FiEyeOff className="w-4 h-4" />
                            : <FiEye className="w-4 h-4" />}
                        </button>

                        {/* Edit */}
                        <Link
                          to={`/admin/projects/${project.id}/edit`}
                          className="p-2 rounded-lg text-white/30 hover:text-cyan-400 hover:bg-cyan-500/10 transition"
                          aria-label={`Edit ${project.title}`}
                        >
                          <FiEdit2 className="w-4 h-4" />
                        </Link>

                        {/* Delete */}
                        <button
                          onClick={() => { setDeleteId(project.id); setDeleteTitle(project.title) }}
                          className="p-2 rounded-lg text-white/30 hover:text-red-400 hover:bg-red-500/10 transition"
                          aria-label={`Delete ${project.title}`}
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Delete confirmation */}
      <ConfirmDialog
        isOpen={!!deleteId}
        title="Delete Project"
        message={`Are you sure you want to delete "${deleteTitle}"? This will also remove all associated images. This action cannot be undone.`}
        confirmLabel="Delete Project"
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => { setDeleteId(null); setDeleteTitle('') }}
      />

      {/* Toast */}
      {toastMsg && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className={`fixed bottom-6 right-6 px-4 py-3 rounded-xl shadow-lg text-sm font-medium z-50 ${
            toastMsg.isError ? 'bg-red-500 text-white' : 'bg-[#0f1729] border border-white/10 text-white'
          }`}
        >
          {toastMsg.msg}
        </motion.div>
      )}
    </div>
  )
}

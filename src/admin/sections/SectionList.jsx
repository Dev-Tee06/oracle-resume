import { useEffect, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { supabase } from '../../lib/supabase'
import ConfirmDialog from '../../Components/ConfirmDialog'
import { PageLoader } from '../../Components/LoadingSpinner'
import EmptyState from '../../Components/EmptyState'
import StatusBadge from '../../Components/StatusBadge'
import { FiPlus, FiEdit2, FiTrash2, FiLayers, FiToggleLeft, FiToggleRight } from 'react-icons/fi'

const SECTION_TYPE_LABELS = {
  selected_work: 'Selected Work',
  testimonials: 'Testimonials',
  services: 'Services',
  skills:         'Skills & Tools',
  experience:     'Experience',
  certifications: 'Certifications',
  stats:          'Stats & Numbers',
  custom:         'Custom Content',
}

export default function SectionList() {
  const [sections, setSections] = useState([])
  const [loading, setLoading] = useState(true)
  const [deleteId, setDeleteId] = useState(null)
  const [deleteTitle, setDeleteTitle] = useState('')
  const [deleting, setDeleting] = useState(false)
  const [toast, setToast] = useState(null)

  function showToast(msg, isError = false) {
    setToast({ msg, isError })
    setTimeout(() => setToast(null), 3000)
  }

  const load = useCallback(async () => {
    const { data } = await supabase
      .from('portfolio_sections')
      .select('id, title, section_type, status, is_enabled, sort_order, updated_at')
      .order('sort_order', { ascending: true })
    setSections(data || [])
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  async function toggleEnabled(section) {
    const { error } = await supabase
      .from('portfolio_sections')
      .update({ is_enabled: !section.is_enabled, updated_at: new Date().toISOString() })
      .eq('id', section.id)

    if (error) { showToast('Failed to update.', true); return }
    setSections(prev => prev.map(s => s.id === section.id ? { ...s, is_enabled: !s.is_enabled } : s))
    showToast(`"${section.title}" ${!section.is_enabled ? 'enabled' : 'disabled'}.`)
  }

  async function handleDelete() {
    setDeleting(true)
    const { error } = await supabase.from('portfolio_sections').delete().eq('id', deleteId)
    if (error) { showToast('Failed to delete.', true); setDeleting(false); setDeleteId(null); return }
    setSections(prev => prev.filter(s => s.id !== deleteId))
    showToast(`"${deleteTitle}" deleted.`)
    setDeleteId(null)
    setDeleting(false)
  }

  if (loading) return <PageLoader />

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Website Sections</h1>
          <p className="text-white/40 text-sm mt-1">Manage and reorder public-facing website sections.</p>
        </div>
        <Link
          id="section-list-new-btn"
          to="/admin/sections/new"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#045496] to-[#05d1ed] text-white font-medium text-sm hover:opacity-90 transition"
        >
          <FiPlus className="w-4 h-4" />
          New Section
        </Link>
      </div>

      {sections.length === 0 ? (
        <EmptyState
          icon={<FiLayers />}
          title="No sections yet"
          description="Create sections to add custom content areas to your website."
          action={
            <Link to="/admin/sections/new" className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-sm hover:bg-cyan-500/20 transition">
              <FiPlus className="w-4 h-4" /> Create First Section
            </Link>
          }
        />
      ) : (
        <div className="space-y-2">
          {sections.map((section, i) => (
            <motion.div
              key={section.id}
              layout
              className="bg-[#0f1729] border border-white/8 rounded-2xl px-5 py-4 flex items-center gap-4"
            >
              {/* Sort order indicator */}
              <span className="text-white/20 text-xs w-6 text-center shrink-0">{i + 1}</span>

              {/* Type icon */}
              <div className="w-9 h-9 rounded-xl bg-indigo-500/10 flex items-center justify-center shrink-0">
                <FiLayers className="w-4 h-4 text-indigo-400" />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="text-white font-medium text-sm truncate">{section.title}</p>
                <p className="text-white/40 text-xs">{SECTION_TYPE_LABELS[section.section_type] || section.section_type}</p>
              </div>

              {/* Status badges */}
              <div className="flex items-center gap-2 shrink-0">
                <StatusBadge status={section.status} />
                <StatusBadge status={section.is_enabled ? 'enabled' : 'disabled'} />
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={() => toggleEnabled(section)}
                  title={section.is_enabled ? 'Disable' : 'Enable'}
                  className="p-2 rounded-lg text-white/30 hover:text-cyan-400 hover:bg-cyan-500/10 transition"
                >
                  {section.is_enabled
                    ? <FiToggleRight className="w-5 h-5 text-cyan-400" />
                    : <FiToggleLeft className="w-5 h-5" />}
                </button>
                <Link
                  to={`/admin/sections/${section.id}/edit`}
                  className="p-2 rounded-lg text-white/30 hover:text-cyan-400 hover:bg-cyan-500/10 transition"
                >
                  <FiEdit2 className="w-4 h-4" />
                </Link>
                <button
                  onClick={() => { setDeleteId(section.id); setDeleteTitle(section.title) }}
                  className="p-2 rounded-lg text-white/30 hover:text-red-400 hover:bg-red-500/10 transition"
                >
                  <FiTrash2 className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <ConfirmDialog
        isOpen={!!deleteId}
        title="Delete Section"
        message={`Delete "${deleteTitle}"? This cannot be undone.`}
        confirmLabel="Delete"
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => { setDeleteId(null); setDeleteTitle('') }}
      />

      {toast && (
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className={`fixed bottom-6 right-6 px-4 py-3 rounded-xl shadow-lg text-sm font-medium z-50 ${toast.isError ? 'bg-red-500 text-white' : 'bg-[#0f1729] border border-white/10 text-white'}`}
        >
          {toast.msg}
        </motion.div>
      )}
    </div>
  )
}

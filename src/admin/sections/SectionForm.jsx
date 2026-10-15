import { useEffect, useState, useCallback } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { slugify } from '../../lib/utils'
import { PageLoader } from '../../Components/LoadingSpinner'
import { FiArrowLeft, FiSave, FiPlus, FiTrash2 } from 'react-icons/fi'
const SECTION_TYPES = [
  { value: 'selected_work',  label: 'Selected Work',    desc: 'Showcase featured projects from your portfolio' },
  { value: 'testimonials',   label: 'Testimonials',     desc: 'Client reviews and feedback' },
  { value: 'services',       label: 'Services',         desc: 'List your offered services' },
  { value: 'skills',         label: 'Skills & Tools',   desc: 'Technical skills and software expertise' },
  { value: 'experience',     label: 'Experience',       desc: 'Professional work history' },
  { value: 'certifications', label: 'Certifications',   desc: 'Awards, certifications, achievements' },
  { value: 'stats',          label: 'Stats & Numbers',  desc: 'Key metrics and statistics' },
  { value: 'custom',         label: 'Custom Content',   desc: 'Free-form text content block' },
]

const inputClass = "w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 text-sm focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 transition"
const cardClass = "bg-[#0f1729] border border-white/8 rounded-2xl p-5 space-y-4"

// Default content structures per section type
function getDefaultContent(type) {
  switch (type) {
    case 'testimonials':   return { items: [{ text: '', author: '', company: '' }] }
    case 'services':       return { items: [{ title: '', description: '', icon: '' }] }
    case 'skills':         return { items: [{ name: '', level: '' }] }
    case 'experience':     return { items: [{ role: '', company: '', period: '', description: '' }] }
    case 'certifications': return { items: [{ name: '', issuer: '', year: '' }] }
    case 'stats':          return { items: [{ value: '', label: '' }] }
    case 'selected_work':  return { layout: 'grid' }
    case 'custom':         return { text: '' }
    default:               return {}
  }
}

// Dynamic content editor per section type
function ContentEditor({ type, content, onChange }) {
  function update(newContent) { onChange(newContent) }

  function updateItem(idx, field, value) {
    const items = [...(content.items || [])]
    items[idx] = { ...items[idx], [field]: value }
    update({ ...content, items })
  }

  function addItem() {
    const blank = getDefaultContent(type).items?.[0] || {}
    update({ ...content, items: [...(content.items || []), blank] })
  }

  function removeItem(idx) {
    update({ ...content, items: (content.items || []).filter((_, i) => i !== idx) })
  }

  if (type === 'custom') {
    return (
      <div className="space-y-2">
        <label className="block text-sm font-medium text-white/60">Content</label>
        <textarea
          value={content.text || ''}
          onChange={e => update({ ...content, text: e.target.value })}
          rows={8} className={inputClass} placeholder="Enter your content…"
        />
      </div>
    )
  }

  if (type === 'selected_work') {
    return (
      <div className="space-y-2">
        <label className="block text-sm font-medium text-white/60">Layout</label>
        <select value={content.layout || 'grid'} onChange={e => update({ ...content, layout: e.target.value })} className={inputClass}>
          <option value="grid">Grid</option>
          <option value="list">List</option>
        </select>
        <p className="text-white/35 text-xs">Projects marked as "Featured" will be shown automatically.</p>
      </div>
    )
  }

  const items = content.items || []

  const fieldSets = {
    testimonials:   [{ key: 'text', label: 'Testimonial Text', type: 'textarea' }, { key: 'author', label: 'Author Name', type: 'text' }, { key: 'company', label: 'Company / Role', type: 'text' }],
    services:       [{ key: 'title', label: 'Service Title', type: 'text' }, { key: 'description', label: 'Description', type: 'textarea' }],
    skills:         [{ key: 'name', label: 'Skill / Tool', type: 'text' }, { key: 'level', label: 'Level (optional)', type: 'text' }],
    experience:     [{ key: 'role', label: 'Role / Position', type: 'text' }, { key: 'company', label: 'Company', type: 'text' }, { key: 'period', label: 'Period (e.g. 2022–2024)', type: 'text' }, { key: 'description', label: 'Description', type: 'textarea' }],
    certifications: [{ key: 'name', label: 'Certification Name', type: 'text' }, { key: 'issuer', label: 'Issuing Organization', type: 'text' }, { key: 'year', label: 'Year', type: 'text' }],
    stats:          [{ key: 'value', label: 'Value (e.g. 150+)', type: 'text' }, { key: 'label', label: 'Label', type: 'text' }],
  }

  const fields = fieldSets[type] || []

  return (
    <div className="space-y-4">
      {items.map((item, idx) => (
        <div key={idx} className="bg-white/3 border border-white/8 rounded-xl p-4 space-y-3 relative">
          <div className="flex items-center justify-between mb-1">
            <span className="text-white/40 text-xs font-medium">Item {idx + 1}</span>
            {items.length > 1 && (
              <button type="button" onClick={() => removeItem(idx)} className="text-red-400/60 hover:text-red-400 transition">
                <FiTrash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
          {fields.map(field => (
            <div key={field.key} className="space-y-1">
              <label className="block text-xs text-white/50">{field.label}</label>
              {field.type === 'textarea' ? (
                <textarea rows={3} value={item[field.key] || ''}
                  onChange={e => updateItem(idx, field.key, e.target.value)}
                  className={`${inputClass} text-xs`} placeholder={field.label} />
              ) : (
                <input type="text" value={item[field.key] || ''}
                  onChange={e => updateItem(idx, field.key, e.target.value)}
                  className={`${inputClass} text-xs`} placeholder={field.label} />
              )}
            </div>
          ))}
        </div>
      ))}

      <button type="button" onClick={addItem}
        className="flex items-center gap-2 px-3 py-2 rounded-xl border border-dashed border-white/15 text-white/40 hover:text-white/70 hover:border-white/30 transition text-sm w-full justify-center"
      >
        <FiPlus className="w-4 h-4" /> Add Item
      </button>
    </div>
  )
}

export default function SectionForm() {
  const { id } = useParams()
  const isEdit = !!id
  const navigate = useNavigate()

  const [loading, setLoading] = useState(isEdit)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)

  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [slugManual, setSlugManual] = useState(false)
  const [sectionType, setSectionType] = useState('')
  const [subtitle, setSubtitle] = useState('')
  const [status, setStatus] = useState('draft')
  const [isEnabled, setIsEnabled] = useState(true)
  const [sortOrder, setSortOrder] = useState(0)
  const [content, setContent] = useState({})

  const load = useCallback(async () => {
    if (!isEdit) return
    const { data, error } = await supabase
      .from('portfolio_sections')
      .select('*')
      .eq('id', id)
      .single()

    if (error || !data) { setError('Section not found.'); setLoading(false); return }

    setTitle(data.title || '')
    setSlug(data.slug || '')
    setSlugManual(true)
    setSectionType(data.section_type || '')
    setSubtitle(data.subtitle || '')
    setStatus(data.status || 'draft')
    setIsEnabled(data.is_enabled ?? true)
    setSortOrder(data.sort_order || 0)
    setContent(data.content || {})
    setLoading(false)
  }, [id, isEdit])

  useEffect(() => { load() }, [load])

  useEffect(() => {
    if (!slugManual && title) setSlug(slugify(title))
  }, [title, slugManual])

  useEffect(() => {
    if (sectionType && !isEdit) {
      setContent(getDefaultContent(sectionType))
    }
  }, [sectionType, isEdit])

  async function handleSubmit(e) {
    e.preventDefault()
    if (!title.trim() || !sectionType) {
      setError('Title and section type are required.')
      return
    }
    setSaving(true)
    setError(null)

    const payload = {
      title: title.trim(),
      slug: slug.trim(),
      section_type: sectionType,
      subtitle: subtitle.trim() || null,
      content,
      status,
      is_enabled: isEnabled,
      sort_order: Number(sortOrder) || 0,
      updated_at: new Date().toISOString(),
    }

    const { error: err } = isEdit
      ? await supabase.from('portfolio_sections').update(payload).eq('id', id)
      : await supabase.from('portfolio_sections').insert(payload)

    setSaving(false)
    if (err) { setError(err.message); return }
    setSuccess(isEdit ? 'Section updated.' : 'Section created.')
    if (!isEdit) setTimeout(() => navigate('/admin/sections'), 800)
  }

  if (loading) return <PageLoader />

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate('/admin/sections')} className="p-2 rounded-xl text-white/40 hover:text-white hover:bg-white/5 transition">
          <FiArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-white">{isEdit ? 'Edit Section' : 'New Section'}</h1>
          <p className="text-white/40 text-sm mt-0.5">Configure a website content section.</p>
        </div>
      </div>

      {error && <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{error}</div>}
      {success && <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm">✓ {success}</div>}

      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        <div className={cardClass}>
          <h2 className="text-white font-semibold text-sm uppercase tracking-wider opacity-60">Basic Info</h2>

          <div>
            <label htmlFor="sec-title" className="block text-sm font-medium text-white/60 mb-1.5">Title <span className="text-red-400">*</span></label>
            <input id="sec-title" type="text" value={title} onChange={e => setTitle(e.target.value)} className={inputClass} placeholder="e.g. Client Testimonials" required />
          </div>

          <div>
            <label htmlFor="sec-slug" className="block text-sm font-medium text-white/60 mb-1.5">Slug</label>
            <input id="sec-slug" type="text" value={slug} onChange={e => { setSlug(e.target.value); setSlugManual(true) }} className={inputClass} />
          </div>

          <div>
            <label htmlFor="sec-subtitle" className="block text-sm font-medium text-white/60 mb-1.5">Subtitle (optional)</label>
            <input id="sec-subtitle" type="text" value={subtitle} onChange={e => setSubtitle(e.target.value)} className={inputClass} placeholder="A short description displayed below the title" />
          </div>
        </div>

        {/* Section type */}
        {!isEdit && (
          <div className={cardClass}>
            <h2 className="text-white font-semibold text-sm uppercase tracking-wider opacity-60">Section Type <span className="text-red-400">*</span></h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {SECTION_TYPES.map(t => (
                <button
                  key={t.value}
                  type="button"
                  onClick={() => setSectionType(t.value)}
                  className={`text-left p-4 rounded-xl border transition ${
                    sectionType === t.value
                      ? 'border-cyan-500/50 bg-cyan-500/5 text-white'
                      : 'border-white/8 bg-white/3 text-white/60 hover:border-white/20 hover:text-white/80'
                  }`}
                >
                  <p className="font-medium text-sm">{t.label}</p>
                  <p className="text-xs mt-0.5 opacity-70">{t.desc}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Content editor */}
        {sectionType && (
          <div className={cardClass}>
            <h2 className="text-white font-semibold text-sm uppercase tracking-wider opacity-60">Content</h2>
            <ContentEditor type={sectionType} content={content} onChange={setContent} />
          </div>
        )}

        {/* Publishing */}
        <div className={cardClass}>
          <h2 className="text-white font-semibold text-sm uppercase tracking-wider opacity-60">Publishing</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label htmlFor="sec-status" className="block text-sm font-medium text-white/60 mb-1.5">Status</label>
              <select id="sec-status" value={status} onChange={e => setStatus(e.target.value)} className={inputClass}>
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>
            <div>
              <label htmlFor="sec-order" className="block text-sm font-medium text-white/60 mb-1.5">Display Order</label>
              <input id="sec-order" type="number" value={sortOrder} min={0} onChange={e => setSortOrder(e.target.value)} className={inputClass} />
            </div>
            <div className="flex items-end">
              <label className="flex items-center gap-2.5 cursor-pointer pb-2.5">
                <input type="checkbox" checked={isEnabled} onChange={e => setIsEnabled(e.target.checked)}
                  className="w-4 h-4 rounded border-white/20 bg-white/5 text-cyan-500 focus:ring-cyan-500/30" />
                <div>
                  <p className="text-sm text-white font-medium">Enabled</p>
                  <p className="text-xs text-white/40">Visible on public site</p>
                </div>
              </label>
            </div>
          </div>
        </div>

        <button
          id="sec-save-btn"
          type="submit"
          disabled={saving}
          className="w-full py-3 rounded-xl font-semibold bg-gradient-to-r from-[#045496] to-[#05d1ed] text-white hover:opacity-90 transition flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {saving ? <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> : <FiSave className="w-4 h-4" />}
          {saving ? 'Saving…' : 'Save Section'}
        </button>
      </form>
    </div>
  )
}

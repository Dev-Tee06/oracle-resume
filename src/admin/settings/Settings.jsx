import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { supabase } from '../../lib/supabase'
import { PageLoader } from '../../Components/LoadingSpinner'
import { FiPlus, FiSave, FiTrash2 } from 'react-icons/fi'

const inputClass = "w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 text-sm focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 transition"

function SettingsGroup({ title, description, children }) {
  return (
    <div className="bg-[#0f1729] border border-white/8 rounded-2xl p-6 space-y-5">
      <div>
        <h2 className="text-white font-semibold">{title}</h2>
        {description && <p className="text-white/40 text-sm mt-1">{description}</p>}
      </div>
      {children}
    </div>
  )
}

export default function Settings() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState(null)

  // Hero settings
  const [heroName, setHeroName] = useState('')
  const [heroTagline, setHeroTagline] = useState('')
  const [heroSubtitle, setHeroSubtitle] = useState('')
  const [heroQuote, setHeroQuote] = useState('')
  const [heroCta1Label, setHeroCta1Label] = useState('')
  const [heroCta1Url, setHeroCta1Url] = useState('/portfolio')
  const [heroCta2Label, setHeroCta2Label] = useState('')
  const [heroCta2Url, setHeroCta2Url] = useState('/contact')

  // Stats
  const [statsItems, setStatsItems] = useState([])

  // Contact
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [location, setLocation] = useState('')
  const [whatsappUrl, setWhatsappUrl] = useState('')
  const [pinterestUrl, setPinterestUrl] = useState('')
  const [instagramUrl, setInstagramUrl] = useState('')

  function showToast(msg, isError = false) {
    setToast({ msg, isError })
    setTimeout(() => setToast(null), 3000)
  }

  useEffect(() => {
    async function load() {
      const { data, error } = await supabase
        .from('site_settings')
        .select('setting_key, setting_value')

      if (error) {
        showToast(`Could not load settings: ${error.message}`, true)
        setLoading(false)
        return
      }

      const map = {}
      ;(data || []).forEach(s => { map[s.setting_key] = s.setting_value })

      const hero = map.hero || {}
      setHeroName(hero.name || "Oracle's Mind")
      setHeroTagline(hero.tagline || '')
      setHeroSubtitle(hero.subtitle || '')
      setHeroQuote(hero.quote || '')
      setHeroCta1Label(hero.cta_primary_label || 'View Portfolio')
      setHeroCta1Url(hero.cta_primary_url || '/portfolio')
      setHeroCta2Label(hero.cta_secondary_label || 'Contact')
      setHeroCta2Url(hero.cta_secondary_url || '/contact')

      const stats = map.stats || {}
      setStatsItems(stats.items || [])

      const contact = map.contact || {}
      setPhone(contact.phone || '')
      setEmail(contact.email || '')
      setLocation(contact.location || '')
      setWhatsappUrl(contact.whatsapp_url || '')
      setPinterestUrl(contact.pinterest_url || '')
      setInstagramUrl(contact.instagram_url || '')

      setLoading(false)
    }
    load()
  }, [])

  async function handleSave(e) {
    e.preventDefault()
    setSaving(true)

    const updates = [
      {
        key: 'hero',
        value: {
          name: heroName,
          tagline: heroTagline,
          subtitle: heroSubtitle,
          quote: heroQuote,
          cta_primary_label: heroCta1Label,
          cta_primary_url: heroCta1Url,
          cta_secondary_label: heroCta2Label,
          cta_secondary_url: heroCta2Url,
        }
      },
      {
        key: 'stats',
        value: { items: statsItems }
      },
      {
        key: 'contact',
        value: { phone, email, location, whatsapp_url: whatsappUrl, pinterest_url: pinterestUrl, instagram_url: instagramUrl }
      }
    ]

    try {
      const results = await Promise.all(updates.map(({ key, value }) =>
        supabase.from('site_settings').upsert({
          setting_key: key,
          setting_value: value,
          updated_at: new Date().toISOString(),
        }, { onConflict: 'setting_key' })
      ))
      const failed = results.find(result => result.error)
      if (failed) throw failed.error
      showToast('Settings saved successfully.')
    } catch (error) {
      showToast(`Could not save settings: ${error.message}`, true)
    } finally {
      setSaving(false)
    }
  }

  function updateStatItem(idx, field, value) {
    setStatsItems(prev => prev.map((s, i) => i === idx ? { ...s, [field]: value } : s))
  }

  function addStatItem() {
    setStatsItems(prev => [...prev, { value: '', label: '' }])
  }

  function removeStatItem(idx) {
    setStatsItems(prev => prev.filter((_, index) => index !== idx))
  }

  if (loading) return <PageLoader />

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Site Settings</h1>
        <p className="text-white/40 text-sm mt-1">Update website content and contact information.</p>
      </div>

      <form onSubmit={handleSave} className="space-y-5">
        {/* Hero */}
        <SettingsGroup title="Hero Section" description="Text shown on the homepage hero area.">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-sm text-white/60">Brand Name</label>
              <input type="text" value={heroName} onChange={e => setHeroName(e.target.value)} className={inputClass} />
            </div>
            <div className="space-y-1.5">
              <label className="block text-sm text-white/60">Tagline</label>
              <input type="text" value={heroTagline} onChange={e => setHeroTagline(e.target.value)} className={inputClass} placeholder="Vision • Insight • Creation" />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="block text-sm text-white/60">Hero Subtitle</label>
            <textarea rows={3} value={heroSubtitle} onChange={e => setHeroSubtitle(e.target.value)} className={inputClass} />
          </div>
          <div className="space-y-1.5">
            <label className="block text-sm text-white/60">Quote</label>
            <input type="text" value={heroQuote} onChange={e => setHeroQuote(e.target.value)} className={inputClass} placeholder="Your design philosophy quote…" />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-sm text-white/60">Primary CTA Label</label>
              <input type="text" value={heroCta1Label} onChange={e => setHeroCta1Label(e.target.value)} className={inputClass} />
            </div>
            <div className="space-y-1.5">
              <label className="block text-sm text-white/60">Primary CTA URL</label>
              <input type="text" value={heroCta1Url} onChange={e => setHeroCta1Url(e.target.value)} className={inputClass} placeholder="/portfolio" />
            </div>
            <div className="space-y-1.5">
              <label className="block text-sm text-white/60">Secondary CTA Label</label>
              <input type="text" value={heroCta2Label} onChange={e => setHeroCta2Label(e.target.value)} className={inputClass} />
            </div>
            <div className="space-y-1.5">
              <label className="block text-sm text-white/60">Secondary CTA URL</label>
              <input type="text" value={heroCta2Url} onChange={e => setHeroCta2Url(e.target.value)} className={inputClass} placeholder="/contact" />
            </div>
          </div>
        </SettingsGroup>

        {/* Stats */}
        <SettingsGroup title="Stats & Achievements" description="Numbers displayed on the homepage.">
          <div className="space-y-3">
            {statsItems.map((stat, idx) => (
              <div key={idx} className="grid grid-cols-[1fr_1fr_auto] gap-3 items-end">
                <div className="space-y-1">
                  <label className="block text-xs text-white/40">Value</label>
                  <input type="text" value={stat.value || ''} onChange={e => updateStatItem(idx, 'value', e.target.value)}
                    className={inputClass} placeholder="150+" />
                </div>
                <div className="space-y-1">
                  <label className="block text-xs text-white/40">Label</label>
                  <input type="text" value={stat.label || ''} onChange={e => updateStatItem(idx, 'label', e.target.value)}
                    className={inputClass} placeholder="Projects Completed" />
                </div>
                <button type="button" onClick={() => removeStatItem(idx)} aria-label="Remove statistic"
                  className="p-2.5 rounded-xl border border-red-500/20 text-red-400 hover:bg-red-500/10 transition">
                  <FiTrash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            <button type="button" onClick={addStatItem}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-white/10 text-white/60 hover:text-white hover:bg-white/5 text-sm transition">
              <FiPlus className="w-4 h-4" /> Add statistic
            </button>
          </div>
        </SettingsGroup>

        {/* Contact */}
        <SettingsGroup title="Contact Information" description="Displayed on the Contact page and footer.">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-sm text-white/60">Phone</label>
              <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} className={inputClass} />
            </div>
            <div className="space-y-1.5">
              <label className="block text-sm text-white/60">Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} className={inputClass} />
            </div>
            <div className="space-y-1.5">
              <label className="block text-sm text-white/60">Location</label>
              <input type="text" value={location} onChange={e => setLocation(e.target.value)} className={inputClass} />
            </div>
            <div className="space-y-1.5">
              <label className="block text-sm text-white/60">WhatsApp URL</label>
              <input type="url" value={whatsappUrl} onChange={e => setWhatsappUrl(e.target.value)} className={inputClass} />
            </div>
            <div className="space-y-1.5">
              <label className="block text-sm text-white/60">Pinterest URL</label>
              <input type="url" value={pinterestUrl} onChange={e => setPinterestUrl(e.target.value)} className={inputClass} />
            </div>
            <div className="space-y-1.5">
              <label className="block text-sm text-white/60">Instagram URL</label>
              <input type="url" value={instagramUrl} onChange={e => setInstagramUrl(e.target.value)} className={inputClass} />
            </div>
          </div>
        </SettingsGroup>

        <button
          id="settings-save-btn"
          type="submit"
          disabled={saving}
          className="w-full py-3 rounded-xl font-semibold bg-gradient-to-r from-[#045496] to-[#05d1ed] text-white hover:opacity-90 transition flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {saving ? <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> : <FiSave className="w-4 h-4" />}
          {saving ? 'Saving…' : 'Save All Settings'}
        </button>
      </form>

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

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import emailjs from '@emailjs/browser'
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaPinterest, FaInstagram, FaWhatsapp } from 'react-icons/fa'
import { supabase } from '../lib/supabase'

const EMAILJS_SERVICE  = import.meta.env.VITE_EMAILJS_SERVICE_ID
const EMAILJS_TEMPLATE = import.meta.env.VITE_EMAILJS_TEMPLATE_ID
const EMAILJS_KEY      = import.meta.env.VITE_EMAILJS_PUBLIC_KEY

const IS_EMAILJS_CONFIGURED = EMAILJS_SERVICE && !EMAILJS_SERVICE.includes('xxxxxxx')

const DEFAULT_CONTACT = {
  phone: '08146040037', email: 'deoracle711@gmail.com', location: 'Lagos, Nigeria',
  whatsapp_url: 'https://wa.me/qr/F3PQMBZKCQBFK1',
  pinterest_url: 'https://www.pinterest.com/OracleMind02/',
  instagram_url: 'https://www.instagram.com/oracle__mind',
}

export default function Contact() {
  const formRef = useRef(null)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState(null) // null | 'sending' | 'success' | 'error'
  const [contact, setContact] = useState(DEFAULT_CONTACT)

  useEffect(() => {
    supabase.from('site_settings').select('setting_value').eq('setting_key', 'contact').maybeSingle()
      .then(({ data }) => { if (data?.setting_value) setContact(current => ({ ...current, ...data.setting_value })) })
  }, [])

  const contactCards = [
    { icon: FaPhone, label: 'Phone', value: contact.phone, href: `tel:${contact.phone}`, color: 'text-cyan-400' },
    { icon: FaEnvelope, label: 'Email', value: contact.email, href: `mailto:${contact.email}`, color: 'text-indigo-400' },
    { icon: FaMapMarkerAlt, label: 'Location', value: contact.location, href: null, color: 'text-emerald-400' },
  ]
  const socials = [
    { icon: FaPinterest, label: 'Pinterest', href: contact.pinterest_url, color: 'hover:text-red-400' },
    { icon: FaInstagram, label: 'Instagram', href: contact.instagram_url, color: 'hover:text-pink-400' },
    { icon: FaWhatsapp, label: 'WhatsApp', href: contact.whatsapp_url, color: 'hover:text-emerald-400' },
  ].filter(social => social.href)

  async function handleSubmit(e) {
    e.preventDefault()
    setStatus('sending')

    if (!IS_EMAILJS_CONFIGURED) {
      // Simulate success in dev mode
      setTimeout(() => {
        setStatus('success')
        setName(''); setEmail(''); setMessage('')
      }, 800)
      return
    }

    try {
      await emailjs.send(
        EMAILJS_SERVICE,
        EMAILJS_TEMPLATE,
        { from_name: name, from_email: email, message },
        EMAILJS_KEY
      )
      setStatus('success')
      setName(''); setEmail(''); setMessage('')
    } catch {
      setStatus('error')
    }
  }

  const inputClass = "w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-white/35 focus:outline-none focus:ring-2 focus:ring-[#05d1ed]/40 focus:border-[#05d1ed]/50 transition text-sm"

  return (
    <section className="relative bg-black text-white min-h-screen overflow-hidden">
      {/* Background glows */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-r from-[#045496]/20 to-[#05d1ed]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-l from-[#f43f5e]/15 to-[#05d1ed]/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Hero */}
      <div className="max-w-7xl mx-auto px-5 pt-24 pb-12 text-center relative z-10">
        <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="inline-block mb-4 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 text-[#05d1ed] text-sm font-medium">
          Let's Work Together
        </motion.span>
        <motion.h1
          className="text-5xl md:text-6xl font-extrabold gradient-text"
          style={{ fontFamily: 'var(--font-heading)' }}
          initial={{ y: -30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.8 }}
        >
          Get in Touch
        </motion.h1>
        <motion.p className="mt-4 text-white/50 max-w-md mx-auto"
          initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}>
          Whether it's a question, collaboration, or project inquiry — reach out using any of the channels below.
        </motion.p>
      </div>

      <div className="max-w-6xl mx-auto px-5 relative z-10">
        {/* Contact cards */}
        <div className="grid sm:grid-cols-3 gap-5 mb-16">
          {contactCards.map((card, idx) => (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="glass-card rounded-2xl p-8 text-center hover:border-white/20 hover:shadow-[0_0_30px_rgba(5,209,237,0.08)] transition-all group"
            >
              <card.icon className={`text-4xl mb-4 mx-auto ${card.color}`} />
              <h3 className="text-white font-semibold mb-2">{card.label}</h3>
              {card.href ? (
                <a href={card.href} className="text-white/60 text-sm hover:text-white transition break-all">{card.value}</a>
              ) : (
                <p className="text-white/60 text-sm">{card.value}</p>
              )}
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-12 pb-24">
          {/* Contact form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-2xl font-bold text-white mb-6" style={{ fontFamily: 'var(--font-heading)' }}>Send a Message</h2>

            {status === 'success' ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-card rounded-2xl p-8 text-center"
              >
                <div className="w-14 h-14 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center mx-auto mb-4">
                  <span className="text-emerald-400 text-2xl">✓</span>
                </div>
                <h3 className="text-white font-semibold text-lg mb-2">Message Sent!</h3>
                <p className="text-white/50 text-sm mb-5">Thanks for reaching out. I'll get back to you shortly.</p>
                <button onClick={() => setStatus(null)} className="text-cyan-400 text-sm hover:underline">Send another message</button>
              </motion.div>
            ) : (
              <form ref={formRef} onSubmit={handleSubmit} className="space-y-4" noValidate>
                <div>
                  <label htmlFor="contact-name" className="block text-white/50 text-sm mb-1.5">Your Name</label>
                  <input id="contact-name" type="text" value={name} onChange={e => setName(e.target.value)}
                    required className={inputClass} placeholder="John Doe" />
                </div>
                <div>
                  <label htmlFor="contact-email" className="block text-white/50 text-sm mb-1.5">Email Address</label>
                  <input id="contact-email" type="email" value={email} onChange={e => setEmail(e.target.value)}
                    required className={inputClass} placeholder="john@example.com" />
                </div>
                <div>
                  <label htmlFor="contact-message" className="block text-white/50 text-sm mb-1.5">Message</label>
                  <textarea id="contact-message" value={message} onChange={e => setMessage(e.target.value)}
                    rows={6} required className={inputClass} placeholder="Tell me about your project…" />
                </div>

                {status === 'error' && (
                  <p className="text-red-400 text-sm">Failed to send. Please try emailing directly at {contact.email}.</p>
                )}

                <button
                  id="contact-submit-btn"
                  type="submit"
                  disabled={status === 'sending' || !name || !email || !message}
                  className="w-full px-6 py-4 rounded-2xl font-bold bg-gradient-to-r from-[#045496] to-[#05d1ed] text-white hover:opacity-90 transition disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {status === 'sending'
                    ? <><div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Sending…</>
                    : 'Send Message'}
                </button>
              </form>
            )}
          </motion.div>

          {/* Socials + additional info */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-8"
          >
            <div>
              <h2 className="text-2xl font-bold text-white mb-6" style={{ fontFamily: 'var(--font-heading)' }}>Connect Online</h2>
              <div className="flex gap-4">
                {socials.map(social => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={social.label}
                    className={`w-12 h-12 rounded-2xl glass-card flex items-center justify-center text-white/50 ${social.color} hover:border-white/25 transition`}
                  >
                    <social.icon className="text-xl" />
                  </a>
                ))}
              </div>
            </div>

            <div className="glass-card rounded-2xl p-6">
              <h3 className="text-white font-semibold mb-2">Response Time</h3>
              <p className="text-white/50 text-sm leading-relaxed">
                I typically respond within 24 hours. For urgent projects, WhatsApp is the fastest way to reach me.
              </p>
              <a
                href={contact.whatsapp_url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 mt-4 px-4 py-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium hover:bg-emerald-500/15 transition"
              >
                <FaWhatsapp className="text-lg" />
                Chat on WhatsApp
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import {
  FaInstagram,
  FaPinterest,
  FaWhatsapp,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
} from 'react-icons/fa'
import logo from '../assets/logo.jpg'

const navLinks = [
  { to: '/',          label: 'Home' },
  { to: '/about',     label: 'About' },
  { to: '/services',  label: 'Services' },
  { to: '/portfolio', label: 'Portfolio' },
  { to: '/contact',   label: 'Contact' },
]

export default function Footer() {
  const [hero, setHero] = useState({ name: "Oracle's Mind", subtitle: 'Creative Artist & Video Editor crafting visuals and videos that communicate clarity, creativity, and emotion.' })
  const [contact, setContact] = useState({
    phone: '08146040037', email: 'deoracle711@gmail.com', location: 'Lagos, Nigeria',
    whatsapp_url: 'https://wa.me/qr/F3PQMBZKCQBFK1',
    pinterest_url: 'https://www.pinterest.com/OracleMind02/',
    instagram_url: 'https://www.instagram.com/oracle__mind',
  })

  useEffect(() => {
    supabase.from('site_settings').select('setting_key, setting_value').in('setting_key', ['hero', 'contact'])
      .then(({ data }) => {
        const settings = Object.fromEntries((data || []).map(row => [row.setting_key, row.setting_value]))
        if (settings.hero) setHero(current => ({ ...current, ...settings.hero }))
        if (settings.contact) setContact(current => ({ ...current, ...settings.contact }))
      })
  }, [])

  const socials = [
    { icon: FaPinterest, label: 'Pinterest', href: contact.pinterest_url, color: 'hover:text-red-400 hover:border-red-400/30' },
    { icon: FaInstagram, label: 'Instagram', href: contact.instagram_url, color: 'hover:text-pink-400 hover:border-pink-400/30' },
    { icon: FaWhatsapp, label: 'WhatsApp', href: contact.whatsapp_url, color: 'hover:text-emerald-400 hover:border-emerald-400/30' },
  ].filter(social => social.href)

  return (
    <footer className="relative bg-black border-t border-white/6 overflow-hidden">
      {/* Subtle top glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-[#05d1ed]/30 to-transparent" />

      <div className="max-w-6xl mx-auto px-5 pt-16 pb-8 relative z-10">
        <div className="grid md:grid-cols-3 gap-12 mb-12">
          {/* ─── BRAND ─── */}
          <div>
            <Link to="/" className="flex items-center gap-3 mb-4 group">
              <img
                src={logo}
                alt={hero.name}
                className="w-12 h-12 rounded-full object-contain border border-white/10 group-hover:border-cyan-500/40 transition"
              />
              <span className="text-white font-bold text-lg" style={{ fontFamily: 'var(--font-heading)' }}>
                {hero.name}
              </span>
            </Link>
            <p className="text-white/50 text-sm leading-relaxed max-w-xs">
              {hero.subtitle}
            </p>

            {/* Social icons */}
            <div className="flex gap-3 mt-5">
              {socials.map(social => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={social.label}
                  className={`w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40 ${social.color} transition`}
                >
                  <social.icon className="text-sm" />
                </a>
              ))}
            </div>
          </div>

          {/* ─── QUICK LINKS ─── */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider opacity-70">Quick Links</h3>
            <ul className="space-y-2.5">
              {navLinks.map(link => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-white/50 text-sm hover:text-white hover:translate-x-1 transition-all duration-200 inline-block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ─── CONTACT ─── */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider opacity-70">Contact</h3>
            <div className="space-y-3">
              <a href={`mailto:${contact.email}`} className="flex items-center gap-3 text-white/50 text-sm hover:text-white transition group">
                <FaEnvelope className="text-[#05d1ed] group-hover:scale-110 transition shrink-0" />
                {contact.email}
              </a>
              <a href={`tel:${contact.phone}`} className="flex items-center gap-3 text-white/50 text-sm hover:text-white transition group">
                <FaPhone className="text-[#05d1ed] group-hover:scale-110 transition shrink-0" />
                {contact.phone}
              </a>
              <div className="flex items-center gap-3 text-white/50 text-sm">
                <FaMapMarkerAlt className="text-[#05d1ed] shrink-0" />
                {contact.location}
              </div>
              <a href={contact.whatsapp_url} target="_blank" rel="noreferrer"
                className="inline-flex items-center gap-2 mt-2 px-3 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium hover:bg-emerald-500/15 transition">
                <FaWhatsapp /> Chat on WhatsApp
              </a>
            </div>
          </div>
        </div>

        {/* ─── BOTTOM BAR ─── */}
        <div className="pt-6 border-t border-white/6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-white/30 text-xs">
            © {new Date().getFullYear()} {hero.name}. All rights reserved.
          </p>
          <p className="text-white/20 text-xs">
            Designed with intention. Built to inspire.
          </p>
        </div>
      </div>
    </footer>
  )
}

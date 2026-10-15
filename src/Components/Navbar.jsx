import { NavLink, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import logo from '../assets/logo.jpg'
import { HiMenuAlt3, HiX } from 'react-icons/hi'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '../lib/supabase'

const publicLinks = [
  { to: '/',          label: 'Home' },
  { to: '/about',     label: 'About' },
  { to: '/services',  label: 'Services' },
  { to: '/portfolio', label: 'Portfolio' },
  { to: '/contact',   label: 'Contact' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [brandName, setBrandName] = useState("Oracle's Mind")
  const location = useLocation()

  // Close mobile menu on route change
  useEffect(() => setOpen(false), [location.pathname])

  useEffect(() => {
    supabase.from('site_settings').select('setting_value').eq('setting_key', 'hero').maybeSingle()
      .then(({ data }) => { if (data?.setting_value?.name) setBrandName(data.setting_value.name) })
  }, [])

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const linkClass = ({ isActive }) =>
    `relative text-sm font-medium transition-colors duration-300 group
     ${isActive ? 'text-[#05d1ed]' : 'text-white/75 hover:text-white'}`

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-black/80 backdrop-blur-xl border-b border-white/8 shadow-[0_4px_30px_rgba(0,0,0,0.4)]'
          : 'bg-black border-b border-white/8'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <NavLink to="/" className="flex items-center gap-3 group" aria-label={`${brandName} home`}>
            <img
              src={logo}
              alt={`${brandName} logo`}
              className="h-12 w-12 rounded-full object-contain border border-white/10 group-hover:border-cyan-500/40 drop-shadow-[0_2px_8px_rgba(5,209,237,0.25)] transition-all duration-300"
            />
            <span className="text-white font-semibold text-base hidden sm:block tracking-tight" style={{ fontFamily: 'var(--font-heading)' }}>
              {brandName}
            </span>
          </NavLink>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-8">
            {publicLinks.map(({ to, label }) => (
              <NavLink key={to} to={to} className={linkClass} end={to === '/'}>
                {({ isActive }) => (
                  <>
                    {label}
                    <span className={`absolute -bottom-1 left-0 h-px w-full bg-[#05d1ed] transition-transform duration-300 origin-left ${isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`} />
                  </>
                )}
              </NavLink>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center">
            <NavLink
              to="/contact"
              className="px-5 py-2 rounded-full bg-gradient-to-r from-[#045496] to-[#05d1ed] text-white text-sm font-semibold hover:opacity-90 transition shadow-[0_2px_20px_rgba(5,209,237,0.25)]"
            >
              Get Started
            </NavLink>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden text-white/70 hover:text-white focus:outline-none p-2 rounded-xl hover:bg-white/5 transition"
            aria-label={open ? 'Close navigation' : 'Open navigation'}
            aria-expanded={open}
          >
            {open ? <HiX size={24} /> : <HiMenuAlt3 size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="md:hidden border-t border-white/8 bg-black/95 backdrop-blur-xl"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            style={{ overflow: 'hidden' }}
          >
            <div className="px-4 py-5 space-y-1">
              {publicLinks.map(({ to, label }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={to === '/'}
                  className={({ isActive }) =>
                    `block px-4 py-3 rounded-xl text-sm font-medium transition-all
                    ${isActive
                      ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                      : 'text-white/65 hover:text-white hover:bg-white/5'}`
                  }
                >
                  {label}
                </NavLink>
              ))}
              <div className="pt-2">
                <NavLink
                  to="/contact"
                  className="block text-center px-4 py-3 rounded-xl bg-gradient-to-r from-[#045496] to-[#05d1ed] text-white text-sm font-semibold hover:opacity-90 transition"
                >
                  Get Started
                </NavLink>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}

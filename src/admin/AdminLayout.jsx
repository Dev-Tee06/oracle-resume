import { useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import logo from '../assets/logo.jpg'
import {
  FiGrid, FiImage, FiLayers, FiSettings, FiLogOut,
  FiExternalLink, FiMenu, FiX,
} from 'react-icons/fi'

const navItems = [
  { to: '/admin/dashboard', icon: FiGrid,    label: 'Overview' },
  { to: '/admin/projects',  icon: FiImage,   label: 'Projects' },
  { to: '/admin/sections',  icon: FiLayers,  label: 'Sections' },
  { to: '/admin/media',     icon: FiImage,   label: 'Media Library' },
  { to: '/admin/settings',  icon: FiSettings,label: 'Settings' },
]

function SidebarContent({ onNavClick }) {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  async function handleLogout() {
    await signOut()
    navigate('/admin/login')
  }

  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-6 py-6 border-b border-white/5">
        <div className="flex items-center gap-3">
          <img src={logo} alt="Oracle's Mind" className="w-10 h-10 rounded-full object-contain border border-cyan-500/30" />
          <div>
            <p className="text-white font-semibold text-sm leading-tight">Oracle's Mind</p>
            <p className="text-white/40 text-xs">Admin Dashboard</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1" aria-label="Admin navigation">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            onClick={onNavClick}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group
              ${isActive
                ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                : 'text-white/50 hover:text-white hover:bg-white/5'}`
            }
          >
            {({ isActive }) => (
              <>
                <Icon className={`w-4 h-4 shrink-0 transition-colors ${isActive ? 'text-cyan-400' : 'text-white/40 group-hover:text-white/70'}`} />
                {label}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Bottom: view site + user + logout */}
      <div className="px-3 py-4 border-t border-white/5 space-y-1">
        <a
          href="/"
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-white/50 hover:text-white hover:bg-white/5 transition"
        >
          <FiExternalLink className="w-4 h-4 shrink-0 text-white/40" />
          View Website
        </a>

        {/* User info */}
        <div className="px-3 py-2.5 flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#045496] to-[#05d1ed] flex items-center justify-center text-white text-xs font-bold shrink-0">
            {user?.email?.[0]?.toUpperCase() || 'A'}
          </div>
          <p className="text-white/50 text-xs truncate">{user?.email}</p>
        </div>

        <button
          onClick={handleLogout}
          id="admin-logout-btn"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-white/50 hover:text-red-400 hover:bg-red-500/5 transition w-full"
        >
          <FiLogOut className="w-4 h-4 shrink-0" />
          Sign Out
        </button>
      </div>
    </div>
  )
}

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-[#06080f] flex">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-[#0a0f1e] border-r border-white/5 fixed h-full z-40">
        <SidebarContent />
      </aside>

      {/* Mobile sidebar backdrop */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            className="fixed inset-0 z-40 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
            <motion.aside
              className="absolute left-0 top-0 bottom-0 w-64 bg-[#0a0f1e] border-r border-white/5"
              initial={{ x: -264 }}
              animate={{ x: 0 }}
              exit={{ x: -264 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            >
              <SidebarContent onNavClick={() => setSidebarOpen(false)} />
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        {/* Mobile top bar */}
        <div className="lg:hidden flex items-center justify-between px-4 py-4 border-b border-white/5 bg-[#0a0f1e] sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <img src={logo} alt="Oracle's Mind" className="w-8 h-8 rounded-full object-contain" />
            <span className="text-white font-semibold text-sm">Admin</span>
          </div>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-white/60 hover:text-white transition"
            aria-label="Toggle navigation"
          >
            {sidebarOpen ? <FiX size={22} /> : <FiMenu size={22} />}
          </button>
        </div>

        {/* Page content */}
        <main className="flex-1 p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

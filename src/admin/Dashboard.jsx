import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { supabase } from '../lib/supabase'
import { timeAgo, truncate } from '../lib/utils'
import StatusBadge from '../Components/StatusBadge'
import { PageLoader } from '../Components/LoadingSpinner'
import { FiPlus, FiEdit2, FiPackage, FiCheckCircle, FiFileText, FiLayers } from 'react-icons/fi'

export default function Dashboard() {
  const [stats, setStats] = useState(null)
  const [recentProjects, setRecentProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function load() {
      try {
        const [projectsRes, sectionsRes, recentRes] = await Promise.all([
          supabase.from('portfolio_projects').select('id, status'),
          supabase.from('portfolio_sections').select('id, is_enabled'),
          supabase
            .from('portfolio_projects')
            .select('id, title, category, status, is_featured, updated_at')
            .order('updated_at', { ascending: false })
            .limit(6),
        ])

        const projects = projectsRes.data || []
        const sections = sectionsRes.data || []

        setStats({
          total: projects.length,
          published: projects.filter(p => p.status === 'published').length,
          draft: projects.filter(p => p.status === 'draft').length,
          sections: sections.length,
          enabledSections: sections.filter(s => s.is_enabled).length,
        })
        setRecentProjects(recentRes.data || [])
      } catch (e) {
        setError('Failed to load dashboard data.')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  if (loading) return <PageLoader />

  const statCards = [
    { label: 'Total Projects', value: stats?.total ?? 0, icon: FiPackage, color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20' },
    { label: 'Published', value: stats?.published ?? 0, icon: FiCheckCircle, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
    { label: 'Drafts', value: stats?.draft ?? 0, icon: FiFileText, color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' },
    { label: 'Sections', value: stats?.sections ?? 0, icon: FiLayers, color: 'text-cyan-400', bg: 'bg-cyan-500/10 border-cyan-500/20' },
  ]

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Overview</h1>
          <p className="text-white/40 text-sm mt-1">Welcome back. Here's what's happening.</p>
        </div>
        <div className="flex gap-3">
          <Link
            to="/admin/sections/new"
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-white/10 text-white/60 hover:bg-white/5 hover:text-white text-sm transition"
          >
            <FiLayers className="w-4 h-4" />
            New Section
          </Link>
          <Link
            id="dashboard-add-project-btn"
            to="/admin/projects/new"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#045496] to-[#05d1ed] text-white font-medium text-sm hover:opacity-90 transition"
          >
            <FiPlus className="w-4 h-4" />
            New Project
          </Link>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{error}</div>
      )}

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className={`bg-[#0f1729] border ${card.bg} rounded-2xl p-5`}
          >
            <div className={`w-10 h-10 rounded-xl ${card.bg} flex items-center justify-center mb-3`}>
              <card.icon className={`w-5 h-5 ${card.color}`} />
            </div>
            <p className={`text-2xl font-bold ${card.color}`}>{card.value}</p>
            <p className="text-white/50 text-sm mt-1">{card.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Quick actions */}
      <div className="grid sm:grid-cols-3 gap-4">
        <Link
          to="/admin/projects/new"
          className="group bg-[#0f1729] border border-white/8 rounded-2xl p-5 hover:border-cyan-500/30 hover:bg-[#0f1729]/80 transition flex flex-col gap-2"
        >
          <div className="w-9 h-9 rounded-xl bg-cyan-500/10 flex items-center justify-center">
            <FiPlus className="w-4 h-4 text-cyan-400" />
          </div>
          <p className="text-white font-medium text-sm">Add Project</p>
          <p className="text-white/40 text-xs">Upload a new portfolio project</p>
        </Link>

        <Link
          to="/admin/sections/new"
          className="group bg-[#0f1729] border border-white/8 rounded-2xl p-5 hover:border-indigo-500/30 transition flex flex-col gap-2"
        >
          <div className="w-9 h-9 rounded-xl bg-indigo-500/10 flex items-center justify-center">
            <FiLayers className="w-4 h-4 text-indigo-400" />
          </div>
          <p className="text-white font-medium text-sm">New Section</p>
          <p className="text-white/40 text-xs">Add a website section</p>
        </Link>

        <a
          href="/"
          target="_blank"
          rel="noreferrer"
          className="group bg-[#0f1729] border border-white/8 rounded-2xl p-5 hover:border-emerald-500/30 transition flex flex-col gap-2"
        >
          <div className="w-9 h-9 rounded-xl bg-emerald-500/10 flex items-center justify-center">
            <FiCheckCircle className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-white font-medium text-sm">Preview Website</p>
          <p className="text-white/40 text-xs">See the public portfolio</p>
        </a>
      </div>

      {/* Recent projects */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-white font-semibold">Recent Projects</h2>
          <Link to="/admin/projects" className="text-cyan-400 text-sm hover:text-cyan-300 transition">
            View all →
          </Link>
        </div>

        {recentProjects.length === 0 ? (
          <div className="bg-[#0f1729] border border-white/8 rounded-2xl p-10 text-center">
            <FiPackage className="w-8 h-8 text-white/20 mx-auto mb-3" />
            <p className="text-white/50 text-sm">No projects yet.</p>
            <Link to="/admin/projects/new" className="inline-flex items-center gap-1.5 mt-3 text-cyan-400 text-sm hover:text-cyan-300 transition">
              <FiPlus className="w-3.5 h-3.5" /> Add your first project
            </Link>
          </div>
        ) : (
          <div className="bg-[#0f1729] border border-white/8 rounded-2xl overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="text-left text-white/40 text-xs font-medium px-5 py-3">Project</th>
                  <th className="text-left text-white/40 text-xs font-medium px-5 py-3 hidden sm:table-cell">Category</th>
                  <th className="text-left text-white/40 text-xs font-medium px-5 py-3">Status</th>
                  <th className="text-left text-white/40 text-xs font-medium px-5 py-3 hidden md:table-cell">Updated</th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {recentProjects.map((project) => (
                  <tr key={project.id} className="hover:bg-white/2 transition">
                    <td className="px-5 py-3.5">
                      <p className="text-white text-sm font-medium truncate max-w-[180px]">{project.title}</p>
                    </td>
                    <td className="px-5 py-3.5 hidden sm:table-cell">
                      <span className="text-white/40 text-xs">{project.category || '—'}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <StatusBadge status={project.status} />
                    </td>
                    <td className="px-5 py-3.5 hidden md:table-cell">
                      <span className="text-white/40 text-xs">{timeAgo(project.updated_at)}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <Link
                        to={`/admin/projects/${project.id}/edit`}
                        className="text-white/30 hover:text-cyan-400 transition"
                        aria-label={`Edit ${project.title}`}
                      >
                        <FiEdit2 className="w-4 h-4" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

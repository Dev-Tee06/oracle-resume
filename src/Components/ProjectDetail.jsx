import { useEffect, useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { supabase } from '../lib/supabase'
import { formatDate } from '../lib/utils'
import { PageLoader } from './LoadingSpinner'
import { FiArrowLeft, FiExternalLink, FiGithub, FiX, FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import { FaPinterest } from 'react-icons/fa'

export default function ProjectDetail() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const [project, setProject] = useState(null)
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [lightbox, setLightbox] = useState(null) // index of open image

  useEffect(() => {
    async function load() {
      setLoading(true)
      const { data: proj, error } = await supabase
        .from('portfolio_projects')
        .select(`
          *,
          cover_image:portfolio_images!fk_cover_image(id, public_url, alt_text)
        `)
        .eq('slug', slug)
        .eq('status', 'published')
        .single()

      if (error || !proj) { setNotFound(true); setLoading(false); return }
      setProject(proj)

      const { data: imgs } = await supabase
        .from('portfolio_images')
        .select('id, public_url, alt_text, sort_order')
        .eq('project_id', proj.id)
        .order('sort_order', { ascending: true })

      setImages(imgs || [])
      setLoading(false)
    }
    load()
  }, [slug])

  // Keyboard navigation for lightbox
  useEffect(() => {
    if (lightbox === null) return
    function handleKey(e) {
      if (e.key === 'Escape') setLightbox(null)
      if (e.key === 'ArrowRight') setLightbox(i => (i + 1) % images.length)
      if (e.key === 'ArrowLeft') setLightbox(i => (i - 1 + images.length) % images.length)
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [lightbox, images.length])

  if (loading) return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <PageLoader />
    </div>
  )

  if (notFound) return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-4 text-center px-4">
      <h1 className="text-2xl font-bold text-white">Project Not Found</h1>
      <p className="text-white/50">This project doesn't exist or has been unpublished.</p>
      <Link to="/portfolio" className="text-[#05d1ed] hover:underline text-sm">← Back to Portfolio</Link>
    </div>
  )

  const techList = project.technologies?.filter(Boolean) || []
  const galleryImages = images.filter(img => img.id !== project.cover_image?.id)
  const allImages = [
    ...(project.cover_image ? [project.cover_image] : []),
    ...galleryImages,
  ]

  return (
    <div className="bg-black min-h-screen">
      {/* Hero image */}
      {project.cover_image?.public_url && (
        <div className="relative h-64 md:h-96 overflow-hidden">
          <img
            src={project.cover_image.public_url}
            alt={project.cover_image.alt_text || project.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
        </div>
      )}

      <div className="max-w-4xl mx-auto px-5 py-12">
        {/* Back button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-8"
        >
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-white/50 hover:text-white text-sm transition"
          >
            <FiArrowLeft className="w-4 h-4" />
            Back to Portfolio
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Category tag */}
          {project.category && (
            <span className="inline-block mb-3 px-3 py-1 rounded-full text-xs font-medium bg-[#05d1ed]/10 text-[#05d1ed] border border-[#05d1ed]/20">
              {project.category}
            </span>
          )}

          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
            {project.title}
          </h1>

          {/* Meta row */}
          <div className="flex flex-wrap gap-6 mb-8 text-sm text-white/45">
            {project.client_name && <span>Client: <span className="text-white/70">{project.client_name}</span></span>}
            {project.project_date && <span>Date: <span className="text-white/70">{formatDate(project.project_date)}</span></span>}
          </div>

          {/* Short description */}
          {project.short_description && (
            <p className="text-lg text-white/70 leading-relaxed mb-8 max-w-2xl">{project.short_description}</p>
          )}

          {/* Links */}
          <div className="flex flex-wrap gap-3 mb-10">
            {project.live_url && (
              <a href={project.live_url} target="_blank" rel="noreferrer"
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#045496] to-[#05d1ed] text-white text-sm font-medium hover:opacity-90 transition">
                <FiExternalLink className="w-4 h-4" /> View Live
              </a>
            )}
            {project.source_url && (
              <a href={project.source_url} target="_blank" rel="noreferrer"
                className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/20 text-white/70 text-sm hover:bg-white/5 hover:text-white transition">
                <FiGithub className="w-4 h-4" /> Source Code
              </a>
            )}
          </div>

          {/* Technologies */}
          {techList.length > 0 && (
            <div className="mb-10">
              <h2 className="text-sm font-semibold text-white/40 uppercase tracking-wider mb-3">Tools & Technologies</h2>
              <div className="flex flex-wrap gap-2">
                {techList.map(tech => (
                  <span key={tech} className="px-3 py-1 rounded-full text-xs bg-white/5 border border-white/10 text-white/65">{tech}</span>
                ))}
              </div>
            </div>
          )}

          {/* Full description */}
          {project.full_description && (
            <div className="mb-12">
              <h2 className="text-xl font-bold text-white mb-4" style={{ fontFamily: 'var(--font-heading)' }}>About this project</h2>
              <div className="prose prose-invert max-w-none">
                <p className="text-white/65 leading-relaxed whitespace-pre-line">{project.full_description}</p>
              </div>
            </div>
          )}

          {/* Image gallery */}
          {allImages.length > 1 && (
            <div className="mb-12">
              <h2 className="text-xl font-bold text-white mb-6" style={{ fontFamily: 'var(--font-heading)' }}>Gallery</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {allImages.map((img, idx) => (
                  <motion.div
                    key={img.id}
                    whileHover={{ scale: 1.02 }}
                    onClick={() => setLightbox(idx)}
                    className="cursor-pointer overflow-hidden rounded-2xl border border-white/8 hover:border-cyan-500/30 transition-all"
                  >
                    <img
                      src={img.public_url}
                      alt={img.alt_text || `${project.title} — image ${idx + 1}`}
                      className="w-full h-44 object-cover"
                      loading="lazy"
                    />
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </motion.div>

        {/* CTA */}
        <div className="text-center pt-8 border-t border-white/8">
          <p className="text-white/50 mb-4">Interested in working together?</p>
          <Link
            to="/contact"
            className="inline-block px-8 py-3.5 rounded-full bg-gradient-to-r from-[#045496] to-[#05d1ed] text-white font-semibold hover:opacity-90 transition shadow-[0_4px_24px_rgba(5,209,237,0.25)]"
          >
            Get Your Project Started
          </Link>
        </div>
      </div>

      {/* Lightbox */}
      {lightbox !== null && (
        <motion.div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <button
            onClick={() => setLightbox(null)}
            className="absolute top-4 right-4 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition z-10"
            aria-label="Close lightbox"
          >
            <FiX className="w-5 h-5" />
          </button>

          <button
            onClick={() => setLightbox(i => (i - 1 + allImages.length) % allImages.length)}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition z-10"
            aria-label="Previous image"
          >
            <FiChevronLeft className="w-6 h-6" />
          </button>

          <img
            src={allImages[lightbox]?.public_url}
            alt={allImages[lightbox]?.alt_text || `Image ${lightbox + 1}`}
            className="max-w-full max-h-[85vh] object-contain rounded-xl"
          />

          <button
            onClick={() => setLightbox(i => (i + 1) % allImages.length)}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition z-10"
            aria-label="Next image"
          >
            <FiChevronRight className="w-6 h-6" />
          </button>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/40 text-sm">
            {lightbox + 1} / {allImages.length}
          </div>
        </motion.div>
      )}
    </div>
  )
}

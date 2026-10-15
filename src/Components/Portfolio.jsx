import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase, IS_SUPABASE_CONFIGURED } from '../lib/supabase'
import { STATIC_PORTFOLIO_PROJECTS } from '../lib/legacyPortfolioAssets'
import { FaPinterest, FaTimes, FaArrowLeft, FaArrowRight } from 'react-icons/fa'
import { FiFilter } from 'react-icons/fi'

// Static fallback data shown before the existing projects are imported.
const STATIC_PROJECTS = STATIC_PORTFOLIO_PROJECTS

const REVIEWS = [
  { text: `Honestly, working with Oracle's Mind was smooth from start to finish. They really listened to what we wanted and brought it to life better than we imagined.`, author: `— Chinedu Okafor, NovaEdge Solutions Ltd.` },
  { text: `I loved how patient and creative they were. I gave them a rough idea and they turned it into something beautiful. The logo and flyers came out really nice.`, author: `— Aisha Bello, BelleAura Cosmetics` },
  { text: `These guys know their craft. Our social media designs look way better now, and people actually notice them. Communication was easy and revisions were not stressful at all.`, author: `— Tunde Adeyemi, Axion Tech Hub` },
  { text: `Very creative and easy to work with. Oracle's Mind helped us redesign our brand visuals, and the difference was clear immediately.`, author: `— Ifunanya Nwoye, PrimeNest Realty` },
  { text: `Good designs, no stories. What we asked for is exactly what we got — neat, bold, and professional.`, author: `— Sadiq Lawal, Lawal Integrated Services` },
]

export default function Portfolio() {
  const [projects, setProjects] = useState([])
  const [categories, setCategories] = useState([])
  const [activeCategory, setActiveCategory] = useState('All')
  const [loading, setLoading] = useState(true)
  const [useStatic, setUseStatic] = useState(false)

  // For static fallback lightbox
  const [lightboxProject, setLightboxProject] = useState(null)
  const [lightboxIndex, setLightboxIndex] = useState(0)

  // Reviews
  const [activeReview, setActiveReview] = useState(0)

  useEffect(() => {
    async function load() {
      if (!IS_SUPABASE_CONFIGURED) {
        setProjects(STATIC_PROJECTS)
        setCategories(['All', ...STATIC_PROJECTS.map(p => p.category)])
        setUseStatic(true)
        setLoading(false)
        return
      }

      const { data, error } = await supabase
        .from('portfolio_projects')
        .select(`
          id, title, slug, short_description, category, sort_order,
          cover_image:portfolio_images!fk_cover_image(public_url, alt_text)
        `)
        .eq('status', 'published')
        .order('sort_order', { ascending: true })

      if (error || !data?.length) {
        // Fall back to static display
        setProjects(STATIC_PROJECTS)
        setCategories(['All', ...STATIC_PROJECTS.map(p => p.category)])
        setUseStatic(true)
      } else {
        setProjects(data)
        const cats = ['All', ...new Set(data.map(p => p.category).filter(Boolean))]
        setCategories(cats)
        setUseStatic(false)
      }
      setLoading(false)
    }
    load()
  }, [])

  const filtered = activeCategory === 'All'
    ? projects
    : projects.filter(p => p.category === activeCategory)

  const currentStaticGallery = lightboxProject?.gallery || []

  return (
    <section className="relative bg-black text-white min-h-screen">
      {/* Ambient glows */}
      <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-[#045496]/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-64 right-0 w-[300px] h-[300px] bg-[#05d1ed]/8 rounded-full blur-[80px] pointer-events-none" />

      {/* Hero */}
      <div className="max-w-7xl mx-auto px-5 pt-24 pb-12 text-center relative z-10">
        <motion.span
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="inline-block mb-4 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 text-[#05d1ed] text-sm font-medium"
        >
          Creative Portfolio
        </motion.span>
        <motion.h1
          className="text-5xl md:text-6xl font-extrabold gradient-text"
          style={{ fontFamily: 'var(--font-heading)' }}
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          Portfolio
        </motion.h1>
        <motion.p
          className="mt-4 text-white/50 max-w-lg mx-auto"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          A curated collection of creative work spanning graphic design, brand identity, and video editing.
        </motion.p>
      </div>

      {/* Category filters */}
      <div className="max-w-7xl mx-auto px-5 flex justify-center gap-3 mb-12 flex-wrap relative z-10">
        {categories.map(cat => (
          <motion.button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
              activeCategory === cat
                ? 'bg-gradient-to-r from-[#045496] to-[#05d1ed] text-white shadow-[0_2px_20px_rgba(5,209,237,0.25)]'
                : 'bg-white/8 border border-white/10 text-white/65 hover:bg-white/12 hover:text-white'
            }`}
          >
            {cat}
          </motion.button>
        ))}
      </div>

      {/* Projects grid */}
      <div className="max-w-7xl mx-auto px-5 relative z-10">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-white/40">No projects in this category yet.</p>
          </div>
        ) : useStatic ? (
          // Static image grid (pre-migration)
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {filtered.map((project) =>
              (project.gallery || [project.cover_image?.public_url]).map((imgSrc, imgIdx) => (
                <motion.div
                  key={`${project.id}-${imgIdx}`}
                  whileHover={{ scale: 1.03 }}
                  className="relative cursor-pointer overflow-hidden rounded-2xl border border-white/8 hover:border-cyan-500/30 shadow-lg group transition-all"
                  onClick={() => { setLightboxProject(project); setLightboxIndex(imgIdx) }}
                >
                  <img src={typeof imgSrc === 'string' ? imgSrc : imgSrc} alt={project.title} className="w-full h-60 object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="absolute bottom-3 left-3">
                      <p className="text-white text-xs font-medium">{project.category}</p>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        ) : (
          // CMS-driven project cards
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            <AnimatePresence mode="wait">
              {filtered.map((project, idx) => (
                <motion.div
                  key={project.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ delay: idx * 0.04 }}
                  whileHover={{ y: -6 }}
                  className="group"
                >
                  <Link to={`/portfolio/${project.slug}`} className="block">
                    <div className="relative overflow-hidden rounded-2xl border border-white/8 hover:border-cyan-500/30 transition-all">
                      {project.cover_image?.public_url ? (
                        <img
                          src={project.cover_image.public_url}
                          alt={project.cover_image.alt_text || project.title}
                          className="w-full h-60 object-cover group-hover:scale-105 transition-transform duration-500"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-60 bg-white/5 flex items-center justify-center text-white/20 text-4xl">🎨</div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="absolute bottom-3 left-3 right-3">
                          <p className="text-white text-sm font-semibold truncate">{project.title}</p>
                          {project.short_description && (
                            <p className="text-white/60 text-xs mt-0.5 line-clamp-1">{project.short_description}</p>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 px-1">
                      <p className="text-white font-medium text-sm">{project.title}</p>
                      {project.category && <p className="text-white/40 text-xs mt-0.5">{project.category}</p>}
                    </div>
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Static lightbox */}
      <AnimatePresence>
        {lightboxProject && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          >
            <button className="absolute top-4 right-4 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition z-20"
              onClick={() => setLightboxProject(null)}>
              <FaTimes />
            </button>
            <button className="absolute top-1/2 left-4 -translate-y-1/2 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition z-20"
              onClick={() => setLightboxIndex(i => (i - 1 + currentStaticGallery.length) % currentStaticGallery.length)}>
              <FaArrowLeft />
            </button>
            <motion.img
              key={lightboxIndex}
              src={currentStaticGallery[lightboxIndex]}
              alt={`${lightboxProject.title} ${lightboxIndex + 1}`}
              className="max-w-full max-h-[85vh] object-contain rounded-xl"
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.25 }}
            />
            <button className="absolute top-1/2 right-4 -translate-y-1/2 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition z-20"
              onClick={() => setLightboxIndex(i => (i + 1) % currentStaticGallery.length)}>
              <FaArrowRight />
            </button>
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/40 text-sm">
              {lightboxIndex + 1} / {currentStaticGallery.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pinterest CTA */}
      <div className="max-w-7xl mx-auto px-5 text-center mt-14 relative z-10">
        <a
          href="https://www.pinterest.com/OracleMind02/"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-3 px-6 py-3 rounded-xl font-medium bg-gradient-to-r from-[#045496] to-[#05d1ed] text-white hover:opacity-90 transition shadow-[0_4px_24px_rgba(5,209,237,0.2)]"
        >
          <FaPinterest className="text-xl" />
          View More on Pinterest
        </a>
      </div>

      {/* Reviews Section */}
      <div className="max-w-3xl mx-auto px-5 py-24 text-center relative z-10">
        <h2 className="text-3xl md:text-4xl font-bold gradient-text mb-12" style={{ fontFamily: 'var(--font-heading)' }}>
          Client Reviews
        </h2>

        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeReview}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.4 }}
              className="glass-card rounded-2xl p-8 mx-4"
            >
              <p className="text-white/65 text-base md:text-lg mb-5 italic">"{REVIEWS[activeReview].text}"</p>
              <p className="text-[#05d1ed] text-sm font-semibold">{REVIEWS[activeReview].author}</p>
            </motion.div>
          </AnimatePresence>

          <button onClick={() => setActiveReview(i => (i - 1 + REVIEWS.length) % REVIEWS.length)}
            className="absolute left-0 top-1/2 -translate-y-1/2 p-3 rounded-full bg-gradient-to-r from-[#045496] to-[#05d1ed] text-white shadow-lg hover:scale-110 transition">
            <FaArrowLeft />
          </button>
          <button onClick={() => setActiveReview(i => (i + 1) % REVIEWS.length)}
            className="absolute right-0 top-1/2 -translate-y-1/2 p-3 rounded-full bg-gradient-to-r from-[#045496] to-[#05d1ed] text-white shadow-lg hover:scale-110 transition">
            <FaArrowRight />
          </button>
        </div>

        <div className="flex justify-center gap-2 mt-5">
          {REVIEWS.map((_, idx) => (
            <button key={idx} onClick={() => setActiveReview(idx)}
              className={`w-2.5 h-2.5 rounded-full transition-all ${idx === activeReview ? 'bg-cyan-400 scale-125' : 'bg-white/25'}`}
              aria-label={`Review ${idx + 1}`}
            />
          ))}
        </div>

        <div className="mt-12">
          <Link to="/contact"
            className="inline-block px-8 py-4 font-semibold text-lg rounded-2xl bg-gradient-to-r from-[#045496] to-[#05d1ed] text-white shadow-lg hover:opacity-90 transition">
            Get Your Project Started
          </Link>
        </div>
      </div>
    </section>
  )
}

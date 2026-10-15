import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { supabase, IS_SUPABASE_CONFIGURED } from '../lib/supabase'
import oracle from '../assets/headshot.jpeg'

// Hardcoded fallback data (used if Supabase not configured / no DB data yet)
const FALLBACK_HERO = {
  name: "Oracle's Mind",
  tagline: 'Vision • Insight • Creation',
  subtitle: "Oracle's Mind is a creative space driven by perception and intention — translating abstract ideas into clear visual language, meaningful design, and thoughtful digital expression.",
  quote: 'Every design begins with insight — clarity follows.',
  cta_primary_label: 'View Portfolio',
  cta_primary_url: '/portfolio',
  cta_secondary_label: 'Contact',
  cta_secondary_url: '/contact',
}

const FALLBACK_STATS = [
  { value: '150+', label: 'Projects Completed' },
  { value: '3+',   label: 'Years of Experience' },
  { value: '40+',  label: 'Happy Clients' },
]

const CONCEPT_PILLARS = [
  { title: 'Perception',     desc: 'Understanding ideas beneath the surface before shaping them.' },
  { title: 'Interpretation', desc: 'Transforming thoughts into intentional visual language.' },
  { title: 'Expression',     desc: 'Delivering designs that speak with clarity and presence.' },
]

export default function Home() {
  const [hero, setHero] = useState(FALLBACK_HERO)
  const [stats, setStats] = useState(FALLBACK_STATS)
  const [featuredProjects, setFeaturedProjects] = useState([])

  useEffect(() => {
    if (!IS_SUPABASE_CONFIGURED) return

    async function load() {
      const [settingsRes, projectsRes] = await Promise.all([
        supabase.from('site_settings').select('setting_key, setting_value'),
        supabase
          .from('portfolio_projects')
          .select(`id, title, slug, short_description, category, cover_image:portfolio_images!fk_cover_image(public_url, alt_text)`)
          .eq('status', 'published')
          .eq('is_featured', true)
          .order('sort_order', { ascending: true })
          .limit(4),
      ])

      const settingsMap = {}
      ;(settingsRes.data || []).forEach(s => { settingsMap[s.setting_key] = s.setting_value })

      if (settingsMap.hero) setHero({ ...FALLBACK_HERO, ...settingsMap.hero })
      if (settingsMap.stats?.items?.length) setStats(settingsMap.stats.items)
      if (projectsRes.data?.length) setFeaturedProjects(projectsRes.data)
    }
    load()
  }, [])

  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    show:   { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut' } },
  }

  const stagger = {
    show: { transition: { staggerChildren: 0.12 } }
  }

  return (
    <div className="bg-black">
      {/* ─── HERO ─── */}
      <section
        id="hero"
        aria-label="Hero"
        className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-black"
      >
        {/* Ambient orbs */}
        <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10 max-w-6xl mx-auto px-5 py-20 w-full">
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="show"
          >
            {/* Eyebrow tag */}
            <motion.div variants={fadeUp} className="flex justify-center mb-6">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 text-[#05d1ed] text-sm font-medium backdrop-blur">
                <span className="w-1.5 h-1.5 rounded-full bg-[#05d1ed] animate-pulse" />
                Creative Artist & Video Editor
              </span>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
              {/* Text */}
              <div className="order-1">
                <motion.h1
                  variants={fadeUp}
                  className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-white leading-tight"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  <span className="gradient-text">{hero.name}</span>
                </motion.h1>

                <motion.p variants={fadeUp} className="mt-4 text-lg text-white/60 font-medium">
                  {hero.tagline}
                </motion.p>

                <motion.p variants={fadeUp} className="mt-5 text-white/55 leading-relaxed max-w-lg text-base">
                  {hero.subtitle}
                </motion.p>

                {/* Quote */}
                <motion.blockquote
                  variants={fadeUp}
                  className="mt-8 pl-4 border-l-2 border-[#05d1ed]/60"
                >
                  <p className="text-white/50 italic text-sm">"{hero.quote}"</p>
                </motion.blockquote>

                {/* CTAs */}
                <motion.div variants={fadeUp} className="mt-10 flex flex-wrap gap-4">
                  <Link
                    to={hero.cta_primary_url || '/portfolio'}
                    className="px-8 py-3.5 rounded-full bg-gradient-to-r from-[#045496] to-[#05d1ed] text-white font-semibold hover:opacity-90 transition shadow-[0_4px_30px_rgba(5,209,237,0.3)]"
                  >
                    {hero.cta_primary_label}
                  </Link>
                  <Link
                    to={hero.cta_secondary_url || '/contact'}
                    className="px-8 py-3.5 rounded-full border border-white/20 text-white/80 hover:bg-white/8 hover:text-white hover:border-white/40 transition"
                  >
                    {hero.cta_secondary_label}
                  </Link>
                </motion.div>
              </div>

              {/* Image */}
              <motion.div
                variants={fadeUp}
                className="order-2 flex justify-center"
              >
                <div className="relative w-full max-w-xs">
                  {/* Outer glow ring */}
                  <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-[#045496]/30 to-[#05d1ed]/20 blur-xl scale-105" />
                  <div className="relative glass-card rounded-3xl p-3 shadow-2xl">
                    <img
                      src={oracle}
                      alt="Oracle's Mind — Creative Artist"
                      className="w-full h-auto object-cover rounded-2xl"
                    />
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Concept Pillars */}
            <motion.div
              variants={stagger}
              initial="hidden"
              animate="show"
              className="mt-20 grid grid-cols-1 sm:grid-cols-3 gap-5"
            >
              {CONCEPT_PILLARS.map((pillar) => (
                <motion.div
                  key={pillar.title}
                  variants={fadeUp}
                  whileHover={{ y: -4 }}
                  className="glass-card rounded-2xl p-6 text-center hover:border-cyan-500/25 transition-all duration-300"
                >
                  <h3 className="text-base font-semibold text-[#05d1ed] mb-2">{pillar.title}</h3>
                  <p className="text-white/50 text-sm leading-relaxed">{pillar.desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1"
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <div className="w-px h-10 bg-gradient-to-b from-transparent to-white/20" />
          <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
        </motion.div>
      </section>

      {/* ─── STATS ─── */}
      <section aria-label="Achievements" className="relative py-20 bg-gradient-to-b from-black to-[#020610]">
        <div className="max-w-5xl mx-auto px-5">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white" style={{ fontFamily: 'var(--font-heading)' }}>
              Achievements & <span className="gradient-text">Experience</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {stats.map((stat, idx) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.5 }}
                whileHover={{ scale: 1.04 }}
                className="glass-card rounded-2xl py-8 text-center hover:border-cyan-500/25 hover:shadow-[0_0_30px_rgba(5,209,237,0.12)] transition-all duration-300"
              >
                <p className="text-4xl font-extrabold gradient-text" style={{ fontFamily: 'var(--font-heading)' }}>{stat.value}</p>
                <p className="mt-2 text-white/50 text-sm">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FEATURED PROJECTS ─── */}
      {featuredProjects.length > 0 && (
        <section aria-label="Featured work" className="relative py-24 bg-[#020610]">
          <div className="max-w-6xl mx-auto px-5">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="flex items-end justify-between mb-12"
            >
              <div>
                <span className="text-[#05d1ed] text-sm font-medium uppercase tracking-wider">Selected Work</span>
                <h2 className="text-3xl md:text-4xl font-bold text-white mt-2" style={{ fontFamily: 'var(--font-heading)' }}>
                  Featured Projects
                </h2>
              </div>
              <Link to="/portfolio" className="text-white/50 hover:text-white text-sm transition hidden sm:block">
                View all →
              </Link>
            </motion.div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {featuredProjects.map((project, idx) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.08 }}
                  whileHover={{ y: -6 }}
                  className="group"
                >
                  <Link to={`/portfolio/${project.slug}`} className="block">
                    <div className="relative overflow-hidden rounded-2xl bg-white/5 border border-white/8 aspect-[4/3] group-hover:border-cyan-500/25 transition-all duration-300">
                      {project.cover_image?.public_url ? (
                        <img
                          src={project.cover_image.public_url}
                          alt={project.cover_image.alt_text || project.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-white/20 text-4xl">🎨</div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="absolute bottom-3 left-3 right-3">
                          <p className="text-white text-sm font-semibold truncate">{project.title}</p>
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 px-1">
                      <p className="text-white font-medium text-sm truncate">{project.title}</p>
                      {project.category && <p className="text-white/40 text-xs mt-0.5">{project.category}</p>}
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>

            <div className="text-center mt-10 sm:hidden">
              <Link to="/portfolio" className="text-[#05d1ed] text-sm hover:underline">View all projects →</Link>
            </div>
          </div>
        </section>
      )}
    </div>
  )
}

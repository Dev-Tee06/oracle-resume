import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  FaVideo,
  FaPaintBrush,
  FaLightbulb,
  FaRocket,
  FaClock,
  FaUsers,
} from 'react-icons/fa'

const services = [
  {
    icon: FaVideo,
    title: 'Video Editing',
    desc: 'Cinematic video editing, transitions, color grading, and professional sound design that captivates audiences.',
    color: 'text-cyan-400',
    bg: 'bg-cyan-500/10 border-cyan-500/20',
  },
  {
    icon: FaPaintBrush,
    title: 'Graphic Design',
    desc: 'Creative logos, flyers, social media creatives, and branding assets crafted to elevate your visual identity.',
    color: 'text-indigo-400',
    bg: 'bg-indigo-500/10 border-indigo-500/20',
  },
  {
    icon: FaLightbulb,
    title: 'Brand Identity',
    desc: 'Cohesive brand identities that communicate your vision, values, and voice across every touchpoint.',
    color: 'text-amber-400',
    bg: 'bg-amber-500/10 border-amber-500/20',
  },
  {
    icon: FaRocket,
    title: 'Marketing Collateral',
    desc: 'Engaging flyers, posters, and digital ads designed to capture attention and drive conversions.',
    color: 'text-rose-400',
    bg: 'bg-rose-500/10 border-rose-500/20',
  },
]

const whyChoose = [
  {
    icon: FaClock,
    title: 'On-Time Delivery',
    desc: 'Deadlines are sacred. Every project is delivered on schedule without compromising quality.',
    color: 'text-cyan-400',
  },
  {
    icon: FaLightbulb,
    title: 'Creative Solutions',
    desc: 'Innovative design ideas that make your brand stand out from the competition.',
    color: 'text-amber-400',
  },
  {
    icon: FaUsers,
    title: 'Client-First Approach',
    desc: 'Your vision drives every decision. Open communication and collaborative process throughout.',
    color: 'text-emerald-400',
  },
]

const processSteps = [
  { step: '01', title: 'Consultation',         desc: 'Understanding your goals, audience, and creative vision.' },
  { step: '02', title: 'Planning',             desc: 'Crafting strategy, mood boards, and concept direction.' },
  { step: '03', title: 'Design & Creation',    desc: 'Bringing ideas to life with professional-grade execution.' },
  { step: '04', title: 'Delivery & Feedback',  desc: 'Refining and delivering polished, production-ready results.' },
]

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.6 } },
}

export default function Services() {
  return (
    <section className="relative bg-black text-white min-h-screen overflow-hidden">
      {/* Background glows */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-r from-[#045496]/20 to-[#05d1ed]/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-l from-[#f43f5e]/10 to-[#05d1ed]/10 rounded-full blur-[120px] pointer-events-none" />

      {/* ─── HERO ─── */}
      <div className="max-w-7xl mx-auto px-5 pt-24 pb-16 text-center relative z-10">
        <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="inline-block mb-4 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 text-[#05d1ed] text-sm font-medium">
          What I Offer
        </motion.span>
        <motion.h1
          className="text-5xl md:text-6xl font-extrabold gradient-text"
          style={{ fontFamily: 'var(--font-heading)' }}
          initial={{ y: -30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.8 }}
        >
          Premium Services
        </motion.h1>
        <motion.p className="mt-4 text-white/50 max-w-xl mx-auto"
          initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}>
          Exceptional creative solutions blending innovation, strategy, and professional design to elevate your brand.
        </motion.p>
      </div>

      {/* ─── SERVICES GRID ─── */}
      <div className="max-w-6xl mx-auto px-5 relative z-10">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {services.map((service, idx) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ y: -6 }}
              className="glass-card rounded-2xl p-7 hover:border-cyan-500/25 transition-all group"
            >
              <div className={`w-12 h-12 rounded-xl ${service.bg} border flex items-center justify-center mb-5`}>
                <service.icon className={`text-xl ${service.color}`} />
              </div>
              <h3 className="text-white font-semibold text-lg mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
                {service.title}
              </h3>
              <p className="text-white/50 text-sm leading-relaxed">{service.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ─── WHY CHOOSE ─── */}
      <div className="max-w-5xl mx-auto px-5 mt-28 relative z-10">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="text-center mb-12">
          <span className="text-[#05d1ed] text-sm font-medium uppercase tracking-wider">Why Oracle's Mind</span>
          <h2 className="text-3xl md:text-4xl font-bold text-white mt-2" style={{ fontFamily: 'var(--font-heading)' }}>
            What Sets Me <span className="gradient-text">Apart</span>
          </h2>
        </motion.div>

        <div className="grid sm:grid-cols-3 gap-5">
          {whyChoose.map((item, idx) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ y: -4 }}
              className="glass-card rounded-2xl p-7 hover:border-white/20 transition-all text-center"
            >
              <item.icon className={`text-3xl mx-auto mb-4 ${item.color}`} />
              <h3 className="text-white font-semibold mb-2">{item.title}</h3>
              <p className="text-white/50 text-sm leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ─── PROCESS ─── */}
      <div className="max-w-5xl mx-auto px-5 mt-28 relative z-10">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="text-center mb-12">
          <span className="text-[#05d1ed] text-sm font-medium uppercase tracking-wider">My Process</span>
          <h2 className="text-3xl md:text-4xl font-bold text-white mt-2" style={{ fontFamily: 'var(--font-heading)' }}>
            From Idea to <span className="gradient-text">Delivery</span>
          </h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {processSteps.map((step, idx) => (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ y: -4 }}
              className="glass-card rounded-2xl p-6 text-center hover:border-cyan-500/25 transition-all relative overflow-hidden"
            >
              {/* Big faded step number */}
              <span className="absolute -top-3 -right-2 text-8xl font-extrabold text-white/3 select-none" style={{ fontFamily: 'var(--font-heading)' }}>
                {step.step}
              </span>
              <span className="text-[#05d1ed] text-sm font-bold uppercase tracking-widest relative z-10">{step.step}</span>
              <h3 className="text-white font-semibold mt-3 text-sm relative z-10">{step.title}</h3>
              <p className="text-white/45 text-xs mt-2 leading-relaxed relative z-10">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ─── CTA ─── */}
      <div className="text-center py-24 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="space-y-4"
        >
          <p className="text-white/50">Ready to bring your vision to life?</p>
          <Link
            to="/contact"
            className="inline-block px-10 py-4 rounded-full bg-gradient-to-r from-[#045496] to-[#05d1ed] text-white font-semibold text-lg hover:opacity-90 transition shadow-[0_4px_30px_rgba(5,209,237,0.3)]"
          >
            Get Your Project Started
          </Link>
        </motion.div>
      </div>
    </section>
  )
}

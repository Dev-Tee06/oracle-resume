import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import premiere from '../assets/skill6.png'
import illustrator from '../assets/skill4.png'
import photoshop from '../assets/skilll5.png'
import {
  FaLightbulb,
  FaPencilRuler,
  FaPaintBrush,
  FaRedo,
} from 'react-icons/fa'

const tools = [
  { img: premiere,    name: 'Premiere Pro', desc: 'Video editing & post-production' },
  { img: illustrator, name: 'Illustrator',  desc: 'Vector graphics & logo design' },
  { img: photoshop,   name: 'Photoshop',    desc: 'Photo manipulation & compositing' },
]

const workflowSteps = [
  { icon: FaLightbulb,  label: 'Ideation & Strategy',     desc: 'Understanding your goals, audience, and creative direction.' },
  { icon: FaPencilRuler, label: 'Design & Visualization', desc: 'Translating ideas into compelling visual concepts and mockups.' },
  { icon: FaPaintBrush,  label: 'Refinement & Delivery',  desc: 'Polishing every detail to deliver pixel-perfect results.' },
  { icon: FaRedo,        label: 'Feedback & Iteration',   desc: 'Collaborative revisions until the work exceeds expectations.' },
]

const strengths = [
  { title: 'Visual Storytelling',       desc: 'Transforming narratives into memorable visual experiences.' },
  { title: 'Attention to Detail',       desc: 'Precision in every pixel, color, and composition.' },
  { title: 'Creative Problem Solving',  desc: 'Finding innovative solutions for complex design challenges.' },
  { title: 'Brand Consistency',         desc: 'Maintaining cohesive identity across all materials.' },
  { title: 'Time-Conscious Delivery',   desc: 'Respecting deadlines without compromising quality.' },
  { title: 'Clear Communication',       desc: 'Transparent process and regular progress updates.' },
]

const testimonials = [
  { text: `Honestly, working with Oracle's Mind was smooth from start to finish. They really listened to what we wanted and brought it to life better than we imagined.`, author: 'Chinedu Okafor', company: 'NovaEdge Solutions Ltd.' },
  { text: `I loved how patient and creative they were. I gave them a rough idea and they turned it into something beautiful. The logo and flyers came out really nice.`, author: 'Aisha Bello', company: 'BelleAura Cosmetics' },
  { text: `These guys know their craft. Our social media designs look way better now, and people actually notice them. Communication was easy and revisions were not stressful at all.`, author: 'Tunde Adeyemi', company: 'Axion Tech Hub' },
]

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
}

const stagger = {
  show: { transition: { staggerChildren: 0.1 } }
}

export default function About() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <section className="relative bg-black overflow-hidden">
      {/* Ambient glows */}
      <div className="absolute -top-40 right-0 w-[500px] h-[500px] bg-[#045496]/15 blur-[140px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 -left-40 w-[500px] h-[500px] bg-[#05d1ed]/12 blur-[140px] rounded-full pointer-events-none" />

      {/* ─── HERO ─── */}
      <div className="max-w-6xl mx-auto px-5 pt-24 pb-16 text-center relative z-10">
        <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="inline-block mb-4 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 text-[#05d1ed] text-sm font-medium">
          About Me
        </motion.span>
        <motion.h1
          className="text-5xl md:text-6xl font-extrabold text-white"
          style={{ fontFamily: 'var(--font-heading)' }}
          initial={{ y: -30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.8 }}
        >
          Designing Experiences That <span className="gradient-text">Speak & Inspire</span>
        </motion.h1>
      </div>

      {/* ─── BIO ─── */}
      <div className="max-w-4xl mx-auto px-5 relative z-10">
        <motion.div
          initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger}
          className="glass-card rounded-3xl p-10 md:p-12 mb-20"
        >
          <motion.p variants={fadeUp} className="text-white/70 text-lg md:text-xl leading-relaxed">
            I'm a Creative Artist and video editor who transforms ideas into
            visually compelling stories. I blend strategy, creativity, and
            modern design tools to craft visuals that elevate brands and leave
            lasting impressions.
          </motion.p>
          <motion.blockquote variants={fadeUp} className="mt-6 pl-4 border-l-2 border-[#05d1ed]/50">
            <p className="text-white/45 italic text-sm">"Every design begins with insight — clarity follows."</p>
          </motion.blockquote>
        </motion.div>
      </div>

      {/* ─── TOOLS ─── */}
      <div className="max-w-4xl mx-auto px-5 mb-24 relative z-10">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="text-center mb-10">
          <span className="text-[#05d1ed] text-sm font-medium uppercase tracking-wider">Tools & Expertise</span>
          <h2 className="text-3xl md:text-4xl font-bold text-white mt-2" style={{ fontFamily: 'var(--font-heading)' }}>
            Software I <span className="gradient-text">Excel At</span>
          </h2>
        </motion.div>

        <div className="grid sm:grid-cols-3 gap-6">
          {tools.map((tool, idx) => (
            <motion.div
              key={tool.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ y: -6 }}
              className="glass-card rounded-2xl p-6 text-center hover:border-cyan-500/25 transition-all group"
            >
              <div className="w-20 h-20 mx-auto rounded-2xl bg-black border border-white/10 group-hover:border-cyan-500/30 flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(5,209,237,0.12)] transition-all">
                <img src={tool.img} alt={tool.name} className="w-12 h-12 object-contain" />
              </div>
              <h3 className="text-white font-semibold mb-1">{tool.name}</h3>
              <p className="text-white/45 text-xs">{tool.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ─── WORKFLOW ─── */}
      <div className="max-w-5xl mx-auto px-5 mb-24 relative z-10">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="text-center mb-10">
          <span className="text-[#05d1ed] text-sm font-medium uppercase tracking-wider">Creative Process</span>
          <h2 className="text-3xl md:text-4xl font-bold text-white mt-2" style={{ fontFamily: 'var(--font-heading)' }}>
            How I <span className="gradient-text">Work</span>
          </h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {workflowSteps.map((step, idx) => (
            <motion.div
              key={step.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ y: -4 }}
              className="glass-card rounded-2xl p-6 text-center hover:border-cyan-500/25 transition-all group"
            >
              <div className="w-12 h-12 mx-auto rounded-xl bg-[#05d1ed]/10 border border-[#05d1ed]/20 flex items-center justify-center mb-4">
                <step.icon className="text-[#05d1ed]" size={22} />
              </div>
              <span className="text-[#05d1ed]/40 text-xs font-bold uppercase tracking-widest">Step {idx + 1}</span>
              <h3 className="text-white font-semibold mt-2 text-sm">{step.label}</h3>
              <p className="text-white/45 text-xs mt-2 leading-relaxed">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ─── STRENGTHS ─── */}
      <div className="max-w-4xl mx-auto px-5 mb-24 relative z-10">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="text-center mb-10">
          <span className="text-[#05d1ed] text-sm font-medium uppercase tracking-wider">Core Strengths</span>
          <h2 className="text-3xl md:text-4xl font-bold text-white mt-2" style={{ fontFamily: 'var(--font-heading)' }}>
            What I <span className="gradient-text">Bring</span>
          </h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 gap-4">
          {strengths.map((s, idx) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, x: idx % 2 === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.08 }}
              className="glass-card rounded-xl p-5 flex items-start gap-4 hover:border-cyan-500/20 transition group"
            >
              <span className="w-2.5 h-2.5 rounded-full bg-[#05d1ed] mt-1.5 shrink-0 group-hover:shadow-[0_0_10px_#05d1ed] transition" />
              <div>
                <h3 className="text-white font-semibold text-sm">{s.title}</h3>
                <p className="text-white/45 text-xs mt-1 leading-relaxed">{s.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ─── TESTIMONIALS ─── */}
      <div className="max-w-3xl mx-auto px-5 pb-24 text-center relative z-10">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="mb-10">
          <span className="text-[#05d1ed] text-sm font-medium uppercase tracking-wider">Testimonials</span>
          <h2 className="text-3xl md:text-4xl font-bold text-white mt-2" style={{ fontFamily: 'var(--font-heading)' }}>
            What Clients <span className="gradient-text">Say</span>
          </h2>
        </motion.div>

        <div className="relative min-h-[200px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentTestimonial}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="glass-card rounded-2xl p-8"
            >
              <svg className="w-8 h-8 text-[#05d1ed]/20 mb-4 mx-auto" viewBox="0 0 24 24" fill="currentColor">
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
              </svg>
              <p className="text-white/65 text-base md:text-lg leading-relaxed italic mb-5">
                "{testimonials[currentTestimonial].text}"
              </p>
              <p className="text-[#05d1ed] font-semibold text-sm">{testimonials[currentTestimonial].author}</p>
              <p className="text-white/40 text-xs mt-0.5">{testimonials[currentTestimonial].company}</p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-2 mt-5">
          {testimonials.map((_, i) => (
            <button key={i} onClick={() => setCurrentTestimonial(i)}
              className={`w-2.5 h-2.5 rounded-full transition-all ${i === currentTestimonial ? 'bg-cyan-400 scale-125' : 'bg-white/25'}`}
              aria-label={`Testimonial ${i + 1}`}
            />
          ))}
        </div>

        {/* CTA */}
        <div className="mt-14">
          <Link
            to="/contact"
            className="inline-block px-8 py-4 rounded-full bg-gradient-to-r from-[#045496] to-[#05d1ed] text-white font-semibold text-lg hover:opacity-90 transition shadow-[0_4px_30px_rgba(5,209,237,0.3)]"
          >
            Get Your Project Started
          </Link>
        </div>
      </div>
    </section>
  )
}

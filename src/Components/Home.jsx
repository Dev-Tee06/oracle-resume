import { motion } from "framer-motion";
import oracle from "../assets/headshot.jpeg";

export default function Home() {
  const stats = [
    { value: "150+", label: "Projects Completed" },
    { value: "3+", label: "Years of Experience" },
    { value: "40+", label: "Happy Clients" },
  ];

  const conceptPillars = [
    {
      title: "Perception",
      desc: "Understanding ideas beneath the surface before shaping them.",
    },
    {
      title: "Interpretation",
      desc: "Transforming thoughts into intentional visual language.",
    },
    {
      title: "Expression",
      desc: "Delivering designs that speak with clarity and presence.",
    },
  ];

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-black">
      {/* Ambient Orbs */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl" />

      {/* Glass Container */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="backdrop-blur-xl bg-white/10 border border-white/15 rounded-3xl p-8 md:p-16 shadow-2xl"
        >
          <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
            {/* Text Content - comes first on mobile */}
            <div className="order-1 md:order-1">
              <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-tight">
                Oracle’s <span className="text-cyan-400">Mind</span>
              </h1>

              <p className="mt-4 text-lg md:text-xl text-slate-200">
                <span className="font-semibold text-white">
                  Vision • Insight • Creation
                </span>{" "}
                — where ideas are interpreted and expressed
              </p>

              <p className="mt-6 text-slate-300 leading-relaxed max-w-xl">
                Oracle’s Mind is a creative space driven by perception and
                intention — translating abstract ideas into clear visual
                language, meaningful design, and thoughtful digital expression.
              </p>

              {/* Philosophy */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="mt-8 border-l-4 border-cyan-400 pl-4"
              >
                <p className="text-slate-200 italic">
                  “Every design begins with insight — clarity follows.”
                </p>
              </motion.div>

              {/* CTA */}
              <div className="mt-10 flex flex-wrap gap-4">
                <a
                  href="https://pin.it/3JQDo7gof"
                  target="_blank"
                  rel="noreferrer"
                  className="px-8 py-3 rounded-full bg-cyan-500 text-slate-900 font-semibold hover:bg-cyan-400 transition"
                >
                  View Portfolio
                </a>

                <a
                  href="https://wa.me/qr/F3PQMBZKCQBFK1"
                  target="_blank"
                  rel="noreferrer"
                  className="px-8 py-3 rounded-full border border-white/40 text-white hover:bg-white/10 transition"
                >
                  Contact
                </a>
              </div>
            </div>

            {/* Image - comes second on mobile */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.9, delay: 0.2 }}
              className="order-2 md:order-2 flex justify-center mt-8 md:mt-0"
            >
              <div className="relative w-full max-w-xs md:max-w-[320px]">
                <div className="relative backdrop-blur-2xl bg-white/10 border border-white/30 rounded-3xl p-2 md:p-4 shadow-2xl">
                  <img
                    src={oracle}
                    alt="Oracle’s Mind"
                    className="w-full h-auto md:h-96 object-cover rounded-2xl"
                  />
                </div>
                <div className="absolute -z-10 -bottom-6 -right-6 w-32 h-32 md:w-40 md:h-40 bg-cyan-500/30 rounded-full blur-2xl" />
              </div>
            </motion.div>
          </div>

          {/* Concept Pillars */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="mt-20 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center"
          >
            {conceptPillars.map((item, idx) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 + idx * 0.2 }}
                className="backdrop-blur-lg bg-white/10 border border-white/20 rounded-2xl p-6 hover:scale-105 transition-transform duration-300"
              >
                <h3 className="text-lg font-semibold text-cyan-400">
                  {item.title}
                </h3>
                <p className="mt-2 text-slate-300 text-sm">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* Stats Section Title */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.6 }}
            className="text-2xl md:text-3xl font-bold text-white text-center mt-12 mb-6"
          >
            Achievements & Experience
          </motion.h2>

          {/* Stats Cards */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.8 }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center"
          >
            {stats.map((stat, idx) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.8 + idx * 0.2 }}
                className="backdrop-blur-lg bg-white/10 border border-white/20 rounded-2xl py-6 hover:scale-105 hover:shadow-[0_0_20px_rgba(0,255,255,0.35)] transition-all duration-300"
              >
                <p className="text-2xl md:text-3xl font-extrabold text-cyan-400">
                  {stat.value}
                </p>
                <p className="mt-1 text-xs md:text-sm text-slate-300">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

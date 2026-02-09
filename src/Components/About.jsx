import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import premiere from "../assets/skill6.png"; // Skill 1
import illustrator from "../assets/skill4.png"; // Skill 2
import photoshop from "../assets/skilll5.png"; // Skill 3
import {
  FaLightbulb,
  FaPencilRuler,
  FaPaintBrush,
  FaRedo,
} from "react-icons/fa";

const About = () => {
  const creativeSkills = [
    "Video Storytelling",
    "Brand Design",
    "Color Grading",
    "Social Media Design",
  ];

  const tools = [
    { img: premiere, name: "Premiere Pro" },
    { img: illustrator, name: "Illustrator" },
    { img: photoshop, name: "Photoshop" },
  ];

  const stats = [
    { value: "150+", label: "Projects Completed" },
    { value: "3+", label: "Years of Experience" },
    { value: "40+", label: "Happy Clients" },
  ];

  const testimonials = [
    {
      text: "Honestly, working with Oracle’s Mind was smooth from start to finish. They really listened to what we wanted and brought it to life better than we imagined. The designs came out clean and very professional.",
      author: "— Chinedu Okafor, NovaEdge Solutions Ltd.",
    },
    {
      text: "I loved how patient and creative they were. I gave them a rough idea and they turned it into something beautiful. The logo and flyers came out really nice, and delivery was on time.",
      author: "— Aisha Bello, BelleAura Cosmetics",
    },
    {
      text: "These guys know their craft. Our social media designs look way better now, and people actually notice them. Communication was easy and revisions were not stressful at all.",
      author: "— Tunde Adeyemi, Axion Tech Hub",
    },
  ];

  const workflowSteps = [
    {
      icon: <FaLightbulb className="mx-auto text-cyan-400" size={28} />,
      label: "Ideation & Strategy",
    },
    {
      icon: <FaPencilRuler className="mx-auto text-cyan-400" size={28} />,
      label: "Design & Visualization",
    },
    {
      icon: <FaPaintBrush className="mx-auto text-cyan-400" size={28} />,
      label: "Refinement & Delivery",
    },
    {
      icon: <FaRedo className="mx-auto text-cyan-400" size={28} />,
      label: "Feedback & Iteration",
    },
  ];

  const strengths = [
    "Visual Storytelling",
    "Attention to Detail",
    "Creative Problem Solving",
    "Brand Consistency",
    "Time-Conscious Delivery",
    "Clear Client Communication",
  ];

  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  // Auto-rotate testimonials every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.12 } },
  };
  const item = { hidden: { opacity: 0, y: 25 }, show: { opacity: 1, y: 0 } };

  return (
    <section id="about" className="relative py-28 overflow-hidden bg-black">
      {/* Ambient glows */}
      <div className="absolute -top-40 right-0 w-[420px] h-[420px] bg-[#045496]/25 blur-[140px] rounded-full" />
      <div className="absolute bottom-0 -left-40 w-[420px] h-[420px] bg-[#05d1ed]/25 blur-[140px] rounded-full" />

      <div className="relative max-w-5xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <span className="inline-block mb-4 px-5 py-1.5 text-sm font-semibold tracking-wide text-[#05d1ed] bg-[#05d1ed]/10 rounded-full border border-white/10">
            About Me
          </span>

          <h2 className="text-3xl md:text-5xl font-extrabold text-white leading-tight">
            Designing Experiences That{" "}
            <span className="bg-gradient-to-r from-[#045496] to-[#05d1ed] bg-clip-text text-transparent">
              Speak & Inspire
            </span>
          </h2>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="relative bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-10 md:p-12 shadow-[0_0_60px_rgba(5,209,237,0.08)]"
        >
          {/* Intro */}
          <motion.p
            variants={item}
            className="text-white/75 text-lg md:text-xl leading-relaxed max-w-3xl mb-14 text-center md:text-left"
          >
            I’m a Creative Artist and video editor who transforms ideas into
            visually compelling stories. I blend strategy, creativity, and
            modern design tools to craft visuals that elevate brands and leave
            lasting impressions.
          </motion.p>

          {/* Tools Section */}
          <motion.div variants={item} className="mb-14">
            <h3 className="text-2xl font-semibold text-white mb-6 text-center">
              Tools I Excel At
            </h3>
            <div className="flex flex-wrap justify-center gap-8">
              {tools.map((tool, i) => (
                <motion.div
                  key={i}
                  whileHover={{
                    scale: 1.1,
                    boxShadow: "0 0 25px #05d1ed, 0 0 40px #05d1ed",
                  }}
                  className="flex flex-col items-center w-24 md:w-28"
                >
                  <div className="w-20 h-20 md:w-24 md:h-24 rounded-full border-2 border-cyan-400 p-2 flex items-center justify-center shadow-[0_0_15px_rgba(5,209,237,0.3)] bg-black">
                    <img
                      src={tool.img}
                      alt={tool.name}
                      className="w-full h-full object-contain rounded-full"
                    />
                  </div>
                  <p className="mt-2 text-cyan-400 font-semibold text-center">
                    {tool.name}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Stats Section */}
          <motion.div variants={item} className="mb-14">
            <h3 className="text-2xl font-semibold text-white mb-6 text-center">
              Experience & Achievements
            </h3>
            <div className="flex flex-wrap justify-center gap-6">
              {stats.map((stat, i) => (
                <motion.div
                  key={i}
                  whileHover={{ scale: 1.05 }}
                  className="text-center backdrop-blur-lg bg-white/10 border border-white/20 rounded-2xl py-4 px-6 w-36"
                >
                  <p className="text-2xl md:text-3xl font-extrabold text-cyan-400">
                    {stat.value}
                  </p>
                  <p className="mt-1 text-xs md:text-sm text-slate-300">
                    {stat.label}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Workflow / Process */}
          <motion.div variants={item} className="mb-14">
            <h3 className="text-2xl font-semibold text-white mb-6 text-center">
              Workflow / Process
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 text-center">
              {workflowSteps.map((step, i) => (
                <motion.div
                  key={i}
                  whileHover={{ scale: 1.05 }}
                  className="backdrop-blur-lg bg-white/10 border border-white/20 rounded-2xl p-6 flex flex-col items-center gap-3"
                >
                  {step.icon}
                  <p className="text-white/80 font-semibold">{step.label}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Strengths Section */}
          <motion.div variants={item} className="mb-14">
            <h3 className="text-2xl font-semibold text-white mb-6 text-center">
              What I Bring to the Table
            </h3>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6 text-white/70">
              {strengths.map((strength, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-center gap-3 group"
                >
                  <span className="w-3 h-3 rounded-full bg-[#05d1ed] group-hover:shadow-[0_0_10px_#05d1ed] transition" />
                  {strength}
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Testimonial Carousel */}
          <motion.div
            variants={item}
            className="mb-14 relative max-w-3xl mx-auto"
          >
            <h3 className="text-2xl font-semibold text-white mb-6 text-center">
              Testimonials
            </h3>
            <AnimatePresence exitBeforeEnter>
              <motion.div
                key={currentTestimonial}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.6 }}
                className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 text-center text-white/80"
              >
                <p className="italic mb-4">
                  "{testimonials[currentTestimonial].text}"
                </p>
                <p className="font-semibold text-cyan-400">
                  {testimonials[currentTestimonial].author}
                </p>
              </motion.div>
            </AnimatePresence>

            {/* Carousel Dots */}
            <div className="flex justify-center mt-4 gap-4">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentTestimonial(i)}
                  className={`w-3 h-3 rounded-full transition ${
                    i === currentTestimonial
                      ? "bg-cyan-400 shadow-[0_0_10px_#05d1ed]"
                      : "bg-white/30"
                  }`}
                />
              ))}
            </div>
          </motion.div>

          {/* CTA Button: Get Your Project Started */}
          <motion.div
            className="flex justify-center mb-28"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <a
              href="#contact"
              className="w-full sm:w-auto px-6 sm:px-10 py-3 sm:py-4 rounded-full bg-cyan-500 text-slate-900 font-semibold hover:bg-cyan-400 transition text-lg text-center
               shadow-md sm:shadow-none sm:hover:shadow-[0_0_20px_#05d1ed,0_0_40px_#05d1ed]"
            >
              Get Your Project Started
            </a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default About;

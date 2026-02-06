import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  FaVideo,
  FaPaintBrush,
  FaLightbulb,
  FaRocket,
  FaUsers,
  FaClock,
} from "react-icons/fa";

const services = [
  {
    icon: <FaVideo />,
    title: "Video Editing",
    desc: "Cinematic video editing, transitions, color grading, and professional sound design.",
  },
  {
    icon: <FaPaintBrush />,
    title: "Graphic Design",
    desc: "Creative logos, flyers, social media creatives, and branding assets.",
  },
  {
    icon: <FaLightbulb />,
    title: "Brand Identity",
    desc: "Cohesive brand identities that communicate your vision, values, and voice.",
  },
  {
    icon: <FaRocket />,
    title: "Marketing Collateral",
    desc: "Engaging flyers, posters, and digital ads to capture your audience.",
  },
];

const processSteps = [
  {
    step: "1",
    title: "Consultation",
    desc: "Understand your goals and vision.",
  },
  {
    step: "2",
    title: "Planning",
    desc: "Craft a strategy and concept for your project.",
  },
  {
    step: "3",
    title: "Design & Creation",
    desc: "Bring your ideas to life with professional designs.",
  },
  {
    step: "4",
    title: "Delivery & Feedback",
    desc: "Refine and deliver top-quality results.",
  },
];

export default function Services() {
  return (
    <section className="relative bg-black text-white min-h-screen overflow-hidden">
      {/* Background Color Grading */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-r from-[#045496]/30 via-[#05d1ed]/20 to-[#f59e0b]/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-l from-[#f43f5e]/30 via-[#f59e0b]/20 to-[#05d1ed]/20 rounded-full blur-3xl"></div>
      </div>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-6 py-24 text-center">
        <motion.h1
          className="text-5xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#045496] to-[#05d1ed]"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1 }}
        >
          My Premium Services
        </motion.h1>
        <motion.p
          className="mt-4 text-white/70 text-base md:text-lg max-w-2xl mx-auto"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          I craft exceptional creative solutions, blending innovation and
          professional design to elevate your brand.
        </motion.p>
      </div>

      {/* Services Grid */}
      <div className="max-w-7xl mx-auto px-6 grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {services.map((service, idx) => (
          <motion.div
            key={idx}
            className="p-8 rounded-3xl bg-white/5 backdrop-blur border border-white/10 cursor-pointer hover:shadow-[0_0_40px_rgba(5,209,237,0.5)] hover:bg-gradient-to-r hover:from-[#045496]/20 hover:to-[#05d1ed]/20 transition-all"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.2 }}
          >
            <div className="text-4xl mb-6 text-gradient from-[#f59e0b] to-[#05d1ed]">
              {service.icon}
            </div>
            <h3 className="text-xl font-semibold mb-3">{service.title}</h3>
            <p className="text-white/70 text-sm">{service.desc}</p>
          </motion.div>
        ))}
      </div>

      {/* Why Choose Us */}
      <div className="max-w-7xl mx-auto px-6 mt-24 text-center">
        <motion.h2
          className="text-3xl md:text-4xl font-bold mb-12 bg-clip-text text-transparent bg-gradient-to-r from-[#f59e0b] to-[#05d1ed]"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          Why Choose Oracle's Mind?
        </motion.h2>
        <div className="grid md:grid-cols-2 gap-8">
          <motion.div
            className="p-8 rounded-3xl bg-gradient-to-r from-[#f59e0b]/20 to-[#f43f5e]/20 backdrop-blur border border-white/10 hover:shadow-[0_0_50px_rgba(245,158,11,0.5)] transition-all"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <FaClock className="text-4xl mb-4 text-[#05d1ed]" />
            <h3 className="text-xl font-bold mb-2">On Time Delivery</h3>
            <p className="text-white/70 text-sm">
              I respect deadlines and always deliver your project on time.
            </p>
          </motion.div>
          <motion.div
            className="p-8 rounded-3xl bg-gradient-to-r from-[#05d1ed]/20 to-[#045496]/20 backdrop-blur border border-white/10 hover:shadow-[0_0_50px_rgba(5,209,237,0.5)] transition-all"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <FaLightbulb className="text-4xl mb-4 text-[#f43f5e]" />
            <h3 className="text-xl font-bold mb-2">Creative Solutions</h3>
            <p className="text-white/70 text-sm">
              Innovative design ideas that make your brand stand out from the
              crowd.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Process Section */}
      <div className="max-w-7xl mx-auto px-6 mt-24">
        <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center bg-clip-text text-transparent bg-gradient-to-r from-[#f43f5e] to-[#05d1ed]">
          Oracle's Mind Creative Process
        </h2>
        <div className="grid md:grid-cols-4 gap-8">
          {processSteps.map((step) => (
            <motion.div
              key={step.step}
              className="p-6 rounded-3xl bg-white/5 backdrop-blur border border-white/10 hover:shadow-[0_0_40px_rgba(5,209,237,0.5)] transition-all text-center"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: step.step * 0.2 }}
            >
              <div className="text-3xl font-bold text-gradient from-[#f59e0b] to-[#05d1ed] mb-4">
                {step.step}
              </div>
              <h3 className="font-semibold mb-2">{step.title}</h3>
              <p className="text-white/70 text-sm">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Call to Action */}
      <div className="text-center mt-24 mb-24">
        <motion.div whileHover={{ scale: 1.05 }}>
          <Link
            to="/contact"
            className="inline-block px-10 py-4 rounded-3xl font-bold bg-gradient-to-r from-[#045496] to-[#05d1ed] text-black transition"
          >
            Get Your Project Started
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

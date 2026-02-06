import { motion } from "framer-motion";
import {
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaPinterest,
  FaInstagram,
} from "react-icons/fa";

export default function Contact() {
  return (
    <section className="relative bg-black text-white min-h-screen overflow-hidden">
      {/* Background Gradient Layers */}
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
          Get in Touch
        </motion.h1>
        <motion.p
          className="mt-4 text-white/70 text-base md:text-lg max-w-2xl mx-auto"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          We'd love to hear from you! Whether it’s a question, collaboration, or
          project inquiry, reach out using the information below.
        </motion.p>
      </div>

      {/* Contact Info Cards */}
      <div className="max-w-7xl mx-auto px-6 grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <motion.div
          className="p-8 rounded-3xl bg-white/5 backdrop-blur border border-white/10 hover:shadow-[0_0_40px_rgba(5,209,237,0.5)] transition-all text-center"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <FaPhone className="text-4xl mb-4 text-gradient from-[#f59e0b] to-[#05d1ed]" />
          <h3 className="text-xl font-semibold mb-2">Phone</h3>
          <p className="text-white/70 text-sm">08146040037</p>
        </motion.div>

        <motion.div
          className="p-8 rounded-3xl bg-white/5 backdrop-blur border border-white/10 hover:shadow-[0_0_40px_rgba(5,209,237,0.5)] transition-all text-center"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <FaEnvelope className="text-4xl mb-4 text-gradient from-[#f59e0b] to-[#05d1ed]" />
          <h3 className="text-xl font-semibold mb-2">Email</h3>
          <p className="text-white/70 text-sm">oraclemind02@example.com</p>
        </motion.div>

        <motion.div
          className="p-8 rounded-3xl bg-white/5 backdrop-blur border border-white/10 hover:shadow-[0_0_40px_rgba(5,209,237,0.5)] transition-all text-center"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <FaMapMarkerAlt className="text-4xl mb-4 text-gradient from-[#f59e0b] to-[#05d1ed]" />
          <h3 className="text-xl font-semibold mb-2">Location</h3>
          <p className="text-white/70 text-sm">Lagos, Nigeria</p>
        </motion.div>

        <motion.div
          className="p-8 rounded-3xl bg-white/5 backdrop-blur border border-white/10 hover:shadow-[0_0_40px_rgba(5,209,237,0.5)] transition-all text-center"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <div className="flex justify-center gap-4 text-2xl text-white/80">
            <a
              href="https://www.pinterest.com/OracleMind02/"
              target="_blank"
              rel="noreferrer"
              className="hover:text-[#05d1ed] transition"
            >
              <FaPinterest />
            </a>
            <a
              href="https://www.instagram.com/oraclemind02/"
              target="_blank"
              rel="noreferrer"
              className="hover:text-[#f59e0b] transition"
            >
              <FaInstagram />
            </a>
          </div>
          <h3 className="text-xl font-semibold mt-4 mb-2">Socials</h3>
          <p className="text-white/70 text-sm">
            Follow us for more creative updates
          </p>
        </motion.div>
      </div>

      {/* Contact Form */}
      <div className="max-w-3xl mx-auto px-6 mt-24">
        <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center bg-clip-text text-transparent bg-gradient-to-r from-[#045496] to-[#05d1ed]">
          Send Us a Message
        </h2>
        <form className="grid gap-6">
          <input
            type="text"
            placeholder="Your Name"
            className="p-4 rounded-2xl bg-white/5 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#05d1ed] transition"
          />
          <input
            type="email"
            placeholder="Your Email"
            className="p-4 rounded-2xl bg-white/5 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#05d1ed] transition"
          />
          <textarea
            placeholder="Your Message"
            rows={6}
            className="p-4 rounded-2xl bg-white/5 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#05d1ed] transition"
          ></textarea>
          <button
            type="submit"
            className="px-8 py-4 rounded-3xl font-bold bg-gradient-to-r from-[#045496] to-[#05d1ed] text-black hover:scale-105 transition"
          >
            Send Message
          </button>
        </form>
      </div>
    </section>
  );
}

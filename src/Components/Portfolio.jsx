import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaPinterest,
  FaTimes,
  FaArrowLeft,
  FaArrowRight,
} from "react-icons/fa";

// ===== Import Portfolio Images =====
import anniversary1 from "../assets/anniversary1.jpg";
import anniversary2 from "../assets/anniversary2.jpg";
import anniversary3 from "../assets/anniversary3.jpg";
import anniversary4 from "../assets/anniversary4.jpg";
import anniversary5 from "../assets/anniversary5.jpg";

import birthday1 from "../assets/birthday1.jpg";
import birthday2 from "../assets/birthday2.jpg";
import birthday3 from "../assets/birthday3.jpg";
import birthday4 from "../assets/birthday4.jpg";
import birthday5 from "../assets/birthday5.jpg";
import birthday6 from "../assets/birthday6.jpg";
import birthday7 from "../assets/birthday7.jpg";

import flyer1 from "../assets/flyer1.jpg";
import flyer2 from "../assets/flyer2.jpg";
import flyer3 from "../assets/flyer3.jpg";
import flyer4 from "../assets/flyer4.jpg";
import flyer5 from "../assets/flyer5.jpg";
import flyer6 from "../assets/flyer6.jpg";
import flyer7 from "../assets/flyer7.jpg";
import flyer8 from "../assets/flyer8.jpg";

import logo1 from "../assets/logo1.jpg";
import logo2 from "../assets/logo2.jpg";
import logo3 from "../assets/logo3.jpg";
import logo4 from "../assets/logo4.jpg";
import logo5 from "../assets/logo5.jpg";
import logo6 from "../assets/logo6.jpg";

// ===== Portfolio Data =====
const portfolioData = {
  Anniversary: [
    anniversary1,
    anniversary2,
    anniversary3,
    anniversary4,
    anniversary5,
  ],
  Birthday: [
    birthday1,
    birthday2,
    birthday3,
    birthday4,
    birthday5,
    birthday6,
    birthday7,
  ],
  Flyer: [flyer1, flyer2, flyer3, flyer4, flyer5, flyer6, flyer7, flyer8],
  Logo: [logo1, logo2, logo3, logo4, logo5, logo6],
};

// ===== Reviews =====
const reviews = [
  {
    text: `Honestly, working with Oracle’s Mind was smooth from start to finish. They really listened to what we wanted and brought it to life better than we imagined. The designs came out clean and very professional.`,
    author: `— Chinedu Okafor, NovaEdge Solutions Ltd.`,
  },
  {
    text: `I loved how patient and creative they were. I gave them a rough idea and they turned it into something beautiful. The logo and flyers came out really nice, and delivery was on time.`,
    author: `— Aisha Bello, BelleAura Cosmetics`,
  },
  {
    text: `These guys know their craft. Our social media designs look way better now, and people actually notice them. Communication was easy and revisions were not stressful at all.`,
    author: `— Tunde Adeyemi, Axion Tech Hub`,
  },
  {
    text: `Very creative and easy to work with. Oracle’s Mind helped us redesign our brand visuals, and the difference was clear immediately. Everything looked more modern and appealing.`,
    author: `— Ifunanya Nwoye, PrimeNest Realty`,
  },
  {
    text: `Good designs, no stories. What we asked for is exactly what we got — neat, bold, and professional. I’ll definitely recommend Oracle’s Mind to anyone who needs graphics.`,
    author: `— Sadiq Lawal, Lawal Integrated Services`,
  },
  {
    text: `You can tell they actually care about your project. They paid attention to details and made sure we were satisfied before final delivery. The whole process was stress-free.`,
    author: `— Blessing Uche, GlowCart Enterprises`,
  },
  {
    text: `Our brand looks more serious now. Since Oracle’s Mind handled our designs, people take us more seriously. The visuals are clean and consistent. Solid work overall.`,
    author: `— Emeka Obi, Crestline Logistics`,
  },
];

export default function Portfolio() {
  const categories = Object.keys(portfolioData);
  const [activeTab, setActiveTab] = useState("Anniversary");
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);
  const [activeReview, setActiveReview] = useState(0);

  const images = portfolioData[activeTab];

  const prevReview = () =>
    setActiveReview((prev) => (prev - 1 + reviews.length) % reviews.length);
  const nextReview = () =>
    setActiveReview((prev) => (prev + 1) % reviews.length);

  return (
    <section className="relative bg-black text-white min-h-screen overflow-x-hidden">
      {/* Hero Section */}
      <div className="relative max-w-7xl mx-auto px-6 py-24 text-center">
        <motion.h1
          className="text-5xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#045496] to-[#05d1ed]"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1 }}
        >
          Creative Portfolio
        </motion.h1>
        <motion.p
          className="mt-4 text-white/70 text-sm md:text-base"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Explore a collection of my best anniversary, birthday, flyer, and logo
          designs
        </motion.p>
      </div>

      {/* Category Tabs */}
      <div className="max-w-7xl mx-auto px-6 flex justify-center gap-6 mb-12 flex-wrap">
        {categories.map((cat) => (
          <motion.button
            key={cat}
            onClick={() => setActiveTab(cat)}
            className={`px-6 py-2 rounded-full font-medium transition-all ${
              activeTab === cat
                ? "bg-gradient-to-r from-[#045496] to-[#05d1ed] text-black shadow-lg"
                : "bg-white/10 text-white hover:bg-gradient-to-r hover:from-[#045496]/40 hover:to-[#05d1ed]/40"
            }`}
            whileHover={{ scale: 1.05 }}
          >
            {cat}
          </motion.button>
        ))}
      </div>

      {/* Portfolio Grid */}
      <div className="max-w-7xl mx-auto px-6 grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {images.map((img, index) => (
          <motion.div
            key={index}
            className="relative cursor-pointer overflow-hidden rounded-2xl border-2 border-transparent hover:border-gradient-to-r hover:from-[#045496] hover:to-[#05d1ed] shadow-lg hover:shadow-[#05d1ed]/50 transition-all"
            onClick={() => {
              setPhotoIndex(index);
              setLightboxOpen(true);
            }}
            whileHover={{ scale: 1.05 }}
          >
            <img
              src={img}
              alt={img}
              className="w-full h-64 object-cover rounded-2xl"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-[#045496]/20 to-[#05d1ed]/20 opacity-0 hover:opacity-30 transition-all rounded-2xl"></div>
          </motion.div>
        ))}
      </div>

      {/* Custom Lightbox */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="relative w-full max-w-2xl max-h-[80vh] mx-6 rounded-xl overflow-hidden flex items-center justify-center"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
            >
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#045496] to-[#05d1ed] opacity-40 blur-3xl animate-pulse"></div>

              <img
                src={images[photoIndex]}
                alt={images[photoIndex]}
                className="relative max-w-full max-h-[80vh] object-contain rounded-xl z-10"
              />

              <button
                className="absolute top-4 right-4 p-3 rounded-full bg-gradient-to-r from-[#045496] to-[#05d1ed] text-white shadow-lg hover:scale-110 transition-transform z-20"
                onClick={() => setLightboxOpen(false)}
              >
                <FaTimes />
              </button>

              <button
                className="absolute top-1/2 left-4 p-3 rounded-full bg-gradient-to-r from-[#045496] to-[#05d1ed] text-white shadow-lg hover:scale-110 transition-transform -translate-y-1/2 z-20"
                onClick={() =>
                  setPhotoIndex(
                    (photoIndex + images.length - 1) % images.length,
                  )
                }
              >
                <FaArrowLeft />
              </button>

              <button
                className="absolute top-1/2 right-4 p-3 rounded-full bg-gradient-to-r from-[#045496] to-[#05d1ed] text-white shadow-lg hover:scale-110 transition-transform -translate-y-1/2 z-20"
                onClick={() => setPhotoIndex((photoIndex + 1) % images.length)}
              >
                <FaArrowRight />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pinterest CTA */}
      <div className="max-w-7xl mx-auto px-6 text-center mt-12">
        <a
          href="https://www.pinterest.com/OracleMind02/"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-3 px-6 py-3 rounded-xl font-medium bg-gradient-to-r from-[#045496] to-[#05d1ed] text-black hover:scale-105 transition"
        >
          <FaPinterest className="text-xl" />
          View More Designs
        </a>
      </div>

      {/* Reviews Carousel Section */}
      <div className="max-w-4xl mx-auto px-6 py-24 text-center relative">
        <h2 className="text-3xl md:text-4xl font-bold mb-12 bg-clip-text text-transparent bg-gradient-to-r from-[#045496] to-[#05d1ed]">
          Client Reviews
        </h2>

        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeReview}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.5 }}
              className="p-8 rounded-2xl bg-white/10 backdrop-blur border border-white/15 mx-4"
            >
              <p className="text-white/70 text-base md:text-lg mb-4">
                "{reviews[activeReview].text}"
              </p>
              <p className="text-white/50 text-sm md:text-base font-semibold">
                {reviews[activeReview].author}
              </p>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Arrows */}
          <button
            onClick={prevReview}
            className="absolute left-0 top-1/2 -translate-y-1/2 p-3 rounded-full bg-gradient-to-r from-[#045496] to-[#05d1ed] text-white shadow-lg hover:scale-110 transition"
          >
            <FaArrowLeft />
          </button>

          <button
            onClick={nextReview}
            className="absolute right-0 top-1/2 -translate-y-1/2 p-3 rounded-full bg-gradient-to-r from-[#045496] to-[#05d1ed] text-white shadow-lg hover:scale-110 transition"
          >
            <FaArrowRight />
          </button>
        </div>

        {/* Dots */}
        <div className="flex justify-center mt-6 gap-2">
          {reviews.map((_, idx) => (
            <span
              key={idx}
              className={`w-3 h-3 rounded-full cursor-pointer transition-all ${
                idx === activeReview ? "bg-cyan-400 scale-125" : "bg-white/30"
              }`}
              onClick={() => setActiveReview(idx)}
            />
          ))}
        </div>

        {/* Get Your Project Started Button */}
        <div className="mt-12">
          <a
            href="/contact"
            className="inline-block px-8 py-4 font-semibold text-lg rounded-2xl bg-gradient-to-r from-[#045496] to-[#05d1ed] text-black shadow-lg hover:scale-105 transition transform"
          >
            Get Your Project Started
          </a>
        </div>
      </div>
    </section>
  );
}

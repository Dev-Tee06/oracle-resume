import {
  FaInstagram,
  FaPinterest,
  FaWhatsapp,
  FaEnvelope,
} from "react-icons/fa";
import logo from "../assets/logo.jpg"; // Optional logo

export default function Footer() {
  return (
    <footer className="relative bg-gradient-to-br from-black via-slate-900 to-[#045496] text-white pt-20 pb-10 overflow-hidden">
      {/* Top Glow Divider */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-px bg-gradient-to-r from-transparent via-[#05d1ed]/60 to-transparent" />

      <div className="max-w-7xl mx-auto px-6">
        {/* Main Content */}
        <div className="grid gap-12 md:grid-cols-3 backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-10">
          {/* BRANDING */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <img
                src={logo}
                alt="Oracle's Mind"
                className="h-25 w-25 object-contain rounded-full"
              />
              <h2 className="text-2xl font-bold text-[#05d1ed] tracking-wide">
                Oracle's Mind
              </h2>
            </div>
            <p className="mt-2 text-white/70 text-sm leading-relaxed max-w-sm">
              Creative Artist & Video Editor crafting visuals and videos that
              communicate clarity, creativity, and emotion.
            </p>
          </div>

          {/* CONTACT */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">
              Get in Touch
            </h3>

            <div className="space-y-3 text-white/70 text-sm">
              <a
                href="mailto:deoracle711@gmail.com"
                className="flex items-center gap-3 hover:text-[#05d1ed] transition"
              >
                <FaEnvelope className="text-[#05d1ed]" />
                deoracle711@gmail.com
              </a>

              <a
                href="tel:08146040037"
                className="flex items-center gap-3 hover:text-[#05d1ed] transition"
              >
                <FaWhatsapp className="text-[#05d1ed]" />
                08146040037
              </a>

              <a
                href="https://wa.me/qr/F3PQMBZKCQBFK1"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 hover:text-[#05d1ed] transition"
              >
                <FaWhatsapp className="text-[#05d1ed]" />
                WhatsApp Link
              </a>
            </div>
          </div>

          {/* SOCIALS */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">
              Connect With Me
            </h3>

            <div className="flex gap-4">
              <a
                href="https://pin.it/3JQDo7gof"
                target="_blank"
                rel="noreferrer"
                className="w-11 h-11 rounded-full bg-white/10 border border-white/20 flex items-center justify-center hover:bg-[#05d1ed] hover:text-black transition"
              >
                <FaPinterest className="text-xl" />
              </a>

              <a
                href="https://www.instagram.com/oracle__mind?igsh=MW10eDd1eHl6OGltZQ=="
                target="_blank"
                rel="noreferrer"
                className="w-11 h-11 rounded-full bg-white/10 border border-white/20 flex items-center justify-center hover:bg-[#05d1ed] hover:text-black transition"
              >
                <FaInstagram className="text-xl" />
              </a>
            </div>

            <p className="mt-4 text-white/50 text-xs max-w-xs">
              Follow for design insights, creative storytelling, and video
              editing tips.
            </p>
          </div>
        </div>

        {/* BOTTOM */}
        <div className="mt-12 text-center text-white/50 text-sm">
          © {new Date().getFullYear()} Oracle's Mind. All rights reserved.
        </div>
      </div>

      {/* Optional Background Glow */}
      <div className="absolute -top-20 -left-20 w-96 h-96 bg-[#045496]/20 rounded-full blur-3xl -z-10"></div>
      <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-[#05d1ed]/10 rounded-full blur-3xl -z-10"></div>
    </footer>
  );
}

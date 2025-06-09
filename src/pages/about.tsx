// src/pages/about.tsx
"use client";
import WavyText from "@/components/wavy-text";
import { Sparkles } from "@/components/icons/outline";
import { motion } from "motion/react";

export default function About() {
  return (
    <section className="px-8 md:px-24 pt-36 pb-24 space-y-24">
      <div className="space-y-6 max-w-3xl">
        <h1 className="text-4xl font-semibold flex items-center gap-2">
          <Sparkles /> Tentang Website Ini
        </h1>
        <p className="leading-relaxed">
          Situs ini dibangun sebagai laboratorium pribadi untuk berbagi karya,
          eksperimen, dan catatan perjalanan saya di dunia teknologi. Semua
          komponen dibuat dengan memanfaatkan Next.js,
          TypeScript, dan Tailwind CSS. Animasi digerakkan dengan Motion One;
          tema disimpan di localStorage.
        </p>
      </div>

      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", damping: 15 }}
        viewport={{ once: true }}
        className="
          rounded-4xl border p-16 flex flex-col items-center space-y-8
          bg-gradient-to-br from-blue-500 to-blue-300 text-white
        "
      >
        <h2 className="text-3xl font-semibold text-center">
          Sedang buka kolaborasi!
        </h2>
        <p className="max-w-xl text-center">Jika kamu punya ide aplikasi, riset, atau proyek seru lain — mari
          ngobrol. Saya terbuka untuk freelance, kontribusi open-source, hingga
          sekadar diskusi kopi virtual ☕.
        </p>
        <a
          href="mailto:tokichimikuni51@gmail.com"
          className="bg-white/20 hover:bg-white/30 px-8 py-3 rounded-full font-medium"
        >
          Kirim Email
        </a>
      </motion.div>

      <div className="text-4xl font-medium text-center">
        <WavyText />
      </div>
    </section>
  );
}

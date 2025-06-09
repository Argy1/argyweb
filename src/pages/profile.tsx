// src/pages/profile.tsx
import { motion } from "motion/react";
import Image from "next/image";
import {Mail, Phone, Sparkles, Star, LayersIntersect,} from "@/components/icons/outline";
import { FourPointedStar } from "@/components/icons/filled";

const skills = [
  { name: "HTML / CSS", level: 90 },
  { name: "JavaScript / TypeScript", level: 85 },
  { name: "React / Next.js", level: 80 },
  { name: "Tailwind CSS", level: 80 },
  { name: "UI / UX Design", level: 70 },
];

export default function Profile() {
  return (
    <section className="px-8 md:px-24 pt-36 pb-24 bg-[var(--bg)] text-[var(--fg)] space-y-24">
      {/* Hero: Foto & Teks */}
      <div className="grid md:grid-cols-2 gap-16 items-center">
        {/* FOTO: Order 1 di mobile, 2 di desktop */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", damping: 20 }}
          viewport={{ once: true }}
          className="order-1 md:order-2"
        >
          <Image
            src="/img/fotoprofile.jpg"
            alt="Foto Profil"
            width={640}
            height={640}
            className="rounded-full w-full object-cover aspect-square border-8 border-white dark:border-gray-900"
          />
        </motion.div>

        {/* TEKS: Order 2 di mobile, 1 di desktop */}
        <div className="space-y-6 order-2 md:order-1">
          <h1 className="text-5xl font-bold leading-tight">
            Halo <span className="wave">👋</span>, saya{" "}
            <span className="text-blue-500">Argy</span>
          </h1>
          <p className="text-lg text-[var(--fg)]/80">
            Front-end developer &amp; tech enthusiast yang tinggal di{" "}
            <strong>Bekasi</strong>. Gemar membangun antarmuka web yang bersih,
            responsif, dan penuh interaksi seru. Saat tidak menatap kode, saya
            sibuk dengan Anime atau Mobil.
          </p>
          <div className="flex items-center gap-4">
            <a
              href="mailto:tokichimikuni51@gmail.com"
              className="inline-flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-full"
            >
              <Mail className="w-5 h-5" /> Email
            </a>
            <a
              href="tel:+6281380091046"
              className="inline-flex items-center gap-2 border border-blue-500 hover:bg-blue-50 dark:hover:bg-gray-800 text-blue-500 dark:text-blue-300 px-4 py-2 rounded-full"
            >
              <Phone className="w-5 h-5" /> Call
            </a>
          </div>
        </div>
      </div>

      {/* Keahlian */}
      <div className="space-y-8">
        <h2 className="text-3xl font-semibold flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-blue-500" /> Keahlian
        </h2>
        <div className="space-y-6">
          {skills.map(({ name, level }) => (
            <div key={name} className="space-y-2">
              <div className="flex justify-between text-sm font-medium">
                <span>{name}</span>
                <span>{level}%</span>
              </div>
              <div className="w-full h-3 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-blue-500 to-blue-300"
                  initial={{ width: 0 }}
                  whileInView={{ width: `${level}%` }}
                  transition={{ duration: 1 }}
                  viewport={{ once: true }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Fun Fact Cards */}
      <div className="grid md:grid-cols-3 gap-8">
        {[
          {
            icon: <Star className="w-6 h-6 text-blue-500" />,
            title: "10K+",
            desc: "Baris kode tahun ini",
          },
          {
            icon: <LayersIntersect className="w-6 h-6 text-blue-500" />,
            title: "3",
            desc: "Proyek side-project selesai",
          },
          {
            icon: <FourPointedStar className="w-6 h-6 text-blue-500" />,
            title: "∞",
            desc: "Cangkir kopi ☕",
          },
        ].map(({ icon, title, desc }) => (
          <motion.div
            key={title}
            whileHover={{ y: -4, rotate: -1 }}
            className="p-8 rounded-3xl border bg-[var(--bg)] border-gray-200 dark:border-gray-700 flex flex-col gap-4 text-center"
          >
            <span>{icon}</span>
            <h3 className="text-3xl font-semibold">{title}</h3>
            <p className="text-[var(--fg)]/70">{desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

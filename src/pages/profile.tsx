// src/pages/profile.tsx
import { motion } from "motion/react";
import Image from "next/image";
import { Mail, Phone, Sparkles, Star, LayersIntersect } from "@/components/icons/outline";
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
    <section className="px-8 md:px-24 pt-36 pb-24 space-y-24">
      {/* Hero */}
      <div className="grid md:grid-cols-2 gap-16 items-center">
        <div className="space-y-6">
          <h1 className="text-5xl font-bold leading-tight">
            Halo 👋, saya <span className="text-blue-500">Argy</span>
          </h1>
          <p className="text-lg">
            Front-end developer & tech enthusiast yang tinggal di <b>Bekasi</b>.
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
              className="inline-flex items-center gap-2 border border-blue-500 px-4 py-2 rounded-full text-blue-500 hover:bg-blue-50"
            >
              <Phone className="w-5 h-5" /> Call
            </a>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", damping: 20 }}
          viewport={{ once: true }}
          className="
            relative mx-auto w-72 h-72 md:w-96 md:h-96
            rounded-full overflow-hidden shadow-2xl
            border-8 border-[var(--bg)]
          "
        >
          <Image
            src="/asset/foto.jpg"
            alt="Foto Profil"
            layout="fill"
            objectFit="cover"
            priority
          />
        </motion.div>
      </div>

      {/* Skills */}
      <div className="space-y-8">
        <h2 className="text-3xl font-semibold flex items-center gap-2">
          <Sparkles /> Keahlian
        </h2>
        <div className="space-y-6">
          {skills.map(({ name, level }) => (
            <div key={name} className="space-y-2">
              <div className="flex justify-between text-sm font-medium">
                <span>{name}</span>
                <span>{level}%</span>
              </div>
              <div className="w-full h-3 rounded-full bg-gray-200 overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-blue-500 to-blue-300"
                  style={{ width: `${level}%` }}
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

      {/* Fun Fact */}
      <div className="grid md:grid-cols-3 gap-8">
        {[
          { icon: <Star />, title: "10K+", desc: "Baris kode tahun ini" },
          { icon: <LayersIntersect />, title: "3", desc: "Proyek side-project selesai" },
          { icon: <FourPointedStar />, title: "∞", desc: "Cangkir kopi ☕" },
        ].map(({ icon, title, desc }) => (
          <motion.div
            key={title}
            whileHover={{ y: -4, rotate: -1 }}
            transition={{ type: "spring", damping: 15, mass: 0.5 }}
            className="
              p-8 rounded-3xl border
              bg-[var(--bg)] border-gray-200 hover:shadow-lg transition
              text-center
            "
          >
            <span className="text-blue-500">{icon}</span>
            <h3 className="text-3xl font-semibold">{title}</h3>
            <p className="opacity-90">{desc}</p>
          </motion.div>
        ))}
      </div>
    </section>

// src/pages/academic.tsx
import { GraduationCap, Book } from "@/components/icons/outline";
import { motion } from "motion/react";

const timeline = [
  {
    year: "2024 — Sekarang",
    title: "IPB University",
    desc: "Mengembangkan website dengan Next.js & Tailwind.",
  },
  {
    year: "2022 — 2024",
    title: "Universitas Indonesia",
    desc: "Belajar aljabar linear dan gerbang logika.",
  },
  {
    year: "2019 — 2022",
    title: "SMAN 2 Tambun Selatan",
    desc: "Belajar HTML, CSS, dan menjadi wakil ketua ekskul ICT.",
  },
];

export default function Academic() {
  return (
    <section className="px-8 md:px-24 pt-36 pb-24 space-y-16">
      <h1 className="text-4xl font-semibold flex items-center gap-2">
        <Book /> Pengalaman Akademik
      </h1>

      <div className="relative">
        <div className="hidden md:block absolute left-4 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 to-blue-300" />

        <div className="space-y-12">
          {timeline.map(({ year, title, desc }) => (
            <motion.div
              key={year}
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ type: "spring", damping: 20 }}
              className="relative md:pl-24 pl-0"
            >
              <span className="hidden md:block absolute left-0 top-2 w-4 h-4 rounded-full bg-blue-500 border-4 border-[var(--bg)]" />
              <h3 className="text-xl font-medium">{title}</h3>
              <p className="text-blue-500 font-semibold mb-1">{year}</p>
              <p>{desc}</p>
            </motion.div>
          ))}
        </div>
      </div>

      <blockquote className="italic text-center text-lg opacity-70">
        <GraduationCap className="w-6 h-6 mx-auto mb-2 text-blue-500" />
        <span>“Learning never exhausts the mind.” — Leonardo da Vinci</span>
      </blockquote>
    </section>
  );
}

// src/pages/hobbies.tsx
import { Mask, Music, Car, Gamepad } from "@/components/icons/outline";
import { FourPointedStar } from "@/components/icons/filled";
import { motion } from "motion/react";

const hobbies = [
  { icon: <Mask />, title: "Cosplay", desc: "Eksplorasi karakter & komunitas anime." },
  { icon: <Music />, title: "Musik", desc: "Mendengarkan lagu anime favorit." },
  { icon: <Gamepad />, title: "Gaming", desc: "Puzzle & indie story-driven." },
  { icon: <Car />, title: "Otomotif", desc: "Road trip & fotografi mobil." },
];

export default function Hobbies() {
  return (
    <section className="px-8 md:px-24 pt-36 pb-24 space-y-16">
      <h1 className="text-4xl font-semibold flex items-center gap-2">
        <FourPointedStar /> Hobi & Kesenangan
      </h1>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
        {hobbies.map(({ icon, title, desc }) => (
          <motion.div
            key={title}
            whileHover={{ y: -6, scale: 1.03 }}
            transition={{ type: "spring", damping: 15, mass: 0.5 }}
            className="
              p-8 rounded-3xl border
              bg-[var(--bg)]
              border-gray-200 dark:border-gray-700
              space-y-4
            "
          >
            <span className="text-blue-500">{icon}</span>
            <h3 className="text-xl font-medium">{title}</h3>
            <p>{desc}</p>
          </motion.div>
        ))}
      </div>
    </section>

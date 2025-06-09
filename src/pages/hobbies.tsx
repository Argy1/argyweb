import { Mask, Music, Car, Gamepad } from "@/components/icons/outline";
import { FourPointedStar } from "@/components/icons/filled";
import { motion } from "motion/react";

const hobbies = [
  {
    icon: <Mask />,
    title: "Cosplay",
    desc: "Mengeksplorasi karakter dan kostum, kreasi DIY, serta komunitas anime/manga.",
  },
  {
    icon: <Music />,
    title: "Musik",
    desc: "Mendengarkan lagu anime kesukaan saya.",
  },
  {
    icon: <Gamepad />,
    title: "Gaming",
    desc: "Casual gamer — suka game puzzle dan indie story-driven.",
  },
  {
    icon: <Car />,
    title: "Otomotif",
    desc: "Mengoleksi dan memfotografi mobil, serta road trip ke lokasi unik.",
  },
];

export default function Hobbies() {
  return (
    <section className="px-8 md:px-24 pt-36 pb-24 space-y-24">
      <h1 className="text-4xl font-semibold text-gray-900 dark:text-gray-50 flex items-center gap-2">
        <FourPointedStar /> Hobi &amp; Kesenangan
      </h1>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
        {hobbies.map(({ icon, title, desc }) => (
          <motion.div
            key={title}
            whileHover={{ y: -6, scale: 1.03 }}
            transition={{ type: "spring", damping: 15, mass: 0.5 }}
            className="p-8 rounded-3xl border bg-white dark:bg-gray-800/50
                       border-gray-200 dark:border-gray-700 space-y-4"
          >
            <span className="text-blue-500">{icon}</span>
            <h3 className="text-xl font-medium text-gray-900 dark:text-gray-50">
              {title}
            </h3>
            <p className="text-gray-700 dark:text-gray-300">{desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

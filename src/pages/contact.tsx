// src/pages/contact.tsx
"use client";

import { motion } from "motion/react";
import { Mail, Phone, WhatsApp, Plane } from "@/components/icons/outline";
import { FourPointedStar } from "@/components/icons/filled";

export default function Contact() {
  return (
    <section className="px-8 md:px-24 pt-36 pb-24 space-y-24">
      {/* Hero */}
      <div className="text-center space-y-6">
        <h1 className="text-5xl font-bold flex justify-center gap-3">
          <span>Kontak</span>
          <span className="text-blue-500">Saya</span>
        </h1>
        <p className="max-w-xl mx-auto">
          Ada ide keren atau sekadar ingin bertanya? Kirim pesan via form,
          email, atau platform favoritmu—aku akan membalas secepatnya 🚀
        </p>
      </div>

      {/* Info Singkat */}
      <div className="grid md:grid-cols-3 gap-12">
        {[
          {
            icon: <Mail />,
            title: "Email",
            value: "tokichimikuni51@gmail.com",
            link: "mailto:tokichimikuni51@gmail.com",
          },
          {
            icon: <Phone />,
            title: "Telepon",
            value: "+62 813-8009-1046",
            link: "tel:+6281380091046",
          },
          {
            icon: <WhatsApp />,
            title: "WhatsApp",
            value: "+62 813-8009-1046",
            link: "https://wa.me/6281380091046",
          },
        ].map(({ icon, title, value, link }) => (
          <motion.a
            href={link}
            key={title}
            whileHover={{ y: -4, rotate: -1 }}
            className="
              flex items-start gap-4 p-6 rounded-3xl border
              bg-[var(--bg)] border-gray-200 hover:shadow-lg transition
            "
          >
            <span className="text-blue-500">{icon}</span>
            <div>
              <p className="font-medium">{title}</p>
              <p className="opacity-90">{value}</p>
            </div>
          </motion.a>
        ))}
      </div>

      {/* Form & Map */}
      <div className="grid md:grid-cols-2 gap-12">
        <motion.form
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ type: "spring", damping: 20 }}
          onSubmit={(e) => {
            e.preventDefault();
            alert("Terima kasih! Pesan terkirim ✨");
            e.currentTarget.reset();
          }}
          className="
            space-y-6 p-8 border border-gray-200 rounded-4xl
            bg-[var(--bg)]
          "
        >
          <h2 className="text-2xl font-semibold">Kirim Pesan</h2>
          <div className="space-y-2">
            <label className="block text-sm font-medium" htmlFor="name">
              Nama
            </label>
            <input
              id="name"
              name="name"
              required
              placeholder="John Doe"
              className="
                w-full rounded-lg border border-gray-300
                bg-gray-50 px-4 py-3 outline-none
                focus:ring-2 focus:ring-blue-400
              "
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              name="email"
              required
              placeholder="john@example.com"
              className="
                w-full rounded-lg border border-gray-300
                bg-gray-50 px-4 py-3 outline-none
                focus:ring-2 focus:ring-blue-400
              "
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium" htmlFor="message">
              Pesan
            </label>
            <textarea
              id="message"
              name="message"
              required
              rows={5}
              placeholder="Tulis pesanmu di sini..."
              className="
                w-full rounded-lg border border-gray-300
                bg-gray-50 px-4 py-3 outline-none
                focus:ring-2 focus:ring-blue-400
              "
            />
          </div>
          <button
            type="submit"
            className="
              inline-flex items-center gap-2 bg-blue-500
              hover:bg-blue-600 text-white px-6 py-3 rounded-full
              font-medium transition
            "
          >
            <Plane className="w-5 h-5" /> Kirim
          </button>
        </motion.form>

        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ type: "spring", damping: 20 }}
          className="space-y-8"
        >
          <div className="overflow-hidden rounded-3xl border-4 border-gray-200 grow">
            <iframe
              className="w-full h-full min-h-[300px]"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12...etc"
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>

          <div className="relative p-8 rounded-3xl bg-gradient-to-r from-blue-500 to-blue-300 text-white">
            <FourPointedStar className="absolute -top-4 -left-4 w-12 h-12 opacity-20" />
            <h3 className="text-xl font-semibold mb-2">
              Lebih suka ngobrol langsung?
            </h3>
            <p className="mb-4">
              Ajak ngopi di sekitar Bekasi—cukup kirim pesan dan atur jadwal!
            </p>
            <a
              href="https://wa.me/6281380091046"
              className="bg-white/20 hover:bg-white/30 px-6 py-2 rounded-full"
            >
              Chat Sekarang
            </a>
          </div>
        </motion.div>
      </div>

      <p className="text-center text-sm opacity-70">
        Dibuat dengan <span className="text-red-500">❤</span> di Bekasi — See you on inbox!
      </p>
    </section>
  );
}

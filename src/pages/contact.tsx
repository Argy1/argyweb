// src/pages/contact.tsx
"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { Mail, Phone, WhatsApp, Plane } from "@/components/icons/outline";
import { FourPointedStar } from "@/components/icons/filled";

export default function Contact() {
  const [status, setStatus] = useState<"idle" | "loading">("idle");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("loading");

    const form = e.currentTarget;
    const data = {
      name: form.name.value,
      email: form.email.value,
      message: form.message.value,
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Network response was not ok");
      alert("Terima kasih! Pesan terkirim ✨");
      form.reset();
    } catch (err) {
      console.error(err);
      alert("Maaf, gagal mengirim. Silakan coba lagi nanti.");
    } finally {
      setStatus("idle");
    }
  };

  return (
    <section className="px-8 md:px-24 pt-36 pb-24 bg-white dark:bg-gray-900 space-y-24">
      {/* Hero / Intro */}
      <div className="text-center space-y-6">
        <h1 className="text-5xl font-bold text-gray-900 dark:text-gray-50 flex justify-center gap-3">
          <span>Kontak</span>
          <span className="text-blue-500">Saya</span>
        </h1>
        <p className="text-gray-700 dark:text-gray-300 max-w-xl mx-auto">
          Ada ide keren atau sekadar ingin bertanya? Kirim pesan via form, email,
          atau platform favoritmu—aku akan membalas secepatnya 🚀
        </p>
      </div>

      {/* Info Singkat */}
      <div className="grid md:grid-cols-3 gap-12">
        {[
          {
            icon: <Mail className="w-6 h-6 text-blue-500" />,
            title: "Email",
            value: "tokichimikuni51@gmail.com",
            link: "mailto:tokichimikuni51@gmail.com",
          },
          {
            icon: <Phone className="w-6 h-6 text-blue-500" />,
            title: "Telepon",
            value: "+62 813-8009-1046",
            link: "tel:+6281380091046",
          },
          {
            icon: <WhatsApp className="w-6 h-6 text-blue-500" />,
            title: "WhatsApp",
            value: "+62 813-8009-1046",
            link: "https://wa.me/6281380091046",
          },
        ].map(({ icon, title, value, link }) => (
          <motion.a
            href={link}
            key={title}
            whileHover={{ y: -4, rotate: -1 }}
            className="flex items-start gap-4 p-6 rounded-3xl border
                       bg-white dark:bg-gray-800/50
                       border-gray-200 dark:border-gray-700
                       hover:shadow-lg transition"
          >
            {icon}
            <div>
              <p className="font-medium text-gray-900 dark:text-gray-50">{title}</p>
              <p className="text-gray-600 dark:text-gray-400">{value}</p>
            </div>
          </motion.a>
        ))}
      </div>

      {/* Form + Map */}
      <div className="grid md:grid-cols-2 gap-12">
        {/* Form */}
        <motion.form
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ type: "spring", damping: 20 }}
          onSubmit={handleSubmit}
          className="space-y-6 bg-white dark:bg-gray-800/50 border
                     border-gray-200 dark:border-gray-700 rounded-4xl p-8"
        >
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-50">
            Kirim Pesan
          </h2>

          <div className="space-y-2">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Nama
            </label>
            <input
              id="name"
              name="name"
              required
              placeholder="John Doe"
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600
                         bg-gray-50 dark:bg-gray-700 px-4 py-3 outline-none
                         focus:ring-2 focus:ring-blue-400 text-gray-900 dark:text-gray-100"
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              placeholder="john@example.com"
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600
                         bg-gray-50 dark:bg-gray-700 px-4 py-3 outline-none
                         focus:ring-2 focus:ring-blue-400 text-gray-900 dark:text-gray-100"
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="message"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Pesan
            </label>
            <textarea
              id="message"
              name="message"
              required
              rows={5}
              placeholder="Tulis pesanmu di sini..."
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600
                         bg-gray-50 dark:bg-gray-700 px-4 py-3 outline-none
                         focus:ring-2 focus:ring-blue-400 text-gray-900 dark:text-gray-100"
            />
          </div>

          <button
            type="submit"
            disabled={status === "loading"}
            className="inline-flex items-center gap-2 bg-blue-500
                       hover:bg-blue-600 text-white px-6 py-3 rounded-full
                       font-medium transition disabled:opacity-50"
          >
            <Plane className="w-5 h-5" />
            {status === "loading" ? " Mengirim..." : " Kirim"}
          </button>
        </motion.form>

        {/* Map & CTA */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ type: "spring", damping: 20 }}
          className="space-y-8 flex flex-col"
        >
          <div className="overflow-hidden rounded-3xl border-4 border-gray-200 dark:border-gray-700 grow">
            <iframe
              className="w-full h-full min-h-[300px]"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.157768589624!2d107.0267150757242!3d-6.241582993748429!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e698fa23f0ae9c5%3A0x77cf1b22ad5151a!2sTaman%20Raya%20Bekasi!5e0!3m2!1sid!2sid!4v1717816629285!5m2!1sid!2sid"
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
            <p className="text-white/90 mb-4">
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

      {/* Penutup */}
      <p className="text-center text-gray-500 dark:text-gray-400 text-sm">
        Dibuat dengan <span className="text-red-500">❤</span> di Bekasi —{" "}
        <span className="italic">See you in inbox!</span>
      </p>
    </section>
  );
}

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
    const formData = new FormData(form);
    const data = {
      name: formData.get("name")?.toString() || "",
      email: formData.get("email")?.toString() || "",
      message: formData.get("message")?.toString() || "",
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
    } catch {
      alert("Maaf, gagal mengirim. Silakan coba lagi nanti.");
    } finally {
      setStatus("idle");
    }
  };

  return (
    <section className="px-8 md:px-24 pt-36 pb-24 bg-[var(--bg)] text-[var(--fg)] space-y-24">
      {/* Hero */}
      <div className="text-center space-y-4">
        <h1 className="text-5xl font-bold flex justify-center gap-2">
          <span>Kontak</span>
          <span className="text-blue-500">Saya</span>
        </h1>
        <p className="max-w-xl mx-auto">
          Ada ide keren atau sekadar ingin bertanya? Kirim pesan via form, email, atau
          platform favoritmu—aku akan membalas secepatnya 🚀
        </p>
      </div>

      {/* Quick Info */}
      <div className="grid md:grid-cols-3 gap-6">
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
            key={title}
            href={link}
            whileHover={{ y: -4, rotate: -1 }}
            className="flex items-center gap-4 p-4 rounded-2xl border
                       bg-[var(--bg)] border-gray-300 dark:border-gray-700 transition"
          >
            {icon}
            <div>
              <p className="font-medium">{title}</p>
              <p className="text-sm">{value}</p>
            </div>
          </motion.a>
        ))}
      </div>

      {/* Form & Map */}
      <div className="grid md:grid-cols-2 gap-12">
        {/* Form */}
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ type: "spring", damping: 20 }}
          className="space-y-6 p-6 rounded-2xl border
                     bg-[var(--bg)] border-gray-300 dark:border-gray-700"
        >
          <h2 className="text-2xl font-semibold">Kirim Pesan</h2>

          <label className="block">
            <span className="text-sm">Nama</span>
            <input
              name="name"
              required
              placeholder="John Doe"
              className="mt-1 block w-full rounded-lg border px-3 py-2
                         bg-gray-50 dark:bg-gray-700
                         text-gray-900 dark:text-gray-100
                         border-gray-300 dark:border-gray-600
                         focus:ring-2 focus:ring-blue-400 outline-none"
            />
          </label>

          <label className="block">
            <span className="text-sm">Email</span>
            <input
              name="email"
              type="email"
              required
              placeholder="john@example.com"
              className="mt-1 block w-full rounded-lg border px-3 py-2
                         bg-gray-50 dark:bg-gray-700
                         text-gray-900 dark:text-gray-100
                         border-gray-300 dark:border-gray-600
                         focus:ring-2 focus:ring-blue-400 outline-none"
            />
          </label>

          <label className="block">
            <span className="text-sm">Pesan</span>
            <textarea
              name="message"
              rows={5}
              required
              placeholder="Tulis pesanmu di sini..."
              className="mt-1 block w-full rounded-lg border px-3 py-2
                         bg-gray-50 dark:bg-gray-700
                         text-gray-900 dark:text-gray-100
                         border-gray-300 dark:border-gray-600
                         focus:ring-2 focus:ring-blue-400 outline-none"
            />
          </label>

          <button
            type="submit"
            disabled={status === "loading"}
            className="inline-flex items-center gap-2 bg-blue-500 hover:bg-blue-600
                       text-white px-5 py-2 rounded-full transition disabled:opacity-50"
          >
            <Plane className="w-5 h-5" />
            {status === "loading" ? "Mengirim..." : "Kirim"}
          </button>
        </motion.form>

        {/* Map & CTA */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ type: "spring", damping: 20 }}
          className="space-y-6"
        >
          <div className="overflow-hidden rounded-2xl border-2
                          border-gray-300 dark:border-gray-700">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.157768589624!2d107.0267150757242!3d-6.241582993748429!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e698fa23f0ae9c5%3A0x77cf1b22ad5151a!2sTaman%20Raya%20Bekasi!5e0!3m2!1sid!2sid!4v1717816629285!5m2!1sid!2sid"
              className="w-full h-64"
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>

          <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-500 to-blue-300 text-white relative overflow-hidden">
            <FourPointedStar className="absolute -top-4 -left-4 w-12 h-12 opacity-20" />
            <h3 className="text-xl font-semibold">Ajak Ngopi?</h3>
            <p className="mt-1 text-white/90">
              Yuk atur kopi virtual atau ketemu langsung di Bekasi!
            </p>
            <a
              href="https://wa.me/6281380091046"
              className="mt-4 inline-block bg-white/20 hover:bg-white/30 px-4 py-2 rounded-full"
            >
              Chat Sekarang
            </a>
          </div>
        </motion.div>
      </div>

      <p className="text-center text-sm text-gray-500 dark:text-gray-400">
        Dibuat dengan <span className="text-red-500">❤</span> di Bekasi —{" "}
        <span className="italic">See you in inbox!</span>
      </p>
    </section>
  );
}

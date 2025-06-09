// src/pages/index.tsx
import { Topography } from "@/components/graphics/decoration";
import StarSpinner from "@/components/star-spinner";
import { FourPointedStar } from "@/components/icons/filled";
import Link from "next/link";

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <section
        className="
          flex flex-col items-center justify-center
          min-h-screen
          pt-20 px-8
          md:pt-36 md:px-36
          space-y-8
        "
      >
        <h1 className="text-4xl md:text-6xl font-black text-center leading-tight">
          <span className="text-blue-500">Hi, I’m Argy</span><br />
          Welcome to my personal playground!
        </h1>
        <p className="max-w-xl text-center opacity-90">
          Sekilas tentang saya, Pengalaman akademik, dan hobi seru yang ingin saya bagikan.
        </p>
        <div className="flex space-x-6">
          <Link
            href="/profile"
            className="
              px-8 py-3 rounded-full font-medium text-white
              bg-gradient-to-tl from-blue-500 to-blue-300
              hover:opacity-90 transition
            "
          >
            Lihat Profil
          </Link>
          <Link
            href="/contact"
            className="
              px-8 py-3 rounded-full font-medium border-2
              border-blue-300 text-blue-500
              hover:bg-blue-50 transition
            "
          >
            Hubungi Saya
          </Link>
        </div>
        <div className="relative mt-24">
          <StarSpinner className="w-32 h-32 text-indigo-300" baseVelocity={12} />
          <FourPointedStar className="absolute inset-0 w-32 h-32 text-blue-200 blur-sm" />
        </div>
      </section>

      {/* Overview Section */}
      <section
        className="
          px-8 md:px-24 py-24
          rounded-b-[4rem]
          border-b-[12px] border-b-blue-100 dark:border-b-gray-800
          relative overflow-hidden
        "
      >
        <Topography className="absolute inset-x-0 top-0 pointer-events-none text-blue-100 dark:text-gray-800" />

        <h2 className="text-3xl md:text-4xl font-semibold text-center">
          Sekilas Tentang Situs Ini
        </h2>

        <div className="grid md:grid-cols-3 gap-12 mt-16">
          {[
            { title: "Profil", desc: "Kenali latar belakang...", link: "/profile" },
            { title: "Pengalaman Akademik", desc: "Mata kuliah & project...", link: "/academic" },
            { title: "Hobi", desc: "Hal-hal seru di luar kuliah.", link: "/hobbies" },
          ].map(({ title, desc, link }) => (
            <Link
              key={title}
              href={link}
              className="
                space-y-4 p-8 rounded-3xl border
                hover:shadow-xl transition backdrop-blur
              "
            >
              <h3 className="text-xl font-medium text-blue-500">{title}</h3>
              <p className="opacity-90">{desc}</p>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}

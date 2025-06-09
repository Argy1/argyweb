import { Topography } from "@/components/graphics/decoration";
import StarSpinner from "@/components/star-spinner";
import { FourPointedStar } from "@/components/icons/filled";
import Link from "next/link";

export default function Home() {
  return (
    <>
       <section className="flex flex-col items-center justify-center
-                          min-h-screen bg-[var(--bg)]
-                          p-8 md:p-36 space-y-8">
        <h1 className="text-4xl md:text-6xl font-black text-center leading-tight
                       text-gray-900 dark:text-gray-50">
          <span className="text-blue-500">Hi, I’m Argy</span><br />
          Welcome to my personal playground!
        </h1>
        <p className="max-w-xl text-center text-gray-600 dark:text-gray-400">
          Sekilas tentang saya, Pengalaman akademik, dan hobi seru yang ingin aku bagikan.
        </p>
        <div className="flex space-x-6">
          <Link href="/profile"
            className="px-8 py-3 rounded-full font-medium text-white
                       bg-gradient-to-tl from-blue-500 to-blue-300 hover:opacity-90">
            Lihat Profil
          </Link>
          <Link href="/contact"
            className="px-8 py-3 rounded-full font-medium border-2
                       border-blue-300 text-blue-500 hover:bg-blue-50
                       dark:border-blue-500 dark:text-blue-300 dark:hover:bg-gray-800">
            Hubungi Saya
          </Link>
        </div>

        {/* Spinner dekorasi */}
        <div className="relative mt-24">
          <StarSpinner className="w-32 h-32 text-indigo-300" baseVelocity={12} />
          <FourPointedStar className="absolute inset-0 w-32 h-32 text-blue-200 blur-sm" />
        </div>
      </section>

      {/* Ringkasan */}
      <section className="px-8 md:px-24 py-24 bg-white dark:bg-gray-900
                          rounded-b-[4rem] border-b-[12px] border-b-blue-100 dark:border-b-gray-800
                          relative overflow-hidden">
        <Topography className="absolute inset-x-0 top-0 pointer-events-none
                               text-blue-100 dark:text-gray-800" />
        <h2 className="text-3xl md:text-4xl font-semibold text-center
                       text-gray-900 dark:text-gray-50">
          Sekilas Tentang Situs Ini
        </h2>
        <div className="grid md:grid-cols-3 gap-12 mt-16">
          {[
            { title: "Profil", desc: "Kenali latar belakang...", link: "/profile" },
            { title: "Pengalaman Akademik", desc: "Mata kuliah & project...", link: "/academic" },
            { title: "Hobi", desc: "Hal-hal seru di luar kuliah.", link: "/hobbies" },
          ].map(({ title, desc, link }) => (
            <Link key={title} href={link}
              className="space-y-4 p-8 rounded-3xl border
                         hover:shadow-xl transition bg-white/70 dark:bg-gray-800/60
                         backdrop-blur">
              <h3 className="text-xl font-medium text-blue-500">{title}</h3>
              <p className="text-gray-600 dark:text-gray-400">{desc}</p>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}

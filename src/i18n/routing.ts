import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["id", "en"],
  defaultLocale: "id",
  localePrefix: "always",
  // hreflang sudah ada di metadata tiap halaman; header Link dari middleware akan menggandakannya.
  alternateLinks: false,
  pathnames: {
    "/": "/",
    "/work": { id: "/karya", en: "/work" },
    "/work/[slug]": { id: "/karya/[slug]", en: "/work/[slug]" },
    "/about": { id: "/tentang", en: "/about" },
    "/contact": { id: "/kontak", en: "/contact" },
  },
});

export type AppLocale = (typeof routing.locales)[number];
export type AppPathname = keyof typeof routing.pathnames;

/** Query key for the work filter, localized so shared links read naturally. */
export const categoryParam: Record<AppLocale, string> = { id: "kategori", en: "category" };

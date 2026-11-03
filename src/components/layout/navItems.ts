/** Item navigasi utama, dipakai kapsul navbar (≥768px) dan menu ☰ (HP). */
export type NavKey = "home" | "work" | "about" | "contact";

export const navItems = [
  { key: "home", href: "/" },
  { key: "work", href: "/work" },
  { key: "about", href: "/about" },
  { key: "contact", href: "/contact" },
] as const satisfies readonly { key: NavKey; href: string }[];

export function activeKey(pathname: string): NavKey | null {
  if (pathname === "/") return "home";
  if (pathname.startsWith("/work")) return "work";
  if (pathname.startsWith("/about")) return "about";
  if (pathname.startsWith("/contact")) return "contact";
  return null;
}

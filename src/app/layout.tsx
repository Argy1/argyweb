import type { ReactNode } from "react";
import "@/styles/globals.css";

// <html>/<body> ada di app/[locale]/layout.tsx. File ini wajib ada karena app/not-found.tsx di root.
export default function RootLayout({ children }: { children: ReactNode }) {
  return children;
}

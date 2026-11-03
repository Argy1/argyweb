import type { ReactNode } from "react";

// template.tsx di-mount ulang tiap navigasi: konten fade + naik 18px (docs/02 Gerak).
export default function Template({ children }: { children: ReactNode }) {
  return <div className="page-enter">{children}</div>;
}

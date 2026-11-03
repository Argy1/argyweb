"use client";

import type { ReactNode } from "react";
import { useUI } from "@/lib/uiStore";

interface PeekLinkProps {
  slug: string;
  href: string;
  className?: string;
  children: ReactNode;
}

/**
 * Kartu bento Beranda: klik biasa membuka panel intip dan mengganti URL ke halaman proyek
 * (history.pushState, fallback intercepting route — lihat docs/04). Ctrl/Cmd-klik, klik tengah,
 * atau tanpa JS tetap membuka halaman penuh.
 */
export function PeekLink({ slug, href, className, children }: PeekLinkProps) {
  const setPeek = useUI((s) => s.setPeek);
  return (
    <a
      href={href}
      className={className}
      aria-haspopup="dialog"
      onClick={(e) => {
        if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
        e.preventDefault();
        window.history.pushState({ argyPeek: slug }, "", href);
        setPeek(slug);
      }}
    >
      {children}
    </a>
  );
}

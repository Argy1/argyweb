"use client";

import type { ComponentProps, MouseEvent } from "react";
import { emitSignal } from "@/components/background/signals";
import { chipMotion } from "@/components/three/chipStore";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { useFxStore } from "@/lib/fxStore";
import { runNavTransition, type NavDirection } from "@/lib/pageTransition";

type LinkProps = ComponentProps<typeof Link>;
export type { NavDirection };

/** Urutan rute untuk menentukan arah geser: Beranda → Karya → detail proyek → Tentang → Kontak. */
function routeIndex(path: string): number {
  if (path.startsWith("/work/")) return 1.5;
  if (path.startsWith("/work")) return 1;
  if (path.startsWith("/about")) return 2;
  if (path.startsWith("/contact")) return 3;
  return 0;
}

export function directionFor(from: string, to: string): NavDirection {
  return routeIndex(to) >= routeIndex(from) ? "forward" : "back";
}

function isPlainLeftClick(e: MouseEvent<HTMLElement>) {
  return !e.defaultPrevented && e.button === 0 && !e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey;
}

/** Memicu sinyal sirkuit + sentakan chip dari titik klik (atau pusat elemen untuk keyboard). */
export function signalNavigation(e: MouseEvent<HTMLElement>) {
  if (!isPlainLeftClick(e)) return;
  if (useFxStore.getState().mode !== "full") return;
  const rect = e.currentTarget.getBoundingClientRect();
  const keyboard = e.detail === 0 || (e.clientX === 0 && e.clientY === 0);
  emitSignal(keyboard ? rect.left + rect.width / 2 : e.clientX, keyboard ? rect.top + rect.height / 2 : e.clientY);
  chipMotion.kick(0.6);
  chipMotion.flash(0.8);
}

/**
 * `Link` untuk navigasi antar halaman: membungkus navigasi dalam View Transition geser arah
 * (maju/mundur) dan memicu sinyal sirkuit di latar. Klik dengan modifier / tab baru berjalan seperti biasa.
 */
export function NavLink({ direction, onClick, ...props }: LinkProps & { direction?: NavDirection }) {
  const pathname = usePathname();
  const router = useRouter();
  const href = props.href as string | { pathname: string };
  const target = typeof href === "string" ? href : href.pathname;

  return (
    <Link
      {...props}
      onClick={(e) => {
        onClick?.(e);
        if (!isPlainLeftClick(e)) return;
        signalNavigation(e);
        // Halaman yang sama: biarkan Link menanganinya (tanpa transisi).
        if (typeof href === "string" && href === pathname) return;
        e.preventDefault();
        runNavTransition(direction ?? directionFor(pathname, target), () => router.push(props.href as never));
      }}
    />
  );
}

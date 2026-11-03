import Image from "next/image";

export type ChipAnchorId =
  | "intro"
  | "home-hero"
  | "home-work"
  | "home-about"
  | "contact"
  | "work-head"
  | "work-grid"
  | "project-hero"
  | "project-body"
  | "about-hero"
  | "about-stack"
  | "about-journey"
  | "contact-hero"
  | "contact-form";

interface ChipAnchorProps {
  id: ChipAnchorId;
  /** Opacity chip di anchor ini (docs/03 §5). */
  opacity?: number;
  /** Tampilkan gambar statis chip bila WebGL tidak tersedia. */
  fallback?: boolean;
  className?: string;
}

/**
 * Ruang kosong nyata di layout tempat chip 3D "parkir". Ukurannya diatur CSS per breakpoint
 * (globals.css), jadi chip otomatis responsif dan tidak pernah berada di belakang teks.
 */
export function ChipAnchor({ id, opacity, fallback = false, className }: ChipAnchorProps) {
  return (
    <div
      data-chip-anchor={id}
      data-chip-opacity={opacity}
      className={className ? `chip-anchor ${className}` : "chip-anchor"}
      aria-hidden="true"
    >
      {fallback && (
        <Image src="/chip-fallback.webp" alt="" width={600} height={600} className="chip-fallback" loading="eager" />
      )}
    </div>
  );
}

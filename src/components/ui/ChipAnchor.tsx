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
  /**
   * Anchor "stage" untuk HP dan tablet (< 1024px): ruang kosong rata tengah di atas judul section, supaya
   * chip ikut turun antar section seperti di desktop. Disembunyikan di ≥ 1024px dan di mode Ringan (HP).
   */
  stage?: boolean;
  className?: string;
}

/**
 * Ruang kosong nyata di layout tempat chip 3D "parkir". Ukurannya diatur CSS per breakpoint
 * (globals.css), jadi chip otomatis responsif dan tidak pernah berada di belakang teks.
 */
export function ChipAnchor({ id, opacity, fallback = false, stage = false, className }: ChipAnchorProps) {
  const base = stage ? "chip-anchor chip-stage" : "chip-anchor";
  return (
    <div
      data-chip-anchor={id}
      data-chip-opacity={opacity}
      className={className ? `${base} ${className}` : base}
      aria-hidden="true"
    >
      {fallback && (
        <Image src="/chip-fallback.webp" alt="" width={600} height={600} className="chip-fallback" loading="eager" />
      )}
    </div>
  );
}

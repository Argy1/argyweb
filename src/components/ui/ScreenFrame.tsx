import Image from "next/image";

interface ScreenFrameProps {
  src: string;
  alt: string;
  sizes: string;
  className?: string;
  priority?: boolean;
}

/** Screenshot proyek dalam bingkai jendela aplikasi (bilah atas + tiga titik), dipakai di kartu dan cover. */
export function ScreenFrame({ src, alt, sizes, className = "", priority = false }: ScreenFrameProps) {
  return (
    <span
      className={`flex flex-col overflow-hidden rounded-[14px] border border-veil-35 bg-surface shadow-[0_18px_40px_-18px_var(--shadow)] ${className}`}
    >
      <span className="flex h-[18px] flex-none items-center gap-1 bg-surface-2 px-2.5" aria-hidden="true">
        <i className="size-[6px] rounded-full bg-line" />
        <i className="size-[6px] rounded-full bg-line" />
        <i className="size-[6px] rounded-full bg-line" />
      </span>
      <span className="relative block min-h-0 flex-1">
        <Image src={src} alt={alt} fill sizes={sizes} priority={priority} className="object-cover object-top" />
      </span>
    </span>
  );
}

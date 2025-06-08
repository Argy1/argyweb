import { SVGProps } from "react";

type IconProps = {
  className?: string;
  strokeWidth?: number;
} & SVGProps<SVGSVGElement>;

export const Sun = ({
  className,
  strokeWidth = 2,
  ...rest
}: IconProps) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    {...rest}
  >
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2m0 16v2m10-10h-2M4 12H2m15.536-6.536l-1.414 1.414M7.879 16.121l-1.414 1.414m0-11.314 1.414 1.414m11.314 11.314-1.414-1.414"/>
  </svg>
);

export const Moon = ({
  className,
  strokeWidth = 2,
  ...rest
}: IconProps) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    {...rest}
  >
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
  </svg>
);
export const MapPin = ({ className, strokeWidth }: { className?: string, strokeWidth?: number }) => {
    return (
        <svg className={className} xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth ?? 2} strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M9 11a3 3 0 1 0 6 0a3 3 0 0 0 -6 0" /><path d="M17.657 16.657l-4.243 4.243a2 2 0 0 1 -2.827 0l-4.244 -4.243a8 8 0 1 1 11.314 0z" /></svg>
    )
}

export const Clock = ({ className, strokeWidth }: { className?: string, strokeWidth?: number }) => {
    return (
        <svg className={className} xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth ?? 2} strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0" /><path d="M12 7v5l3 3" /></svg>
    )
}

export const Phone = ({ className, strokeWidth }: { className?: string, strokeWidth?: number }) => {
    return (
        <svg className={className} xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth ?? 2} strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M5 4h4l2 5l-2.5 1.5a11 11 0 0 0 5 5l1.5 -2.5l5 2v4a2 2 0 0 1 -2 2a16 16 0 0 1 -15 -15a2 2 0 0 1 2 -2" /></svg>
    )
}

export const WhatsApp = ({ className, strokeWidth }: { className?: string, strokeWidth?: number }) => {
    return (
        <svg className={className} xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth ?? 2} strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M3 21l1.65 -3.8a9 9 0 1 1 3.4 2.9l-5.05 .9" /><path d="M9 10a.5 .5 0 0 0 1 0v-1a.5 .5 0 0 0 -1 0v1a5 5 0 0 0 5 5h1a.5 .5 0 0 0 0 -1h-1a.5 .5 0 0 0 0 1" /></svg>
    )
}

export const Mail = ({ className, strokeWidth }: { className?: string, strokeWidth?: number }) => {
    return (
        <svg className={className} xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth ?? 2} strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M3 7a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v10a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-10z" /><path d="M3 7l9 6l9 -6" /></svg>
    )
}

export const Book = ({ className, strokeWidth }: { className?: string, strokeWidth?: number }) => {
    return (
        <svg className={className} xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth ?? 2} strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M19 4v16h-12a2 2 0 0 1 -2 -2v-12a2 2 0 0 1 2 -2h12z" /><path d="M19 16h-12a2 2 0 0 0 -2 2" /><path d="M9 8h6" /></svg>
    )
}

export const Link = ({ className, strokeWidth }: { className?: string, strokeWidth?: number }) => {
    return (
        <svg className={className} xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth ?? 2} strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M9 15l6 -6" /><path d="M11 6l.463 -.536a5 5 0 0 1 7.071 7.072l-.534 .464" /><path d="M13 18l-.397 .534a5.068 5.068 0 0 1 -7.127 0a4.972 4.972 0 0 1 0 -7.071l.524 -.463" /></svg>
    )
}

export const ArrowNarrowDown = ({ className, strokeWidth }: { className?: string, strokeWidth?: number }) => {
    return (
        <svg className={className} xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth ?? 2} strokeLinecap="round" strokeLinejoin="round" ><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M12 5l0 14" /><path d="M16 15l-4 4" /><path d="M8 15l4 4" /></svg>
    )
}

export const Sparkles = ({ className, strokeWidth }: { className?: string, strokeWidth?: number }) => {
    return (
        <svg className={className} xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth ?? 2} strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M16 18a2 2 0 0 1 2 2a2 2 0 0 1 2 -2a2 2 0 0 1 -2 -2a2 2 0 0 1 -2 2zm0 -12a2 2 0 0 1 2 2a2 2 0 0 1 2 -2a2 2 0 0 1 -2 -2a2 2 0 0 1 -2 2zm-7 12a6 6 0 0 1 6 -6a6 6 0 0 1 -6 -6a6 6 0 0 1 -6 6a6 6 0 0 1 6 6z" /></svg>
    )
}

export const LayersIntersect = ({ className, strokeWidth }: { className?: string, strokeWidth?: number }) => {
    return (
        <svg className={className} xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth ?? 2} strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M8 4m0 2a2 2 0 0 1 2 -2h8a2 2 0 0 1 2 2v8a2 2 0 0 1 -2 2h-8a2 2 0 0 1 -2 -2z" /><path d="M4 8m0 2a2 2 0 0 1 2 -2h8a2 2 0 0 1 2 2v8a2 2 0 0 1 -2 2h-8a2 2 0 0 1 -2 -2z" /></svg>
    )
}

export const Star = ({ className, strokeWidth }: { className?: string, strokeWidth?: number }) => {
    return (
        <svg className={className} xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth ?? 2} strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M17.286 21.09q -1.69 .001 -5.288 -2.615q -3.596 2.617 -5.288 2.616q -2.726 0 -.495 -6.8q -9.389 -6.775 2.135 -6.775h.076q 1.785 -5.516 3.574 -5.516q 1.785 0 3.574 5.516h.076q 11.525 0 2.133 6.774q 2.23 6.802 -.497 6.8" /></svg>
    )
}

export const FourPointedStar = ({ className, strokeWidth }: { className?: string, strokeWidth?: number }) => {
    return (
        <svg className={className} strokeWidth={strokeWidth ?? 2} stroke="currentColor" xmlns="http://www.w3.org/2000/svg" width={28} height={28} viewBox="0 0 28 28" fill="none">
            <path d="M14.282 5.084c.257 1.447.544 2.85.848 3.979.152.563.313 1.078.485 1.505.16.394.373.834.678 1.139.305.305.745.519 1.139.678.427.172.942.333 1.506.485 1.128.304 2.53.59 3.978.848.58.103 1.1.197 1.564.282l-1.564.282c-1.447.257-2.85.544-3.979.848-.563.152-1.078.313-1.505.485-.394.16-.834.373-1.139.678-.305.305-.519.745-.678 1.139-.172.427-.333.942-.485 1.506a41.718 41.718 0 0 0-.65 2.905l-.198 1.073c-.103.58-.197 1.1-.282 1.564l-.282-1.564c-.257-1.447-.544-2.85-.848-3.979a13.629 13.629 0 0 0-.485-1.505c-.16-.394-.373-.834-.678-1.139-.305-.305-.745-.519-1.139-.678a13.628 13.628 0 0 0-1.505-.485c-1.129-.304-2.532-.59-3.979-.848-.58-.103-1.1-.197-1.565-.282l1.565-.282c1.447-.257 2.85-.544 3.979-.848a13.628 13.628 0 0 0 1.505-.485c.394-.16.834-.373 1.139-.678.305-.305.519-.745.678-1.139.172-.427.333-.942.485-1.505.304-1.129.59-2.532.848-3.979.103-.58.197-1.1.282-1.565l.282 1.565Z" />
        </svg>
    )
}

export const Menu = ({ className, strokeWidth }: { className?: string, strokeWidth?: number }) => {
    return (
        <svg className={className} xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth ?? 2} strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M7 6h10" /><path d="M4 12h16" /><path d="M7 12h13" /><path d="M7 18h10" /></svg>
    )
}

export const X = ({ className, strokeWidth }: { className?: string, strokeWidth?: number }) => {
    return (
        <svg className={className} xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth ?? 2} strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M18 6l-12 12" /><path d="M6 6l12 12" /></svg>
    )
}

export const GraduationCap = ({
  className,
  strokeWidth = 2,
}: {
  className?: string;
  strokeWidth?: number;
}) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 7l-9-4-9 4 9 4 9-4z" />
    <path d="M12 3v17" />
    <path d="M3 11v4a4 4 0 0 0 4 4h10a4 4 0 0 0 4-4v-4" />
  </svg>
);

// src/components/icons/outline.tsx
// … sebelumnya sudah ada export MapPin, Clock, WhatsApp, dll.

export const Music = ({
  className,
  strokeWidth = 2,
}: {
  className?: string;
  strokeWidth?: number;
}) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M9 18V5l12-2v13" />
    <circle cx="6" cy="18" r="3" />
    <circle cx="18" cy="16" r="3" />
  </svg>
);

export const Gamepad = ({
  className,
  strokeWidth = 2,
}: {
  className?: string;
  strokeWidth?: number;
}) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="2" y="6" width="20" height="12" rx="2" ry="2" />
    <path d="M6 12h4" />
    <path d="M8 10v4" />
    <path d="M14 10l0 .01" />
    <path d="M18 10l0 .01" />
  </svg>
);

// ===== Tambahkan di src/components/icons/outline.tsx =====

export const Mask = ({
  className,
  strokeWidth = 2,
}: {
  className?: string;
  strokeWidth?: number;
}) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {/* Ikon topeng cosplay */}
    <path d="M4 14s2-4 8-4 8 4 8 4-2 4-8 4-8-4-8-4z" />
    <path d="M10 10h.01M14 10h.01" />
    <path d="M2 12s2-7 10-7 10 7 10 7" />
  </svg>
);

export const Car = ({
  className,
  strokeWidth = 2,
}: {
  className?: string;
  strokeWidth?: number;
}) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {/* Ikon mobil otomotif */}
    <rect x="2" y="13" width="20" height="6" rx="2" ry="2" />
    <circle cx="7" cy="19" r="2" />
    <circle cx="17" cy="19" r="2" />
    <path d="M5 13V9a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v4" />
  </svg>
);

export const Plane = ({
  className,
  strokeWidth = 2,
}: {
  className?: string;
  strokeWidth?: number;
}) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M10.5 19L17 12.5L10.5 6" />
    <path d="M17 12.5H3" />
    <path d="M14 4L16 10L22 11L16 12L14 18" />
  </svg>
);



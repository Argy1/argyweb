import { ImageResponse } from "next/og";

// next/og (Satori) tidak membaca CSS custom property; nilai disalin dari tokens.css.
const c = {
  bg: "#EEF1F6",
  ink: "#0F1629",
  muted: "#4E5870",
  blue: "#2F5BFF",
  navy: "#121A3A",
  gold: "#E3B34C",
  steel: "#D6DCE6",
  violet: "#6E62F0",
  white: "#FFFFFF",
  grid: "rgba(47, 91, 255, 0.08)",
};

const toneBg = { blue: c.blue, navy: c.navy, violet: c.violet, gold: c.gold, steel: c.steel } as const;
const toneFg = { blue: c.white, navy: c.white, violet: c.white, gold: c.ink, steel: c.ink } as const;

export const ogSize = { width: 1200, height: 630 };

interface OgInput {
  eyebrow: string;
  title: string;
  subtitle: string;
  glyph: string;
  tone: keyof typeof toneBg;
  footer: string;
}

export function renderOg({ eyebrow, title, subtitle, glyph, tone, footer }: OgInput) {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          backgroundColor: c.bg,
          backgroundImage: `linear-gradient(${c.grid} 1px, transparent 1px), linear-gradient(90deg, ${c.grid} 1px, transparent 1px)`,
          backgroundSize: "72px 72px",
          padding: 56,
          gap: 40,
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", flex: 1 }}>
          <div style={{ display: "flex", fontSize: 40, fontWeight: 900, color: c.ink, letterSpacing: -1 }}>
            argy<span style={{ color: c.blue }}>.</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            <div style={{ display: "flex", fontSize: 22, color: c.muted, letterSpacing: 2, textTransform: "uppercase" }}>
              {eyebrow}
            </div>
            <div style={{ display: "flex", fontSize: title.length > 22 ? 64 : 84, fontWeight: 800, color: c.ink, lineHeight: 1, letterSpacing: -3 }}>
              {title}
            </div>
            <div style={{ display: "flex", fontSize: 28, color: c.muted, lineHeight: 1.4, maxWidth: 640 }}>{subtitle}</div>
          </div>
          <div style={{ display: "flex", fontSize: 22, color: c.ink, fontWeight: 700 }}>{footer}</div>
        </div>
        <div
          style={{
            width: 360,
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "flex-end",
            borderRadius: 40,
            backgroundColor: toneBg[tone],
            color: toneFg[tone],
            padding: 28,
            overflow: "hidden",
            fontSize: glyph.length > 3 ? 120 : 170,
            fontWeight: 900,
            letterSpacing: -6,
          }}
        >
          {glyph}
        </div>
      </div>
    ),
    ogSize,
  );
}

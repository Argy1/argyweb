import { profile } from "@/content/profile";
import { checkRateLimit } from "@/lib/rateLimit";

export const maxDuration = 20;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const RESEND_URL = "https://api.resend.com/emails";
// Tanpa domain terverifikasi, Resend hanya mengizinkan pengirim ini dan hanya ke email pemilik akun.
const DEFAULT_FROM = "Portofolio Argy <onboarding@resend.dev>";

type Reply = { ok: true } | { ok: false; reason: "invalid" | "limit" | "unavailable" | "failed" };

function reply(body: Reply, status: number) {
  return Response.json(body, { status, headers: { "Cache-Control": "no-store" } });
}

const oneLine = (v: unknown, max: number) => (typeof v === "string" ? v.replace(/[\r\n]+/g, " ").trim().slice(0, max) : "");

/**
 * Formulir kontak → email ke Argy lewat Resend (REST, tanpa SDK). Butuh RESEND_API_KEY di server.
 * Tanpa key, jawabannya "unavailable" dan formulir di klien jatuh ke mailto.
 */
export async function POST(req: Request) {
  const key = process.env.RESEND_API_KEY?.trim();
  if (!key) return reply({ ok: false, reason: "unavailable" }, 501);

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return reply({ ok: false, reason: "invalid" }, 400);
  }

  // Honeypot: kolom tersembunyi yang tidak diisi manusia. Bot dibuat merasa berhasil.
  if (typeof body.website === "string" && body.website.trim()) return reply({ ok: true }, 200);

  const name = oneLine(body.name, 80);
  const email = oneLine(body.email, 120);
  const topic = oneLine(body.topic, 40) || "Lainnya";
  const message = typeof body.message === "string" ? body.message.trim().slice(0, 3000) : "";
  if (!name || !message || !EMAIL.test(email)) return reply({ ok: false, reason: "invalid" }, 400);

  const ip = (req.headers.get("x-forwarded-for") ?? "").split(",")[0].trim() || req.headers.get("x-real-ip") || "local";
  if (!(await checkRateLimit(`contact:${ip}`))) return reply({ ok: false, reason: "limit" }, 429);

  try {
    const res = await fetch(RESEND_URL, {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: process.env.CONTACT_FROM_EMAIL?.trim() || DEFAULT_FROM,
        to: [process.env.CONTACT_TO_EMAIL?.trim() || profile.email],
        reply_to: email,
        subject: `[${topic}] Pesan dari ${name}`,
        text: `${message}\n\n—\nDari: ${name} (${email})\nDikirim lewat formulir kontak portofolio.`,
      }),
      signal: AbortSignal.timeout(12_000),
    });
    if (!res.ok) {
      console.error("[contact]", res.status, await res.text().catch(() => ""));
      return reply({ ok: false, reason: "failed" }, 502);
    }
    return reply({ ok: true }, 200);
  } catch (error) {
    console.error("[contact]", error);
    return reply({ ok: false, reason: "failed" }, 502);
  }
}

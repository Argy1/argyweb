import { google } from "@ai-sdk/google";
import { streamText, type LanguageModel, type ModelMessage } from "ai";
import { profile } from "@/content/profile";
import type { Locale } from "@/content/projects";
import { buildSystemPrompt, keywordAnswer } from "@/lib/chat-knowledge";
import { checkRateLimit } from "@/lib/rateLimit";
import idMessages from "../../../../messages/id.json";
import enMessages from "../../../../messages/en.json";

export const maxDuration = 30;

const MAX_MESSAGES = 12;
const MAX_USER_CHARS = 600;
const errors = { id: idMessages.chat, en: enMessages.chat };

interface IncomingMessage {
  role: "user" | "assistant";
  content: string;
}

// Flash-Lite: tier Gemini termurah yang stabil; cukup untuk tanya-jawab dari konteks portofolio.
const DEFAULT_MODEL = "gemini-2.5-flash-lite";

/** Gemini lewat Google AI SDK. Tanpa GOOGLE_GENERATIVE_AI_API_KEY → null (mode demo kata kunci). */
function pickModel(): LanguageModel | null {
  if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY?.trim()) return null;
  return google(process.env.AI_MODEL?.trim() || DEFAULT_MODEL);
}

function textResponse(stream: ReadableStream<Uint8Array>, mode: "llm" | "demo", status = 200) {
  return new Response(stream, {
    status,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Chat-Mode": mode,
    },
  });
}

/** Mode demo: jawaban kata kunci dialirkan per kata supaya UI streaming tetap teruji. */
function streamStatic(text: string): ReadableStream<Uint8Array> {
  const encoder = new TextEncoder();
  const parts = text.split(/(\s+)/);
  let i = 0;
  return new ReadableStream({
    async pull(controller) {
      if (i >= parts.length) {
        controller.close();
        return;
      }
      controller.enqueue(encoder.encode(parts.slice(i, i + 3).join("")));
      i += 3;
      await new Promise((r) => setTimeout(r, 18));
    },
  });
}

function sanitize(raw: unknown): IncomingMessage[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .filter(
      (m): m is IncomingMessage =>
        !!m &&
        typeof m === "object" &&
        (m.role === "user" || m.role === "assistant") &&
        typeof m.content === "string" &&
        m.content.trim().length > 0,
    )
    .slice(-MAX_MESSAGES)
    .map((m) => ({
      role: m.role,
      content: m.role === "user" ? m.content.slice(0, MAX_USER_CHARS) : m.content.slice(0, 2000),
    }));
}

export async function POST(req: Request) {
  let body: { messages?: unknown; locale?: unknown };
  try {
    body = await req.json();
  } catch {
    return new Response("Bad request", { status: 400 });
  }
  const locale: Locale = body.locale === "en" ? "en" : "id";
  const messages = sanitize(body.messages);
  const last = messages.at(-1);
  if (!last || last.role !== "user") return new Response("Bad request", { status: 400 });

  const ip = (req.headers.get("x-forwarded-for") ?? "").split(",")[0].trim() || req.headers.get("x-real-ip") || "local";
  const model = pickModel();
  const mode = model ? "llm" : "demo";
  if (!(await checkRateLimit(ip))) {
    return textResponse(
      streamStatic(errors[locale].errorLimit.replace("{email}", profile.email)),
      mode,
      429,
    );
  }

  if (!model) return textResponse(streamStatic(keywordAnswer(last.content, locale)), "demo");

  let failed = false;
  const result = streamText({
    model,
    instructions: buildSystemPrompt(locale),
    messages: messages as ModelMessage[],
    maxOutputTokens: 400,
    temperature: 0.3,
    onError: ({ error }) => {
      failed = true;
      console.error("[chat]", error);
    },
  });

  const encoder = new TextEncoder();
  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      let wrote = false;
      try {
        for await (const delta of result.textStream) {
          if (!delta) continue;
          wrote = true;
          controller.enqueue(encoder.encode(delta));
        }
      } catch (error) {
        failed = true;
        console.error("[chat]", error);
      }
      if (!wrote || failed) {
        const fallback = errors[locale].errorGeneric.replace("{email}", profile.email);
        controller.enqueue(encoder.encode(wrote ? `\n\n${fallback}` : fallback));
      }
      controller.close();
    },
  });
  return textResponse(stream, "llm");
}

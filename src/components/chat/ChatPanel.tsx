"use client";

import { useLocale, useTranslations } from "next-intl";
import { Fragment, useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { profile } from "@/content/profile";
import { useFocusTrap } from "@/lib/useFocusTrap";
import { useUI } from "@/lib/uiStore";
import { ArrowRightIcon, CloseIcon } from "@/components/ui/icons";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

const STORAGE_KEY = "argy-chat";
const MAX_INPUT = 600;

function loadHistory(): ChatMessage[] {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    const parsed = raw ? (JSON.parse(raw) as ChatMessage[]) : [];
    return Array.isArray(parsed) ? parsed.filter((m) => m && typeof m.content === "string") : [];
  } catch {
    return [];
  }
}

/** Tautan & **tebal** sederhana di jawaban bot; sisanya teks biasa. */
function renderRich(text: string): ReactNode[] {
  const pattern = /(\*\*[^*]+\*\*|https?:\/\/[^\s)]+|\/(?:id|en)\/[\w\-/]+)/g;
  const out: ReactNode[] = [];
  let last = 0;
  let i = 0;
  for (const match of text.matchAll(pattern)) {
    const idx = match.index ?? 0;
    if (idx > last) out.push(<Fragment key={i++}>{text.slice(last, idx)}</Fragment>);
    const token = match[0];
    if (token.startsWith("**")) {
      out.push(<strong key={i++}>{token.slice(2, -2)}</strong>);
    } else {
      const href = token.replace(/[.,;:!?]+$/, "");
      const trailing = token.slice(href.length);
      const internal = href.startsWith("/") || href.includes(window.location.host);
      out.push(
        <a
          key={i++}
          href={href}
          className="font-semibold text-accent underline underline-offset-2"
          {...(internal ? {} : { target: "_blank", rel: "noopener noreferrer" })}
        >
          {href.replace(/^https?:\/\//, "")}
        </a>,
      );
      if (trailing) out.push(<Fragment key={i++}>{trailing}</Fragment>);
    }
    last = idx + token.length;
  }
  if (last < text.length) out.push(<Fragment key={i++}>{text.slice(last)}</Fragment>);
  return out;
}

export default function ChatPanel({ open }: { open: boolean }) {
  const t = useTranslations("chat");
  const locale = useLocale();
  const closeChat = useUI((s) => s.closeChat);
  const takePendingQuestion = useUI((s) => s.takePendingQuestion);
  const pendingQuestion = useUI((s) => s.pendingQuestion);
  const [messages, setMessages] = useState<ChatMessage[]>(loadHistory);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [streaming, setStreaming] = useState(false);
  const [mode, setMode] = useState<"llm" | "demo" | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  const onEscape = useCallback(() => closeChat(), [closeChat]);
  useFocusTrap(panelRef, open, onEscape, inputRef);

  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(messages.slice(-30)));
    } catch {
      /* penuh / private mode */
    }
  }, [messages]);

  useEffect(() => {
    const el = listRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, busy, open]);

  useEffect(() => () => abortRef.current?.abort(), []);

  const send = useCallback(
    async (raw: string) => {
      const question = raw.trim().slice(0, MAX_INPUT);
      if (!question || busy) return;
      setInput("");
      const history: ChatMessage[] = [...messages, { role: "user", content: question }];
      setMessages(history);
      setBusy(true);
      const controller = new AbortController();
      abortRef.current = controller;
      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: history.slice(-12), locale }),
          signal: controller.signal,
        });
        const headerMode = res.headers.get("x-chat-mode");
        if (headerMode === "llm" || headerMode === "demo") setMode(headerMode);
        if (!res.ok || !res.body) {
          const key = res.status === 429 ? "errorLimit" : "errorGeneric";
          setMessages((m) => [...m, { role: "assistant", content: t(key, { email: profile.email }) }]);
          return;
        }
        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let text = "";
        setMessages((m) => [...m, { role: "assistant", content: "" }]);
        setStreaming(true);
        for (;;) {
          const { done, value } = await reader.read();
          if (done) break;
          text += decoder.decode(value, { stream: true });
          const snapshot = text;
          setMessages((m) => {
            const next = m.slice();
            next[next.length - 1] = { role: "assistant", content: snapshot };
            return next;
          });
        }
        if (!text.trim()) {
          setMessages((m) => {
            const next = m.slice();
            next[next.length - 1] = { role: "assistant", content: t("errorGeneric", { email: profile.email }) };
            return next;
          });
        }
      } catch (error) {
        if ((error as Error).name !== "AbortError") {
          setMessages((m) => [...m, { role: "assistant", content: t("errorGeneric", { email: profile.email }) }]);
        }
      } finally {
        setBusy(false);
        setStreaming(false);
        abortRef.current = null;
      }
    },
    [busy, messages, locale, t],
  );

  // Pertanyaan otomatis dari tombol "Tanya AI soal proyek ini".
  useEffect(() => {
    if (!open || busy || !pendingQuestion) return;
    const timer = window.setTimeout(() => {
      const q = takePendingQuestion();
      if (q) void send(q);
    }, 0);
    return () => window.clearTimeout(timer);
  }, [open, busy, pendingQuestion, takePendingQuestion, send]);

  if (!open) return null;

  const suggestions = t.raw("sugs") as string[];

  return (
    <div
      ref={panelRef}
      role="dialog"
      aria-modal="false"
      aria-labelledby="chat-title"
      className="animate-pop-in fixed right-4 bottom-[calc(env(safe-area-inset-bottom,0px)+92px)] z-60 flex h-[min(560px,calc(100svh-140px))] w-[calc(100vw-32px)] origin-bottom-right flex-col overflow-hidden rounded-lg border border-line bg-surface shadow-[0_30px_70px_-30px_var(--shadow)] sm:right-[calc(env(safe-area-inset-right,0px)+22px)] sm:bottom-[calc(env(safe-area-inset-bottom,0px)+98px)] sm:w-[392px]"
    >
      <div className="flex items-center gap-3 bg-blue py-3.5 pr-3 pl-4 text-on-dark">
        <span
          aria-hidden="true"
          className="grid size-10 flex-none place-items-center rounded-sm bg-gold font-display text-sm font-black text-tile-ink"
        >
          AI
        </span>
        <div className="min-w-0">
          <p id="chat-title" className="m-0 font-display text-[17px] font-extrabold">
            {t("title")}
          </p>
          <p className="m-0 mt-0.5 text-[12.5px] opacity-90">{t("sub")}</p>
        </div>
        <button
          type="button"
          onClick={closeChat}
          aria-label={t("close")}
          className="ml-auto grid size-11 flex-none place-items-center rounded-full bg-veil-18"
        >
          <CloseIcon />
        </button>
      </div>

      <div ref={listRef} className="flex flex-1 flex-col gap-2.5 overflow-y-auto p-4" aria-live="polite">
        <div className="max-w-[86%] self-start rounded-[20px] rounded-bl-md bg-surface-2 px-3.5 py-[11px] text-[14.5px] leading-[1.55] whitespace-pre-line">
          {t("greeting")}
        </div>
        {messages.map((m, i) =>
          m.role === "user" ? (
            <div
              key={i}
              className="max-w-[86%] self-end rounded-[20px] rounded-br-md bg-blue px-3.5 py-[11px] text-[14.5px] leading-[1.55] whitespace-pre-line text-on-dark"
            >
              {m.content}
            </div>
          ) : m.content ? (
            <div
              key={i}
              className="max-w-[86%] self-start rounded-[20px] rounded-bl-md bg-surface-2 px-3.5 py-[11px] text-[14.5px] leading-[1.55] break-words whitespace-pre-line"
            >
              {renderRich(m.content)}
            </div>
          ) : null,
        )}
        {busy && !streaming && (
          <div className="self-start rounded-[20px] rounded-bl-md bg-surface-2 px-3.5 py-[11px]" role="status">
            <span className="sr-only">{t("typing")}</span>
            <span className="flex h-[18px] items-center gap-[5px]" aria-hidden="true">
              <span className="typing-dot" />
              <span className="typing-dot" />
              <span className="typing-dot" />
            </span>
          </div>
        )}
      </div>

      {!busy && (
        <div className="flex flex-wrap gap-1.5 px-4 pb-3">
          {suggestions.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => send(s)}
              className="min-h-9 rounded-chip border-[1.5px] border-line bg-surface px-3 py-1.5 text-left text-[13px] font-semibold hover:border-blue"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      <form
        className="flex gap-2 border-t border-line p-3"
        onSubmit={(e) => {
          e.preventDefault();
          void send(input);
        }}
      >
        <label htmlFor="chat-input" className="sr-only">
          {t("placeholder")}
        </label>
        <input
          ref={inputRef}
          id="chat-input"
          type="text"
          autoComplete="off"
          maxLength={MAX_INPUT}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t("placeholder")}
          className="h-12 min-w-0 flex-1 rounded-chip border-[1.5px] border-line bg-bg px-4 text-[14.5px] text-ink placeholder:text-muted"
        />
        <button
          type="submit"
          disabled={busy}
          aria-label={t("send")}
          className="grid size-12 flex-none place-items-center rounded-full bg-gold text-tile-ink disabled:opacity-60"
        >
          <ArrowRightIcon />
        </button>
      </form>
      <p className="m-0 px-4 pb-3 text-[11.5px] text-muted">{mode === "demo" ? t("demo") : t("note")}</p>
    </div>
  );
}

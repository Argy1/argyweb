"use client";

import { useTranslations } from "next-intl";
import { useState, type FormEvent } from "react";
import { profile } from "@/content/profile";
import { ArrowRightIcon } from "@/components/ui/icons";

type Field = "name" | "email" | "message";
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const inputCls =
  "w-full rounded-[16px] border-[1.5px] border-line bg-bg px-4 text-[15.5px] text-ink placeholder:text-muted aria-invalid:border-danger focus-visible:border-blue";

type Status = "idle" | "sending" | "sent" | "limit" | "failed" | "fallback";

/**
 * Kirim lewat /api/contact (Resend). Bila server belum punya RESEND_API_KEY atau jaringan gagal,
 * jatuh ke mailto supaya pesan tetap bisa dikirim lewat aplikasi email pengunjung.
 */
export function ContactForm() {
  const t = useTranslations("contactPage");
  const topics = t.raw("topics") as string[];
  const [values, setValues] = useState({ name: "", email: "", topic: topics[0], message: "" });
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});
  const [status, setStatus] = useState<Status>("idle");
  const [trap, setTrap] = useState("");

  function validate() {
    const next: Partial<Record<Field, string>> = {};
    if (!values.name.trim()) next.name = t("errorRequired");
    if (!values.email.trim()) next.email = t("errorRequired");
    else if (!EMAIL.test(values.email.trim())) next.email = t("errorEmail");
    if (!values.message.trim()) next.message = t("errorRequired");
    setErrors(next);
    return next;
  }

  function openMailApp() {
    const name = values.name.trim();
    const email = values.email.trim();
    const subject = t("subject", { topic: values.topic, name });
    const body = `${values.message.trim()}

—
${t("bodyFrom", { name, email })}`;
    window.location.href = `mailto:${profile.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "sending") return;
    const found = validate();
    const first = (Object.keys(found) as Field[])[0];
    if (first) {
      document.getElementById(`cf-${first}`)?.focus();
      return;
    }
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: values.name,
          email: values.email,
          topic: values.topic,
          message: values.message,
          website: trap,
        }),
      });
      if (res.ok) {
        setStatus("sent");
        setValues({ name: "", email: "", topic: topics[0], message: "" });
      } else if (res.status === 429) {
        setStatus("limit");
      } else if (res.status === 501) {
        setStatus("fallback");
        openMailApp();
      } else {
        setStatus("failed");
      }
    } catch {
      setStatus("fallback");
      openMailApp();
    }
  }

  function field(key: Field) {
    return {
      id: `cf-${key}`,
      value: values[key],
      "aria-invalid": errors[key] ? true : undefined,
      "aria-describedby": errors[key] ? `cf-${key}-err` : undefined,
      onChange: (e: { target: { value: string } }) => {
        setValues((v) => ({ ...v, [key]: e.target.value }));
        if (errors[key]) setErrors((er) => ({ ...er, [key]: undefined }));
      },
    };
  }

  const error = (key: Field) =>
    errors[key] ? (
      <p id={`cf-${key}-err`} className="m-0 mt-1.5 text-sm font-semibold text-danger">
        {errors[key]}
      </p>
    ) : null;

  return (
    <form noValidate onSubmit={onSubmit} className="flex flex-col gap-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="cf-name" className="mb-2 block text-sm font-bold">
            {t("name")}
          </label>
          <input {...field("name")} type="text" autoComplete="name" placeholder={t("namePlaceholder")} className={`${inputCls} h-[52px]`} />
          {error("name")}
        </div>
        <div>
          <label htmlFor="cf-email" className="mb-2 block text-sm font-bold">
            {t("email")}
          </label>
          <input
            {...field("email")}
            type="email"
            autoComplete="email"
            inputMode="email"
            placeholder={t("emailPlaceholder")}
            className={`${inputCls} h-[52px]`}
          />
          {error("email")}
        </div>
      </div>

      <fieldset className="m-0 border-0 p-0">
        <legend className="mb-2 block p-0 text-sm font-bold">{t("topic")}</legend>
        <div className="flex flex-wrap gap-2">
          {topics.map((topic) => (
            <label key={topic} className="cursor-pointer">
              <input
                type="radio"
                name="topic"
                value={topic}
                checked={values.topic === topic}
                onChange={() => setValues((v) => ({ ...v, topic }))}
                className="peer sr-only"
              />
              <span className="filter-chip peer-checked:border-blue peer-checked:bg-blue peer-checked:text-on-dark peer-focus-visible:outline-3 peer-focus-visible:outline-offset-3 peer-focus-visible:outline-glow">
                {topic}
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <div>
        <label htmlFor="cf-message" className="mb-2 block text-sm font-bold">
          {t("message")}
        </label>
        <textarea
          {...field("message")}
          rows={6}
          maxLength={3000}
          placeholder={t("messagePlaceholder")}
          className={`${inputCls} min-h-[160px] resize-y py-3.5 leading-[1.6]`}
        />
        {error("message")}
      </div>

      {/* Honeypot anti-bot: tersembunyi dari pengunjung dan pembaca layar. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <input type="text" name="website" tabIndex={-1} autoComplete="off" value={trap} onChange={(e) => setTrap(e.target.value)} />
      </div>

      <div className="flex flex-col gap-4">
        <button type="submit" disabled={status === "sending"} className="btn btn-blue w-full sm:w-auto disabled:opacity-70">
          {status === "sending" ? t("sending") : t("send")}
          <ArrowRightIcon />
        </button>
        <p
          role={status === "failed" || status === "limit" ? "alert" : "status"}
          className={`m-0 text-[15px] leading-[1.6] font-semibold ${status === "sent" ? "text-ink" : "text-danger"}`}
        >
          {status === "sent" && t("sent")}
          {status === "limit" && t("errorLimit")}
          {status === "failed" && t("errorSend", { email: profile.email })}
          {status === "fallback" && t("fallbackNote")}
        </p>
      </div>
    </form>
  );
}

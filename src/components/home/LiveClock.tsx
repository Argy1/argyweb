"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { profile } from "@/content/profile";

function now() {
  try {
    return new Date().toLocaleTimeString("id-ID", { timeZone: profile.timeZone, hour: "2-digit", minute: "2-digit" });
  } catch {
    return "--.--";
  }
}

/** Jam WIB di stiker hero. Diisi setelah hydration supaya HTML server dan klien sama. */
export function LiveClock() {
  const t = useTranslations("hero");
  const [time, setTime] = useState("--.--");
  useEffect(() => {
    const first = window.setTimeout(() => setTime(now()), 0);
    const id = window.setInterval(() => setTime(now()), 20_000);
    return () => {
      window.clearTimeout(first);
      window.clearInterval(id);
    };
  }, []);
  return <span suppressHydrationWarning>{t("clock", { time })}</span>;
}

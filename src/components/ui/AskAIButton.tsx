"use client";

import type { ReactNode } from "react";
import { useUI } from "@/lib/uiStore";

interface AskAIButtonProps {
  className?: string;
  /** Pertanyaan yang langsung dikirim saat panel terbuka. */
  question?: string;
  children: ReactNode;
}

export function AskAIButton({ className, question, children }: AskAIButtonProps) {
  const openChat = useUI((s) => s.openChat);
  return (
    <button
      type="button"
      className={className}
      onClick={(e) => openChat({ question, returnFocus: e.currentTarget })}
    >
      {children}
    </button>
  );
}

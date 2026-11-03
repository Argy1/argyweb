"use client";

import { useTranslations } from "next-intl";
import dynamic from "next/dynamic";
import { useState } from "react";
import { useUI } from "@/lib/uiStore";
import { ChatIcon, CloseIcon } from "@/components/ui/icons";

// Panel chat dimuat saat pertama dibuka supaya tidak membebani loading awal.
const ChatPanel = dynamic(() => import("./ChatPanel"), { ssr: false });

export function ChatWidget() {
  const t = useTranslations("chat");
  const chatOpen = useUI((s) => s.chatOpen);
  const openChat = useUI((s) => s.openChat);
  const closeChat = useUI((s) => s.closeChat);
  const [everOpened, setEverOpened] = useState(false);
  if (chatOpen && !everOpened) setEverOpened(true);

  return (
    <>
      {everOpened && <ChatPanel open={chatOpen} />}
      <button
        type="button"
        onClick={(e) => (chatOpen ? closeChat() : openChat({ returnFocus: e.currentTarget }))}
        aria-expanded={chatOpen}
        aria-label={chatOpen ? t("close") : t("open")}
        className="site-chat fixed right-[calc(env(safe-area-inset-right,0px)+16px)] bottom-[calc(env(safe-area-inset-bottom,0px)+16px)] z-60 grid size-[62px] place-items-center rounded-full bg-blue text-on-dark shadow-[0_16px_30px_-10px_var(--blue-shadow)] transition-transform duration-250 hover:scale-[1.08] hover:-rotate-8 sm:right-[calc(env(safe-area-inset-right,0px)+22px)] sm:bottom-[calc(env(safe-area-inset-bottom,0px)+22px)]"
      >
        {chatOpen ? <CloseIcon size={22} /> : <ChatIcon />}
      </button>
    </>
  );
}

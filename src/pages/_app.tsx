import Cursor from "@/components/cursor";
import MainLayout from "@/components/layouts/main-layout";
import useBreakpoint from "@/hooks/breakpoint";
import "@/styles/globals.css";
import type { LenisRef } from "lenis/react";
import { ReactLenis } from "lenis/react";
import { motion, AnimatePresence, cancelFrame, frame } from "motion/react";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import { useEffect, useRef } from "react";
import { ThemeProvider } from "@/context/ThemeContext";           // ← NEW


export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const lenisRef = useRef<LenisRef>(null);
  const isMdUp = useBreakpoint(768);

  useEffect(() => {
    const update = (data: { timestamp: number }) => {
      lenisRef?.current?.lenis?.raf(data.timestamp);
    };
    frame.update(update, true);
    return () => cancelFrame(update);
  }, []);

  return (
    <ThemeProvider>                                             {/* NEW */}
      <ReactLenis root options={{ autoRaf: false }} ref={lenisRef} />
      {isMdUp && <Cursor />}
      <MainLayout>
        <AnimatePresence mode="wait" initial={false}>
          <div key={router.pathname}>
            <Component {...pageProps} />
            {/* ---- transisi bawaan ---- */}
            {["blue-500", "blue-200"].map((clr, i) => (
              <motion.div
                key={i}
                className={`fixed top-0 left-0 bg-${clr} w-full text-white origin-top z-[99] rounded-3xl`}
                initial={{ height: i % 2 ? 0 : "100vh" }}
                animate={{ height: 0 }}
                exit={{ height: i % 2 ? "100vh" : 0 }}
                transition={{ type: "spring", damping: 20, delay: i ? 0.1 : 0 }}
              />
            ))}
          </div>
        </AnimatePresence>
      </MainLayout>
    </ThemeProvider>
  );
}

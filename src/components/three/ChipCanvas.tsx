"use client";

import { Canvas, useThree } from "@react-three/fiber";
import { useLayoutEffect, useRef, useState } from "react";
import * as THREE from "three";
import { readChipTarget } from "./anchorTracker";
import { Chip } from "./Chip";
import { chipPalette } from "./chipPalette";
import { useChipStore } from "./chipStore";
import { createLightPanelEnvironment } from "./geometry";

/**
 * Canvas memakai frameloop "demand": loop kecil di bawah ini hanya meminta frame baru selama chip
 * terlihat (atau sedang fade). Kalau anchor tersembunyi, render GPU berhenti total.
 */
function RenderPump({ visibleRef }: { visibleRef: React.RefObject<boolean> }) {
  const invalidate = useThree((s) => s.invalidate);
  useLayoutEffect(() => {
    let raf = 0;
    const tick = () => {
      raf = requestAnimationFrame(tick);
      if (document.hidden) return;
      const { introActive, introGone } = useChipStore.getState();
      if (visibleRef.current || (introActive && !introGone) || readChipTarget().visible) invalidate();
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [invalidate, visibleRef]);
  return null;
}

const idle = (fn: () => void) =>
  typeof window.requestIdleCallback === "function"
    ? window.requestIdleCallback(fn, { timeout: 500 })
    : window.setTimeout(fn, 16);

/**
 * Persiapan sebelum frame pertama, dipecah supaya tidak jadi satu long task:
 * 1. environment dari panel cahaya (docs/03 §2) dibuat saat idle,
 * 2. shader dikompilasi asinkron (KHR_parallel_shader_compile) lewat compileAsync,
 * 3. baru frameloop "demand" dinyalakan.
 */
function Warmup({ dark, mobile }: { dark: boolean; mobile: boolean }) {
  const gl = useThree((s) => s.gl);
  const scene = useThree((s) => s.scene);
  const camera = useThree((s) => s.camera);
  const setFrameloop = useThree((s) => s.setFrameloop);
  const invalidate = useThree((s) => s.invalidate);

  useLayoutEffect(() => {
    let cancelled = false;
    let target: THREE.WebGLRenderTarget | null = null;
    idle(() => {
      if (cancelled) return;
      target = createLightPanelEnvironment(
        gl,
        [
          { color: chipPalette.white, intensity: 2, position: [0, 5, 1], scale: [12, 1.6] },
          { color: chipPalette.lightKey, intensity: 1.2, position: [6, 3, 0.5], scale: [2.5, 3] },
          { color: chipPalette.lightFill, intensity: 0.8, position: [-5, 1, 2], scale: [4, 5] },
          // Langit lembut redup: dipantulkan kuat oleh tutup logam (envMapIntensity tinggi), samar di papan.
          { color: chipPalette.white, intensity: 0.16, position: [0, 2, 8], scale: [16, 10] },
          { color: chipPalette.white, intensity: 0.14, position: [0, 8, -2], scale: [16, 16] },
        ],
        mobile ? 64 : 128,
      );
      scene.environment = target.texture;
      idle(() => {
        if (cancelled) return;
        const start = () => {
          if (cancelled) return;
          setFrameloop("demand");
          invalidate();
        };
        // compileAsync hanya berguna dengan KHR_parallel_shader_compile; tanpa ekstensi itu three.js
        // memperingatkan di konsol lalu jatuh ke polling. Lewati saja (hasilnya sama, tanpa peringatan).
        if (!gl.getContext().getExtension("KHR_parallel_shader_compile")) {
          start();
          return;
        }
        gl.compileAsync(scene, camera)
          .catch(() => undefined)
          .then(start);
      });
    });
    return () => {
      cancelled = true;
      scene.environment = null;
      target?.dispose();
    };
  }, [gl, scene, camera, mobile, setFrameloop, invalidate]);

  useLayoutEffect(() => {
    scene.environmentIntensity = dark ? 0.45 : 1;
    invalidate();
  }, [dark, scene, invalidate]);
  return null;
}

export default function ChipCanvas({ dark }: { dark: boolean }) {
  const [layerEl, setLayerEl] = useState<HTMLDivElement | null>(null);
  const visibleRef = useRef(false);
  const introGone = useChipStore((s) => s.introGone);
  const introActive = useChipStore((s) => s.introActive);
  const [env] = useState(() => {
    const mobile = window.matchMedia("(max-width: 767px), (pointer: coarse)").matches;
    return {
      mobile,
      reduce: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
      dpr: mobile ? 1 : Math.min(window.devicePixelRatio || 1, 1.5),
    };
  });

  return (
    <div
      ref={setLayerEl}
      className="chip-canvas"
      data-layer={introActive && !introGone ? "intro" : "page"}
      aria-hidden="true"
    >
      <Canvas
        frameloop="never"
        dpr={env.dpr}
        camera={{ fov: 30, position: [0, 0, 10], near: 0.1, far: 50 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        onCreated={({ gl, scene }) => {
          // Cek error shader memanggil getProgramParameter secara sinkron (main thread menunggu GPU
          // menyelesaikan kompilasi). Cukup di dev.
          gl.debug.checkShaderErrors = process.env.NODE_ENV !== "production";
          gl.setClearColor(0x000000, 0);
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          scene.background = null;
        }}
        style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
        tabIndex={-1}
      >
        <Warmup dark={dark} mobile={env.mobile} />
        <directionalLight position={[-2, 4, 5]} intensity={dark ? 0.6 : 0.9} />
        <Chip
          layerEl={layerEl}
          isMobile={env.mobile}
          dark={dark}
          reduceMotion={env.reduce}
          onFrameVisible={(v) => {
            visibleRef.current = v;
          }}
        />
        <RenderPump visibleRef={visibleRef} />
      </Canvas>
    </div>
  );
}

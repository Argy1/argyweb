"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { readChipTarget } from "./anchorTracker";
import { chipDims, chipPalette } from "./chipPalette";
import { chipMotion, useChipStore } from "./chipStore";
import {
  createBoardMaterial,
  createCircuitUniforms,
  createDieMaterial,
  createEngravingTexture,
} from "./circuitMaterials";
import { useFxStore } from "@/lib/fxStore";
import { createRoundedBox, createShadowTexture } from "./geometry";

const BASE_TILT = 0.92;
const INTRO_TILT = 1.3;
const STAGE_MARKS = [0.26, 0.5, 0.74, 0.97];

/** Ease-out kubik untuk tahap perakitan, sama dengan pk() di shader prototipe. */
function stage(p: number, a: number, b: number) {
  const k = Math.min(1, Math.max(0, (p - a) / (b - a)));
  return 1 - Math.pow(1 - k, 3);
}

interface ChipProps {
  layerEl: HTMLDivElement | null;
  isMobile: boolean;
  dark: boolean;
  reduceMotion: boolean;
  onFrameVisible: (visible: boolean) => void;
}

export function Chip({ layerEl, isMobile, dark, reduceMotion, onFrameVisible }: ChipProps) {
  const { camera, size } = useThree();
  const root = useRef<THREE.Group>(null);
  const tiltGroup = useRef<THREE.Group>(null);
  const floatGroup = useRef<THREE.Group>(null);
  const yawGroup = useRef<THREE.Group>(null);
  const board = useRef<THREE.Mesh>(null);
  const pins = useRef<THREE.InstancedMesh>(null);
  const die = useRef<THREE.Mesh>(null);
  const lid = useRef<THREE.Group>(null);
  const engraving = useRef<THREE.MeshBasicMaterial>(null);

  const uniforms = useMemo(() => createCircuitUniforms(), []);
  const boardMaterial = useMemo(() => createBoardMaterial(uniforms, isMobile), [uniforms, isMobile]);
  const dieMaterial = useMemo(() => createDieMaterial(uniforms), [uniforms]);
  const pinGeometry = useMemo(() => new THREE.BoxGeometry(chipDims.pin.w, chipDims.pin.h, 1), []);
  const boardGeometry = useMemo(
    () => createRoundedBox(chipDims.board.w, chipDims.board.h, chipDims.board.w, chipDims.board.r, 3),
    [],
  );
  const dieGeometry = useMemo(
    () => createRoundedBox(chipDims.die.w, chipDims.die.h, chipDims.die.w, chipDims.die.r, 2),
    [],
  );
  const lidGeometry = useMemo(
    () => createRoundedBox(chipDims.lid.w, chipDims.lid.h, chipDims.lid.w, chipDims.lid.r, 4),
    [],
  );
  const shadowTexture = useMemo(() => createShadowTexture(), []);
  const pinMarker = useMemo(() => {
    const s = 0.08;
    const shape = new THREE.Shape();
    shape.moveTo(0, 0);
    shape.lineTo(s, 0);
    shape.lineTo(0, -s);
    shape.closePath();
    return new THREE.ShapeGeometry(shape);
  }, []);
  const engravingTexture = useMemo(() => createEngravingTexture(), []);

  // Catatan: efek di dalam <Canvas> memakai useLayoutEffect; passive effect di root R3F kadang baru
  // di-flush pada commit berikutnya (frameloop "demand"), sehingga listener/tekstur telat terpasang.

  // Ukiran "AF" digambar setelah font Gabarito siap supaya hurufnya benar (sebelumnya tekstur kosong).
  useLayoutEffect(() => {
    let cancelled = false;
    document.fonts.ready.then(() => {
      if (cancelled) return;
      // Canvas 2D menolak string font dengan family generik baru (ui-sans-serif), jadi ambil family pertama saja.
      const first = getComputedStyle(document.documentElement).getPropertyValue("--font-display").split(",")[0].trim();
      engravingTexture.draw(`${first || "Gabarito"}, sans-serif`);
    });
    return () => {
      cancelled = true;
    };
  }, [engravingTexture]);

  useLayoutEffect(
    () => () => {
      boardMaterial.dispose();
      dieMaterial.dispose();
      pinGeometry.dispose();
      pinMarker.dispose();
      engravingTexture.texture.dispose();
      boardGeometry.dispose();
      dieGeometry.dispose();
      lidGeometry.dispose();
      shadowTexture.dispose();
    },
    [boardMaterial, dieMaterial, pinGeometry, pinMarker, engravingTexture, boardGeometry, dieGeometry, lidGeometry, shadowTexture],
  );

  // Kursor (desktop saja).
  const mouse = useRef({ x: 0, y: 0, tx: 0, ty: 0 });
  useLayoutEffect(() => {
    if (isMobile || reduceMotion) return;
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      mouse.current.tx = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.ty = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [isMobile, reduceMotion]);

  const state = useRef({
    initialized: false,
    x: 0,
    y: 0,
    s: 0.001,
    opacity: 0,
    assembly: 0,
    tilt: INTRO_TILT,
    yaw: 0.65,
    time: 0,
    themeMix: 0,
    lastStage: -1,
    pinK: -1,
    reported: false,
  });
  const pinMatrix = useMemo(() => new THREE.Object3D(), []);
  const glowColor = useMemo(() => new THREE.Color(), []);

  useFrame((_, rawDelta) => {
    const dt = Math.min(rawDelta, 1 / 20);
    const st = state.current;
    const store = useChipStore.getState();
    const target = readChipTarget();
    const persp = camera as THREE.PerspectiveCamera;

    // Konversi px → unit dunia di bidang z = 0.
    const dist = persp.position.z;
    const visibleH = 2 * dist * Math.tan(THREE.MathUtils.degToRad(persp.fov / 2));
    const pxPerUnit = size.height / visibleH;

    const introRunning = store.introActive && !store.introDone;
    let tx = st.x;
    let ty = st.y;
    let ts = st.s;
    let to = 0;
    if (target.visible) {
      tx = (target.cx - size.width / 2) / pxPerUnit;
      ty = -(target.cy - size.height / 2) / pxPerUnit;
      ts = (Math.min(target.w, target.h) * 0.92) / pxPerUnit / chipDims.span;
      to = target.opacity;
    }

    if (!st.initialized && target.visible) {
      st.x = tx;
      st.y = ty;
      st.s = ts;
      st.initialized = true;
    }

    const ease = introRunning ? 0.12 : 0.055;
    const k = 1 - Math.pow(1 - ease, dt * 60);
    const dx = tx - st.x;
    const dy = ty - st.y;
    st.x += dx * k;
    st.y += dy * k;
    st.s += (ts - st.s) * k;

    // Saat berpindah antar anchor, opacity turun ke ~0.6 supaya tidak mengganggu teks yang dilewati.
    const travelPx = Math.hypot(dx, dy) * pxPerUnit;
    const travelCap = 1 - Math.min(0.4, travelPx / Math.max(1, size.height) * 1.4);
    const targetOpacity = target.visible ? Math.min(to, travelCap) : 0;
    st.opacity += (targetOpacity - st.opacity) * (1 - Math.pow(1 - 0.09, dt * 60));
    if (layerEl) layerEl.style.opacity = st.opacity.toFixed(3);
    const scr = chipMotion.screen;
    scr.x = size.width / 2 + st.x * pxPerUnit;
    scr.y = size.height / 2 - st.y * pxPerUnit;
    scr.r = st.s * chipDims.span * pxPerUnit * 0.5;
    scr.opacity = st.opacity;
    onFrameVisible(st.opacity > 0.004 || targetOpacity > 0);

    // Tema: environment & glow mengikuti data-theme di <html>.
    const dark = document.documentElement.dataset.theme === "dark" ? 1 : 0;
    st.themeMix += (dark - st.themeMix) * 0.1;
    uniforms.uGlowMul.value = 1 + 0.4 * st.themeMix;

    // Perakitan.
    const assemblyTarget = !store.introActive || reduceMotion ? 1 : store.introProgress;
    if (!store.introActive || reduceMotion) st.assembly = 1;
    else st.assembly += (assemblyTarget - st.assembly) * (1 - Math.pow(0.9, dt * 60));
    const p = st.assembly;
    const stageIdx = STAGE_MARKS.findLastIndex((m) => p >= m);
    if (store.introActive && stageIdx > st.lastStage) {
      if (!reduceMotion) {
        chipMotion.kick(0.22);
        chipMotion.flash(0.55);
      }
      st.lastStage = stageIdx;
    }

    const k1 = stage(p, 0, 0.26);
    const k3 = stage(p, 0.46, 0.72);
    const k4 = stage(p, 0.7, 0.97);
    if (board.current) {
      board.current.visible = k1 > 0.02;
      board.current.position.y = -2.4 * (1 - k1);
      board.current.scale.setScalar(Math.max(k1, 0.001));
    }
    if (pins.current) {
      const pinKey = Math.round(p * 1000);
      if (pinKey !== st.pinK) {
        st.pinK = pinKey;
        const { perSide, gap, len, y } = chipDims.pin;
        const half = chipDims.board.w / 2;
        let i = 0;
        for (let side = 0; side < 4; side++) {
          const kSide = stage(p, 0.22 + side * 0.02, 0.5);
          const L = Math.max(len * kSide, 0.0001);
          for (let n = 0; n < perSide; n++) {
            const along = (n - (perSide - 1) / 2) * gap;
            const out = half + L / 2;
            const [px, pz] =
              side === 0 ? [along, out] : side === 1 ? [along, -out] : side === 2 ? [out, along] : [-out, along];
            pinMatrix.position.set(px, y, pz);
            pinMatrix.rotation.set(0, side < 2 ? 0 : Math.PI / 2, 0);
            pinMatrix.scale.set(1, 1, L);
            pinMatrix.updateMatrix();
            pins.current.setMatrixAt(i++, pinMatrix.matrix);
          }
        }
        pins.current.instanceMatrix.needsUpdate = true;
        pins.current.visible = p > 0.22;
      }
    }
    if (die.current) {
      die.current.visible = k3 > 0.02 && k4 < 0.999;
      die.current.position.y = chipDims.die.y + 2.0 * (1 - k3);
      die.current.scale.set(Math.max(k3, 0.001), 1, Math.max(k3, 0.001));
    }
    if (lid.current) {
      lid.current.visible = k4 > 0.02;
      lid.current.position.y = chipDims.lid.y + 2.6 * (1 - k4);
      lid.current.rotation.y = (1 - k4) * 1.8;
    }

    // Gerak dasar: putaran idle, scroll spin, kursor, mengambang.
    // Mode Ringan: tanpa putaran scroll dan tilt kursor, rotasi idle diperlambat (seperti reduced-motion).
    const lite = useFxStore.getState().mode === "lite";
    const calm = reduceMotion || lite;
    st.time += dt * (reduceMotion ? 0.2 : 1);
    uniforms.uTime.value = st.time;
    const idle = calm ? 0.04 : 0.16;
    st.yaw += idle * dt + (calm ? 0 : chipMotion.velocity);
    chipMotion.velocity *= Math.pow(0.9, dt * 60);
    chipMotion.glow *= Math.pow(0.955, dt * 60);
    uniforms.uGlow.value = chipMotion.glow;

    const m = mouse.current;
    if (lite) {
      m.tx = 0;
      m.ty = 0;
    }
    m.x += (m.tx - m.x) * 0.05;
    m.y += (m.ty - m.y) * 0.05;

    const tiltTarget = introRunning ? INTRO_TILT : BASE_TILT;
    st.tilt += (tiltTarget - st.tilt) * (1 - Math.pow(1 - 0.045, dt * 60));

    if (root.current) {
      root.current.position.set(st.x, st.y, 0);
      root.current.scale.setScalar(Math.max(st.s, 0.0001));
    }
    if (tiltGroup.current) tiltGroup.current.rotation.x = st.tilt - m.y * 0.35;
    if (yawGroup.current) yawGroup.current.rotation.y = st.yaw + m.x * 0.8;
    if (floatGroup.current) floatGroup.current.position.y = reduceMotion ? 0 : 0.04 * Math.sin(st.time * 1.1);

    if (engraving.current) {
      // Normal: ukiran gelap dengan semburat biru (intensitas .25); saat flash menyala sampai ~2.5.
      const lit = Math.min(1, 0.3 + 0.7 * Math.min(1, chipMotion.glow) + 0.15 * st.themeMix);
      glowColor.set(chipPalette.glow).multiplyScalar(1 + chipMotion.glow);
      engraving.current.color.set(chipPalette.engraveDark).lerp(glowColor, lit);
    }

    if (!st.reported) {
      st.reported = true;
      store.setSceneReady();
    }
  });

  return (
    <group ref={root}>
      <group ref={tiltGroup}>
        <group ref={floatGroup}>
          <group ref={yawGroup}>
            <mesh ref={board} geometry={boardGeometry} material={boardMaterial} />
            <mesh
              geometry={pinMarker}
              position={[-chipDims.board.w / 2 + 0.1, chipDims.board.h / 2 + 0.001, chipDims.board.w / 2 - 0.1]}
              rotation={[-Math.PI / 2, 0, 0]}
            >
              <meshStandardMaterial color={chipPalette.pins} metalness={1} roughness={0.3} />
            </mesh>
            <instancedMesh ref={pins} args={[pinGeometry, undefined, chipDims.pin.perSide * 4]}>
              <meshStandardMaterial color={chipPalette.pins} metalness={1} roughness={0.25} />
            </instancedMesh>
            <mesh ref={die} geometry={dieGeometry} material={dieMaterial} />
            <group ref={lid}>
              <mesh geometry={lidGeometry}>
                {isMobile ? (
                  <meshStandardMaterial envMapIntensity={3.6} color={chipPalette.lid} metalness={1} roughness={0.3} />
                ) : (
                  <meshPhysicalMaterial
                    envMapIntensity={3.6}
                    color={chipPalette.lid}
                    metalness={1}
                    roughness={0.28}
                    anisotropy={0.6}
                    clearcoat={0.3}
                    clearcoatRoughness={0.3}
                  />
                )}
              </mesh>
              <mesh
                position={[0, chipDims.lid.h / 2 + 0.002, 0]}
                rotation={[-Math.PI / 2, 0, 0]}
              >
                <planeGeometry args={[chipDims.engraving.w, chipDims.engraving.h]} />
                <meshBasicMaterial
                  ref={engraving}
                  map={engravingTexture.texture}
                  transparent
                  depthWrite={false}
                  toneMapped={false}
                  polygonOffset
                  polygonOffsetFactor={-2}
                />
              </mesh>
            </group>
          </group>
        </group>
        {/* Bayangan lembut di "lantai" di bawah chip (ikut miring, tidak ikut berputar). */}
        <mesh position={[0, -0.32, 0]} rotation={[-Math.PI / 2, 0, 0]} renderOrder={-1}>
          <planeGeometry args={[3.4, 3.4]} />
          <meshBasicMaterial
            map={shadowTexture}
            color={chipPalette.board}
            transparent
            opacity={dark ? 0.4 : 0.25}
            depthWrite={false}
            toneMapped={false}
          />
        </mesh>
      </group>
    </group>
  );
}

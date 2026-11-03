import * as THREE from "three";
import { chipPalette } from "./chipPalette";

/** Uniform yang dibagi papan & die: waktu, kilau (flash intro), dan pengali glow per tema. */
export interface CircuitUniforms {
  uTime: { value: number };
  uGlow: { value: number };
  uGlowMul: { value: number };
}

export function createCircuitUniforms(): CircuitUniforms {
  return { uTime: { value: 0 }, uGlow: { value: 0 }, uGlowMul: { value: 1 } };
}

const LOCAL_VARYINGS = /* glsl */ `
varying vec3 vLocalPos;
varying vec3 vLocalNormal;
`;

const PULSE = /* glsl */ `
uniform float uTime;
uniform float uGlow;
uniform float uGlowMul;
float circuitPulse(vec3 lp) {
  float r = max(abs(lp.x), abs(lp.z));
  return pow(0.5 + 0.5 * sin(r * 22.0 - uTime * 3.5 + (lp.x - lp.z) * 2.0), 8.0);
}
`;

function injectLocalVaryings(shader: THREE.WebGLProgramParametersWithUniforms) {
  shader.vertexShader = shader.vertexShader
    .replace("#include <common>", `#include <common>\n${LOCAL_VARYINGS}`)
    .replace(
      "#include <begin_vertex>",
      "#include <begin_vertex>\nvLocalPos = position;\nvLocalNormal = normal;",
    );
}

/**
 * Papan: jalur tembaga dari tepi tutup ke setiap pin + bus persegi (fungsi traces() di shader prototipe),
 * dengan pulse cahaya yang bergerak keluar dari tengah.
 */
export function createBoardMaterial(uniforms: CircuitUniforms, lite = false) {
  // Mobile: MeshStandard (tanpa clearcoat) — shader jauh lebih kecil, kompilasi & per-piksel lebih murah.
  const material = lite
    ? new THREE.MeshStandardMaterial({ color: chipPalette.board, roughness: 0.3, metalness: 0.1 })
    : new THREE.MeshPhysicalMaterial({
        color: chipPalette.board,
        roughness: 0.35,
        metalness: 0.1,
        clearcoat: 0.8,
        clearcoatRoughness: 0.2,
      });
  const copper = new THREE.Color(chipPalette.copper);
  const glow = new THREE.Color(chipPalette.glow);

  material.onBeforeCompile = (shader) => {
    Object.assign(shader.uniforms, uniforms, {
      uCopper: { value: copper },
      uGlowColor: { value: glow },
    });
    injectLocalVaryings(shader);
    shader.fragmentShader = shader.fragmentShader
      .replace(
        "#include <common>",
        /* glsl */ `#include <common>
${LOCAL_VARYINGS}
${PULSE}
uniform vec3 uCopper;
uniform vec3 uGlowColor;
float traces(vec3 lp) {
  float ax = abs(lp.x), az = abs(lp.z);
  float m = max(ax, az);
  if (m < 0.71 || m > 0.97) return 0.0;
  float s = 0.18;
  float al = az > ax ? lp.x : lp.z;
  float qx = al - s * (clamp(floor(al / s), -4.0, 3.0) + 0.5);
  float aa = max(fwidth(qx), 0.0015);
  float line = (1.0 - smoothstep(0.009 - aa, 0.009 + aa, abs(qx))) * step(abs(al), 0.72);
  float am = max(fwidth(m), 0.0015);
  float bus = 1.0 - smoothstep(0.005 - am, 0.005 + am, abs(m - 0.82));
  return max(line, bus * 0.55);
}`,
      )
      .replace(
        "#include <color_fragment>",
        /* glsl */ `#include <color_fragment>
float trace = traces(vLocalPos) * step(0.8, vLocalNormal.y);
diffuseColor.rgb = mix(diffuseColor.rgb, uCopper, trace * 0.6);`,
      )
      .replace(
        "#include <emissivemap_fragment>",
        /* glsl */ `#include <emissivemap_fragment>
totalEmissiveRadiance += uGlowColor * trace * (0.18 + 0.9 * circuitPulse(vLocalPos) + 2.2 * uGlow) * uGlowMul;`,
      );
  };
  material.customProgramCacheKey = () => (lite ? "argy-board-lite" : "argy-board");
  return material;
}

/** Die ungu dengan grid yang menyala (hanya terlihat selama perakitan). */
export function createDieMaterial(uniforms: CircuitUniforms) {
  const material = new THREE.MeshStandardMaterial({ color: chipPalette.die, roughness: 0.4, metalness: 0.2 });
  const gridColor = new THREE.Color(chipPalette.dieGrid);
  material.onBeforeCompile = (shader) => {
    Object.assign(shader.uniforms, uniforms, { uGridColor: { value: gridColor } });
    injectLocalVaryings(shader);
    shader.fragmentShader = shader.fragmentShader
      .replace("#include <common>", `#include <common>\n${LOCAL_VARYINGS}\n${PULSE}\nuniform vec3 uGridColor;`)
      .replace(
        "#include <emissivemap_fragment>",
        /* glsl */ `#include <emissivemap_fragment>
vec2 g = abs(fract(vLocalPos.xz * 14.0) - 0.5);
float grid = 1.0 - smoothstep(0.0, 0.08, min(g.x, g.y));
totalEmissiveRadiance += uGridColor * grid * (0.35 + 0.8 * circuitPulse(vLocalPos) + 1.5 * uGlow) * uGlowMul;`,
      );
  };
  material.customProgramCacheKey = () => "argy-die";
  return material;
}

/** Tekstur ukiran "AF" (Gabarito 900) dari canvas 2D. Kosong sampai draw() dipanggil. */
export function createEngravingTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 280;
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  return {
    texture,
    draw(fontFamily: string) {
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = chipPalette.white;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.font = `900 250px ${fontFamily}`;
      ctx.fillText("AF", canvas.width / 2, canvas.height / 2 + 12);
      texture.needsUpdate = true;
    },
  };
}

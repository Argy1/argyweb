import * as THREE from "three";

/**
 * Kotak bersudut bulat (pengganti RoundedBox drei supaya bundle 3D tetap kecil).
 * Persegi panjang bulat di bidang XZ, diekstrusi ke atas dengan bevel; pusat di titik asal.
 */
export function createRoundedBox(width: number, height: number, depth: number, radius: number, segments = 4) {
  const r = Math.min(radius, height / 2 - 0.0005, width / 2, depth / 2);
  const w = width / 2 - r;
  const d = depth / 2 - r;
  const shape = new THREE.Shape();
  shape.moveTo(-w, -d - r);
  shape.lineTo(w, -d - r);
  shape.quadraticCurveTo(w + r, -d - r, w + r, -d);
  shape.lineTo(w + r, d);
  shape.quadraticCurveTo(w + r, d + r, w, d + r);
  shape.lineTo(-w, d + r);
  shape.quadraticCurveTo(-w - r, d + r, -w - r, d);
  shape.lineTo(-w - r, -d);
  shape.quadraticCurveTo(-w - r, -d - r, -w, -d - r);

  const bevel = r * 0.9;
  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth: Math.max(height - bevel * 2, 0.0001),
    bevelEnabled: true,
    bevelThickness: bevel,
    bevelSize: bevel * 0.6,
    bevelOffset: -bevel * 0.6,
    bevelSegments: segments,
    curveSegments: segments * 2,
  });
  // Ekstrusi berjalan di sumbu Z: putar supaya tinggi berada di sumbu Y, lalu pusatkan.
  geometry.rotateX(-Math.PI / 2);
  geometry.center();
  return geometry;
}

/** Tekstur bayangan lembut (radial) di bawah chip; pengganti ContactShadows yang jauh lebih murah. */
export function createShadowTexture() {
  const size = 128;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    g.addColorStop(0, "rgba(0,0,0,1)");
    g.addColorStop(0.45, "rgba(0,0,0,0.55)");
    g.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, size, size);
  }
  return new THREE.CanvasTexture(canvas);
}

interface LightPanel {
  color: string;
  intensity: number;
  position: [number, number, number];
  scale: [number, number];
}

/**
 * Environment dari panel cahaya (seperti Lightformer drei): scene kecil berisi bidang emissive,
 * diubah sekali menjadi PMREM untuk pantulan logam & clearcoat.
 */
export function createLightPanelEnvironment(renderer: THREE.WebGLRenderer, panels: LightPanel[], size = 128) {
  const scene = new THREE.Scene();
  const geometry = new THREE.PlaneGeometry(1, 1);
  const materials: THREE.Material[] = [];
  for (const p of panels) {
    const material = new THREE.MeshBasicMaterial({
      color: new THREE.Color(p.color).multiplyScalar(p.intensity),
      side: THREE.DoubleSide,
      toneMapped: false,
    });
    materials.push(material);
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(...p.position);
    mesh.scale.set(p.scale[0], p.scale[1], 1);
    mesh.lookAt(0, 0, 0);
    scene.add(mesh);
  }
  const pmrem = new THREE.PMREMGenerator(renderer);
  const target = pmrem.fromScene(scene, 0, 0.1, 50, { size });
  pmrem.dispose();
  geometry.dispose();
  materials.forEach((m) => m.dispose());
  return target;
}

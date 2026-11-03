import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    // React Three Fiber memutasi objek three.js di dalam useFrame (pola imperatif yang disarankan R3F),
    // yang ditandai keliru oleh aturan React Compiler ini.
    files: ["src/components/three/**"],
    rules: { "react-hooks/immutability": "off" },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "reference/**",
    "playwright-report/**",
    "test-results/**",
  ]),
]);

export default eslintConfig;

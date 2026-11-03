import { notFound } from "next/navigation";

// Semua path tak dikenal di bawah /id atau /en → not-found.tsx terlokalisasi.
export default function CatchAll() {
  notFound();
}

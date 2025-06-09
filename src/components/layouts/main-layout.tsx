// src/components/layouts/main-layout.tsx
import Navbar from "@/components/partials/navbar";
import Footer from "@/components/partials/footer";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      {/* pt-16 = 4rem = 64px, setara header height */}
      <main className="pt-16 min-h-screen bg-[var(--bg)] text-[var(--fg)]">
        {children}
      </main>
      <Footer />
    </>
  );
}

import Navbar from "@/components/partials/navbar";
import Footer from "@/components/partials/footer";
import type { ReactNode } from "react";

interface MainLayoutProps {
  children: ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <>
      <Navbar />
      <main className="pt-16 min-h-screen bg-[var(--bg)] text-[var(--fg)]">
        {children}
      </main>
      <Footer />
    </>
  );
}

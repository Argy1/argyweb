import Navbar from "@/components/partials/navbar"
import Footer from "@/components/partials/footer"

// src/components/layouts/main-layout.tsx
export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="min-h-screen
                       bg-white text-gray-900
                       dark:bg-gray-900 dark:text-gray-100">
        {children}
      </main>
      <Footer />
    </>
  )
}

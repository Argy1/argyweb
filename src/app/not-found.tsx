import Link from "next/link";

// Fallback untuk URL di luar prefix bahasa (jarang terjadi karena proxy selalu menambahkan /id atau /en).
export default function GlobalNotFound() {
  return (
    <html lang="id">
      <body className="bg-circuit grid min-h-svh place-items-center p-6 text-center">
        <main>
          <p className="eyebrow">404</p>
          <h1 className="h-section mx-auto">Halaman tidak ditemukan · Page not found</h1>
          <p className="mt-6">
            <Link href="/id" className="btn btn-blue">
              argy.
            </Link>
          </p>
        </main>
      </body>
    </html>
  );
}

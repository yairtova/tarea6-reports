// app/layout.tsx
import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="flex flex-col min-h-screen bg-gray-50 text-gray-900">
        <header className="bg-blue-600 text-white p-4 shadow-md">
          <nav className="max-w-6xl mx-auto flex justify-between items-center">
            <h1 className="font-bold text-xl">Report Dashboard</h1>
            <div className="space-x-4">
              <a href="/" className="hover:underline">Home</a>
              <a href="/reports/1" className="hover:underline">Ventas</a>
              <a href="/reports/2" className="hover:underline">Clientes</a>
            </div>
          </nav>
        </header>
        <main className="flex-grow max-w-6xl mx-auto w-full p-6">{children}</main>
        <footer className="p-4 text-center text-gray-500">Lab 6 - Next.js & Postgres</footer>
      </body>
    </html>
  );
}
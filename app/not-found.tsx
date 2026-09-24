import Link from "next/link";
import "./globals.css";

export default function NotFound() {
  return (
    <html lang="es">
      <body className="flex min-h-dvh items-center justify-center bg-crema p-6 text-center">
        <div>
          <p className="text-6xl text-caoba">404</p>
          <Link href="/" className="mt-6 inline-block text-caoba underline">
            Ir al inicio
          </Link>
        </div>
      </body>
    </html>
  );
}

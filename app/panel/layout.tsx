import type { ReactNode } from "react";
import { Rubik } from "next/font/google";
import "../globals.css";

const rubik = Rubik({ subsets: ["latin"], weight: ["300", "400", "500", "600"], variable: "--font-rubik", display: "swap" });

export const metadata = {
  title: { default: "CRM | ZAMÄ Bacalar", template: "%s | CRM ZAMÄ" },
  robots: { index: false, follow: false },
};

export default function PanelLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es" className={`${rubik.variable} antialiased`}>
      <body className="font-ui min-h-dvh bg-[#faf7f2] text-tinta">{children}</body>
    </html>
  );
}

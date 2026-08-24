import type { Metadata } from "next";
import { Space_Grotesk, Inter } from "next/font/google";
import "./globals.css";
import { AppStateProvider } from "@/lib/state/AppStateContext";
import { Navbar } from "@/components/layout/Navbar";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Semillero de Robótica — Explora tu perfil",
  description:
    "Explora, construye y muéstranos cómo piensas. Prueba de ingreso al Semillero de Robótica.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      className={`${spaceGrotesk.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-base text-ink">
        <AppStateProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
        </AppStateProvider>
      </body>
    </html>
  );
}

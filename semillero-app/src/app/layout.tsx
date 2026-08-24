import type { Metadata } from "next";
import { Space_Grotesk, Inter } from "next/font/google";
import { MotionConfig } from "framer-motion";
import "./globals.css";
import { AppStateProvider } from "@/lib/state/AppStateContext";
import { Navbar } from "@/components/layout/Navbar";
import { PageTransition } from "@/components/layout/PageTransition";

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
      <body className="min-h-full flex flex-col bg-night text-ink">
        <AppStateProvider>
          <MotionConfig reducedMotion="user">
            <a
              href="#main-content"
              className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-ink focus:px-4 focus:py-2.5 focus:text-sm focus:font-semibold focus:text-night focus:outline-2 focus:outline-offset-2 focus:outline-cyan"
            >
              Saltar al contenido
            </a>
            <Navbar />
            <main id="main-content" tabIndex={-1} className="flex-1 focus:outline-none">
              <PageTransition>{children}</PageTransition>
            </main>
          </MotionConfig>
        </AppStateProvider>
      </body>
    </html>
  );
}

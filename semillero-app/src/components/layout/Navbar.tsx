"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SaveIndicator } from "./SaveIndicator";

const STEPS = [
  { href: "/", label: "Inicio" },
  { href: "/semillero", label: "Semillero" },
  { href: "/registro", label: "Registro" },
  { href: "/presentacion", label: "Preséntate" },
  { href: "/disponibilidad", label: "Disponibilidad" },
  { href: "/skills", label: "Árbol" },
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-base/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-3.5">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-action to-cyan text-sm font-bold text-[#061827] font-heading">
            SR
          </span>
          <span className="font-heading text-sm font-semibold tracking-wide text-ink hidden sm:inline">
            Semillero de Robótica
          </span>
        </Link>

        <nav className="flex min-w-0 items-center gap-1 overflow-x-auto text-sm">
          {STEPS.map((step) => {
            const active = pathname === step.href;
            return (
              <Link
                key={step.href}
                href={step.href}
                className={`relative whitespace-nowrap rounded-md px-3 py-1.5 transition-colors ${
                  active
                    ? "text-ink"
                    : "text-muted hover:text-ink"
                }`}
              >
                {step.label}
                {active && (
                  <span className="absolute inset-x-2 -bottom-[13px] h-0.5 rounded-full bg-cyan" />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="shrink-0">
          <SaveIndicator />
        </div>
      </div>
    </header>
  );
}

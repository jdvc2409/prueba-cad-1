"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SaveIndicator } from "./SaveIndicator";

const STEPS = [
  { href: "/registro", label: "Registro" },
  { href: "/skills", label: "Árbol" },
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-night/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-3.5">
        <Link href="/" className="flex shrink-0 items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-action to-cyan font-heading text-sm font-bold text-[#061827]">
            SR
          </span>
          <span className="hidden font-heading text-sm font-semibold tracking-wide text-ink sm:inline">
            Semillero de Robótica
          </span>
        </Link>

        <nav className="flex min-w-0 items-center gap-1 text-sm">
          {STEPS.map((step, i) => {
            const active = pathname === step.href;
            return (
              <div key={step.href} className="flex items-center">
                {i > 0 && <span className="mx-1 h-px w-4 bg-line sm:mx-2 sm:w-8" />}
                <Link
                  href={step.href}
                  className={`relative whitespace-nowrap rounded-md px-2.5 py-1.5 transition-colors sm:px-3 ${
                    active ? "text-ink" : "text-muted hover:text-ink"
                  }`}
                >
                  <span
                    className={`mr-1.5 inline-flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-semibold ${
                      active ? "bg-cyan text-[#061827]" : "bg-surface-raised text-muted"
                    }`}
                  >
                    {i + 1}
                  </span>
                  {step.label}
                  {active && (
                    <span className="absolute inset-x-2 -bottom-[13px] h-0.5 rounded-full bg-cyan" />
                  )}
                </Link>
              </div>
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

"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useEvaluatorSession } from "@/lib/evaluator/session";

export default function EvaluatorDashboardPage() {
  const router = useRouter();
  const { hydrated, evaluator, logout } = useEvaluatorSession();

  useEffect(() => {
    if (hydrated && !evaluator) {
      router.replace("/evaluador/login");
    }
  }, [evaluator, hydrated, router]);

  if (!hydrated || !evaluator) {
    return (
      <div className="flex min-h-[calc(100svh-4rem)] items-center justify-center bg-night px-6" aria-live="polite">
        <div className="flex items-center gap-3 text-sm text-muted">
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-muted/25 border-t-cyan" aria-hidden="true" />
          Verificando sesión…
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto min-h-[calc(100svh-4rem)] max-w-5xl px-5 py-12 sm:px-6 sm:py-16">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan">Panel de evaluación</p>
          <h1 className="mt-2 font-heading text-3xl font-semibold tracking-[-0.025em] text-ink">
            Hola, {evaluator.username}
          </h1>
        </div>
        <button
          type="button"
          onClick={() => {
            logout();
            router.replace("/evaluador/login");
          }}
          className="inline-flex min-h-10 items-center justify-center rounded-lg border border-cyan/30 bg-cyan/10 px-4 text-xs font-semibold text-cyan transition-colors hover:border-cyan/50 hover:bg-cyan/15"
        >
          Cerrar sesión
        </button>
      </div>

      <div className="mt-10 rounded-2xl border border-line bg-surface/70 p-6">
        <p className="text-sm font-semibold text-ice">Todavía no hay candidatos para revisar aquí</p>
        <p className="mt-2 text-sm leading-6 text-muted">
          Por ahora este panel solo valida el acceso de evaluador. Las respuestas, diagramas y tiempos de cada
          candidato se guardan únicamente en el dispositivo de ese candidato — no existe todavía un servidor
          central que los reciba — así que esta vista se conectará a esos datos cuando ese respaldo compartido
          esté disponible.
        </p>
      </div>
    </div>
  );
}

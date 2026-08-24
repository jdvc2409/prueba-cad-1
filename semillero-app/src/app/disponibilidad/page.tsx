"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useAppState } from "@/lib/state/AppStateContext";

const HOURS = ["Menos de 2 h", "2–4 h", "4–6 h", "6–8 h", "Más de 8 h"];
const DAYS = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
const MODALITY = ["Presencial", "Remota", "Ambas"];
const TIME_OF_DAY = ["Mañana", "Mediodía", "Tarde", "Noche"];
const COMMITMENT = [
  "Quiero conocer",
  "Quiero aprender",
  "Quiero participar",
  "Quiero liderar proyectos",
];

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-lg border px-4 py-2 text-xs font-medium transition-colors ${
        active
          ? "border-tech bg-tech/15 text-ink"
          : "border-line bg-surface text-muted hover:border-tech/60"
      }`}
    >
      {children}
    </button>
  );
}

export default function DisponibilidadPage() {
  const { state, updateAvailability } = useAppState();
  const a = state.availability;

  function toggleDay(day: string) {
    const set = new Set(a.days);
    if (set.has(day)) set.delete(day);
    else set.add(day);
    updateAvailability({ days: Array.from(set) });
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <span className="text-xs font-medium uppercase tracking-widest text-cyan">
          Paso 3 · Disponibilidad
        </span>
        <h1 className="mt-3 font-heading text-3xl font-semibold text-ink">
          ¿Cuánto tiempo puedes dedicar?
        </h1>
        <p className="mt-3 text-sm text-muted">
          Esto se mide aparte de tu presentación: nos ayuda a entender cómo
          encajar contigo, no a evaluarte.
        </p>
      </motion.div>

      <div className="mt-8 space-y-8 rounded-2xl border border-line bg-surface/60 p-6 sm:p-8">
        <div>
          <p className="mb-3 text-xs font-medium text-muted">Horas por semana</p>
          <div className="flex flex-wrap gap-2">
            {HOURS.map((h) => (
              <Chip key={h} active={a.hoursPerWeek === h} onClick={() => updateAvailability({ hoursPerWeek: h })}>
                {h}
              </Chip>
            ))}
          </div>
        </div>

        <div>
          <p className="mb-3 text-xs font-medium text-muted">Días con disponibilidad</p>
          <div className="flex flex-wrap gap-2">
            {DAYS.map((d) => (
              <Chip key={d} active={a.days.includes(d)} onClick={() => toggleDay(d)}>
                {d}
              </Chip>
            ))}
          </div>
        </div>

        <div>
          <p className="mb-3 text-xs font-medium text-muted">Modalidad</p>
          <div className="flex flex-wrap gap-2">
            {MODALITY.map((m) => (
              <Chip key={m} active={a.modality === m} onClick={() => updateAvailability({ modality: m })}>
                {m}
              </Chip>
            ))}
          </div>
        </div>

        <div>
          <p className="mb-3 text-xs font-medium text-muted">Franja habitual</p>
          <div className="flex flex-wrap gap-2">
            {TIME_OF_DAY.map((t) => (
              <Chip key={t} active={a.timeOfDay === t} onClick={() => updateAvailability({ timeOfDay: t })}>
                {t}
              </Chip>
            ))}
          </div>
        </div>

        <div>
          <p className="mb-4 text-xs font-medium text-muted">Compromiso esperado</p>
          <div className="relative">
            <div className="absolute left-0 right-0 top-[9px] h-0.5 bg-line" />
            <div className="relative grid grid-cols-4 gap-2">
              {COMMITMENT.map((c) => {
                const active = a.commitment === c;
                return (
                  <button
                    key={c}
                    type="button"
                    onClick={() => updateAvailability({ commitment: c })}
                    className="flex flex-col items-center gap-2.5 text-center"
                  >
                    <span
                      className={`h-5 w-5 rounded-full border-2 transition-colors ${
                        active
                          ? "border-cyan bg-cyan"
                          : "border-line bg-surface"
                      }`}
                    />
                    <span
                      className={`text-[11px] leading-tight ${
                        active ? "text-ink" : "text-muted"
                      }`}
                    >
                      {c}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 flex justify-end">
        <Link
          href="/skills"
          className="rounded-lg bg-gradient-to-r from-action to-tech px-7 py-3 text-sm font-semibold text-ink shadow-lg shadow-action/20 transition-transform hover:scale-[1.03] active:scale-[0.98]"
        >
          Ver el árbol de habilidades
        </Link>
      </div>
    </div>
  );
}

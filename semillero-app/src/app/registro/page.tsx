"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useAppState } from "@/lib/state/AppStateContext";

function Field({
  label,
  optional,
  children,
}: {
  label: string;
  optional?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 flex items-center gap-2 text-xs font-medium text-muted">
        {label}
        {optional && (
          <span className="rounded-full bg-surface-raised px-2 py-0.5 text-[10px] text-muted">
            opcional
          </span>
        )}
      </span>
      {children}
    </label>
  );
}

const inputClass =
  "w-full rounded-lg border border-line bg-surface px-3.5 py-2.5 text-sm text-ink placeholder:text-muted/60 outline-none transition-colors focus:border-tech";

export default function RegistroPage() {
  const { state, updateProfile } = useAppState();
  const p = state.profile;

  const canContinue =
    p.fullName.trim() &&
    p.email.trim() &&
    p.program.trim() &&
    p.semester.trim() &&
    p.consentData &&
    p.consentFiles;

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <span className="text-xs font-medium uppercase tracking-widest text-cyan">
          Paso 1 · Registro
        </span>
        <h1 className="mt-3 font-heading text-3xl font-semibold text-ink">
          Cuéntanos quién eres, formalmente.
        </h1>
        <p className="mt-3 text-sm text-muted">
          Los campos con “opcional” no son obligatorios — puedes dejarlos en
          blanco.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="mt-8 rounded-2xl border border-line bg-surface/60 p-6 sm:p-8"
      >
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Field label="Nombre completo">
            <input
              className={inputClass}
              value={p.fullName}
              onChange={(e) => updateProfile({ fullName: e.target.value })}
              placeholder="Ada Lovelace"
            />
          </Field>
          <Field label="Correo electrónico">
            <input
              type="email"
              className={inputClass}
              value={p.email}
              onChange={(e) => updateProfile({ email: e.target.value })}
              placeholder="tucorreo@universidad.edu"
            />
          </Field>
          <Field label="Programa / carrera">
            <input
              className={inputClass}
              value={p.program}
              onChange={(e) => updateProfile({ program: e.target.value })}
              placeholder="Ingeniería Mecatrónica"
            />
          </Field>
          <Field label="Semestre">
            <input
              className={inputClass}
              value={p.semester}
              onChange={(e) => updateProfile({ semester: e.target.value })}
              placeholder="5"
            />
          </Field>
          <Field label="Código o identificador institucional" optional>
            <input
              className={inputClass}
              value={p.studentCode}
              onChange={(e) => updateProfile({ studentCode: e.target.value })}
              placeholder="20231234"
            />
          </Field>
        </div>

        <div className="my-7 h-px bg-line" />

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Field label="GitHub" optional>
            <input
              className={inputClass}
              value={p.github}
              onChange={(e) => updateProfile({ github: e.target.value })}
              placeholder="github.com/usuario"
            />
          </Field>
          <Field label="LinkedIn" optional>
            <input
              className={inputClass}
              value={p.linkedin}
              onChange={(e) => updateProfile({ linkedin: e.target.value })}
              placeholder="linkedin.com/in/usuario"
            />
          </Field>
          <Field label="Portafolio" optional>
            <input
              className={inputClass}
              value={p.portfolio}
              onChange={(e) => updateProfile({ portfolio: e.target.value })}
              placeholder="miportafolio.com"
            />
          </Field>
          <Field label="Página personal / Instagram" optional>
            <input
              className={inputClass}
              value={p.website || p.instagram}
              onChange={(e) => updateProfile({ website: e.target.value })}
              placeholder="instagram.com/usuario"
            />
          </Field>
        </div>

        <div className="my-7 h-px bg-line" />

        <div className="space-y-3">
          <label className="flex cursor-pointer items-start gap-3 text-xs text-muted">
            <input
              type="checkbox"
              checked={p.consentData}
              onChange={(e) => updateProfile({ consentData: e.target.checked })}
              className="mt-0.5 h-4 w-4 accent-tech"
            />
            Acepto el tratamiento de mis datos personales para el proceso de
            selección del semillero.
          </label>
          <label className="flex cursor-pointer items-start gap-3 text-xs text-muted">
            <input
              type="checkbox"
              checked={p.consentFiles}
              onChange={(e) => updateProfile({ consentFiles: e.target.checked })}
              className="mt-0.5 h-4 w-4 accent-tech"
            />
            Acepto que los archivos que envíe sean utilizados con fines del
            proceso de selección.
          </label>
        </div>
      </motion.div>

      <div className="mt-8 flex justify-end">
        <Link
          href="/presentacion"
          aria-disabled={!canContinue}
          className={`rounded-lg px-7 py-3 text-sm font-semibold transition-transform ${
            canContinue
              ? "bg-gradient-to-r from-action to-tech text-ink hover:scale-[1.03] active:scale-[0.98]"
              : "pointer-events-none bg-surface-raised text-muted"
          }`}
        >
          Continuar
        </Link>
      </div>
    </div>
  );
}

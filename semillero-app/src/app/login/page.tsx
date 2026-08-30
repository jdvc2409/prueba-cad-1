"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import {
  UNISABANA_EMAIL_PATTERN,
  isUnisabanaEmail,
} from "@/lib/admissions";
import { getJourneyDestination } from "@/lib/journey";
import { EASE_OUT } from "@/lib/motion";
import { useAppState } from "@/lib/state/AppStateContext";
import { isTesterEmail, useTesterSession } from "@/lib/tester/session";

export default function LoginPage() {
  const router = useRouter();
  const reduceMotion = Boolean(useReducedMotion());
  const { state, hydrated, sessionActive, startSession } = useAppState();
  const { activateTester } = useTesterSession();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const journey = getJourneyDestination(state);
  const storedEmail = state.profile.email.trim();
  const storedEmailIsInstitutional = isUnisabanaEmail(storedEmail);
  const hasStoredJourney = journey.isReturning;
  const canRecoverWithEmail = hasStoredJourney && Boolean(storedEmail);

  useEffect(() => {
    if (!hydrated || !sessionActive) return;
    router.replace(journey.href);
  }, [hydrated, journey.href, router, sessionActive]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const normalizedEmail = email.trim().toLowerCase();

    if (isTesterEmail(normalizedEmail)) {
      activateTester();
      router.replace("/skills");
      return;
    }

    if (!hasStoredJourney) {
      setError("No encontramos un recorrido guardado en este dispositivo.");
      return;
    }

    if (!storedEmail) {
      setError("Este recorrido todavía no tiene un correo asociado. Continúa el registro para completarlo.");
      return;
    }

    if (storedEmailIsInstitutional && !isUnisabanaEmail(normalizedEmail)) {
      setError("Ingresa tu correo institucional terminado en @unisabana.edu.co.");
      return;
    }

    if (normalizedEmail !== storedEmail.toLowerCase()) {
      setError("El correo no coincide con el recorrido guardado en este dispositivo.");
      return;
    }

    setError("");
    startSession();
    router.replace(journey.href);
  }

  if (!hydrated || sessionActive) {
    return <LoginLoading message={sessionActive ? "Abriendo tu recorrido…" : "Buscando tu recorrido…"} />;
  }

  return (
    <div className="hero-gradient relative isolate min-h-[calc(100svh-4rem)] overflow-hidden px-5 py-12 sm:px-6 sm:py-16">
      <div className="grid-pattern pointer-events-none absolute inset-0 opacity-45" />
      <div className="pointer-events-none absolute -left-32 top-12 h-80 w-80 rounded-full bg-cyan/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-tech/10 blur-3xl" />

      <motion.section
        initial={reduceMotion ? false : { opacity: 0, y: 20, scale: 0.985 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: EASE_OUT }}
        aria-labelledby="login-title"
        className="relative mx-auto w-full max-w-lg overflow-hidden rounded-3xl border border-cyan/20 bg-surface/90 shadow-[0_28px_90px_rgba(0,0,0,0.3)] backdrop-blur-xl"
      >
        <div className="h-1 bg-gradient-to-r from-action via-cyan to-tech" />
        <div className="p-6 sm:p-9">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-cyan/25 bg-cyan/10 text-cyan">
            <LoginIcon />
          </div>

          <p className="mt-7 text-xs font-semibold uppercase tracking-[0.2em] text-cyan">
            Retoma tu proceso
          </p>
          <h1 id="login-title" className="mt-3 text-balance font-heading text-3xl font-semibold tracking-[-0.025em] text-ink sm:text-4xl">
            {hasStoredJourney ? "Continúa donde quedaste." : "Aún no hay un recorrido guardado."}
          </h1>
          <p className="mt-4 text-sm leading-6 text-muted">
            {hasStoredJourney
              ? storedEmailIsInstitutional
                ? "Escribe el correo institucional que usaste en el registro para abrir el avance de este dispositivo."
                : "Este recorrido usa un correo anterior. Escríbelo para entrar y actualizar tus datos antes de volver al árbol."
              : "Cuando comiences tu registro, guardaremos el avance localmente para que puedas retomarlo después."}
          </p>

          {canRecoverWithEmail ? (
            <form onSubmit={handleSubmit} noValidate className="mt-8">
              <label htmlFor="login-email" className="block text-sm font-semibold text-ice">
                {storedEmailIsInstitutional ? "Correo institucional" : "Correo del registro anterior"}
              </label>
              <div className="relative mt-2">
                <span className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-muted" aria-hidden="true">
                  <MailIcon />
                </span>
                <input
                  id="login-email"
                  name="email"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  autoCapitalize="none"
                  spellCheck={false}
                  required
                  pattern={storedEmailIsInstitutional ? UNISABANA_EMAIL_PATTERN : undefined}
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value);
                    if (error) setError("");
                  }}
                  aria-invalid={Boolean(error)}
                  aria-describedby={error ? "login-error login-local-note" : "login-local-note"}
                  placeholder={
                    storedEmailIsInstitutional
                      ? "nombre@unisabana.edu.co"
                      : "Correo usado anteriormente"
                  }
                  className="min-h-12 w-full rounded-xl border border-line bg-night/65 py-3 pl-11 pr-4 text-sm text-ink outline-none transition-[border-color,box-shadow] placeholder:text-muted/65 focus:border-cyan/70 focus:shadow-[0_0_0_3px_rgba(132,182,215,0.14)]"
                />
              </div>

              <div aria-live="polite" className="min-h-8 pt-2">
                {error && (
                  <p id="login-error" role="alert" className="text-xs leading-5 text-danger">
                    {error}
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="group mt-2 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-action to-tech px-6 text-sm font-semibold text-white shadow-[0_12px_35px_rgba(2,56,125,0.34)] transition-[transform,box-shadow] hover:-translate-y-0.5 hover:shadow-[0_16px_42px_rgba(2,56,125,0.46)] active:translate-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
              >
                {storedEmailIsInstitutional ? "Abrir mi recorrido" : "Verificar y actualizar datos"}
                <ArrowIcon />
              </button>
            </form>
          ) : (
            <div className="mt-8 rounded-2xl border border-line bg-night/45 p-5">
              <p className="text-sm font-semibold text-ice">
                {hasStoredJourney ? "Falta asociar un correo" : "Empieza por tu registro"}
              </p>
              <p className="mt-2 text-xs leading-5 text-muted">
                {hasStoredJourney
                  ? "Encontramos avance parcial, pero todavía no tiene un correo institucional. Puedes entrar y completar ese dato."
                  : "Solo toma unos minutos. Después podrás explorar el árbol y volver cuando quieras."}
              </p>
              <RegistrationLink onStart={startSession} label={hasStoredJourney ? "Completar registro" : "Registrarme"} />
            </div>
          )}

          <div id="login-local-note" className="mt-7 flex gap-3 rounded-2xl border border-cyan/15 bg-cyan/[0.045] p-4 text-xs leading-5 text-muted">
            <span className="mt-0.5 shrink-0 text-cyan" aria-hidden="true">
              <InfoIcon />
            </span>
            <p>
              Por ahora este acceso recupera únicamente el recorrido guardado en este dispositivo. No usa contraseña ni reemplaza una autenticación real; la conexión institucional y el respaldo en servidor se integrarán después.
            </p>
          </div>

          <Link
            href="/evaluador/login"
            className="mt-6 inline-flex min-h-9 items-center gap-1.5 text-xs font-semibold text-cyan hover:text-ice"
          >
            ¿Eres evaluador? Accede al panel de evaluación
            <ArrowIcon />
          </Link>

        </div>
      </motion.section>
    </div>
  );
}

function RegistrationLink({ onStart, label }: { onStart: () => void; label: string }) {
  return (
    <Link
      href="/registro"
      onClick={onStart}
      className="mt-5 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-cyan/30 bg-cyan/10 px-5 text-sm font-semibold text-cyan transition-colors hover:border-cyan/50 hover:bg-cyan/15 hover:text-ice focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-night"
    >
      {label}
      <ArrowIcon />
    </Link>
  );
}

function LoginLoading({ message }: { message: string }) {
  return (
    <div className="flex min-h-[calc(100svh-4rem)] items-center justify-center bg-night px-6" aria-live="polite">
      <div className="flex items-center gap-3 text-sm text-muted">
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-muted/25 border-t-cyan" aria-hidden="true" />
        {message}
      </div>
    </div>
  );
}

function LoginIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" aria-hidden="true">
      <path d="M10 7H6.8A1.8 1.8 0 0 0 5 8.8v8.4A1.8 1.8 0 0 0 6.8 19h8.4a1.8 1.8 0 0 0 1.8-1.8V14M13 5h6m0 0v6m0-6-8 8" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4">
      <path d="M3.5 5.5h13v9h-13v-9Zm.5.7 6 4.3 6-4.3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function InfoIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4">
      <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1.4" />
      <path d="M10 9v4m0-6.5v.1" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" className="h-4 w-4">
      <path d="M4 10h11m0 0-4-4m4 4-4 4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

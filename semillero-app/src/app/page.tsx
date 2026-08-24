"use client";

import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import { BRANCHES, BRANCH_ORDER } from "@/lib/data/branches";
import { BranchIcon } from "@/components/icons/BranchIcon";
import { EASE_OUT } from "@/lib/motion";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.08, ease: EASE_OUT },
  }),
};

const HOW_IT_WORKS = [
  {
    n: "01",
    title: "Regístrate y preséntate",
    body: "Datos básicos y una presentación libre — texto, imagen, audio, video o un enlace a tu portafolio.",
  },
  {
    n: "02",
    title: "Explora el árbol",
    body: "Siete ramas, decenas de retos. Empiezas por donde quieras y avanzas a tu ritmo.",
  },
  {
    n: "03",
    title: "Construye tu perfil",
    body: "Cada reto que completas queda registrado. No hay nota — hay un mapa de lo que decidiste explorar.",
  },
];

export default function LandingPage() {
  return (
    <div className="relative overflow-hidden">
      <section className="relative hero-gradient">
        <div className="grid-pattern pointer-events-none absolute inset-0 opacity-70" />

        <svg
          className="pointer-events-none absolute inset-0 h-full w-full opacity-40"
          preserveAspectRatio="none"
        >
          <motion.line
            x1="8%" y1="20%" x2="35%" y2="45%"
            stroke="url(#lineGrad)" strokeWidth="1"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, ease: "easeInOut" }}
          />
          <motion.line
            x1="90%" y1="15%" x2="62%" y2="42%"
            stroke="url(#lineGrad)" strokeWidth="1"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, delay: 0.3, ease: "easeInOut" }}
          />
          <motion.line
            x1="20%" y1="85%" x2="45%" y2="60%"
            stroke="url(#lineGrad)" strokeWidth="1"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, delay: 0.6, ease: "easeInOut" }}
          />
          <defs>
            <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#35C4E8" stopOpacity="0" />
              <stop offset="50%" stopColor="#35C4E8" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#35C4E8" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>

        <div className="drift pointer-events-none absolute -right-24 top-24 h-72 w-72 rounded-full bg-tech/10 blur-3xl" />
        <div className="drift pointer-events-none absolute -left-16 bottom-10 h-64 w-64 rounded-full bg-cyan/10 blur-3xl" style={{ animationDelay: "-4s" }} />

        <div className="relative mx-auto flex max-w-5xl flex-col items-center px-6 py-28 text-center sm:py-36">
          <motion.span
            initial="hidden"
            animate="show"
            custom={0}
            variants={fadeUp}
            className="mb-6 rounded-full border border-line bg-surface/60 px-4 py-1.5 text-xs tracking-wide text-cyan"
          >
            Semillero de Robótica · Proceso de ingreso
          </motion.span>

          <motion.h1
            initial="hidden"
            animate="show"
            custom={1}
            variants={fadeUp}
            className="font-heading text-4xl font-semibold leading-tight text-ink sm:text-6xl"
          >
            Explora hasta dónde
            <br className="hidden sm:block" /> puedes llegar.
          </motion.h1>

          <motion.p
            initial="hidden"
            animate="show"
            custom={2}
            variants={fadeUp}
            className="mt-6 max-w-2xl text-balance text-base text-muted sm:text-lg"
          >
            Esta no es una prueba para demostrar que ya lo sabes todo. Es una
            oportunidad para mostrarnos cómo piensas, qué construyes y qué
            quieres aprender.
          </motion.p>

          <motion.div
            initial="hidden"
            animate="show"
            custom={3}
            variants={fadeUp}
            className="mt-10 flex flex-col gap-3 sm:flex-row"
          >
            <Link
              href="/registro"
              className="rounded-lg bg-gradient-to-r from-action to-tech px-7 py-3 text-sm font-semibold text-ink shadow-lg shadow-action/20 transition-transform hover:scale-[1.03] active:scale-[0.98]"
            >
              Comenzar experiencia
            </Link>
            <a
              href="#como-funciona"
              className="rounded-lg border border-line px-7 py-3 text-sm font-semibold text-ink transition-colors hover:border-tech hover:bg-surface"
            >
              Ver cómo funciona
            </a>
          </motion.div>

          <motion.p
            initial="hidden"
            animate="show"
            custom={4}
            variants={fadeUp}
            className="mt-14 font-heading text-sm tracking-widest text-muted"
          >
            EXPLORA · CONSTRUYE · MUÉSTRANOS CÓMO PIENSAS
          </motion.p>
        </div>
      </section>

      <section id="como-funciona" className="relative border-t border-line bg-night px-6 py-20 scroll-mt-16">
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5 }}
            className="max-w-2xl"
          >
            <span className="text-xs font-medium uppercase tracking-widest text-cyan">
              Cómo funciona
            </span>
            <h2 className="mt-3 font-heading text-2xl font-semibold text-ink sm:text-3xl">
              Tres pasos. Sin examen tradicional.
            </h2>
          </motion.div>

          <div className="relative mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
            <div className="pointer-events-none absolute left-0 right-0 top-6 hidden h-px bg-line sm:block" />
            {HOW_IT_WORKS.map((step, i) => (
              <motion.div
                key={step.n}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.45, delay: i * 0.1 }}
                className="relative"
              >
                <span className="relative z-10 mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-cyan/40 bg-night font-heading text-sm font-semibold text-cyan">
                  {step.n}
                </span>
                <h3 className="font-heading text-base font-semibold text-ink">
                  {step.title}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted">
                  {step.body}
                </p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-12 rounded-2xl border border-line bg-surface/60 p-6 sm:p-8"
          >
            <p className="font-heading text-sm font-semibold text-cyan">
              ¿Qué es el Semillero?
            </p>
            <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted sm:text-base">
              Un equipo multidisciplinario de estudiantes que diseña,
              construye y programa proyectos reales de robótica. No necesitas
              dominar todas las áreas: los equipos combinan diseño, mecánica,
              electrónica, control, software e IA, y cada persona aporta
              desde su fortaleza mientras aprende de las demás.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="relative border-t border-line bg-night px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5 }}
            className="mb-10 max-w-2xl"
          >
            <h2 className="font-heading text-2xl font-semibold text-ink sm:text-3xl">
              Siete ramas. Decenas de caminos.
            </h2>
            <p className="mt-2 text-sm text-muted sm:text-base">
              Un perfil construido por ti, no una nota. Elige por dónde
              empezar y cuánto profundizar.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {BRANCH_ORDER.map((id, i) => {
              const branch = BRANCHES[id];
              return (
                <motion.div
                  key={id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.45, delay: (i % 3) * 0.07 }}
                  whileHover={{ y: -4 }}
                  className="group rounded-xl border border-line bg-surface/70 p-5 transition-colors hover:border-tech/60"
                >
                  <div
                    className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg"
                    style={{ background: `${branch.color}22`, color: branch.color }}
                  >
                    <BranchIcon branch={id} className="h-5 w-5" />
                  </div>
                  <h3 className="font-heading text-sm font-semibold text-ink">
                    {branch.name}
                  </h3>
                  <p className="mt-1.5 text-xs leading-relaxed text-muted">
                    {branch.tagline}
                  </p>
                </motion.div>
              );
            })}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="mt-12 flex justify-center"
          >
            <Link
              href="/registro"
              className="rounded-lg bg-gradient-to-r from-action to-tech px-7 py-3 text-sm font-semibold text-ink shadow-lg shadow-action/20 transition-transform hover:scale-[1.03] active:scale-[0.98]"
            >
              Comenzar experiencia
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { BRANCHES, BRANCH_ORDER } from "@/lib/data/branches";
import { BranchIcon } from "@/components/icons/BranchIcon";

export default function SemilleroPage() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <span className="text-xs font-medium uppercase tracking-widest text-cyan">
          El Semillero
        </span>
        <h1 className="mt-3 font-heading text-3xl font-semibold text-ink sm:text-4xl">
          Un equipo multidisciplinario que construye robótica real.
        </h1>
        <p className="mt-5 max-w-2xl text-sm leading-relaxed text-muted sm:text-base">
          El Semillero de Robótica es un espacio donde estudiantes de distintas
          carreras diseñan, construyen y programan proyectos reales de
          robótica. No es necesario dominar todas las áreas: los equipos son
          multidisciplinarios y cada persona aporta desde su fortaleza, mientras
          aprende de las demás.
        </p>
      </motion.div>

      <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[
          {
            title: "Se valora aprender y construir",
            body: "Nos interesa más tu proceso y tu curiosidad que un examen perfecto.",
          },
          {
            title: "No necesitas saberlo todo",
            body: "Puedes empezar desde fundamentos en cualquiera de las siete ramas.",
          },
          {
            title: "Equipos multidisciplinarios",
            body: "Diseño, mecánica, electrónica, control, software e IA trabajan juntos.",
          },
        ].map((item, i) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.1 + i * 0.08 }}
            className="rounded-xl border border-line bg-surface/70 p-5"
          >
            <h3 className="font-heading text-sm font-semibold text-ink">
              {item.title}
            </h3>
            <p className="mt-2 text-xs leading-relaxed text-muted">{item.body}</p>
          </motion.div>
        ))}
      </div>

      <div className="mt-16">
        <h2 className="font-heading text-xl font-semibold text-ink">
          Las siete áreas del árbol de habilidades
        </h2>
        <p className="mt-1.5 text-sm text-muted">
          Cada una se despliega en tu propio recorrido más adelante.
        </p>

        <div className="relative mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {BRANCH_ORDER.map((id, i) => {
            const branch = BRANCHES[id];
            return (
              <motion.div
                key={id}
                initial={{ opacity: 0, scale: 0.94 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.4, delay: (i % 4) * 0.06 }}
                whileHover={{ y: -3, borderColor: branch.color }}
                className="rounded-xl border border-line bg-surface/70 p-5 transition-colors"
              >
                <div
                  className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg"
                  style={{ background: `${branch.color}22`, color: branch.color }}
                >
                  <BranchIcon branch={id} className="h-4.5 w-4.5" />
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
      </div>

      <div className="mt-16 flex justify-center">
        <Link
          href="/registro"
          className="rounded-lg bg-gradient-to-r from-action to-tech px-7 py-3 text-sm font-semibold text-ink shadow-lg shadow-action/20 transition-transform hover:scale-[1.03] active:scale-[0.98]"
        >
          Comenzar experiencia
        </Link>
      </div>
    </div>
  );
}

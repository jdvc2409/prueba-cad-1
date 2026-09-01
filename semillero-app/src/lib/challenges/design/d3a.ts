/**
 * Pure content and evaluation engine for Design/CAD D3A.
 *
 * Original piece (not derived from any external exam): a rectangular plate
 * with one square corner notch and one or two through-holes, modified across
 * three sequential steps. Each step recomputes the mass after a geometry
 * change — inspired by the general pedagogy of "build, then modify, then
 * modify again" used in parametric-modeling assessments, but with entirely
 * original dimensions and geometry.
 */

export type D3AStepId = "base" | "resize" | "add-hole";

export const D3A_STEP_IDS = ["base", "resize", "add-hole"] as const satisfies readonly D3AStepId[];

export interface D3ASubmission {
  readonly stepId: D3AStepId;
  readonly value: string;
}

export interface D3AEvaluation {
  readonly isCorrect: boolean;
  readonly feedback: string;
}

const TOLERANCE = 0.02;
/** Densidad del Aluminio 6061, en g/mm³. */
const DENSITY = 0.0027;

export interface D3AStepGeometry {
  readonly length: number;
  readonly width: number;
  readonly height: number;
  readonly notch: number;
  readonly holes: readonly number[];
}

const STEP_GEOMETRY: Record<D3AStepId, D3AStepGeometry> = {
  base: { length: 80, width: 50, height: 15, notch: 15, holes: [12] },
  resize: { length: 85, width: 52, height: 15, notch: 15, holes: [12] },
  "add-hole": { length: 90, width: 54, height: 15, notch: 15, holes: [12, 10] },
};

function targetMass(stepId: D3AStepId): number {
  const g = STEP_GEOMETRY[stepId];
  let volume = g.length * g.width * g.height;
  volume -= g.notch * g.notch * g.height;
  for (const d of g.holes) {
    volume -= (Math.PI / 4) * d * d * g.height;
  }
  return volume * DENSITY;
}

export const D3A_CHALLENGE = {
  id: "D3A",
  title: "Modela y recalcula",
  subtitle: "Profundización · Modelado paramétrico",
  introduction:
    "Modela esta placa y ve modificándola paso a paso, recalculando su masa en cada versión — igual que en un flujo real de diseño iterativo.",
  attempts: "unlimited",
  completionRule: "all_steps",
  totalSteps: 3,
  material: "Aluminio 6061 (densidad 0.0027 g/mm³)",
  steps: {
    base: {
      id: "base" as const,
      order: 1 as const,
      eyebrow: "Paso 1 de 3",
      title: "Pieza base",
      statement:
        "Modela una placa rectangular de 80 × 50 × 15 mm. En una esquina, quita una muesca cuadrada de 15 × 15 mm que atraviese todo el espesor. Agrega un agujero pasante de Ø12 mm, centrado en la placa. Material: Aluminio 6061. ¿Cuál es la masa de la pieza (g)?",
      geometry: STEP_GEOMETRY.base,
      hints: [
        "El volumen es el bloque completo menos la muesca menos el agujero — todo pasante a través del espesor.",
        "Densidad del Aluminio 6061: 0.0027 g/mm³.",
      ] as const,
      feedback: {
        correct: "Correcto — dentro del ±2% del valor de referencia.",
        incorrect: "Aún no. Revisa que la muesca y el agujero atraviesen todo el espesor de 15 mm.",
      },
    },
    resize: {
      id: "resize" as const,
      order: 2 as const,
      eyebrow: "Paso 2 de 3",
      title: "Redimensiona",
      statement:
        "Parte de la pieza del paso anterior. Cambia el largo a 85 mm y el ancho a 52 mm, manteniendo el espesor, la muesca (15 × 15 mm) y el agujero (Ø12 mm) sin cambios. ¿Cuál es la nueva masa (g)?",
      geometry: STEP_GEOMETRY.resize,
      hints: [
        "Solo cambia el contorno exterior (largo y ancho) — la muesca y el agujero se mantienen igual.",
        "Si tu modelo está bien parametrizado, este cambio no debería romper nada.",
      ] as const,
      feedback: {
        correct: "Correcto — dentro del ±2% del valor de referencia.",
        incorrect: "Aún no. Verifica que solo cambiaste el largo y el ancho, no la muesca ni el agujero.",
      },
    },
    "add-hole": {
      id: "add-hole" as const,
      order: 3 as const,
      eyebrow: "Paso 3 de 3",
      title: "Agrega complejidad",
      statement:
        "Parte de la pieza del paso anterior. Cambia el largo a 90 mm y el ancho a 54 mm. Agrega un segundo agujero pasante de Ø10 mm (sin interferir con el primero). ¿Cuál es la nueva masa (g)?",
      geometry: STEP_GEOMETRY["add-hole"],
      hints: [
        "Ahora restas el volumen de dos agujeros distintos, no solo uno.",
        "Verifica que los dos agujeros no se solapen entre sí ni con la muesca.",
      ] as const,
      feedback: {
        correct: "Correcto — dentro del ±2% del valor de referencia.",
        incorrect: "Aún no. Revisa que ambos agujeros (Ø12 y Ø10) estén completos y no se corten entre sí.",
      },
    },
  },
} as const;

export function createD3ADraft(stepId: D3AStepId): D3ASubmission {
  return { stepId, value: "" };
}

export function evaluateD3AStep(submission: D3ASubmission): D3AEvaluation {
  const parsed = Number(submission.value.replace(",", "."));
  let isCorrect = false;
  if (Number.isFinite(parsed)) {
    const target = targetMass(submission.stepId);
    const lo = target * (1 - TOLERANCE);
    const hi = target * (1 + TOLERANCE);
    isCorrect = parsed >= lo && parsed <= hi;
  }
  const feedback = D3A_CHALLENGE.steps[submission.stepId].feedback;
  return { isCorrect, feedback: isCorrect ? feedback.correct : feedback.incorrect };
}

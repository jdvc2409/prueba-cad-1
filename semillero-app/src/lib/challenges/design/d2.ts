/**
 * Pure content and evaluation engine for Design/CAD D2.
 */

export type D2StepId = "lightening";

export interface D2Option {
  readonly id: string;
  readonly label: string;
}

export interface D2Submission {
  readonly stepId: D2StepId;
  readonly selected: readonly string[];
}

export interface D2Evaluation {
  readonly isCorrect: boolean;
  readonly feedback: string;
}

export const D2_STEP_IDS = ["lightening"] as const satisfies readonly D2StepId[];

export const D2_OPTIONS: readonly D2Option[] = [
  { id: "vaciado", label: "Vaciado interior (shell) con espesor de pared uniforme" },
  { id: "nervaduras", label: "Nervaduras de refuerzo en vez de material sólido" },
  { id: "bolsillos", label: "Patrón de bolsillos en zonas sin carga" },
  { id: "redondeo_no_estructural", label: "Redondear aristas no estructurales" },
  { id: "rejilla_nucleo", label: "Estructura tipo rejilla en el núcleo, manteniendo las caras externas" },
  { id: "adelgazar_montaje", label: "Adelgazar la superficie de montaje" },
  { id: "eliminar_agujero", label: "Eliminar uno de los agujeros de sujeción" },
  { id: "cambiar_diametro_montaje", label: "Cambiar el diámetro de los agujeros de montaje" },
  { id: "reducir_espesor_uniforme", label: "Reducir el espesor de toda la pieza de forma uniforme (incluida la zona de montaje)" },
];

/** Las 5 técnicas válidas — deben marcarse TODAS. */
export const D2_REQUIRED = [
  "vaciado",
  "nervaduras",
  "bolsillos",
  "redondeo_no_estructural",
  "rejilla_nucleo",
] as const;
/** Ninguna opción fuera de las requeridas es aceptable (todas las demás tocan el montaje). */
export const D2_OPTIONAL_OK: readonly string[] = [];

export const D2_CHALLENGE = {
  id: "D2",
  title: "Diseña menos, logra más",
  subtitle: "Aplicación · Criterio de aligeramiento",
  introduction:
    "Esta pieza tiene marcadas sus superficies de montaje, que no se pueden modificar. Selecciona todas las técnicas de aligeramiento que serían válidas sin tocarlas.",
  attempts: "unlimited",
  completionRule: "all_steps",
  totalSteps: 1,
  steps: {
    lightening: {
      id: "lightening" as const,
      order: 1 as const,
      eyebrow: "Paso único",
      title: "¿Qué técnicas son válidas?",
      statement:
        "Esta pieza tiene marcadas sus superficies de montaje (no se pueden modificar). Selecciona todas las técnicas de aligeramiento que serían válidas para reducir su masa sin tocar esas superficies.",
      hints: [
        "Piensa en qué operaciones cambian solo el interior o zonas sin función de ensamble.",
        "Cualquier cambio que afecte una cara o un agujero de montaje queda descartado, sin importar cuánto aligere la pieza.",
      ] as const,
      feedback: {
        correct:
          "Correcto. Vaciado, nervaduras, bolsillos, redondeos no estructurales y rejilla interior aligeran la pieza sin tocar el montaje. Las demás opciones modifican directa o indirectamente las superficies de sujeción.",
        incorrect:
          "Aún no. Revisa cada opción marcada: ¿toca de alguna forma una cara o un agujero de montaje? Si sí, no es válida sin importar cuánto reduzca la masa.",
      },
    },
  },
} as const;

export function createD2Draft(): D2Submission {
  return { stepId: "lightening", selected: [] };
}

export function evaluateD2(submission: D2Submission): D2Evaluation {
  const selected = submission.selected;
  const allowed = new Set<string>([...D2_REQUIRED, ...D2_OPTIONAL_OK]);
  const hasAllRequired = D2_REQUIRED.every((id) => selected.includes(id));
  const noForbidden = selected.every((id) => allowed.has(id));
  const isCorrect = hasAllRequired && noForbidden;
  return {
    isCorrect,
    feedback: isCorrect
      ? D2_CHALLENGE.steps.lightening.feedback.correct
      : D2_CHALLENGE.steps.lightening.feedback.incorrect,
  };
}

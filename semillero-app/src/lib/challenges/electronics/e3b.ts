/** Pure, serializable content and evaluation rules for Electronics E3B. */

export type E3BStepId = "hardware-diagnosis";
export type E3BQuestionId = "cause" | "correction" | "explanation";

export interface E3BOption {
  readonly id: string;
  readonly label: string;
}

export interface E3BSubmission {
  readonly stepId: E3BStepId;
  readonly causeOptionId?: string;
  readonly correctionOptionId?: string;
  readonly explanation: string;
}

export interface E3BEvaluationItem {
  readonly id: E3BQuestionId;
  readonly isAnswered: boolean;
  readonly isCorrect: boolean | null;
  readonly feedback: string;
}

export interface E3BEvaluation {
  readonly stepId: E3BStepId;
  readonly isComplete: boolean;
  readonly isCorrect: boolean;
  readonly score: number;
  readonly maxScore: number;
  readonly feedback: string;
  readonly items: readonly E3BEvaluationItem[];
}

export const E3B_STEP_IDS = [
  "hardware-diagnosis",
] as const satisfies readonly E3BStepId[];

export const E3B_MEASUREMENTS = [
  { id: "vm", label: "VM (potencia del driver)", value: "9.1 V" },
  { id: "vcc", label: "VCC (lógica del driver)", value: "3.30 V" },
  { id: "pwm", label: "PWM", value: "Presente" },
  { id: "ain1", label: "AIN1", value: "HIGH" },
  { id: "ain2", label: "AIN2", value: "LOW" },
  { id: "motor", label: "Motor", value: "No gira" },
] as const;

export const E3B_CAUSE_OPTIONS = [
  {
    id: "grounds-not-common",
    label:
      "La lógica y la etapa de potencia no comparten una referencia de GND.",
  },
  {
    id: "motor-voltage-low",
    label: "La alimentación de 9.1 V es insuficiente para que el motor gire.",
  },
  {
    id: "pwm-missing",
    label: "La señal PWM no llega al driver.",
  },
  {
    id: "direction-invalid",
    label: "AIN1 y AIN2 tienen el mismo nivel lógico y ordenan freno.",
  },
] as const satisfies readonly E3BOption[];

export const E3B_CORRECTION_OPTIONS = [
  {
    id: "join-grounds",
    label:
      "Conectar GND de la lógica con GND de la fuente de potencia, manteniendo el cableado de retorno adecuado.",
  },
  {
    id: "raise-vm",
    label: "Aumentar VM por encima del voltaje nominal del motor.",
  },
  {
    id: "invert-power",
    label: "Invertir los terminales de la batería externa.",
  },
  {
    id: "remove-logic-ground",
    label: "Retirar también el GND del ESP32 para aislar completamente ambos circuitos.",
  },
] as const satisfies readonly E3BOption[];

export const E3B_CHALLENGE = {
  id: "E3B",
  title: "Debuggea el hardware",
  subtitle: "Cruza esquema, síntomas y mediciones antes de intervenir.",
  attempts: "unlimited",
  completionRule: "all_steps",
  steps: {
    "hardware-diagnosis": {
      id: "hardware-diagnosis",
      title: "Laboratorio de diagnóstico",
      statement:
        "La lógica responde, el driver tiene alimentación y recibe señales, pero el motor no gira. Identifica la causa raíz, propone una corrección y justifica por qué concuerda con las mediciones.",
      minimumExplanationCharacters: 120,
      hints: [
        "Una señal digital solo tiene significado si emisor y receptor comparten una referencia eléctrica; revisa los retornos de GND del esquema.",
      ],
      assets: {
        schematic: {
          src: "/challenges/electronics/e3b/electronics_E3B_S1_driver_motor_fault.svg",
          sourceFilename: "electronics_E3B_S1_driver_motor_fault.svg",
          alt:
            "Esquema de un ESP32 conectado por PWM y señales de dirección a un driver TB6612, alimentado por una batería externa y conectado a un motor.",
        },
        measurements: {
          src: "/challenges/electronics/e3b/electronics_E3B_S2_measurements_panel.png",
          sourceFilename: "electronics_E3B_S2_measurements_panel.png",
          alt:
            "Panel de mediciones: VM 9.1 V, VCC 3.30 V, PWM presente, AIN1 alto, AIN2 bajo y motor sin giro.",
        },
      },
    },
  },
} as const;

export function createE3BDraft(): E3BSubmission {
  return {
    stepId: "hardware-diagnosis",
    explanation: "",
  };
}

export function evaluateE3B(submission: E3BSubmission): E3BEvaluation {
  const causeCorrect = submission.causeOptionId === "grounds-not-common";
  const correctionCorrect = submission.correctionOptionId === "join-grounds";
  const explanation = submission.explanation.trim();
  const minimum =
    E3B_CHALLENGE.steps["hardware-diagnosis"].minimumExplanationCharacters;
  const explanationComplete = explanation.length >= minimum;

  const items: E3BEvaluationItem[] = [
    {
      id: "cause",
      isAnswered: Boolean(submission.causeOptionId),
      isCorrect: causeCorrect,
      feedback: causeCorrect
        ? "La causa concuerda con un driver alimentado y señales presentes que carecen de referencia común."
        : "Descarta hipótesis que contradigan VM, VCC, PWM y AIN1/AIN2 antes de elegir la causa raíz.",
    },
    {
      id: "correction",
      isAnswered: Boolean(submission.correctionOptionId),
      isCorrect: correctionCorrect,
      feedback: correctionCorrect
        ? "Unir las referencias permite que el driver interprete los niveles lógicos del ESP32."
        : "La corrección debe resolver la referencia de las señales sin exceder tensiones nominales ni invertir la fuente.",
    },
    {
      id: "explanation",
      isAnswered: explanation.length > 0,
      isCorrect: null,
      feedback: explanationComplete
        ? "La explicación cumple la extensión mínima y quedará disponible para revisión manual."
        : `Desarrolla la relación entre síntomas, mediciones y causa. Faltan ${Math.max(0, minimum - explanation.length)} caracteres.`,
    },
  ];

  const score = Number(causeCorrect) + Number(correctionCorrect);
  const isComplete = causeCorrect && correctionCorrect && explanationComplete;
  return {
    stepId: submission.stepId,
    isComplete,
    isCorrect: isComplete,
    score,
    maxScore: 2,
    feedback: isComplete
      ? "Diagnóstico consistente. La causa y la intervención propuesta explican todas las observaciones."
      : "Aún hay una parte del diagnóstico por ajustar. Usa las mediciones para descartar opciones.",
    items,
  };
}

/**
 * Pure content and evaluation engine for Electronics E1A.
 *
 * It deliberately contains no React or browser APIs. Definitions, drafts and
 * evaluations are JSON-compatible so the UI can persist them in the shared
 * NodeChallengeProgress contract.
 */

export const E1A_STEP_IDS = ["interpretation", "blocks", "faults"] as const;

export type E1AStepId = (typeof E1A_STEP_IDS)[number];
export type E1AFunctionId =
  | "source"
  | "regulation"
  | "measurement"
  | "processing"
  | "driver"
  | "actuation"
  | "indicator";
export type E1ABlockId =
  | "battery"
  | "regulator"
  | "mcu"
  | "sensor"
  | "led"
  | "motor-driver"
  | "dc-motor";
export type E1AFaultId = "missing-resistor" | "reverse-polarity" | "short-circuit";

export interface E1AAsset {
  readonly sourceFilename: string;
  readonly src: string;
  readonly alt: string;
}

export interface E1AHotspot {
  /** Percentages relative to the original 1600 x 900 artboard. */
  readonly left: number;
  readonly top: number;
  readonly width: number;
  readonly height: number;
}

export interface E1AFunctionOption {
  readonly id: E1AFunctionId;
  readonly label: string;
  readonly description: string;
}

export interface E1ABlockDefinition {
  readonly id: E1ABlockId;
  readonly shortLabel: string;
  readonly accessibleLabel: string;
  readonly correctFunctionId: E1AFunctionId;
  readonly hotspot: E1AHotspot;
}

export interface E1AFaultTarget {
  readonly id: string;
  readonly accessibleLabel: string;
  readonly hotspot: E1AHotspot;
}

export interface E1AChoiceOption {
  readonly id: string;
  readonly label: string;
}

export interface E1AFaultDefinition {
  readonly id: E1AFaultId;
  readonly title: string;
  readonly prompt: string;
  readonly asset: E1AAsset;
  readonly targets: readonly E1AFaultTarget[];
  readonly correctTargetId: string;
  readonly causePrompt: string;
  readonly causeOptions: readonly E1AChoiceOption[];
  readonly correctCauseOptionId: string;
  readonly feedback: {
    readonly correct: string;
    readonly incorrect: string;
  };
}

export interface E1AStepDefinition {
  readonly id: E1AStepId;
  readonly order: 1 | 2 | 3;
  readonly title: string;
  readonly eyebrow: string;
  readonly statement: string;
  readonly asset: E1AAsset;
  readonly hints: readonly string[];
}

export interface E1AInterpretationSubmission {
  readonly stepId: "interpretation";
  readonly response: string;
}

export interface E1ABlocksSubmission {
  readonly stepId: "blocks";
  readonly assignments: Readonly<Partial<Record<E1ABlockId, E1AFunctionId>>>;
}

export interface E1AFaultAnswer {
  readonly targetId: string;
  readonly causeOptionId: string;
  readonly incorrectClicks: number;
}

export interface E1AFaultsSubmission {
  readonly stepId: "faults";
  readonly cases: Readonly<Partial<Record<E1AFaultId, E1AFaultAnswer>>>;
}

export type E1AStepSubmission =
  | E1AInterpretationSubmission
  | E1ABlocksSubmission
  | E1AFaultsSubmission;

export interface E1AItemEvaluation {
  readonly itemId: string;
  readonly isAnswered: boolean;
  /** null means the answer must be assessed manually by a reviewer. */
  readonly isCorrect: boolean | null;
  readonly score: number;
  readonly maxScore: number;
  readonly feedback: string;
}

export interface E1AStepEvaluation {
  readonly stepId: E1AStepId;
  readonly isComplete: boolean;
  readonly score: number;
  readonly maxScore: number;
  readonly feedback: string;
  readonly items: readonly E1AItemEvaluation[];
  readonly metadata: Readonly<Record<string, string | number | boolean>>;
}

export const E1A_FUNCTIONS: readonly E1AFunctionOption[] = [
  {
    id: "source",
    label: "Fuente",
    description: "Entrega la energía eléctrica inicial al sistema.",
  },
  {
    id: "regulation",
    label: "Regulación",
    description: "Acondiciona el voltaje para los circuitos que lo necesitan.",
  },
  {
    id: "measurement",
    label: "Medición",
    description: "Convierte una magnitud del entorno en información utilizable.",
  },
  {
    id: "processing",
    label: "Procesamiento",
    description: "Lee entradas y decide qué salidas activar.",
  },
  {
    id: "driver",
    label: "Driver",
    description: "Adapta la señal de control a la potencia del actuador.",
  },
  {
    id: "actuation",
    label: "Actuación",
    description: "Transforma energía eléctrica en una acción física.",
  },
  {
    id: "indicator",
    label: "Indicador",
    description: "Comunica visualmente un estado del sistema.",
  },
] as const;

export const E1A_BLOCKS: readonly E1ABlockDefinition[] = [
  {
    id: "battery",
    shortLabel: "B1",
    accessibleLabel: "Bloque izquierdo: batería de 12 V",
    correctFunctionId: "source",
    hotspot: { left: 7.5, top: 36.7, width: 11.3, height: 13.4 },
  },
  {
    id: "regulator",
    shortLabel: "B2",
    accessibleLabel: "Segundo bloque: regulador de 5 V",
    correctFunctionId: "regulation",
    hotspot: { left: 23.7, top: 36.7, width: 13.2, height: 13.4 },
  },
  {
    id: "mcu",
    shortLabel: "B3",
    accessibleLabel: "Bloque central grande: microcontrolador",
    correctFunctionId: "processing",
    hotspot: { left: 43.7, top: 31.6, width: 16.3, height: 23.5 },
  },
  {
    id: "sensor",
    shortLabel: "B4",
    accessibleLabel: "Bloque superior derecho: sensor ultrasónico",
    correctFunctionId: "measurement",
    hotspot: { left: 69, top: 30, width: 11.7, height: 12.3 },
  },
  {
    id: "led",
    shortLabel: "B5",
    accessibleLabel: "Bloque medio derecho: LED de estado",
    correctFunctionId: "indicator",
    hotspot: { left: 69, top: 47.7, width: 11.7, height: 12.4 },
  },
  {
    id: "motor-driver",
    shortLabel: "B6",
    accessibleLabel: "Bloque inferior derecho: driver de motor",
    correctFunctionId: "driver",
    hotspot: { left: 64.3, top: 70, width: 13.9, height: 12.4 },
  },
  {
    id: "dc-motor",
    shortLabel: "B7",
    accessibleLabel: "Círculo del extremo derecho: motor DC",
    correctFunctionId: "actuation",
    hotspot: { left: 84.1, top: 69.8, width: 7, height: 12.8 },
  },
] as const;

const INTERPRETATION_ASSET: E1AAsset = {
  sourceFilename: "electronics_E1A_S1_robot_schematic_simple.svg",
  src: "/challenges/electronics/e1a/electronics_E1A_S1_robot_schematic_simple.svg",
  alt: "Esquema de un robot con batería, regulador, microcontrolador, sensor, LED, driver y motor.",
};

const BLOCKS_ASSET: E1AAsset = {
  sourceFilename: "electronics_E1A_S2_robot_schematic_labeled_blank.svg",
  src: "/challenges/electronics/e1a/electronics_E1A_S2_robot_schematic_labeled_blank.svg",
  alt: "Esquema del robot con siete bloques sin etiquetas para asociar sus funciones.",
};

export const E1A_FAULTS: readonly E1AFaultDefinition[] = [
  {
    id: "missing-resistor",
    title: "Caso 1 · LED sin limitación",
    prompt: "Señala el sector del circuito que debes corregir.",
    asset: {
      sourceFilename: "electronics_E1A_S3_fault_case_led.svg",
      src: "/challenges/electronics/e1a/electronics_E1A_S3_fault_case_led.svg",
      alt: "Circuito de un LED conectado sin resistencia limitadora.",
    },
    targets: [
      {
        id: "left-supply",
        accessibleLabel: "Zona izquierda de alimentación",
        hotspot: { left: 25, top: 39, width: 11, height: 15 },
      },
      {
        id: "led-branch",
        accessibleLabel: "Rama del LED en el centro",
        hotspot: { left: 36.5, top: 43, width: 11, height: 16 },
      },
      {
        id: "right-return",
        accessibleLabel: "Conductor de retorno derecho",
        hotspot: { left: 49, top: 39, width: 8, height: 15 },
      },
    ],
    correctTargetId: "led-branch",
    causePrompt: "¿Cuál es la causa técnica de la falla?",
    causeOptions: [
      { id: "missing-series-resistor", label: "Falta una resistencia limitadora en serie con el LED." },
      { id: "open-return", label: "El retorno está abierto y no existe un camino de corriente." },
      { id: "reversed-battery", label: "La batería está conectada con la polaridad invertida." },
    ],
    correctCauseOptionId: "missing-series-resistor",
    feedback: {
      correct: "La rama del LED necesita limitar la corriente con una resistencia o un driver apropiado.",
      incorrect: "Revisa qué elemento controla la corriente que atraviesa el LED.",
    },
  },
  {
    id: "reverse-polarity",
    title: "Caso 2 · Módulo polarizado",
    prompt: "Señala dónde aparece la incompatibilidad de polaridad.",
    asset: {
      sourceFilename: "electronics_E1A_S4_fault_case_reverse_polarity.svg",
      src: "/challenges/electronics/e1a/electronics_E1A_S4_fault_case_reverse_polarity.svg",
      alt: "Módulo cuyos terminales positivo y negativo están alimentados de forma invertida.",
    },
    targets: [
      {
        id: "left-wire",
        accessibleLabel: "Conductor izquierdo",
        hotspot: { left: 25, top: 39, width: 9, height: 15 },
      },
      {
        id: "module-terminals",
        accessibleLabel: "Terminales positivo y negativo del módulo",
        hotspot: { left: 33.5, top: 42, width: 14.5, height: 21 },
      },
      {
        id: "right-wire",
        accessibleLabel: "Conductor derecho",
        hotspot: { left: 48, top: 39, width: 9, height: 15 },
      },
    ],
    correctTargetId: "module-terminals",
    causePrompt: "¿Qué explica mejor el riesgo mostrado?",
    causeOptions: [
      { id: "reverse-module-supply", label: "VCC y GND llegan invertidos a un módulo sensible a polaridad." },
      { id: "low-current", label: "La fuente entrega menos corriente máxima que la indicada por el módulo." },
      { id: "missing-data-wire", label: "Falta una conexión de datos entre el módulo y el MCU." },
    ],
    correctCauseOptionId: "reverse-module-supply",
    feedback: {
      correct: "En un módulo polarizado, invertir VCC y GND puede impedir el funcionamiento o causar daño.",
      incorrect: "Compara los signos de los terminales con los conductores que llegan al módulo.",
    },
  },
  {
    id: "short-circuit",
    title: "Caso 3 · Cortocircuito",
    prompt: "Señala el camino que produce la falla.",
    asset: {
      sourceFilename: "electronics_E1A_S5_fault_case_short.svg",
      src: "/challenges/electronics/e1a/electronics_E1A_S5_fault_case_short.svg",
      alt: "Conexión directa entre la línea de alimentación VCC y el retorno GND.",
    },
    targets: [
      {
        id: "short-loop",
        accessibleLabel: "Lazo conductor directo entre VCC y GND",
        hotspot: { left: 25, top: 40, width: 23, height: 14 },
      },
      {
        id: "empty-center",
        accessibleLabel: "Zona central vacía",
        hotspot: { left: 49, top: 41, width: 11, height: 16 },
      },
      {
        id: "case-border",
        accessibleLabel: "Borde derecho del recuadro",
        hotspot: { left: 71, top: 36, width: 9, height: 21 },
      },
    ],
    correctTargetId: "short-loop",
    causePrompt: "¿Por qué este camino es peligroso?",
    causeOptions: [
      { id: "direct-vcc-ground", label: "Une VCC y GND con una impedancia muy baja, por lo que la corriente puede elevarse mucho." },
      { id: "series-load", label: "Agrega una carga en serie y reduce demasiado la corriente disponible." },
      { id: "floating-input", label: "Deja una entrada lógica flotante y susceptible al ruido." },
    ],
    correctCauseOptionId: "direct-vcc-ground",
    feedback: {
      correct: "Una unión directa VCC–GND crea un camino de muy baja impedancia y puede dañar la fuente o las pistas.",
      incorrect: "Sigue el conductor y verifica si existe alguna carga que limite la corriente entre VCC y GND.",
    },
  },
] as const;

export const E1A_STEPS: readonly E1AStepDefinition[] = [
  {
    id: "interpretation",
    order: 1,
    title: "Interpreta el sistema",
    eyebrow: "Lectura abierta",
    statement:
      "Explica qué hace el sistema, cómo fluye la alimentación y qué función cumple cada bloque. Tu respuesta será revisada por una persona.",
    asset: INTERPRETATION_ASSET,
    hints: [
      "Recorre el esquema de izquierda a derecha: fuente, acondicionamiento, decisión, entradas y salidas.",
    ],
  },
  {
    id: "blocks",
    order: 2,
    title: "Asocia las funciones",
    eyebrow: "Esquema interactivo",
    statement:
      "Selecciona cada bloque del plano y asígnale la función que desempeña. Debes completar las siete asociaciones.",
    asset: BLOCKS_ASSET,
    hints: [
      "Identifica primero la fuente y el actuador; después sigue el flujo de energía y señales hasta el bloque central.",
    ],
  },
  {
    id: "faults",
    order: 3,
    title: "Detecta tres fallas",
    eyebrow: "Banco de diagnóstico",
    statement:
      "En cada caso señala la zona problemática y elige su causa técnica. Los tres casos deben quedar resueltos.",
    asset: E1A_FAULTS[0].asset,
    hints: [
      "En cada diagrama sigue el camino de corriente y comprueba limitación, polaridad y separación entre VCC y GND.",
    ],
  },
] as const;

export const E1A_CHALLENGE = {
  id: "E1A",
  title: "Lee un plano eléctrico",
  subtitle: "Del símbolo a la función y de la anomalía al diagnóstico.",
  totalSteps: 3,
  completionRule: "all_steps",
  attempts: "unlimited",
  minimumInterpretationCharacters: 120,
  steps: E1A_STEPS,
} as const;

export function createEmptyE1ASubmission(stepId: E1AStepId): E1AStepSubmission {
  if (stepId === "interpretation") return { stepId, response: "" };
  if (stepId === "blocks") return { stepId, assignments: {} };
  return { stepId, cases: {} };
}

export function normalizeE1ASubmission(
  stepId: E1AStepId,
  value: unknown
): E1AStepSubmission {
  const record = isRecord(value) ? value : {};

  if (stepId === "interpretation") {
    return {
      stepId,
      response: typeof record.response === "string" ? record.response : "",
    };
  }

  if (stepId === "blocks") {
    const rawAssignments = isRecord(record.assignments) ? record.assignments : {};
    const assignments: Partial<Record<E1ABlockId, E1AFunctionId>> = {};
    for (const block of E1A_BLOCKS) {
      const candidate = rawAssignments[block.id];
      if (isFunctionId(candidate)) assignments[block.id] = candidate;
    }
    return { stepId, assignments };
  }

  const rawCases = isRecord(record.cases) ? record.cases : {};
  const cases: Partial<Record<E1AFaultId, E1AFaultAnswer>> = {};
  for (const fault of E1A_FAULTS) {
    const rawAnswer = rawCases[fault.id];
    if (!isRecord(rawAnswer)) continue;
    cases[fault.id] = {
      targetId: typeof rawAnswer.targetId === "string" ? rawAnswer.targetId : "",
      causeOptionId:
        typeof rawAnswer.causeOptionId === "string" ? rawAnswer.causeOptionId : "",
      incorrectClicks:
        typeof rawAnswer.incorrectClicks === "number" && Number.isFinite(rawAnswer.incorrectClicks)
          ? Math.max(0, Math.floor(rawAnswer.incorrectClicks))
          : 0,
    };
  }
  return { stepId, cases };
}

export function isE1ADraftReady(submission: E1AStepSubmission): boolean {
  if (submission.stepId === "interpretation") {
    return normalizedLength(submission.response) >= E1A_CHALLENGE.minimumInterpretationCharacters;
  }
  if (submission.stepId === "blocks") {
    return E1A_BLOCKS.every((block) => Boolean(submission.assignments[block.id]));
  }
  return E1A_FAULTS.every((fault) => {
    const answer = submission.cases[fault.id];
    return Boolean(answer?.targetId && answer.causeOptionId);
  });
}

export function evaluateE1AStep(submission: E1AStepSubmission): E1AStepEvaluation {
  if (submission.stepId === "interpretation") return evaluateInterpretation(submission);
  if (submission.stepId === "blocks") return evaluateBlocks(submission);
  return evaluateFaults(submission);
}

export function isE1AComplete(completedStepIds: readonly string[]): boolean {
  return E1A_STEP_IDS.every((stepId) => completedStepIds.includes(stepId));
}

function evaluateInterpretation(
  submission: E1AInterpretationSubmission
): E1AStepEvaluation {
  const length = normalizedLength(submission.response);
  const meetsMinimum = length >= E1A_CHALLENGE.minimumInterpretationCharacters;
  return {
    stepId: submission.stepId,
    isComplete: meetsMinimum,
    score: meetsMinimum ? 1 : 0,
    maxScore: 1,
    feedback: meetsMinimum
      ? "Respuesta registrada para revisión. Puedes continuar con la asociación de bloques."
      : `Desarrolla un poco más la explicación: faltan ${Math.max(0, E1A_CHALLENGE.minimumInterpretationCharacters - length)} caracteres.`,
    items: [
      {
        itemId: "interpretation-response",
        isAnswered: length > 0,
        isCorrect: null,
        score: meetsMinimum ? 1 : 0,
        maxScore: 1,
        feedback: meetsMinimum
          ? "Cumple la extensión mínima y queda pendiente de revisión semántica."
          : "Incluye propósito, flujo de alimentación y función de los bloques.",
      },
    ],
    metadata: { characterCount: length, reviewerRequired: true },
  };
}

function evaluateBlocks(submission: E1ABlocksSubmission): E1AStepEvaluation {
  const items = E1A_BLOCKS.map((block) => {
    const answer = submission.assignments[block.id];
    const isAnswered = Boolean(answer);
    const isCorrect = answer === block.correctFunctionId;
    return {
      itemId: block.id,
      isAnswered,
      isCorrect,
      score: isCorrect ? 1 : 0,
      maxScore: 1,
      feedback: isCorrect ? "Función bien asociada." : "La función no coincide con el flujo del esquema.",
    };
  });
  const score = items.reduce((sum, item) => sum + item.score, 0);
  const isComplete = score === items.length;
  return {
    stepId: submission.stepId,
    isComplete,
    score,
    maxScore: items.length,
    feedback: isComplete
      ? "Las siete funciones coinciden con los bloques del plano."
      : `Tienes ${score} de ${items.length} asociaciones correctas. Revisa el flujo antes de reintentar.`,
    items,
    metadata: { correctAssociations: score },
  };
}

function evaluateFaults(submission: E1AFaultsSubmission): E1AStepEvaluation {
  const items = E1A_FAULTS.map((fault) => {
    const answer = submission.cases[fault.id];
    const isAnswered = Boolean(answer?.targetId && answer.causeOptionId);
    const targetCorrect = answer?.targetId === fault.correctTargetId;
    const causeCorrect = answer?.causeOptionId === fault.correctCauseOptionId;
    const isCorrect = targetCorrect && causeCorrect;
    return {
      itemId: fault.id,
      isAnswered,
      isCorrect,
      score: isCorrect ? 1 : 0,
      maxScore: 1,
      feedback: isCorrect ? fault.feedback.correct : fault.feedback.incorrect,
    };
  });
  const score = items.reduce((sum, item) => sum + item.score, 0);
  const incorrectClicks = E1A_FAULTS.reduce(
    (sum, fault) => sum + (submission.cases[fault.id]?.incorrectClicks ?? 0),
    0
  );
  const isComplete = score === items.length;
  return {
    stepId: submission.stepId,
    isComplete,
    score,
    maxScore: items.length,
    feedback: isComplete
      ? "Los tres diagnósticos son correctos. Terminaste la lectura de planos."
      : `Resolviste ${score} de ${items.length} casos. Ajusta las zonas o causas antes de reintentar.`,
    items,
    metadata: { correctFaults: score, incorrectDiagramClicks: incorrectClicks },
  };
}

function normalizedLength(value: string): number {
  return value.trim().replace(/\s+/g, " ").length;
}

function isFunctionId(value: unknown): value is E1AFunctionId {
  return (
    typeof value === "string" &&
    E1A_FUNCTIONS.some((option) => option.id === value)
  );
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

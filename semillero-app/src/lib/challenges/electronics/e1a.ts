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
  | "communication"
  | "processing"
  | "driver"
  | "actuation"
  | "indicator";
export type E1ABlockId =
  | "battery"
  | "regulator"
  | "mcu"
  | "bluetooth"
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
  /** Percentages relative to the asset's own width/height, not currently rendered as an overlay. */
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
  readonly componentName: string;
  readonly componentDetail: string;
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
    id: "communication",
    label: "Comunicación",
    description: "Envía y recibe datos con otro dispositivo.",
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
    componentName: "Fuente 7V–10V",
    componentDetail: "Batería / fuente principal del robot",
    accessibleLabel: "Bloque inferior izquierdo: fuente de 7 a 10 voltios",
    correctFunctionId: "source",
    hotspot: { left: 24.6, top: 88, width: 16.9, height: 9.6 },
  },
  {
    id: "regulator",
    shortLabel: "B2",
    componentName: "LM2596",
    componentDetail: "Convierte 7–10 V en 5 V regulados para el Arduino",
    accessibleLabel: "Bloque inferior derecho: regulador LM2596",
    correctFunctionId: "regulation",
    hotspot: { left: 78.1, top: 88.9, width: 11.3, height: 8.4 },
  },
  {
    id: "mcu",
    shortLabel: "B3",
    componentName: "Arduino Nano",
    componentDetail: "Procesa entradas y genera las señales de control",
    accessibleLabel: "Bloque central: Arduino Nano",
    correctFunctionId: "processing",
    hotspot: { left: 42.6, top: 46.7, width: 19.1, height: 8.4 },
  },
  {
    id: "bluetooth",
    shortLabel: "B4",
    componentName: "HC-05",
    componentDetail: "Módulo Bluetooth: TX/RX con el Arduino",
    accessibleLabel: "Bloque izquierdo: módulo Bluetooth HC-05",
    correctFunctionId: "communication",
    hotspot: { left: 9.3, top: 45.5, width: 11.5, height: 9.8 },
  },
  {
    id: "led",
    shortLabel: "B5",
    componentName: "Matriz LED (×2)",
    componentDetail: "Muestra información visual mediante CLK, CS y DIN",
    accessibleLabel: "Bloques superiores: matrices LED en cascada",
    correctFunctionId: "indicator",
    hotspot: { left: 45.9, top: 1.2, width: 11.5, height: 31.1 },
  },
  {
    id: "motor-driver",
    shortLabel: "B6",
    componentName: "L298N mini",
    componentDetail: "Adapta las señales del Arduino a la potencia de los motores",
    accessibleLabel: "Bloque inferior central: driver L298N mini",
    correctFunctionId: "driver",
    hotspot: { left: 48.6, top: 72.5, width: 11.5, height: 9 },
  },
  {
    id: "dc-motor",
    shortLabel: "B7",
    componentName: "Motores DC (×2)",
    componentDetail: "Convierten energía eléctrica en el movimiento de las ruedas",
    accessibleLabel: "Círculos inferiores: motor izquierdo y motor derecho",
    correctFunctionId: "actuation",
    hotspot: { left: 33.8, top: 72.1, width: 8.3, height: 9.1 },
  },
] as const;

const INTERPRETATION_ASSET: E1AAsset = {
  sourceFilename: "electronics_E1A_S1_robot_schematic.png",
  src: "/challenges/electronics/e1a/electronics_E1A_S1_robot_schematic.png",
  alt: "Plano eléctrico de un robot: fuente de 7 a 10 voltios y regulador LM2596 alimentan un Arduino Nano, que controla dos matrices LED en cascada, un módulo Bluetooth HC-05 y un driver L298N mini conectado a dos motores DC.",
};

const BLOCKS_ASSET: E1AAsset = {
  ...INTERPRETATION_ASSET,
  alt: "Plano eléctrico rotulado del robot usado para asociar cada componente con su función.",
};

export const E1A_FAULTS: readonly E1AFaultDefinition[] = [
  {
    id: "missing-resistor",
    title: "Caso 1 · LED con brillo excesivo",
    prompt: "Al energizar el circuito, el LED brilla demasiado y termina dañándose. Analiza el recorrido de corriente.",
    asset: {
      sourceFilename: "electronics_E1A_S3_fault_case_led.svg",
      src: "/challenges/electronics/e1a/electronics_E1A_S3_fault_case_led.svg",
      alt: "Circuito de alimentación, rama de LED y retorno a tierra para diagnóstico.",
    },
    targets: [
      {
        id: "left-supply",
        accessibleLabel: "Zona A · Fuente de 3,3 V",
        hotspot: { left: 25, top: 39, width: 11, height: 15 },
      },
      {
        id: "led-branch",
        accessibleLabel: "Zona B · Rama GPIO–LED",
        hotspot: { left: 36.5, top: 43, width: 11, height: 16 },
      },
      {
        id: "right-return",
        accessibleLabel: "Zona C · Retorno a GND",
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
    title: "Caso 2 · Módulo que no enciende",
    prompt: "El módulo no inicia y comienza a calentarse al conectarlo. Compara los terminales con las líneas de alimentación.",
    asset: {
      sourceFilename: "electronics_E1A_S4_fault_case_reverse_polarity.svg",
      src: "/challenges/electronics/e1a/electronics_E1A_S4_fault_case_reverse_polarity.svg",
      alt: "Fuente conectada a un módulo con terminales positivo y negativo para diagnóstico.",
    },
    targets: [
      {
        id: "left-wire",
        accessibleLabel: "Zona A · Salida de la fuente",
        hotspot: { left: 25, top: 39, width: 9, height: 15 },
      },
      {
        id: "module-terminals",
        accessibleLabel: "Zona B · Terminales VCC y GND del módulo",
        hotspot: { left: 33.5, top: 42, width: 14.5, height: 21 },
      },
      {
        id: "right-wire",
        accessibleLabel: "Zona C · Señal de salida",
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
    title: "Caso 3 · Fuente en protección",
    prompt: "La fuente limita la corriente apenas se conecta el circuito. Revisa si existe un recorrido de baja impedancia.",
    asset: {
      sourceFilename: "electronics_E1A_S5_fault_case_short.svg",
      src: "/challenges/electronics/e1a/electronics_E1A_S5_fault_case_short.svg",
      alt: "Líneas de alimentación VCC y GND con tres zonas para diagnóstico.",
    },
    targets: [
      {
        id: "short-loop",
        accessibleLabel: "Zona A · Camino entre VCC y GND",
        hotspot: { left: 25, top: 40, width: 23, height: 14 },
      },
      {
        id: "empty-center",
        accessibleLabel: "Zona B · Salida hacia la carga",
        hotspot: { left: 49, top: 41, width: 11, height: 16 },
      },
      {
        id: "case-border",
        accessibleLabel: "Zona C · Entrada de la fuente",
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
      "Sigue primero la energía desde la fuente de 7–10 V y el LM2596 hasta el Arduino Nano; desde ahí identifica qué señales salen hacia el HC-05, la matriz LED y el L298N con los motores.",
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
    const targetId =
      typeof rawAnswer.targetId === "string" &&
      fault.targets.some((target) => target.id === rawAnswer.targetId)
        ? rawAnswer.targetId
        : "";
    const causeOptionId =
      typeof rawAnswer.causeOptionId === "string" &&
      fault.causeOptions.some((option) => option.id === rawAnswer.causeOptionId)
        ? rawAnswer.causeOptionId
        : "";
    cases[fault.id] = {
      targetId,
      causeOptionId,
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
    return normalizedLength(submission.response) > 0;
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
  const hasResponse = length > 0;
  return {
    stepId: submission.stepId,
    isComplete: hasResponse,
    score: hasResponse ? 1 : 0,
    maxScore: 1,
    feedback: hasResponse
      ? "Respuesta registrada para revisión. Puedes continuar con la asociación de bloques."
      : "Escribe tu lectura del plano para guardarla y continuar.",
    items: [
      {
        itemId: "interpretation-response",
        isAnswered: length > 0,
        isCorrect: null,
        score: hasResponse ? 1 : 0,
        maxScore: 1,
        feedback: hasResponse
          ? "La respuesta queda pendiente de revisión semántica."
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

/** Pure, serializable content and evaluation rules for Electronics E3A. */

export type E3AStepId = "dimensioning" | "rail-separation";

export type E3AQuestionId =
  | "motor-peak"
  | "five-volt-rail"
  | "six-volt-rail"
  | "battery";

export interface E3AOption {
  readonly id: string;
  readonly label: string;
}

export interface E3AQuestion {
  readonly id: E3AQuestionId;
  readonly prompt: string;
  readonly options: readonly E3AOption[];
  readonly correctOptionId: string;
  readonly feedback: {
    readonly correct: string;
    readonly incorrect: string;
  };
}

export interface E3AAsset {
  readonly src: string;
  readonly sourceFilename: string;
  readonly alt: string;
}

export interface E3ADimensioningSubmission {
  readonly stepId: "dimensioning";
  readonly answers: Readonly<Partial<Record<E3AQuestionId, string>>>;
}

export interface E3ASeparationSubmission {
  readonly stepId: "rail-separation";
  readonly explanation: string;
}

export type E3ASubmission =
  | E3ADimensioningSubmission
  | E3ASeparationSubmission;

export interface E3AEvaluationItem {
  readonly id: string;
  readonly isAnswered: boolean;
  readonly isCorrect: boolean | null;
  readonly feedback: string;
}

export interface E3AEvaluation {
  readonly stepId: E3AStepId;
  readonly isComplete: boolean;
  readonly isCorrect: boolean | null;
  readonly score: number;
  readonly maxScore: number;
  readonly feedback: string;
  readonly items: readonly E3AEvaluationItem[];
}

export const E3A_STEP_IDS = [
  "dimensioning",
  "rail-separation",
] as const satisfies readonly E3AStepId[];

export const E3A_CONSUMPTION_ROWS = [
  {
    id: "motors",
    component: "2 motores DC",
    voltage: "12 V",
    peakPerUnit: "4 A c/u",
    totalPeak: "8 A",
  },
  {
    id: "sbc",
    component: "SBC / microcomputador",
    voltage: "5 V",
    peakPerUnit: "5 A",
    totalPeak: "5 A",
  },
  {
    id: "servos",
    component: "4 servos",
    voltage: "6 V",
    peakPerUnit: "1.2 A c/u",
    totalPeak: "4.8 A",
  },
  {
    id: "sensors",
    component: "Sensores",
    voltage: "5 V",
    peakPerUnit: "0.5 A total",
    totalPeak: "0.5 A",
  },
] as const;

export const E3A_QUESTIONS = [
  {
    id: "motor-peak",
    prompt: "¿Cuál es la mayor demanda pico del sistema y de dónde proviene?",
    options: [
      { id: "motors-8a", label: "Los motores: 8 A pico en conjunto" },
      { id: "sbc-5a", label: "La SBC: 5 A pico" },
      { id: "servos-4-8a", label: "Los servos: 4.8 A pico" },
      { id: "sensors-0-5a", label: "Los sensores: 0.5 A pico" },
    ],
    correctOptionId: "motors-8a",
    feedback: {
      correct: "Dos motores a 4 A pico cada uno demandan 8 A en conjunto.",
      incorrect: "Multiplica la corriente pico por la cantidad de actuadores.",
    },
  },
  {
    id: "five-volt-rail",
    prompt:
      "La SBC y los sensores comparten el riel de 5 V. ¿Qué capacidad elegirías con margen razonable?",
    options: [
      { id: "5v-5a", label: "5 A" },
      { id: "5v-5-5a", label: "5.5 A" },
      { id: "5v-8a", label: "8 A" },
      { id: "5v-15a", label: "15 A" },
    ],
    correctOptionId: "5v-8a",
    feedback: {
      correct:
        "La demanda pico suma 5.5 A; un regulador de 8 A deja margen para transitorios y evita operar al límite.",
      incorrect:
        "Suma SBC y sensores y añade margen: el regulador no debería trabajar continuamente en su límite.",
    },
  },
  {
    id: "six-volt-rail",
    prompt:
      "Los cuatro servos comparten el riel de 6 V. ¿Qué capacidad nominal es adecuada?",
    options: [
      { id: "6v-1-2a", label: "1.2 A" },
      { id: "6v-4a", label: "4 A" },
      { id: "6v-4-8a", label: "4.8 A exactos" },
      { id: "6v-6a", label: "6 A" },
    ],
    correctOptionId: "6v-6a",
    feedback: {
      correct:
        "La demanda pico es 4 × 1.2 A = 4.8 A; 6 A aporta un margen práctico.",
      incorrect:
        "Calcula la demanda conjunta de los cuatro servos y evita dimensionar exactamente al límite.",
    },
  },
  {
    id: "battery",
    prompt:
      "¿Qué batería propuesta cubre el bus de 12 V nominal y ofrece suficiente descarga para los picos?",
    options: [
      { id: "battery-2s-2200-10c", label: "2S · 7.4 V · 2200 mAh · 10C" },
      { id: "battery-3s-5000-20c", label: "3S · 11.1 V · 5000 mAh · 20C" },
      { id: "battery-4s-1000-5c", label: "4S · 14.8 V · 1000 mAh · 5C" },
      { id: "battery-9v", label: "Batería rectangular de 9 V" },
    ],
    correctOptionId: "battery-3s-5000-20c",
    feedback: {
      correct:
        "Una 3S entrega 11.1 V nominales y 5 Ah × 20C ofrece holgura de descarga para este caso.",
      incorrect:
        "Revisa tensión nominal, capacidad y corriente de descarga: I máx. ≈ capacidad (Ah) × C.",
    },
  },
] as const satisfies readonly E3AQuestion[];

export const E3A_CHALLENGE = {
  id: "E3A",
  title: "Alimenta el robot",
  subtitle: "Dimensiona los rieles y defiende una arquitectura estable.",
  attempts: "unlimited",
  completionRule: "all_steps",
  steps: {
    dimensioning: {
      id: "dimensioning",
      title: "Consumo y dimensionamiento",
      statement:
        "Trabaja con consumos pico. Selecciona capacidades que cubran la demanda sin operar permanentemente al límite.",
      hints: [
        "Multiplica la corriente pico por la cantidad de dispositivos, agrupa las cargas por voltaje y revisa la descarga de la batería con Ah × C.",
      ],
      asset: {
        src: "/challenges/electronics/e3a/electronics_E3A_S1_robot_power_table.png",
        sourceFilename: "electronics_E3A_S1_robot_power_table.png",
        alt: "Tabla de consumos pico del robot para motores, microcomputador, servos y sensores.",
      } satisfies E3AAsset,
    },
    "rail-separation": {
      id: "rail-separation",
      title: "Separa potencia y procesamiento",
      statement:
        "Explica por qué conviene separar los rieles de motores, lógica y servos, aunque compartan una referencia de tierra adecuada.",
      minimumCharacters: 120,
      rubricConcepts: ["ruido", "transitorios", "brownouts o caídas", "estabilidad"],
      hints: [
        "Relaciona los transitorios de arranque del motor con ruido, caídas o brownouts y la estabilidad de la electrónica de procesamiento.",
      ],
      asset: {
        src: "/challenges/electronics/e3a/electronics_E3A_S2_power_architecture_blank.svg",
        sourceFilename: "electronics_E3A_S2_power_architecture_blank.svg",
        alt: "Arquitectura con una batería y tres rieles separados: motores a 12 V, lógica a 5 V y servos a 6 V.",
      } satisfies E3AAsset,
    },
  },
} as const;

export function evaluateE3A(
  submission: E3ASubmission
): E3AEvaluation {
  if (submission.stepId === "dimensioning") {
    const items = E3A_QUESTIONS.map((question) => {
      const answer = submission.answers[question.id];
      const isAnswered = typeof answer === "string" && answer.length > 0;
      const isCorrect = answer === question.correctOptionId;
      return {
        id: question.id,
        isAnswered,
        isCorrect,
        feedback: isCorrect
          ? question.feedback.correct
          : question.feedback.incorrect,
      };
    });
    const score = items.filter((item) => item.isCorrect).length;
    const isComplete = score === E3A_QUESTIONS.length;
    return {
      stepId: submission.stepId,
      isComplete,
      isCorrect: isComplete,
      score,
      maxScore: E3A_QUESTIONS.length,
      feedback: isComplete
        ? "Dimensionamiento correcto. Tus rieles cubren los picos con margen."
        : `Hay ${E3A_QUESTIONS.length - score} decisión${score === E3A_QUESTIONS.length - 1 ? "" : "es"} por revisar.`,
      items,
    };
  }

  const explanation = submission.explanation.trim();
  const minimum = E3A_CHALLENGE.steps["rail-separation"].minimumCharacters;
  const isComplete = explanation.length >= minimum;
  return {
    stepId: submission.stepId,
    isComplete,
    isCorrect: null,
    score: isComplete ? 1 : 0,
    maxScore: 1,
    feedback: isComplete
      ? "Respuesta registrada para revisión. Se evaluará la claridad de tu criterio técnico."
      : `Desarrolla tu explicación con al menos ${minimum} caracteres.`,
    items: [
      {
        id: "separation-explanation",
        isAnswered: explanation.length > 0,
        isCorrect: null,
        feedback: isComplete
          ? "La respuesta cumple la extensión mínima y queda disponible para revisión manual."
          : `Faltan ${Math.max(0, minimum - explanation.length)} caracteres.`,
      },
    ],
  };
}

export function createE3ADraft(stepId: E3AStepId): E3ASubmission {
  return stepId === "dimensioning"
    ? { stepId, answers: {} }
    : { stepId, explanation: "" };
}

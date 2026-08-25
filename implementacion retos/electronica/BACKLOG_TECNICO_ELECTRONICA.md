# Backlog técnico — Rama de Electrónica
## Prueba de ingreso · Semillero de Robótica
**Base funcional:** `03-electronica_IMPLEMENTACION_FINAL.md`

**Objetivo:** traducir la especificación pedagógica de Electrónica a tareas directamente implementables por Codex/desarrollo.

---

# 1. Alcance

Implementar los 7 nodos:

- E0 — Fundamentos eléctricos y símbolos
- E1A — Lee un plano eléctrico
- E1B — Habla con el microcontrolador
- E2 — Del problema al esquema electrónico
- E3A — Alimenta el robot
- E3B — Debuggea el hardware
- E4 — Electrónica libre

La implementación debe registrar intentos, pistas, tiempo, respuestas y evidencias.

---

# 2. Stack asumido

- Next.js
- TypeScript
- Tailwind CSS
- React Hook Form
- Zod
- Supabase/PostgreSQL
- Supabase Storage
- Framer Motion
- SVG interactivo para diagramas
- opcional: React Flow para E2

---

# 3. Arquitectura de contenido

Los retos NO deben hardcodearse completamente en JSX.

## 3.1 Modelo base

```ts
type ChallengeType =
  | "single_choice"
  | "multiple_choice"
  | "numeric"
  | "matching"
  | "visual_select"
  | "open_text"
  | "evidence_upload"
  | "open_project";

interface ElectronicsChallenge {
  id: string;
  nodeId: "E0" | "E1A" | "E1B" | "E2" | "E3A" | "E3B" | "E4";
  stepId: string;
  title: string;
  type: ChallengeType;
  statement: string;
  asset?: string;
  options?: ChallengeOption[];
  expected?: unknown;
  tolerance?: number;
  unit?: string;
  hints: string[];
  feedback: {
    correct: string;
    incorrect: string;
  };
  metadata?: Record<string, unknown>;
}
```

## 3.2 Attempt

```ts
interface ChallengeAttempt {
  id: string;
  candidateId: string;
  nodeId: string;
  stepId: string;
  attemptNumber: number;
  startedAt: string;
  submittedAt: string;
  durationSeconds: number;
  answer: unknown;
  isCorrect: boolean | null;
  hintsUsed: number;
}
```

---

# 4. Componentes comunes

## EL-C01 — ElectronicsNodeShell

**Responsabilidad**
- cabecera del nodo;
- progreso interno;
- navegación entre pasos;
- autosave;
- estado de guardado;
- botón de pista.

**Props**
```ts
nodeId
title
currentStep
totalSteps
children
```

**Criterios de aceptación**
- [ ] muestra `paso actual / total`;
- [ ] conserva progreso al recargar;
- [ ] registra entrada/salida del paso;
- [ ] muestra `Guardando...` / `Guardado`;
- [ ] nunca pierde una respuesta abierta escrita.

---

## EL-C02 — HintPanel

- [ ] muestra una pista a la vez;
- [ ] no permite saltar directamente a Pista 3;
- [ ] registra cada pista abierta;
- [ ] no bloquea reintentos.

---

## EL-C03 — ChoiceChallenge

- [ ] soporta single/multiple choice;
- [ ] feedback inmediato configurable;
- [ ] registra cada envío;
- [ ] reintentos ilimitados.

---

## EL-C04 — NumericChallenge

- [ ] recibe valor y unidad;
- [ ] normaliza A/mA, V/mV, W/mW cuando corresponda;
- [ ] acepta tolerancias;
- [ ] evita comparar strings literalmente.

---

## EL-C05 — MatchingChallenge

- [ ] drag & drop desktop;
- [ ] alternativa accesible por selección en móvil/teclado;
- [ ] orden de tarjetas aleatorio;
- [ ] registra mapping enviado.

---

## EL-C06 — InteractiveSchematic

- [ ] renderiza SVG;
- [ ] soporta hotspots;
- [ ] soporta selección de bloque;
- [ ] opcionalmente dibuja conexión;
- [ ] no depende solo de color.

---

## EL-C07 — EvidenceUploader

- [ ] imágenes;
- [ ] PDF;
- [ ] video;
- [ ] ZIP/código cuando esté permitido;
- [ ] preview;
- [ ] progreso;
- [ ] eliminar/reemplazar;
- [ ] almacenamiento privado.

---

# 5. EPIC E0 — Fundamentos eléctricos

## E0-US01 — Shell secuencial de 5 pasos

**Como** aspirante

**quiero** avanzar por cinco minirretos

**para** demostrar fundamentos antes de leer esquemas.

**Pasos**
1. Voltaje
2. Corriente
3. Polaridad
4. Ley de Ohm y potencia
5. Símbolos

**Aceptación**
- [ ] barra 1/5 a 5/5;
- [ ] cada subpaso guarda su propia analítica;
- [ ] sólo completa E0 cuando los cinco fueron resueltos.

---

## E0-US02 — Más o menos voltaje

**Asset**
`electronics_E0_S1_voltage_cases.svg`

**Preguntas**
- LED ~2 V alimentado con 5 V sin limitación.
- Motor 12 V alimentado con 3 V.
- Sensor 3.3 V alimentado con 12 V.

**Aceptación**
- [ ] tres tarjetas independientes;
- [ ] opciones en orden aleatorio;
- [ ] feedback por tarjeta;
- [ ] pistas 1–3;
- [ ] resultado final correcto requerido.

---

## E0-US03 — Más o menos corriente

**Asset**
`electronics_E0_S2_current_cases.svg`

**Preguntas**
- fuente 5 V/2 A + carga 300 mA;
- servos 4 A + regulador 1 A.

**Aceptación**
- [ ] texto evita la idea incorrecta de que una fuente “inyecta” su corriente máxima;
- [ ] se registra si el usuario corrige esa concepción tras feedback.

---

## E0-US04 — Polaridad

**Asset**
`electronics_E0_S3_polarity_examples.svg`

**Interacción**
- selección múltiple de componentes sensibles a polaridad;
- pregunta sobre LED invertido.

**Aceptación**
- [ ] incluye LED, batería, capacitor electrolítico y resistencia;
- [ ] la resistencia es distractor;
- [ ] no se marca como terminado hasta resolver ambas preguntas.

---

## E0-US05 — Ohm y potencia

**Asset**
`electronics_E0_S4_ohm_power_cards.svg`

**Valores**
- R = 100 Ω
- V = 5 V
- I esperado = 0.05 A = 50 mA
- P esperada = 0.25 W

**Aceptación**
- [ ] normaliza 50 mA y 0.05 A como equivalentes;
- [ ] tolerancia I ±0.005 A;
- [ ] tolerancia P ±0.03 W.

---

## E0-US06 — Matching de símbolos

**Asset**
`electronics_E0_S5_symbol_match.svg`

**Elementos**
- resistencia
- LED
- interruptor
- fuente DC/batería
- GND
- motor DC
- microcontrolador
- sensor
- capacitor polarizado

**Aceptación**
- [ ] 9 símbolos;
- [ ] matching arrastrable;
- [ ] mínimo 7/9 para primer intento;
- [ ] en reintento debe completar 9/9;
- [ ] aleatorizar nombres.

---

# 6. EPIC E1A — Leer un plano eléctrico

## E1A-US01 — Interpretación abierta

**Asset**
`electronics_E1A_S1_robot_schematic_simple.svg`

**Prompt**
Explicar:
1. qué hace;
2. flujo de alimentación;
3. función de bloques.

**Aceptación**
- [ ] textarea con autosave;
- [ ] mínimo 120 caracteres;
- [ ] guarda respuesta completa para reviewer;
- [ ] no autocorrige semánticamente en MVP.

---

## E1A-US02 — Función de bloques

**Asset**
`electronics_E1A_S2_robot_schematic_labeled_blank.svg`

**Funciones**
- fuente;
- regulación;
- medición;
- procesamiento;
- driver;
- actuación;
- indicador.

**Aceptación**
- [ ] click sobre bloque;
- [ ] panel lateral con opciones;
- [ ] todos los bloques deben quedar asociados.

---

## E1A-US03 — Banco de 3 fallas

**Assets**
- `electronics_E1A_S3_fault_case_led.svg`
- `electronics_E1A_S4_fault_case_reverse_polarity.svg`
- `electronics_E1A_S5_fault_case_short.svg`

**Aceptación**
- [ ] permite señalar visualmente;
- [ ] también pregunta causa;
- [ ] 3/3 casos resueltos para completar;
- [ ] registra clicks erróneos.

---

# 7. EPIC E1B — Datasheet + interfaces

## E1B-US01 — Visor de datasheet

**Asset**
`electronics_E1B_S1_esp32_datasheet_excerpt.pdf`

**Aceptación**
- [ ] panel lateral/visor;
- [ ] páginas acotadas;
- [ ] zoom;
- [ ] registra apertura y tiempo visible;
- [ ] preguntas siguen visibles o accesibles sin perder contexto.

---

## E1B-US02 — Preguntas de datasheet

Preguntas:
- nivel lógico;
- ADC;
- SDA/SCL;
- qué revisar antes de conectar sensor.

**Aceptación**
- [ ] 3 cerradas + 1 abierta;
- [ ] respuesta abierta guardada para reviewer.

---

## E1B-US03 — Matching de interfaces

**Asset**
`electronics_E1B_S2_esp32_board_reference.svg`

Mappings:
- LED/relé → GPIO
- potenciómetro → ADC
- motor driver → PWM
- GPS TX/RX → UART
- IMU SDA/SCL → I²C
- microSD MOSI/MISO/SCK → SPI

**Aceptación**
- [ ] 6 mappings;
- [ ] feedback por conjunto, no revelar todo al primer error;
- [ ] pregunta final de compatibilidad 5 V/3.3 V.

---

# 8. EPIC E2 — Del problema al esquema

## E2-US01 — Brief del robot

**Asset**
`electronics_E2_S1_problem_card_mobile_obstacle.png`

Debe pedir:
- detectar obstáculo frontal;
- detectar borde;
- 2 ruedas;
- señal visual;
- MCU.

---

## E2-US02 — Lista justificada de componentes

Campos repetibles:
```ts
{
  category,
  componentName,
  purpose,
  justification
}
```

**Aceptación**
- [ ] añadir/quitar fila;
- [ ] mínimo: MCU, sensor frontal, sensor de borde, driver, actuadores, indicador, fuente;
- [ ] no imponer marcas/modelos concretos;
- [ ] autosave.

---

## E2-US03 — Esquema

MVP:
- uploader imagen/PDF;
- canvas opcional.

Fase 2:
- canvas React Flow/SVG.

**Aceptación MVP**
- [ ] admite PNG/JPG/PDF;
- [ ] preview;
- [ ] obligatorio antes de enviar.

---

## E2-US04 — Explicación de arquitectura

Prompt:
`sensor → procesamiento → decisión → driver → actuador`

**Aceptación**
- [ ] texto mínimo configurable;
- [ ] rúbrica manual 5 criterios x 2 puntos.

---

# 9. EPIC E3A — Alimentación

## E3A-US01 — Tabla de consumos

Datos:
- motores: 12 V, 4 A pico c/u
- SBC: 5 V, 5 A
- servos: 6 V, 1.2 A pico c/u
- sensores: 5 V, 0.5 A total

**Aceptación**
- [ ] tabla responsive;
- [ ] consumos pico claramente identificados.

---

## E3A-US02 — Dimensionamiento

Preguntas:
- mayor corriente pico → motores, 8 A;
- rail 5 V → 8 A;
- rail 6 V → 6 A;
- batería → 3S, 11.1 V, 5000 mAh, 20C.

**Aceptación**
- [ ] opciones configurables;
- [ ] feedback técnico.

---

## E3A-US03 — Separación potencia/procesamiento

Respuesta abierta.

Rubricar:
- ruido;
- transitorios;
- brownouts/caídas;
- estabilidad.

---

# 10. EPIC E3B — Debug de hardware

## E3B-US01 — Laboratorio visual

**Assets**
- `electronics_E3B_S1_driver_motor_fault.svg`
- `electronics_E3B_S2_measurements_panel.png`

**Aceptación**
- [ ] muestra esquema;
- [ ] pestaña observaciones;
- [ ] pestaña mediciones;
- [ ] no revela la falla visualmente con color de error.

---

## E3B-US02 — Diagnóstico

Correcto:
- GND lógico y GND potencia sin referencia común.

**Aceptación**
- [ ] causa;
- [ ] corrección;
- [ ] explicación abierta;
- [ ] pistas escalonadas.

---

# 11. EPIC E4 — Electrónica libre

## E4-US01 — Formulario de proyecto

Campos:
- título;
- problema;
- funcionamiento;
- lista componentes;
- reflexión final.

## E4-US02 — Evidencias

Obligatorias:
- esquema/diagrama;
- foto/captura/video;
- código si aplica.

Opcionales:
- Wokwi;
- Tinkercad;
- KiCad;
- Proteus;
- PCB;
- BOM.

**Aceptación**
- [ ] envío múltiple;
- [ ] enlaces;
- [ ] archivos privados;
- [ ] reviewer puede abrir todo.

---

# 12. Reviewer — Electrónica

## EL-R01 — Vista de progreso

Mostrar:
- nodo máximo;
- intentos;
- pistas;
- tiempo;
- open responses;
- evidencias.

## EL-R02 — Rúbricas

### E2
5 criterios x 0–2.

### E4
5 criterios x 0–2.

**Aceptación**
- [ ] notas privadas;
- [ ] guardar borrador;
- [ ] marcar reviewed.

---

# 13. QA mínimo

## E0
- [ ] unidades equivalentes funcionan;
- [ ] símbolos accesibles;
- [ ] no hay respuestas dependientes de orden.

## E1A
- [ ] SVG escala correctamente;
- [ ] hotspots siguen alineados responsive.

## E1B
- [ ] PDF abre sin descargar;
- [ ] datasheet sigue legible móvil/desktop.

## E2/E4
- [ ] uploads grandes muestran progreso;
- [ ] recuperación después de refresh.

## E3A
- [ ] valores coinciden con configuración;
- [ ] no hay ambigüedad entre nominal/pico.

## E3B
- [ ] el diagrama no delata la respuesta por estilo;
- [ ] las mediciones son consistentes con la falla.

---

# 14. Fases de desarrollo

## Sprint EL-01 — Base + E0
- componentes comunes;
- modelo de datos;
- E0 completo;
- analytics de intentos/pistas.

## Sprint EL-02 — E1A + E1B
- SVG interactivo;
- datasheet viewer;
- matching interfaces.

## Sprint EL-03 — E3A + E3B
- casos de ingeniería;
- laboratorio de diagnóstico.

## Sprint EL-04 — E2 + E4
- uploads;
- formularios abiertos;
- rúbricas reviewer.

## Sprint EL-05 — Pulido
- responsive;
- accesibilidad;
- animaciones;
- QA;
- integración al árbol global.

---

# 15. Definition of Done de la rama

- [ ] 7 nodos implementados;
- [ ] E0 contiene sus 5 minirretos;
- [ ] E1A contiene interpretación + bloques + 3 fallas;
- [ ] E1B contiene datasheet + interfaces;
- [ ] E2 acepta selección libre y esquema propio;
- [ ] E3A dimensiona potencia;
- [ ] E3B diagnostica GND común;
- [ ] E4 acepta proyecto libre;
- [ ] reintentos y pistas quedan registrados;
- [ ] evidencia es privada;
- [ ] reviewer puede revisar respuestas abiertas;
- [ ] árbol desbloquea nodos correctamente;
- [ ] todos los assets tienen nombre estable;
- [ ] desktop y mobile funcionales;
- [ ] accesibilidad básica WCAG AA.

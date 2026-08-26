# Software

Color de rama: `#7B7FE8` · Lógica, código y arquitectura.

## Progresión

```text
S0 — Haz pensar al robot (Fundamentos)
├── S1A — Código que decide (Subhabilidad)
└── S1B — Rompe el bug (Subhabilidad)
        ↓ (con S1A o S1B completado)
    S2 — El robot tiene estados (Aplicación)
        ├── S3A — Haz que los sistemas hablen (Profundización)
        └── S3B — Divide un robot en piezas de software (Profundización)
                ↓ (con S3A o S3B completado)
            S4 — Software libre (Reto libre)
```

7 nodos. S2 conecta conceptualmente con C4 (Control); S3A con E2 y SI3B; S3B
con SI4 — son referencias de la spec original para conexiones híbridas
futuras, no bloquean nada hoy.

## Resumen

| ID | Título | Nivel | Requiere | Desbloquea |
|---|---|---|---|---|
| S0 | Haz pensar al robot | Fundamentos | — | S1A, S1B |
| S1A | Código que decide | Subhabilidad | S0 | S2 |
| S1B | Rompe el bug | Subhabilidad | S0 | S2 |
| S2 | El robot tiene estados | Aplicación | S1A o S1B | S3A, S3B |
| S3A | Haz que los sistemas hablen | Profundización | S2 | S4 |
| S3B | Divide un robot en piezas de software | Profundización | S2 | S4 |
| S4 | Software libre | Reto libre | S3A o S3B | — |

---

## S0 — Haz pensar al robot

**Estado en la app:** Fundamentos · sin requisitos · desbloquea S1A, S1B

### Ya definido

- **Mini-descripción actual (panel de debug):** "Guía a un robot de A a B
  usando bloques de avanzar, girar, condicionales y repeticiones."
- **De la especificación original:**
  - Reto: robot debe llegar de A a B usando bloques: avanzar, girar, if,
    repeat.
  - Nota explícita de la spec: "la estética debe ser técnica, no infantil"
    (aunque use bloques, evitar look de Scratch para niños).

### Por definir

- **Tipo de reto sugerido:** G (interacción visual: armar bloques)
- **Enunciado final:** _(completar)_
- **Recursos que se muestran:** _(completar — ¿qué mapa/grilla A→B?)_
- **Opciones / respuesta correcta:** _(completar — ¿una única solución válida o varias?)_
- **Pistas:**
  - Pista 1: _(completar)_
  - Pista 2: _(completar)_
  - Pista 3: _(completar)_
- **Feedback si acierta:** _(completar)_
- **Feedback si no acierta:** _(completar)_
- **Intentos máximos:** _(completar — sugerido: ilimitado)_
- **Notas para el evaluador:** _(completar)_

---

## S1A — Código que decide

**Estado en la app:** Subhabilidad · requiere S0 · desbloquea S2 (junto con S1B, basta uno)

### Ya definido

- **Mini-descripción actual (panel de debug):** "En un editor de código,
  procesa mediciones de un sensor de distancia y decide avanzar, reducir
  velocidad o detener el robot."
- **De la especificación original:**
  - Reto: editor Python/C++. Ejemplo: "Procesa cinco mediciones de distancia y
    decide avanzar, reducir velocidad o detener." Tests automáticos.

### Por definir

- **Tipo de reto sugerido:** F (editor de código con tests)
- **Enunciado final:** _(completar)_
- **Recursos que se muestran:** _(completar — código base/starter en qué lenguaje?)_
- **Tests / criterio de corrección:** _(completar)_
- **Pistas:**
  - Pista 1: _(completar)_
  - Pista 2: _(completar)_
  - Pista 3: _(completar)_
- **Feedback si acierta:** _(completar)_
- **Feedback si no acierta:** _(completar)_
- **Intentos máximos:** _(completar — sugerido: ilimitado)_
- **Notas para el evaluador:** _(completar)_

---

## S1B — Rompe el bug

**Estado en la app:** Subhabilidad · requiere S0 · desbloquea S2 (junto con S1A, basta uno)

### Ya definido

- **Mini-descripción actual (panel de debug):** "Encuentra y corrige errores
  en un código con bugs, y valida tu solución con tests."
- **De la especificación original:**
  - Reto: código con varios errores; debe identificar, modificar y ejecutar
    tests.

### Por definir

- **Tipo de reto sugerido:** F (editor de código con tests)
- **Enunciado final:** _(completar)_
- **Recursos que se muestran:** _(completar — código con bug(s) concreto(s), ¿cuáles exactamente?)_
- **Tests / criterio de corrección:** _(completar)_
- **Pistas:**
  - Pista 1: _(completar)_
  - Pista 2: _(completar)_
  - Pista 3: _(completar)_
- **Feedback si acierta:** _(completar)_
- **Feedback si no acierta:** _(completar)_
- **Intentos máximos:** _(completar — sugerido: ilimitado)_
- **Notas para el evaluador:** _(completar)_

---

## S2 — El robot tiene estados

**Estado en la app:** Aplicación · requiere S1A o S1B · desbloquea S3A, S3B

### Ya definido

- **Mini-descripción actual (panel de debug):** "Construye una máquina de
  estados (buscar, aproximar, interactuar, volver) con condiciones y
  transiciones."
- **De la especificación original:**
  - Reto: construir `SEARCH → APPROACH → INTERACT → RETURN`, agregando
    condiciones, eventos, transiciones.
  - Conecta con: C4 (Control) — referencia conceptual.

### Por definir

- **Tipo de reto sugerido:** G (interacción visual: construir el diagrama de estados) o F (código)
- **Enunciado final:** _(completar)_
- **Recursos que se muestran:** _(completar)_
- **Opciones / respuesta correcta:** _(completar)_
- **Pistas:**
  - Pista 1: _(completar)_
  - Pista 2: _(completar)_
  - Pista 3: _(completar)_
- **Feedback si acierta:** _(completar)_
- **Feedback si no acierta:** _(completar)_
- **Intentos máximos:** _(completar — sugerido: ilimitado)_
- **Notas para el evaluador:** _(completar)_

---

## S3A — Haz que los sistemas hablen

**Estado en la app:** Profundización · requiere S2 · desbloquea S4 (junto con S3B, basta uno)

### Ya definido

- **Mini-descripción actual (panel de debug):** "Procesa mensajes de sensores
  y genera decisiones usando conceptos de comunicación (serial, JSON,
  pub/sub)."
- **De la especificación original:**
  - Reto: procesar mensajes de sensores y generar decisiones. Puede
    introducir serial, JSON, pub/sub, sockets conceptuales.
  - Conecta con: E2 (Electrónica), SI3B (Sistemas) — referencia conceptual.

### Por definir

- **Tipo de reto sugerido:** F (editor de código) o G (interacción visual)
- **Enunciado final:** _(completar)_
- **Recursos que se muestran:** _(completar — ¿formato de mensaje de ejemplo?)_
- **Tests / criterio de corrección:** _(completar)_
- **Pistas:**
  - Pista 1: _(completar)_
  - Pista 2: _(completar)_
  - Pista 3: _(completar)_
- **Feedback si acierta:** _(completar)_
- **Feedback si no acierta:** _(completar)_
- **Intentos máximos:** _(completar — sugerido: ilimitado)_
- **Notas para el evaluador:** _(completar)_

---

## S3B — Divide un robot en piezas de software

**Estado en la app:** Profundización · requiere S2 · desbloquea S4 (junto con S3A, basta uno)

### Ya definido

- **Mini-descripción actual (panel de debug):** "Divide un robot en piezas de
  software (cámara, detector, planner, controlador) y propón nodos, mensajes y
  flujo."
- **De la especificación original:**
  - Reto: dado cámara, detector, planner, controlador, motores, debe proponer
    nodos, mensajes y flujo. Puede introducir ROS 2 conceptualmente.
  - Conecta con: SI4 (Sistemas) — referencia conceptual.

### Por definir

- **Tipo de reto sugerido:** G (interacción visual: construir el diagrama de nodos) o I (respuesta abierta)
- **Enunciado final:** _(completar)_
- **Recursos que se muestran:** _(completar)_
- **Opciones / respuesta correcta:** _(completar — ¿se valida una arquitectura "correcta" o se evalúa manualmente?)_
- **Pistas:**
  - Pista 1: _(completar)_
  - Pista 2: _(completar)_
  - Pista 3: _(completar)_
- **Feedback si acierta:** _(completar)_
- **Feedback si no acierta:** _(completar)_
- **Intentos máximos:** _(completar — sugerido: ilimitado)_
- **Notas para el evaluador:** _(completar — probablemente necesita revisión humana)_

---

## S4 — Software libre

**Estado en la app:** Reto libre · requiere S3A o S3B · no desbloquea nada más en esta rama

### Ya definido

- **Mini-descripción actual (panel de debug):** "Crea una herramienta de
  software útil para un robot: nodo, controlador, GUI, simulador o
  algoritmo."
- **De la especificación original:**
  - Enunciado: "Crea una herramienta de software útil para un robot."
  - Ejemplos: nodo, controlador, GUI, simulador, visualizador, algoritmo.

### Por definir

- **Tipo de reto sugerido:** J (reto libre, múltiples evidencias)
- **Enunciado final:** _(completar)_
- **Qué debe entregar exactamente:** _(completar)_
- **Pistas:** _(completar, opcional)_
- **Feedback al entregar:** _(completar)_
- **Notas para el evaluador:** _(completar)_

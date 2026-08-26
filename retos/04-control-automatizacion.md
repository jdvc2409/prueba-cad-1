# Control y Automatización

Color de rama: `#17A2C9` · Haz que un sistema persiga su referencia.

## Progresión

```text
C0 — Persigue la referencia (Fundamentos)
├── C1A — Abierto o realimentado (Subhabilidad)
└── C1B — ¿Quién mide y quién actúa? (Subhabilidad)
        ↓ (con C1A o C1B completado)
    C2 — Domina el Kp (Aplicación interactiva)
        ├── C3A — Afina un PID (Profundización)
        └── C3B — Lee la respuesta (Profundización)
                ↓ (con C3A o C3B completado)
            C4 — Haz que el robot siga (Aplicación robótica)
                ↓
            C5 — Diagnostica el controlador (Evaluación crítica)
                ↓
            C6 — Control libre (Reto libre)
```

9 nodos — la rama más larga del árbol, porque cubre fundamentos,
experimentación y aplicación robótica directa en una sola línea continua
(C4 → C5 → C6, sin más bifurcaciones después de C2).

## Resumen

| ID | Título | Nivel | Requiere | Desbloquea |
|---|---|---|---|---|
| C0 | Persigue la referencia | Fundamentos | — | C1A, C1B |
| C1A | Abierto o realimentado | Subhabilidad | C0 | C2 |
| C1B | ¿Quién mide y quién actúa? | Subhabilidad | C0 | C2 |
| C2 | Domina el Kp | Aplicación interactiva | C1A o C1B | C3A, C3B |
| C3A | Afina un PID | Profundización | C2 | C4 |
| C3B | Lee la respuesta | Profundización | C2 | C4 |
| C4 | Haz que el robot siga | Aplicación robótica | C3A o C3B | C5 |
| C5 | Diagnostica el controlador | Evaluación crítica | C4 | C6 |
| C6 | Control libre | Reto libre | C5 | — |

---

## C0 — Persigue la referencia

**Estado en la app:** Fundamentos · sin requisitos · desbloquea C1A, C1B

### Ya definido

- **Mini-descripción actual (panel de debug):** "Un robot debe mantenerse a 50
  cm de un objetivo: decide qué debería hacer cuando la distancia cambia."
- **De la especificación original:**
  - Reto: un robot debe mantenerse a 50 cm; la interfaz cambia la distancia y
    pregunta qué debería hacer. Sin introducir formulación matemática todavía.

### Por definir

- **Tipo de reto sugerido:** G (interacción visual con simulación simple) o A (selección)
- **Enunciado final:** _(completar)_
- **Recursos que se muestran:** _(completar — ¿animación/simulación de qué tipo?)_
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

## C1A — Abierto o realimentado

**Estado en la app:** Subhabilidad · requiere C0 · desbloquea C2 (junto con C1B, basta uno)

### Ya definido

- **Mini-descripción actual (panel de debug):** "Compara control en lazo
  abierto y en lazo cerrado, y elige cuál usar para un posicionamiento
  preciso."
- **De la especificación original:**
  - Reto: comparar `Motor → tiempo → detener` contra
    `Encoder → controlador → motor`; elegir cuál usar para posicionamiento
    preciso.

### Por definir

- **Tipo de reto sugerido:** A (selección única) o E (matching escenario → tipo de lazo)
- **Enunciado final:** _(completar)_
- **Recursos que se muestran:** _(completar — ¿diagrama de los dos esquemas?)_
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

## C1B — ¿Quién mide y quién actúa?

**Estado en la app:** Subhabilidad · requiere C0 · desbloquea C2 (junto con C1A, basta uno)

### Ya definido

- **Mini-descripción actual (panel de debug):** "Clasifica sensores y
  actuadores (encoder, IMU, LiDAR, servo...) y decide cuáles cierran cada
  lazo."
- **De la especificación original:**
  - Reto: clasificar encoder, IMU, LiDAR, potenciómetro, motor, servo; luego
    seleccionar sensores adecuados para cerrar diferentes lazos.

### Por definir

- **Tipo de reto sugerido:** D (ordenar/clasificar) o E (matching sensor/actuador → lazo)
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

## C2 — Domina el Kp

**Estado en la app:** Aplicación interactiva · requiere C1A o C1B · desbloquea C3A, C3B

### Ya definido

- **Mini-descripción actual (panel de debug):** "Ajusta un control
  proporcional (Kp) en una simulación interactiva buscando respuesta rápida
  sin oscilación."
- **De la especificación original:**
  - Reto: simulación de posición con slider de `Kp`; debe conseguir respuesta
    rápida sin oscilación excesiva.
  - Métricas observables sugeridas: tiempo de establecimiento, overshoot, error.

### Por definir

- **Tipo de reto sugerido:** G (interacción visual con slider en vivo)
- **Enunciado final:** _(completar)_
- **Recursos que se muestran:** _(completar — parámetros del sistema simulado: masa, fricción, referencia)_
- **Opciones / respuesta correcta:** _(completar — ¿rango de Kp aceptable? ¿umbral de overshoot/tiempo de establecimiento?)_
- **Pistas:**
  - Pista 1: _(completar)_
  - Pista 2: _(completar)_
  - Pista 3: _(completar)_
- **Feedback si acierta:** _(completar)_
- **Feedback si no acierta:** _(completar)_
- **Intentos máximos:** _(completar — sugerido: ilimitado)_
- **Notas para el evaluador:** _(completar)_

---

## C3A — Afina un PID

**Estado en la app:** Profundización · requiere C2 · desbloquea C4 (junto con C3B, basta uno)

### Ya definido

- **Mini-descripción actual (panel de debug):** "Ante error estacionario,
  oscilaciones o ruido, ajusta o selecciona las ganancias Kp, Ki y Kd
  adecuadas."
- **De la especificación original:**
  - Casos a cubrir: error estacionario, oscilaciones, respuesta lenta, ruido.
  - Debe ajustar o seleccionar modificaciones de Kp, Ki, Kd.

### Por definir

- **Tipo de reto sugerido:** E (matching síntoma → ajuste de ganancia) o G (sliders interactivos)
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

## C3B — Lee la respuesta

**Estado en la app:** Profundización · requiere C2 · desbloquea C4 (junto con C3A, basta uno)

### Ya definido

- **Mini-descripción actual (panel de debug):** "A partir de una gráfica de
  respuesta, identifica tiempo de subida, overshoot, error estacionario y
  estabilidad."
- **De la especificación original:**
  - Reto: a partir de gráfica de referencia y salida, identificar tiempo de
    subida, overshoot, error estacionario, estabilidad, asentamiento.

### Por definir

- **Tipo de reto sugerido:** G (interacción visual sobre la gráfica) o A/E (selección/matching de valores leídos)
- **Enunciado final:** _(completar)_
- **Recursos que se muestran:** _(completar — ¿qué gráfica exacta, con qué forma de respuesta?)_
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

## C4 — Haz que el robot siga

**Estado en la app:** Aplicación robótica · requiere C3A o C3B · desbloquea C5

### Ya definido

- **Mini-descripción actual (panel de debug):** "Programa las velocidades de
  motor de un robot diferencial a partir del error de seguimiento."
- **De la especificación original:**
  - Reto: robot diferencial sigue línea o referencia; debe producir
    velocidades de motores a partir del error.
  - Ejemplo de código dado:
    ```python
    error = left - right
    correction = kp * error
    left_motor = base - correction
    right_motor = base + correction
    ```
  - Conecta con: E2 (Electrónica), S1A y S2 (Software) — referencia
    conceptual.

### Por definir

- **Tipo de reto sugerido:** F (editor de código con tests)
- **Enunciado final:** _(completar)_
- **Recursos que se muestran:** _(completar — código base/starter, datos de entrada de ejemplo)_
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

## C5 — Diagnostica el controlador

**Estado en la app:** Evaluación crítica · requiere C4 · desbloquea C6

### Ya definido

- **Mini-descripción actual (panel de debug):** "Compara tres respuestas de
  control (lenta, oscilatoria, rápida con overshoot leve) y justifica cuál
  implementarías."
- **De la especificación original:**
  - Reto: comparar tres respuestas — lenta, oscilatoria, rápida con pequeño
    overshoot — y seleccionar cuál implementaría, justificando.

### Por definir

- **Tipo de reto sugerido:** A (selección) + I (justificación abierta)
- **Enunciado final:** _(completar)_
- **Recursos que se muestran:** _(completar — las 3 gráficas/curvas de respuesta)_
- **Opciones / respuesta correcta:** _(completar)_
- **Pistas:**
  - Pista 1: _(completar)_
  - Pista 2: _(completar)_
  - Pista 3: _(completar)_
- **Feedback si acierta:** _(completar)_
- **Feedback si no acierta:** _(completar)_
- **Intentos máximos:** _(completar — sugerido: ilimitado)_
- **Notas para el evaluador:** _(completar — la justificación probablemente necesita revisión humana)_

---

## C6 — Control libre

**Estado en la app:** Reto libre · requiere C5 · no desbloquea nada más en esta rama

### Ya definido

- **Mini-descripción actual (panel de debug):** "Controla cualquier sistema
  que te interese y documenta sensor, controlador, actuador y resultado."
- **De la especificación original:**
  - Enunciado: "Controla cualquier sistema que quieras."
  - Herramientas posibles: MATLAB, Simulink, Python, Arduino, Gazebo, Webots,
    MuJoCo, hardware real.
  - Entrega esperada: Sistema → Variable controlada → Sensor → Controlador →
    Actuador → Resultado.

### Por definir

- **Tipo de reto sugerido:** J (reto libre, múltiples evidencias)
- **Enunciado final:** _(completar)_
- **Qué debe entregar exactamente:** _(completar)_
- **Pistas:** _(completar, opcional)_
- **Feedback al entregar:** _(completar)_
- **Notas para el evaluador:** _(completar)_

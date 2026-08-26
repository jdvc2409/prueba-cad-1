# Mecánica

Color de rama: `#4E7CA6` · Fuerzas, movimiento y mecanismos.

## Progresión

```text
M0 — Piensa como un mecanismo (Fundamentos)
├── M1A — Fuerzas que cuentan una historia (Subhabilidad)
└── M1B — Cambia velocidad por fuerza (Subhabilidad)
        ↓ (con M1A o M1B completado)
    M2 — Elige el actuador correcto (Aplicación)
        ├── M3A — ¿La estructura aguanta? (Profundización)
        └── M3B — Inventa el movimiento (Profundización)
                ↓ (con M3A o M3B completado)
            M4 — Mecánica libre (Reto libre)
```

7 nodos. Misma lógica de desbloqueo que Diseño/CAD: cada bifurcación se abre
con **cualquiera** de sus dos padres completado.

## Resumen

| ID | Título | Nivel | Requiere | Desbloquea |
|---|---|---|---|---|
| M0 | Piensa como un mecanismo | Fundamentos | — | M1A, M1B |
| M1A | Fuerzas que cuentan una historia | Subhabilidad | M0 | M2 |
| M1B | Cambia velocidad por fuerza | Subhabilidad | M0 | M2 |
| M2 | Elige el actuador correcto | Aplicación | M1A o M1B | M3A, M3B |
| M3A | ¿La estructura aguanta? | Profundización | M2 | M4 |
| M3B | Inventa el movimiento | Profundización | M2 | M4 |
| M4 | Mecánica libre | Reto libre | M3A o M3B | — |

---

## M0 — Piensa como un mecanismo

**Estado en la app:** Fundamentos · sin requisitos · desbloquea M1A, M1B

### Ya definido

- **Mini-descripción actual (panel de debug):** "Minijuegos visuales sobre
  engranajes, poleas, palancas y sentido de giro para poner a prueba tu
  intuición mecánica."
- **De la especificación original:**
  - Reto: minijuegos sobre engranajes, poleas, palancas, sentido de giro,
    ventaja mecánica, velocidad y torque.

### Por definir

- **Tipo de reto sugerido:** G (interacción visual) o A/B (selección)
- **Enunciado final:** _(completar — ¿cuántos "minijuegos", uno por concepto o uno combinado?)_
- **Recursos que se muestran:** _(completar — ¿imágenes/animaciones de qué mecanismos?)_
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

## M1A — Fuerzas que cuentan una historia

**Estado en la app:** Subhabilidad · requiere M0 · desbloquea M2 (junto con M1B, basta uno)

### Ya definido

- **Mini-descripción actual (panel de debug):** "Resuelve problemas visuales
  de reacción, momento, torque y brazo de palanca."
- **De la especificación original:**
  - Reto: resolver uno o varios problemas visuales sencillos de reacción,
    momento, torque, brazo de palanca.

### Por definir

- **Tipo de reto sugerido:** C (valor numérico) por problema, o A (selección)
- **Enunciado final:** _(completar)_
- **Recursos que se muestran:** _(completar — diagramas de cuerpo libre, con qué datos?)_
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

## M1B — Cambia velocidad por fuerza

**Estado en la app:** Subhabilidad · requiere M0 · desbloquea M2 (junto con M1A, basta uno)

### Ya definido

- **Mini-descripción actual (panel de debug):** "A partir de motor, velocidad
  y carga, elige una relación de reducción adecuada."
- **De la especificación original:**
  - Reto: a partir de motor, velocidad, torque y carga, elegir una reducción
    adecuada.
  - Interacción sugerida: sliders, selección, animación de velocidad/torque.

### Por definir

- **Tipo de reto sugerido:** G (interacción visual con sliders) o A (selección de relación correcta)
- **Enunciado final:** _(completar)_
- **Recursos que se muestran:** _(completar — ¿qué motor/carga concretos se dan como datos?)_
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

## M2 — Elige el actuador correcto

**Estado en la app:** Aplicación · requiere M1A o M1B · desbloquea M3A, M3B

### Ya definido

- **Mini-descripción actual (panel de debug):** "Dado un brazo que debe
  levantar una carga en un tiempo determinado, estima el torque, la velocidad
  y el motor/reducción necesarios."
- **De la especificación original:**
  - Ejemplo dado: "Un brazo levanta 2 kg a 0.25 m y debe completar el
    movimiento en 1.5 s."
  - Debe estimar: torque, velocidad, margen, motor/reducción.

### Por definir

- **Tipo de reto sugerido:** C (valor numérico: torque, velocidad) + A (selección de motor/reducción de una lista)
- **Enunciado final:** _(completar — ¿se usa el ejemplo del brazo tal cual o uno nuevo?)_
- **Recursos que se muestran:** _(completar — catálogo de motores/reducciones disponibles para elegir)_
- **Opciones / respuesta correcta:** _(completar — valores esperados + tolerancia, y motor correcto)_
- **Pistas:**
  - Pista 1: _(completar)_
  - Pista 2: _(completar)_
  - Pista 3: _(completar)_
- **Feedback si acierta:** _(completar)_
- **Feedback si no acierta:** _(completar)_
- **Intentos máximos:** _(completar — sugerido: ilimitado)_
- **Notas para el evaluador:** _(completar)_

---

## M3A — ¿La estructura aguanta?

**Estado en la app:** Profundización · requiere M2 · desbloquea M4 (junto con M3B, basta uno)

### Ya definido

- **Mini-descripción actual (panel de debug):** "Interpreta un análisis
  estructural (FEA): identifica restricciones, cargas, deformación y factor de
  seguridad."
- **De la especificación original:**
  - Reto: se entrega un FEA o escenario; debe identificar restricciones,
    cargas, deformación, factor de seguridad, y si la simulación es
    físicamente coherente.

### Por definir

- **Tipo de reto sugerido:** A/B (selección) sobre lectura de un resultado de FEA dado
- **Enunciado final:** _(completar)_
- **Recursos que se muestran:** _(completar — ¿captura de un software de FEA real, cuál?)_
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

## M3B — Inventa el movimiento

**Estado en la app:** Profundización · requiere M2 · desbloquea M4 (junto con M3A, basta uno)

### Ya definido

- **Mini-descripción actual (panel de debug):** "Propón o selecciona un
  mecanismo (husillo, cuatro barras, piñón-cremallera...) para lograr un
  movimiento específico."
- **De la especificación original:**
  - Reto: "Necesitas mover una plataforma 150 mm dentro de este volumen."
  - Puede seleccionar o proponer: husillo, cuatro barras, piñón-cremallera,
    actuador lineal, otro. Debe justificar.

### Por definir

- **Tipo de reto sugerido:** A (selección) + I (justificación abierta)
- **Enunciado final:** _(completar — ¿se mantiene el ejemplo de 150 mm o se cambia?)_
- **Recursos que se muestran:** _(completar — dibujo del volumen disponible)_
- **Opciones / respuesta correcta:** _(completar — ¿hay una única "mejor" opción o se acepta justificación razonada?)_
- **Pistas:**
  - Pista 1: _(completar)_
  - Pista 2: _(completar)_
  - Pista 3: _(completar)_
- **Feedback si acierta:** _(completar)_
- **Feedback si no acierta:** _(completar)_
- **Intentos máximos:** _(completar — sugerido: ilimitado)_
- **Notas para el evaluador:** _(completar)_

---

## M4 — Mecánica libre

**Estado en la app:** Reto libre · requiere M3A o M3B · no desbloquea nada más en esta rama

### Ya definido

- **Mini-descripción actual (panel de debug):** "Diseña o analiza un
  subsistema mecánico para un robot: transmisión, manipulador, suspensión o
  estructura."
- **De la especificación original:**
  - Enunciado: "Diseña o analiza un subsistema mecánico para un robot."
  - Ejemplos: transmisión, manipulador, suspensión, estructura, soporte,
    mecanismo.

### Por definir

- **Tipo de reto sugerido:** J (reto libre, múltiples evidencias)
- **Enunciado final:** _(completar)_
- **Qué debe entregar exactamente:** _(completar)_
- **Pistas:** _(completar, opcional)_
- **Feedback al entregar:** _(completar)_
- **Notas para el evaluador:** _(completar)_

# Diseño / CAD

Color de rama: `#3455D1` · Del plano a la pieza que existe.

## Progresión

```text
D0 — Del plano al modelo (Fundamentos)
├── D1A — Geometría bajo control (Subhabilidad)
└── D1B — El material también diseña (Subhabilidad)
        ↓ (con D1A o D1B completado)
    D2 — Diseña menos, logra más (Aplicación)
        ├── D3A — Diseña para imprimir (Profundización)
        └── D3B — Diseña para fabricar y ensamblar (Profundización)
                ↓ (con D3A o D3B completado)
            D4 — Diseña algo que exista (Reto libre)
```

7 nodos. D0 disponible desde el inicio. Cada bifurcación se desbloquea al
completar **cualquiera** de sus dos padres (no hace falta hacer los dos).

## Resumen

| ID | Título | Nivel | Requiere | Desbloquea |
|---|---|---|---|---|
| D0 | Del plano al modelo | Fundamentos | — | D1A, D1B |
| D1A | Geometría bajo control | Subhabilidad | D0 | D2 |
| D1B | El material también diseña | Subhabilidad | D0 | D2 |
| D2 | Diseña menos, logra más | Aplicación | D1A o D1B | D3A, D3B |
| D3A | Diseña para imprimir | Profundización | D2 | D4 |
| D3B | Diseña para fabricar y ensamblar | Profundización | D2 | D4 |
| D4 | Diseña algo que exista | Reto libre | D3A o D3B | — |

---

## D0 — Del plano al modelo

**Estado en la app:** Fundamentos · sin requisitos · desbloquea D1A, D1B

### Ya definido

- **Mini-descripción actual (panel de debug):** "Se entrega un plano técnico
  sencillo: modela la pieza, sube tu archivo o capturas y responde las
  dimensiones principales."
- **De la especificación original:**
  - Reto: se entrega un plano técnico sencillo; el candidato debe modelar la
    pieza en el CAD que prefiera, subir archivo o capturas, y responder
    dimensiones verificables.
  - Interacción sugerida: visor de plano, campos numéricos, carga de evidencia.
  - Evidencia sugerida: captura o archivo CAD + respuestas dimensionales.

### Por definir

- **Tipo de reto sugerido:** C (valor numérico) + H (subida de evidencia)
- **Enunciado final:** _(completar)_
- **Recursos que se muestran:** _(completar — ¿qué plano/pieza exacta se entrega? ¿imagen, PDF, link?)_
- **Opciones / respuesta correcta:** _(completar — ¿qué dimensiones exactas se piden y con qué tolerancia?)_
- **Pistas:**
  - Pista 1: _(completar)_
  - Pista 2: _(completar)_
  - Pista 3: _(completar)_
- **Feedback si acierta:** _(completar)_
- **Feedback si no acierta:** _(completar)_
- **Intentos máximos:** _(completar — sugerido: ilimitado)_
- **Notas para el evaluador:** _(completar)_

---

## D1A — Geometría bajo control

**Estado en la app:** Subhabilidad · requiere D0 · desbloquea D2 (junto con D1B, basta uno)

### Ya definido

- **Mini-descripción actual (panel de debug):** "Observa varios croquis e
  identifica cuál está completamente definido y qué restricción falta."
- **De la especificación original:**
  - Reto: se presentan varios croquis; debe identificar cuál está completamente
    definido, qué restricción falta y qué dimensión controla determinado cambio.
  - Interacción sugerida: selección, highlight visual, matching.

### Por definir

- **Tipo de reto sugerido:** A (selección única) o E (matching)
- **Enunciado final:** _(completar)_
- **Recursos que se muestran:** _(completar — ¿cuántos croquis, con qué imágenes?)_
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

## D1B — El material también diseña

**Estado en la app:** Subhabilidad · requiere D0 · desbloquea D2 (junto con D1A, basta uno)

### Ya definido

- **Mini-descripción actual (panel de debug):** "Asigna un material real a tu
  pieza (por ejemplo aluminio 6061) y calcula su masa, volumen y centro de masa."
- **De la especificación original:**
  - Reto: asignar un material definido (ej. `Aluminio 6061`) y responder masa,
    volumen, centro de masa y, opcionalmente, área superficial.
  - Evaluación: valores numéricos con tolerancia.

### Por definir

- **Tipo de reto sugerido:** C (valor numérico, uno por cada magnitud pedida)
- **Enunciado final:** _(completar)_
- **Recursos que se muestran:** _(completar — misma pieza de D0, u otra?)_
- **Opciones / respuesta correcta:** _(completar — valor esperado + unidad + tolerancia para masa/volumen/centro de masa/área)_
- **Pistas:**
  - Pista 1: _(completar)_
  - Pista 2: _(completar)_
  - Pista 3: _(completar)_
- **Feedback si acierta:** _(completar)_
- **Feedback si no acierta:** _(completar)_
- **Intentos máximos:** _(completar — sugerido: ilimitado)_
- **Notas para el evaluador:** _(completar)_

---

## D2 — Diseña menos, logra más

**Estado en la app:** Aplicación · requiere D1A o D1B · desbloquea D3A, D3B

### Ya definido

- **Mini-descripción actual (panel de debug):** "Reduce al menos 15% la masa
  de tu pieza sin modificar las superficies de montaje, y explica tus decisiones."
- **De la especificación original:**
  - Reto: "Reduce al menos 15 % la masa sin modificar las superficies de montaje."
  - Entrega esperada: captura antes, captura después, masa antes, masa después,
    explicación de las decisiones.

### Por definir

- **Tipo de reto sugerido:** H (evidencia: capturas antes/después) + C (masa antes/después) + I (explicación abierta)
- **Enunciado final:** _(completar)_
- **Recursos que se muestran:** _(completar)_
- **Opciones / respuesta correcta:** _(completar — ¿% mínimo exacto, cómo se valida "sin modificar superficies de montaje"?)_
- **Pistas:**
  - Pista 1: _(completar)_
  - Pista 2: _(completar)_
  - Pista 3: _(completar)_
- **Feedback si acierta:** _(completar)_
- **Feedback si no acierta:** _(completar)_
- **Intentos máximos:** _(completar — sugerido: ilimitado)_
- **Notas para el evaluador:** _(completar — esta entrega probablemente necesita revisión humana, no solo automática)_

---

## D3A — Diseña para imprimir

**Estado en la app:** Profundización · requiere D2 · desbloquea D4 (junto con D3B, basta uno)

### Ya definido

- **Mini-descripción actual (panel de debug):** "Se presenta una pieza
  problemática para impresión 3D: identifica y corrige los problemas de
  manufactura aditiva."
- **De la especificación original:**
  - Reto: se presenta una pieza deliberadamente problemática para impresión 3D.
  - Problemas posibles a incluir: overhang, orientación, espesor insuficiente,
    exceso de soportes, anisotropía, tolerancias.
  - Debe identificar y corregir los problemas.

### Por definir

- **Tipo de reto sugerido:** B (selección múltiple de problemas) + H (evidencia de la corrección)
- **Enunciado final:** _(completar)_
- **Recursos que se muestran:** _(completar — ¿qué pieza exacta, con qué problema(s) reales?)_
- **Opciones / respuesta correcta:** _(completar — ¿cuáles de los problemas listados aplican a esta pieza en particular?)_
- **Pistas:**
  - Pista 1: _(completar)_
  - Pista 2: _(completar)_
  - Pista 3: _(completar)_
- **Feedback si acierta:** _(completar)_
- **Feedback si no acierta:** _(completar)_
- **Intentos máximos:** _(completar — sugerido: ilimitado)_
- **Notas para el evaluador:** _(completar)_

---

## D3B — Diseña para fabricar y ensamblar

**Estado en la app:** Profundización · requiere D2 · desbloquea D4 (junto con D3A, basta uno)

### Ya definido

- **Mini-descripción actual (panel de debug):** "Detecta problemas de
  manufactura y ensamble en una pieza (tornillos inaccesibles, tolerancias
  imposibles) y corrígelos."
- **De la especificación original:**
  - Problemas posibles: acceso imposible de herramienta, tolerancias absurdas,
    tornillos inaccesibles, geometrías innecesarias, exceso de piezas.
  - Debe modificar y justificar.

### Por definir

- **Tipo de reto sugerido:** B (selección múltiple de problemas) + I (justificación) + H (evidencia)
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

## D4 — Diseña algo que exista

**Estado en la app:** Reto libre · requiere D3A o D3B · no desbloquea nada más en esta rama

### Ya definido

- **Mini-descripción actual (panel de debug):** "Diseña una pieza, conjunto o
  mecanismo que consideres útil para un robot y documenta tu proceso."
- **De la especificación original:**
  - Enunciado: "Diseña una pieza, conjunto o mecanismo que consideres útil
    para un robot."
  - Entrega esperada: CAD o enlace, capturas, material, proceso de
    manufactura, explicación, limitaciones.

### Por definir

- **Tipo de reto sugerido:** J (reto libre, múltiples evidencias)
- **Enunciado final:** _(completar — ¿se deja tal cual o se acota más?)_
- **Recursos que se muestran:** _(completar)_
- **Qué debe entregar exactamente:** _(completar — lista final de entregables obligatorios vs. opcionales)_
- **Pistas:** _(completar, opcional en un reto libre)_
- **Feedback al entregar:** _(completar — aquí no hay "correcto/incorrecto", ¿qué mensaje de cierre se muestra?)_
- **Notas para el evaluador:** _(completar — este nodo probablemente se revisa 100% manual)_

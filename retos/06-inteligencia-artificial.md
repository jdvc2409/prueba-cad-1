# Inteligencia Artificial

Color de rama: `#35C4E8` · Datos, modelos y criterio.

## Progresión

```text
A0 — Limpia antes de aprender (Fundamentos)
├── A1A — ¿Qué significa funcionar? (Subhabilidad)
└── A1B — Prepara los datos (Subhabilidad)
        ↓ (con A1A o A1B completado)
    A2 — Entrena algo real (Aplicación)
        ├── A3A — El mejor modelo depende del robot (Profundización)
        └── A3B — ¿Por qué falló fuera del laboratorio? (Profundización)
                ↓ (con A3A o A3B completado)
            A4 — IA libre (Reto libre)
```

7 nodos. A3A conecta conceptualmente con SI6 (Sistemas) y E3A (Electrónica) —
referencia de la spec, no bloquea nada hoy.

## Resumen

| ID | Título | Nivel | Requiere | Desbloquea |
|---|---|---|---|---|
| A0 | Limpia antes de aprender | Fundamentos | — | A1A, A1B |
| A1A | ¿Qué significa funcionar? | Subhabilidad | A0 | A2 |
| A1B | Prepara los datos | Subhabilidad | A0 | A2 |
| A2 | Entrena algo real | Aplicación | A1A o A1B | A3A, A3B |
| A3A | El mejor modelo depende del robot | Profundización | A2 | A4 |
| A3B | ¿Por qué falló fuera del laboratorio? | Profundización | A2 | A4 |
| A4 | IA libre | Reto libre | A3A o A3B | — |

---

## A0 — Limpia antes de aprender

**Estado en la app:** Fundamentos · sin requisitos · desbloquea A1A, A1B

### Ya definido

- **Mini-descripción actual (panel de debug):** "Encuentra problemas en un
  dataset: duplicados, etiquetas incorrectas, desbalance o contaminación
  train/test."
- **De la especificación original:**
  - Reto: encontrar duplicados, etiquetas incorrectas, desbalance,
    contaminación train/test, muestras malas.

### Por definir

- **Tipo de reto sugerido:** B (selección múltiple) o G (interacción visual sobre una tabla de datos)
- **Enunciado final:** _(completar)_
- **Recursos que se muestran:** _(completar — ¿tabla/dataset de ejemplo con qué problemas plantados?)_
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

## A1A — ¿Qué significa funcionar?

**Estado en la app:** Subhabilidad · requiere A0 · desbloquea A2 (junto con A1B, basta uno)

### Ya definido

- **Mini-descripción actual (panel de debug):** "A partir de una matriz de
  confusión o escenario, decide qué métrica importa más para el problema."
- **De la especificación original:**
  - Reto: a partir de matriz de confusión o escenario, seleccionar qué métrica
    importa. Ejemplo dado: "En rescate, ¿qué error te preocupa más al detectar
    personas?"

### Por definir

- **Tipo de reto sugerido:** A (selección única) + I (justificación breve)
- **Enunciado final:** _(completar — ¿se usa el ejemplo de rescate o uno propio?)_
- **Recursos que se muestran:** _(completar — matriz de confusión de ejemplo)_
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

## A1B — Prepara los datos

**Estado en la app:** Subhabilidad · requiere A0 · desbloquea A2 (junto con A1A, basta uno)

### Ya definido

- **Mini-descripción actual (panel de debug):** "Elige o aplica técnicas de
  preprocesamiento: augmentation, resize, normalización, balanceo o
  limpieza."
- **De la especificación original:**
  - Reto: elegir o aplicar augmentation, resize, normalización, balanceo,
    limpieza.

### Por definir

- **Tipo de reto sugerido:** A/E (selección o matching problema → técnica)
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

## A2 — Entrena algo real

**Estado en la app:** Aplicación · requiere A1A o A1B · desbloquea A3A, A3B

### Ya definido

- **Mini-descripción actual (panel de debug):** "Entrena un modelo con una
  herramienta a tu elección y entrega captura, métrica y explicación del
  proceso."
- **De la especificación original:**
  - Herramientas posibles: Edge Impulse, Teachable Machine, notebook
    preparado, herramienta propia.
  - Entrega esperada: captura, métrica, modelo o enlace, explicación.

### Por definir

- **Tipo de reto sugerido:** H (subida de evidencia) + I (explicación)
- **Enunciado final:** _(completar)_
- **Qué debe entregar exactamente:** _(completar — ¿se exige una herramienta específica o es libre?)_
- **Criterio de aceptación:** _(completar — ¿métrica mínima, o basta con completar el ciclo?)_
- **Pistas:**
  - Pista 1: _(completar)_
  - Pista 2: _(completar)_
  - Pista 3: _(completar)_
- **Feedback si acierta:** _(completar)_
- **Feedback si no acierta:** _(completar)_
- **Intentos máximos:** _(completar — sugerido: ilimitado)_
- **Notas para el evaluador:** _(completar — probablemente necesita revisión humana)_

---

## A3A — El mejor modelo depende del robot

**Estado en la app:** Profundización · requiere A2 · desbloquea A4 (junto con A3B, basta uno)

### Ya definido

- **Mini-descripción actual (panel de debug):** "Compara modelos por
  precisión, latencia, tamaño y consumo, y elige el más adecuado según el
  hardware disponible."
- **De la especificación original:**
  - Reto: comparar modelos por accuracy, latencia, RAM, tamaño, consumo;
    elegir según hardware objetivo.
  - Conecta con: SI6 (Sistemas), E3A (Electrónica) — referencia conceptual.

### Por definir

- **Tipo de reto sugerido:** A (selección) + I (justificación)
- **Enunciado final:** _(completar)_
- **Recursos que se muestran:** _(completar — tabla comparativa de 2-3 modelos con sus métricas)_
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

## A3B — ¿Por qué falló fuera del laboratorio?

**Estado en la app:** Profundización · requiere A2 · desbloquea A4 (junto con A3A, basta uno)

### Ya definido

- **Mini-descripción actual (panel de debug):** "Diagnostica por qué un
  modelo falla fuera del laboratorio (iluminación, ángulo, ruido) y propone
  mejoras."
- **De la especificación original:**
  - Casos posibles: iluminación, cámara distinta, ángulo, oclusión, ruido,
    dominio diferente.
  - Debe diagnosticar y proponer mejoras.

### Por definir

- **Tipo de reto sugerido:** A/B (selección de causa) + I (propuesta de mejora)
- **Enunciado final:** _(completar)_
- **Recursos que se muestran:** _(completar — ¿ejemplos de imágenes que fallan?)_
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

## A4 — IA libre

**Estado en la app:** Reto libre · requiere A3A o A3B · no desbloquea nada más en esta rama

### Ya definido

- **Mini-descripción actual (panel de debug):** "Entrena, evalúa o
  experimenta con un modelo de IA que te interese y documenta tus
  resultados."
- **De la especificación original:**
  - Enunciado: "Entrena, evalúa o experimenta con un modelo de IA que te
    interese."
  - Entrega esperada: objetivo, datos, método, métricas, resultado,
    limitaciones. No es obligatorio usar deep learning.

### Por definir

- **Tipo de reto sugerido:** J (reto libre, múltiples evidencias)
- **Enunciado final:** _(completar)_
- **Qué debe entregar exactamente:** _(completar)_
- **Pistas:** _(completar, opcional)_
- **Feedback al entregar:** _(completar)_
- **Notas para el evaluador:** _(completar)_

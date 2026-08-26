# Electrónica

Color de rama: `#0A84C7` · Del sensor a la señal correcta.

## Progresión

```text
E0 — Encuentra qué no cuadra (Fundamentos)
├── E1A — Haz que los números cierren (Subhabilidad)
└── E1B — Habla con el microcontrolador (Subhabilidad)
        ↓ (con E1A o E1B completado)
    E2 — Del sensor al motor (Aplicación)
        ├── E3A — Alimenta el robot (Profundización)
        └── E3B — Debuggea el hardware (Profundización)
                ↓ (con E3A o E3B completado)
            E4 — Electrónica libre (Reto libre)
```

7 nodos. **E2 conecta con otras ramas**: la especificación lo marca como punto
de enlace conceptual con C4 (Control) y S3A (Software) — no crea nodos nuevos,
pero sirve como referencia si más adelante se activan las conexiones híbridas.

## Estado: los 7 nodos están implementados

Este documento empezó como plantilla para definir cada reto antes de
construirlo. Ya no lo es: los 7 nodos tienen contenido real, evaluación y UI
funcionando en la app. Lo que sigue describe **lo que hay hoy en el código**
(`semillero-app/src/lib/challenges/electronics/*.ts`), no un plan.

Dos nodos terminaron con un enfoque distinto al de la especificación
original — no por error, sino por decisiones tomadas durante la
implementación: **E1A** se convirtió en lectura/diagnóstico de un plano
eléctrico concreto (en vez de problemas sueltos de Ley de Ohm) y **E3B** se
rediseñó por completo de "debuggear una falla de hardware fija" a un
laboratorio de simulación en 4 partes. Ambos casos se explican en su propia
sección más abajo.

## Resumen

| ID | Título en el árbol | Nivel | Requiere | Desbloquea | Pasos |
|---|---|---|---|---|---|
| E0 | Fundamentos eléctricos y símbolos | Fundamentos | — | E1A, E1B | 5 |
| E1A | Lee un plano eléctrico | Subhabilidad | E0 | E2 | 3 |
| E1B | Habla con el microcontrolador | Subhabilidad | E0 | E2 | 2 |
| E2 | Del problema al esquema electrónico | Aplicación | E1A o E1B | E3A, E3B | 4 |
| E3A | Alimenta el robot | Profundización | E2 | E4 | 3 |
| E3B | Simula antes de construir | Profundización | E2 | E4 | 4 |
| E4 | Electrónica libre | Reto libre | E3A o E3B | — | 1 |

Todos los nodos comparten la misma filosofía: **reintentos ilimitados**, no
se bloquea el avance por una respuesta "incorrecta" en las partes de
revisión humana, y no se muestra nota ni porcentaje al aspirante — solo qué
falta por completar.

---

## E0 — Fundamentos eléctricos y símbolos

**Estado en la app:** Fundamentos · sin requisitos · desbloquea E1A, E1B

### Implementado

5 minirretos independientes, todos con reintentos ilimitados:

1. **Voltaje** — 3 preguntas de opción única con un caso cada una: un LED de
   ~2 V conectado directo a 5 V, un motor de 12 V alimentado con 3 V, un
   sensor de máximo 3.3 V conectado a 12 V. Apoyo visual: SVG con las tres
   tarjetas.
2. **Corriente** — 2 preguntas de opción única: una fuente de 5 V/2 A con una
   carga de 300 mA (distinguir demanda de capacidad máxima), y un regulador
   de 1 A alimentando servos que piden 4 A (sobrecarga). La primera pregunta
   además alimenta una métrica de "concepto erróneo detectado/corregido"
   (`summarizeCurrentMisconception`) para analítica, sin mostrarse al
   aspirante.
3. **Polaridad** — 1 pregunta de selección múltiple (qué componentes tienen
   polaridad: LED, batería, capacitor electrolítico, resistencia común — la
   resistencia es la opción distractora) + 1 de opción única (qué pasa con
   un LED invertido). SVG con las 4 tarjetas.
4. **Ley de Ohm y potencia** — 2 preguntas numéricas (corriente y potencia
   de una resistencia de 100 Ω a 5 V), con tolerancia y conversión de
   unidades (A/mA, W/mW, acepta coma o punto decimal). No usa imagen: un
   diagrama HTML (`OhmPowerDiagram`) con la fuente, la resistencia y las
   fórmulas I=V/R y P=V×I.
5. **Símbolos** — matching de 9 símbolos eléctricos con su nombre (arrastrar
   en escritorio; seleccionar símbolo y después nombre en móvil o teclado).
   Requiere 7/9 correctas en el primer intento o 9/9 en reintentos
   posteriores. El orden de las etiquetas se baraja de forma determinística
   por candidato (semilla), no aleatoria en cada carga.

Evaluación mayormente automática (opción única/múltiple, numérica, matching);
feedback específico por pregunta, sin revelar la respuesta antes de intentar.

---

## E1A — Lee un plano eléctrico

**Estado en la app:** Subhabilidad · requiere E0 · desbloquea E2 (junto con E1B, basta uno)

> **Diverge de la especificación original.** El documento base proponía
> "problemas cortos de Ley de Ohm, potencia, divisor de tensión, serie/
> paralelo, resistencia para LED" — ese contenido terminó viviendo en **E0**
> (paso 4) en su lugar. E1A se construyó como lectura de un plano eléctrico
> real y diagnóstico de fallas sobre circuitos con motores y driver L293D.

### Implementado

3 pasos sobre el mismo robot de referencia (fuente 7–10 V + regulador
LM2596 → Arduino Nano → HC-05, matriz LED en cascada y L298N mini con dos
motores DC):

1. **Interpreta el sistema** — respuesta abierta libre: explicar qué hace el
   sistema, cómo fluye la alimentación y la función de cada bloque.
   Revisión humana (no hay respuesta "correcta" automática).
2. **Asocia las funciones** — el mismo plano, ahora hay que asignarle a cada
   uno de los 7 bloques (fuente, regulador, MCU, Bluetooth, LED, driver,
   motor) su función (fuente / regulación / comunicación / procesamiento /
   driver / actuación / indicador). Auto-calificado, exige las 7 correctas.
3. **Diagnostica los circuitos** — banco de 3 casos con fotos reales de
   protoboard (no dibujos), cada uno con su propio enunciado que describe
   solo el objetivo del circuito, nunca la falla (los títulos no llevan
   spoilers desde la segunda ronda de corrección):
   - **Caso 1** — motores conectados directo a pines digitales sin driver.
     3 preguntas abiertas: por qué es un problema, qué elementos faltan, por
     qué esos elementos.
   - **Caso 2** — L293D en protoboard con un error. 3 preguntas abiertas:
     explicar el L293D consultando su datasheet, el papel de cada cable, y
     cuál es el error y cómo se detectó.
   - **Caso 3** — mismo circuito ya resuelto, con los pines de control
     conectados a GND. 2 preguntas abiertas: para qué sirven esos pines y a
     dónde van conectados / cómo se relaciona con el funcionamiento.

   Todas las preguntas de los 3 casos son abiertas y de revisión humana. La
   pista del paso es "¿Qué es un puente H?".

---

## E1B — Habla con el microcontrolador

**Estado en la app:** Subhabilidad · requiere E0 · desbloquea E2 (junto con E1A, basta uno)

### Implementado

2 pasos sobre un ESP32 de referencia:

1. **Consulta el datasheet** — 3 preguntas cerradas de opción única (nivel
   lógico del ESP32 = 3.3 V; para qué sirve una entrada ADC; qué interfaz
   usa SDA/SCL = I²C), auto-calificadas contra el datasheet real. Más 1
   respuesta abierta: revisar la compatibilidad de un sensor con el ESP32
   (se espera que mencione voltaje, nivel lógico, GND común y adaptación de
   niveles). Revisión humana para la parte abierta.
2. **Conecta cada periférico** — matching de 6 periféricos (LED/relé,
   potenciómetro, driver de motor, GPS, IMU, microSD) contra las 6
   interfaces GPIO/ADC/PWM/UART/I²C/SPI, según la señal que cada uno
   necesita. Más 1 pregunta de opción única sobre compatibilidad 5 V/3.3 V
   (la respuesta correcta es "verificar niveles y adaptar si hace falta",
   no "conectar directo" ni "solo compartir VCC"). Todo auto-calificado.

---

## E2 — Del problema al esquema electrónico

**Estado en la app:** Aplicación · requiere E1A o E1B · desbloquea E3A, E3B

### Implementado

4 pasos sobre un robot móvil de obstáculos (sin imágenes de apoyo — se
quitaron deliberadamente para que el aspirante no dependa de una plantilla
visual):

1. **Entiende el robot** — los 5 requisitos del brief aparecen como cajones
   individuales, cada uno con su descripción concreta (ej. "detectar
   obstáculo frontal" incluye la distancia aproximada de 10–30 cm) y su
   propio checkbox de "entendido". Los 5 son obligatorios.
2. **Define los componentes** — tabla libre de filas (categoría + nombre +
   propósito + justificación). 7 categorías obligatorias (microcontrolador,
   sensor frontal, sensor de borde, driver, actuadores, indicador, fuente) y
   1 opcional ("otro"). Sin biblioteca de referencia: el aspirante debe
   investigar por su cuenta qué proponer.
3. **Entrega el esquema** — sube su propio plano eléctrico (PNG, JPG o PDF)
   vía `LocalEvidenceUploader`. El enunciado deja claro que es su propuesta,
   no que rellene una plantilla.
4. **Explica la arquitectura** — texto libre (mínimo 160 caracteres) sobre
   el recorrido sensor → procesamiento → decisión → driver → actuador y
   cómo el esquema responde al brief.

Evaluación mixta: los pasos 1–3 se validan automáticamente (checkboxes,
categorías cubiertas, archivo válido subido); el contenido cualitativo queda
para una rúbrica manual de 5 criterios × 2 puntos (máx. 10).

---

## E3A — Alimenta el robot

**Estado en la app:** Profundización · requiere E2 · desbloquea E4 (junto con E3B, basta uno)

### Implementado

3 pasos:

1. **Investiga las fuentes de energía** — 3 tarjetas de investigación
   abierta (baterías LiPo, fuentes switcheadas, baterías NiMH), mínimo 60
   caracteres cada una. La pista sugiere Tinkercad Circuits, Wokwi, Falstad,
   LTspice, Proteus o Multisim como punto de partida, sin obligar a ninguna.
   Revisión humana.
2. **Consumo y dimensionamiento** — tabla de consumos pico (2 motores DC,
   SBC, 4 servos, sensores) + 4 preguntas de opción única: mayor demanda
   pico del sistema, capacidad del riel de 5 V, capacidad del riel de 6 V, y
   qué batería LiPo (2S/3S/4S, distintas capacidades y descarga) cubre el
   bus de 12 V con margen. Sin imagen: la tabla es autosuficiente.
   Auto-calificado.
3. **Separa potencia y procesamiento** — explicación abierta (mínimo 120
   caracteres) de por qué conviene separar los rieles de motores, lógica y
   servos, aunque compartan tierra **y aunque los actuadores usen el mismo
   nivel de voltaje** que la parte de procesamiento. Diagrama SVG propio
   (batería → 3 rieles → cargas) como apoyo, sin título/subtítulo quemados
   en la imagen — el pie de imagen retoma esa información en HTML normal.
   Revisión humana.

---

## E3B — Simula antes de construir

**Estado en la app:** Profundización · requiere E2 · desbloquea E4 (junto con E3A, basta uno)

> **Reemplaza por completo el enfoque original.** La especificación pedía
> diagnosticar una falla de hardware fija (tierra no común, pull-up
> ausente, etc. — ese enfoque de diagnóstico ya vive en **E1A**, caso 2).
> E3B se rediseñó como laboratorio de simulación electrónica aplicada a
> robótica, siguiendo un documento de especificación específico para este
> nodo. Explícitamente **no** evalúa simulación física de un robot completo
> (chasis, ruedas, navegación) — solo componentes electrónicos, señales y
> lógica de control.

### Implementado

4 pasos, con badges EXPLORE / SIMULATE / TEST / EXPLAIN:

1. **Explora simuladores** — compara 3 simuladores de electrónica (nombre,
   qué permite simular, ventaja principal, una limitación, en qué proyecto
   lo usaría) y elige uno con justificación. La pista sugiere Tinkercad
   Circuits primero, junto con Wokwi, Falstad, LTspice, Proteus y Multisim
   como referencia no vinculante.
2. **Controla dos motores** — simulación de microcontrolador + driver + 2
   motores DC, con una advertencia muy visible (antes del enunciado) de que
   no debe simularse un robot completo. Pide: simulador usado, componentes
   opcionales (MCU/driver/tipo de motor/fuente), evidencia general
   (obligatoria), código (texto o archivo, uno de los dos), y evidencia de
   4 estados — detenido, ambos motores en un sentido, sentido contrario,
   control independiente — cada uno con su propio uploader o, como
   alternativa, un solo video marcando qué estados cubre. Cierra con una
   pregunta conceptual: por qué usar un driver en vez de conectar los
   motores directo al microcontrolador.
3. **Haz que el sistema reaccione** — añade un sensor (libre elección) y
   define mínimo 2 condiciones sensor→comportamiento (una tercera es
   opcional), después prueba mínimo 2 escenarios con evidencia visual cada
   uno (un tercero opcional), y explica cómo viaja la información del
   sensor a los motores.
4. **Reflexiona** — 2 preguntas de cierre: qué ventaja tiene simular antes
   de construir, y qué podría comportarse distinto en hardware real.

Todo el contenido es de revisión humana (nunca "correcto/incorrecto"
automático); el paso solo se marca resuelto cuando el formato está completo
(archivos requeridos, mínimos de caracteres, condiciones/escenarios
definidos), y los intentos incompletos no cuentan como fallidos — solo
muestran qué falta.

---

## E4 — Electrónica libre

**Estado en la app:** Reto libre · requiere E3A o E3B · no desbloquea nada más en esta rama

### Implementado

1 solo paso, "Tu proyecto electrónico". Sin imagen de ejemplo: una tarjeta
destacada ("Ahora es tu momento de diseñar") explica que la solución puede
ser un robot, un conjunto de sensores y actuadores, una PCB, un sistema de
control… simulada o construida físicamente.

Campos: título (mín. 5 caracteres), problema que resuelve (mín. 80),
explicación de funcionamiento (mín. 120), lista de al menos 3 componentes
(nombre + cantidad + propósito), esquema o diagrama (obligatorio), evidencia
del resultado —foto, captura, video o PDF— (obligatoria), código si aplica
(archivo o enlace a repositorio), enlaces opcionales de simulación/
repositorio/adicional, y reflexión final (mín. 100 caracteres, qué funcionó,
qué fue difícil, qué cambiaría).

Rúbrica interna de 5 criterios (problema, funcionamiento, componentes,
evidencia, reflexión) sobre 5 puntos, visible solo para el evaluador. Todo
de revisión humana.

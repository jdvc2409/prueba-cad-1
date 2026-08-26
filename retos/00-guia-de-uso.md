# Guía de uso — Definición de retos

Esta carpeta tiene un `.md` por cada rama del árbol de habilidades (7) más uno
para el reto transversal **IR**. Cada archivo trae:

1. **Progresión** — diagrama de cómo se desbloquean los nodos de esa rama.
2. **Resumen** — tabla con todos los retos de la rama de un vistazo.
3. **Un bloque por reto** con dos partes:
   - **Ya definido** — lo que ya viene de la especificación original y de la
     app actual (título, tipo/nivel, mini-descripción que ya se muestra en el
     panel de debug, requisitos, qué desbloquea). No hace falta tocar esto,
     está aquí de referencia.
   - **Por definir** — la plantilla vacía (o con una sugerencia) que debes
     completar para que el reto quede listo para implementar de verdad.

Cuando termines de rellenar los campos "Por definir" de un archivo, devuélvemelo
y lo convierto en el reto real dentro de la app (reemplazando el placeholder de
debug "nombre + mini descripción" que hay ahora).

## Tipos de reto disponibles (motor de la plataforma)

Al llenar **Tipo de reto**, elige uno (o combina, ej. `H + I`):

| Código | Tipo | Qué necesita |
|---|---|---|
| A | Selección única | pregunta, imagen opcional, opciones, respuesta correcta |
| B | Selección múltiple | igual que A, pero con varias respuestas correctas |
| C | Valor numérico | valor esperado, unidad, tolerancia |
| D | Ordenar | lista de pasos/instrucciones/componentes en el orden correcto |
| E | Matching | pares de conceptos a relacionar |
| F | Editor de código | código inicial, tests, timeout |
| G | Interacción visual | conectar circuito, arrastrar componentes, señalar el error |
| H | Subida de evidencia | qué archivo(s) debe subir (imagen, video, PDF, CAD, ZIP, código, enlace) |
| I | Respuesta abierta | texto o audio libre |
| J | Reto libre | combina varias evidencias, sin respuesta única |

Cada bloque "Por definir" ya trae una **sugerencia** de tipo basada en cómo lo
describe la especificación original — puedes cambiarla si prefieres otro tipo.

## Campos que vas a completar en cada reto

- **Tipo de reto** — uno o más códigos de la tabla de arriba.
- **Enunciado final** — el texto exacto que va a leer el aspirante.
- **Recursos que se muestran** — plano/imagen/circuito/dataset/terminal/etc. que acompaña al enunciado.
- **Opciones / respuesta correcta** — depende del tipo (opciones+correcta, valor+tolerancia, orden correcto, pares, tests del código, qué debe subir...).
- **Pistas** — hasta 3, de lo más conceptual a lo más concreto. No bloquean el reto, se registran cuántas se usan.
- **Feedback si acierta** — mensaje corto + explicación breve.
- **Feedback si no acierta** — nunca "Incorrecto" a secas; algo como *"Todavía no. Puedes revisar tu solución e intentarlo otra vez."* + variación opcional.
- **Intentos máximos** — vacío/`ilimitado` si se puede reintentar sin límite (recomendado por la spec).
- **Notas para el evaluador** — cualquier criterio interno que no vea el aspirante.

## Reglas generales (ya decididas, no hace falta redefinirlas por reto)

- Los reintentos son **ilimitados por defecto** salvo que digas lo contrario.
- El feedback nunca debe sonar punitivo ("Fallaste", "0 puntos").
- Las pistas nunca se muestran solas; el aspirante las pide con un botón.
- El aspirante no ve nota numérica en ningún reto — solo completado/no completado.

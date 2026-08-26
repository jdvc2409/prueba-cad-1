# IR — Integración Robótica (reto transversal)

No es una octava rama: es un único nodo especial que combina lo que el
aspirante ya exploró en varias ramas. En el árbol aparece como una tarjeta más
grande, tipo "capstone", conectada por líneas de convergencia a los nodos de
nivel Aplicación de cada rama.

## Progresión / regla de desbloqueo

**Regla implementada hoy en la app:** IR se desbloquea al completar **al
menos 2** de los siguientes 7 nodos (uno por rama, todos de nivel Aplicación):

```text
D2 (Diseño) · M2 (Mecánica) · E2 (Electrónica) · C2 (Control)
S2 (Software) · A2 (IA) · SI2 (Sistemas)
```

```text
        D2   M2   E2   C2   S2   A2   SI2
         \    \    |    |    /    /    /
          \    \   |    |   /    /    /
           ---------- IR ----------
        (con ≥ 2 de los 7 completados)
```

### Ya definido

- **Mini-descripción actual (panel de debug):** "Combina al menos dos de las
  áreas que exploraste para proponer o construir una solución robótica
  completa."
- **De la especificación original:**
  - Nombre: "IR — Conecta tus habilidades".
  - Visual sugerido: forma hexagonal, borde cian animado, conexiones desde las
    ramas ya exploradas, **con estética de "boss final" de videojuego**.
  - Regla de desbloqueo sugerida (más rica que la implementada hoy, dos rutas
    alternativas):
    - **Ruta multidisciplinar:** nivel de Aplicación alcanzado en dos ramas
      distintas (ej. D2+M2, E2+S2, A2+S2). *(Esta es la que está implementada
      hoy, simplificada a "cualquiera 2 de los 7".)*
    - **Ruta especialista:** nivel avanzado en una rama + fundamentos en otras
      dos (ej. S3B + A1A + SI1A). *(No implementada todavía — ver "Por
      definir" más abajo si quieres agregarla.)*
  - Enunciado original: "Combina al menos dos de las áreas que exploraste
    para proponer o construir una solución robótica."
  - Entregables sugeridos: problema, solución, diagrama, áreas utilizadas,
    evidencia, decisiones, pruebas, limitaciones, próximos pasos.
  - Ejemplos de combinación dados en la spec:
    - Software + IA: Cámara → Modelo → ROS 2 → Comportamiento
    - Mecánica + Diseño: Necesidad → Mecanismo → Cálculo → CAD → Manufactura
    - Electrónica + Software: Sensor → ESP32 → Comunicación → Interfaz
    - Control + Electrónica + Software: Sensor → Controlador → PWM → Motor (ciclo)

### Por definir

- **Tipo de reto sugerido:** J (reto libre, múltiples evidencias)
- **Regla de desbloqueo final:** _(completar — ¿se deja "≥2 de los 7" tal cual, o se agrega también la "ruta especialista"?)_
- **Enunciado final:** _(completar)_
- **Qué debe entregar exactamente:** _(completar — de la lista de 9 entregables sugeridos, ¿cuáles son obligatorios?)_
- **Ejemplos de combinación a mostrar en la interfaz:** _(completar — ¿se muestran los 4 ejemplos de la spec, otros, o ninguno?)_
- **Pistas:** _(completar, opcional)_
- **Feedback al entregar:** _(completar)_
- **Notas para el evaluador:** _(completar — este es probablemente el reto que más revisión humana necesita de todo el árbol)_

---

## Conexiones híbridas de referencia (no implementadas, solo contexto)

La especificación original menciona varias combinaciones de nodos que podrían
convertirse en "insignias" o rutas alternativas de acceso a IR más adelante,
sin ser nodos nuevos del árbol:

| Combinación | Resultado conceptual |
|---|---|
| E2 + C4 | Control embebido |
| S3B + SI4 | Arquitectura ROS 2 |
| S3A + SI3B + E2 | Comunicación robótica |
| A3A + SI6 | IA en robot |
| D2 + M2 + E2 | Diseño mecatrónico |
| A2 + S2 + C4 | Autonomía |

_(Completar solo si decides implementar insignias/rutas alternativas — no es
necesario para que IR funcione.)_

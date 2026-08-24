# Semillero de Robótica — Prueba de ingreso

Plataforma web para la prueba de ingreso al Semillero de Robótica: en vez de un
examen tradicional, el aspirante explora un **árbol de habilidades** con siete
ramas (Diseño/CAD, Mecánica, Electrónica, Control, Software, IA, Sistemas e
Integración Robótica), completando retos a su propio ritmo.

- [`PRUEBA_SEMILLERO_ROBOTICA_V3_DEFINITIVA.md`](./PRUEBA_SEMILLERO_ROBOTICA_V3_DEFINITIVA.md) — especificación funcional completa.
- [`semillero-app/`](./semillero-app) — implementación (Next.js + TypeScript + Tailwind + React Flow + Framer Motion).

## Estado actual

Implementado el recorrido del aspirante: landing, presentación del semillero,
registro, presentación libre multimodal, disponibilidad, y el árbol de
habilidades interactivo con 54 nodos técnicos + el reto transversal de
Integración Robótica.

Los retos en esta etapa son **placeholders de debug**: al hacer clic en un
nodo se muestra su nombre, tipo y una mini descripción de en qué consiste, con
un botón "Completar reto" que lo marca como resuelto y desbloquea los
siguientes nodos con animación. El contenido real de cada reto (tipos A–J del
motor de retos) se implementará en una siguiente etapa.

No incluye todavía: autenticación, backend/base de datos, dashboard del
evaluador ni panel administrativo — el progreso se guarda automáticamente en
el navegador (`localStorage`) mientras se define esa capa.

## Desarrollo local

```bash
cd semillero-app
npm install
npm run dev
```

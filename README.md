# Semillero de Robótica — Prueba de ingreso

Plataforma web para la prueba de ingreso al Semillero de Robótica: en vez de un
examen tradicional, el aspirante explora un **árbol de habilidades** con siete
ramas (Diseño/CAD, Mecánica, Electrónica, Control, Software, IA, Sistemas e
Integración Robótica), completando retos a su propio ritmo.

- [`PRUEBA_SEMILLERO_ROBOTICA_V3_DEFINITIVA.md`](./PRUEBA_SEMILLERO_ROBOTICA_V3_DEFINITIVA.md) — especificación funcional completa.
- [`semillero-app/`](./semillero-app) — implementación (Next.js + TypeScript + Tailwind + React Flow + Framer Motion).

## Estado actual

Implementado el recorrido del aspirante: landing, presentación del semillero,
registro con validaciones académicas, acceso local para reanudar, presentación
libre multimodal y un árbol de habilidades interactivo con 53 nodos técnicos
más el reto transversal de Integración Robótica.

Los retos en esta etapa son **prototipos visuales**: al hacer clic en un nodo
se abre una vista amplia con título, descripción parcial, modalidad, formatos de
entrega y estado. El botón "Registrar mi entrega" simula la entrega, marca el
reto como resuelto y desbloquea las siguientes rutas. Las conexiones conservan
el color de su rama y muestran el flujo desde el centro hacia los nuevos nodos.
El contenido interactivo definitivo de cada reto (tipos A–J del motor) se
implementará en una siguiente etapa.

No incluye todavía: autenticación real, backend/base de datos, dashboard del
evaluador ni panel administrativo. El acceso actual compara el correo contra el
recorrido guardado en ese navegador (`localStorage`); la sesión sólo se mantiene
en la pestaña mediante `sessionStorage` mientras se define la capa de backend.

## Desarrollo local

```bash
cd semillero-app
npm install
npm run dev
```

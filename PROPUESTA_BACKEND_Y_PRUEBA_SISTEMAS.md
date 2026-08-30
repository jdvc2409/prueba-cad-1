# Propuesta técnica — Backend, autenticación y prueba de Sistemas

Fecha de revisión: 25 de agosto de 2026.

## 1. Diagnóstico del proyecto actual

La aplicación es un frontend en Next.js 16.3.2, React 19, TypeScript,
Tailwind CSS 4, React Flow y Framer Motion. Usa App Router, pero actualmente se
compila como sitio estático (`output: "export"`) para GitHub Pages, con el
prefijo `/semillero-robotica-prueba`.

El recorrido del aspirante ya incluye landing, registro, presentación libre,
árbol de habilidades, envío final y los retos interactivos de Electrónica. Los
demás nodos, incluida toda la rama de Sistemas e Integración, son prototipos que
se pueden marcar como completados sin resolver una actividad real.

### Persistencia y sesión actuales

- El perfil, progreso, intentos y métricas viven en `localStorage`.
- La sesión sólo es un booleano en `sessionStorage`.
- El login compara el correo escrito con el correo guardado en ese mismo
  navegador; no usa contraseña ni verifica identidad.
- Las evidencias de Electrónica se guardan en IndexedDB.
- Los archivos de presentación inicial usan URLs temporales creadas con
  `URL.createObjectURL`; no sobreviven correctamente a una nueva sesión.
- No existen API, base de datos compartida, autorización por roles, dashboard
  de evaluador, recuperación de contraseña ni respaldo.
- El cliente puede alterar su propio `localStorage`, por lo que el progreso y
  la finalización todavía no son confiables para una evaluación real.

### Verificación local realizada

- `npm ci`: correcto, 382 paquetes, 0 vulnerabilidades reportadas.
- `npm run lint`: correcto.
- `npm run build`: correcto, incluidas las comprobaciones de TypeScript y la
  generación de las 9 páginas estáticas.
- `npm run dev`: servidor listo en menos de un segundo.
- Las rutas `/`, `/login`, `/registro`, `/skills`, `/perfil` y `/enviar`
  respondieron HTTP 200 bajo el prefijo configurado.

Para ejecutarlo:

```powershell
cd semillero-app
npm ci
npm run dev
```

Abrir `http://localhost:3000/semillero-robotica-prueba/`, no la raíz del puerto
3000. Inter y Space Grotesk quedaron instaladas como dependencias locales para
que la compilación y una prueba presencial no dependan de Google Fonts.

## 2. Decisiones funcionales que hay que cerrar

Hay una contradicción entre documentación y código. El documento específico de
Sistemas indica que basta completar una de las dos subramas para avanzar, pero
`computeStatus` exige todos los nodos de `requires`. La implementación actual,
por tanto, exige SI1A y SI1B para SI2, y SI3A y SI3B para SI4.

Recomendación: conservar la regla global ya implementada — completar todos los
retos del nivel previo — porque produce evidencia comparable entre aspirantes.
Debe corregirse la redacción “A o B” de la documentación. Si el equipo decide
que son caminos alternativos, el modelo debe representar explícitamente grupos
`anyOf`; no conviene inferir OR a partir de un arreglo llamado `requires`.

También hay una diferencia entre la especificación original (SI5 desbloquea
SI6) y el árbol actual (SI5 y SI6 son hojas paralelas después de SI4). Se propone
adoptar el árbol actual: SI5 y SI6 se desbloquean juntos al completar SI4.

## 3. Arquitectura recomendada

### Opción elegida para el MVP

**Frontend estático actual + Supabase**:

- Supabase Auth para correo y contraseña.
- PostgreSQL de Supabase para perfiles, progreso, intentos y evaluaciones.
- Supabase Storage para imágenes, audio, video y evidencias.
- Row Level Security (RLS) para que un aspirante sólo vea y modifique su propio
  recorrido y un evaluador pueda consultar el banco común de aspirantes.
- GitHub Pages puede seguir alojando el frontend sin costo.

No se debe poner una `service_role` en variables `NEXT_PUBLIC_*` ni en el
navegador. El cliente sólo utiliza la clave pública y toda la seguridad se
aplica con RLS. La creación de evaluadores se hace desde un script administrativo,
una migración controlada o el panel de Supabase, nunca desde el formulario
público de registro.

### Roles

- `candidate`: registra su perfil, resuelve retos, sube evidencias y hace un
  envío final. Después de enviarlo sólo puede leer.
- `evaluator`: elige candidatos del banco común y ve respuestas, secuencias, tiempos,
  pistas, evidencias y registra calificación/comentarios.
- `admin`: crea/asigna evaluadores y administra convocatorias. Puede posponerse
  su interfaz; inicialmente las operaciones se hacen desde Supabase.

El rol debe almacenarse en una tabla protegida (`user_roles`), no aceptarse en
el formulario ni confiarse desde metadatos editables por el usuario.

### Modelo de datos mínimo

| Tabla | Propósito | Campos principales |
|---|---|---|
| `profiles` | Datos comunes del usuario | `id = auth.users.id`, `role`, `full_name`, `email` |
| `candidate_profiles` | Información de admisión | `user_id`, programa, semestre, promedio, código, enlaces, consentimientos |
| `assessment_runs` | Un recorrido/convocatoria por candidato | `id`, `candidate_id`, `status`, `started_at`, `submitted_at`, `schema_version` |
| `node_progress` | Estado por nodo | `run_id`, `node_id`, `status`, `started_at`, `completed_at`, `score_auto` |
| `step_progress` | Borrador y métricas por paso | `run_id`, `node_id`, `step_id`, `draft jsonb`, `hints_used`, `active_seconds`, `solved_at` |
| `attempts` | Historial inmutable | `id`, `run_id`, nodos/paso, respuesta `jsonb`, número, duración, corrección, puntaje |
| `evidence_files` | Metadatos de Storage | `id`, `run_id`, `node_id`, `storage_path`, tipo, tamaño, hash |
| `introductions` | Presentación multimodal | `id`, `run_id`, tipo, texto o `storage_path`, orden |
| `evaluator_assignments` | Tabla histórica, sin uso en el flujo actual | `run_id`, `evaluator_id`, `assigned_at` |
| `evaluations` | Revisión humana | `run_id`, `node_id`, `evaluator_id`, criterio, puntaje, comentario, fecha |
| `audit_events` | Eventos relevantes | usuario, acción, entidad, fecha, metadatos no sensibles |

Restricciones clave:

- `profiles.email`, `candidate_profiles.student_code` y la combinación
  convocatoria/candidato deben ser únicas según la política de admisión.
- Un `attempt` no se actualiza ni se elimina desde el cliente.
- El servidor/RLS rechaza cambios si `assessment_runs.status = 'submitted'`.
- El progreso desbloqueado se recalcula con definiciones versionadas; no se
  acepta ciegamente un `status = completed` enviado por el navegador.
- Las rutas de Storage empiezan por el UUID del dueño, por ejemplo
  `candidate/{user_id}/{run_id}/{node_id}/{uuid}`.

### Política RLS resumida

| Operación | Aspirante | Evaluador | Admin |
|---|---|---|---|
| Leer perfil/recorrido | Sólo propio | Todos | Todos |
| Editar perfil/progreso | Propio y no enviado | Nunca | Excepcional/auditado |
| Crear intento/evidencia | Propio y no enviado | Nunca | Sí |
| Leer evidencias | Propias | Todas | Todas |
| Crear evaluación | No | Recorridos enviados | Sí |
| Cambiar roles/asignar | No | No | Sí |

### Flujo de autenticación

1. En `/registro`, el aspirante crea cuenta con correo institucional y
   contraseña; se verifica el correo si el entorno de correo está habilitado.
2. Un trigger crea `profiles(role='candidate')` y su `assessment_run`.
3. `/login` usa Supabase Auth. Según el rol, redirige a `/skills` o
   `/evaluador`.
4. La sesión se mantiene con los tokens seguros manejados por el SDK; cerrar
   sesión invalida el estado local.
5. “Olvidé mi contraseña” envía un enlace de recuperación.
6. Los evaluadores son invitados o creados por un administrador y reciben
   `role='evaluator'` mediante una operación privilegiada.

Para un MVP estático, RLS es la frontera de seguridad. Si luego se añaden
operaciones privilegiadas, correos institucionales, generación de reportes o
validación central compleja, se incorporan Edge Functions o se migra el
frontend a ejecución normal de Next.js en Vercel.

### Sincronización y migración del estado local

1. Mantener el contexto React como caché de interfaz, pero reemplazar
   `persistState(localStorage)` por un repositorio de datos Supabase.
2. Guardar borradores con debounce y usar `upsert` con `updated_at`/versión para
   detectar conflictos entre dispositivos.
3. Guardar cada intento inmediatamente; no agruparlo sólo al envío final.
4. Subir archivos a Storage y persistir una ruta estable, nunca una Blob URL.
5. En el primer login, ofrecer una única importación del estado local si su
   correo coincide. Marcar `local_state_imported_at` para no duplicar intentos.
6. Conservar localmente sólo caché no sensible para tolerar desconexiones.

## 4. Prueba propuesta — Sistemas e Integración Robótica

### Motor común de terminal simulada

Los nodos SI0–SI5 deben reutilizar un componente de terminal determinista, no
ejecutar comandos reales del sistema operativo. Cada escenario define un estado
JSON (filesystem, procesos, red, ROS o repositorio), un parser con lista blanca
de comandos y transiciones controladas. Así se evita ejecución arbitraria y se
pueden registrar estrategia, errores y secuencia.

Cada comando genera un evento con `command`, argumentos normalizados,
`timestamp`, `result`, `is_error` y `help_used`. No se califica sólo el comando
final: también se mide si el aspirante inspeccionó antes de modificar.

Reglas comunes:

- Intentos ilimitados; los errores y pistas permanecen visibles para el
  evaluador.
- Tres pistas graduales; cada pista reduce el puntaje automático, pero no
  bloquea la finalización.
- Tiempo activo, pausado cuando la pestaña está oculta.
- Reiniciar escenario no borra intentos anteriores.
- Accesibilidad: historial navegable, etiquetas para lector de pantalla y una
  alternativa de botones/comandos sugeridos en móvil.

### SI0 — Entra a la terminal

**Enunciado:** “El equipo de pruebas guarda el nombre del robot en un archivo.
Explora el computador y muestra su contenido.”

Filesystem:

```text
/home/robot
├── README.txt             # pista contextual
├── documentos/notas.txt   # distractor
├── descargas/manual.pdf   # distractor
└── proyectos/rover/config/nombre_robot.txt  # contiene SABANABOT-01
```

Comandos: `ls [ruta]`, `cd <ruta>`, `pwd`, `cat <archivo>`, `help`, `clear`.
Se completa al ejecutar `cat` sobre `nombre_robot.txt`; no se exige una secuencia
exacta. Pistas: usar `ls`; entrar a `proyectos`; revisar `rover/config`.

Métricas: comandos válidos/inválidos, directorios visitados, ayuda, pistas,
tiempo y si utilizó rutas relativas o absolutas.

### SI1A — Navega el sistema

**Enunciado:** “Prepara la entrega de telemetría: crea `entrega`, copia
`telemetria.csv`, muévela a `entrega/datos.csv`, localiza `debug.tmp` y
elimínalo.”

Estado inicial: `/home/robot/logs/telemetria.csv` y
`/home/robot/cache/sesion/debug.tmp`. Comandos permitidos: `ls`, `pwd`, `cd`,
`mkdir`, `cp`, `mv`, `find`, `rm`, `help`. Se valida el estado final del
filesystem, no una cadena literal, por lo que varias soluciones correctas son
aceptadas. Antes de `rm`, la terminal pide confirmar el archivo objetivo.

### SI1B — Hazlo ejecutable

**Enunciado:** “El arranque del robot falla con `Permission denied`. Diagnostica
los permisos, corrige sólo lo necesario y vuelve a iniciar.”

Salida inicial: `-rw-r--r-- start_robot.sh`. Comandos: `ls -l`, `chmod`,
`./start_robot.sh`, `help`. Se completa con permiso ejecutable y ejecución
exitosa. Se acepta `chmod +x` o modos numéricos equivalentes seguros. No se
premia `chmod 777`; se permite continuar, pero queda como mala práctica para el
evaluador.

### SI2 — El entorno está roto

**Enunciado:** “`controller.py` no encuentra `serial`. Determina qué intérprete
y entorno se están usando, comprueba la dependencia e instala el paquete
correcto sin modificar el Python global.”

Escenario: existe `.venv`; el comando inicial usa `/usr/bin/python3`, mientras
`pyserial` falta en el entorno virtual. Comandos simulados: `which python3`,
`python3 --version`, `python3 -m pip list`, `source .venv/bin/activate`,
`python -m pip install pyserial`, `python controller.py`.

Se completa al activar `.venv`, instalar `pyserial` con el intérprete asociado y
ejecutar el controlador. Puntaje de estrategia: inspección antes de instalar,
coherencia entre Python/pip y evitar `sudo pip install`.

### SI3A — Encuentra el proceso rebelde

Tabla inicial:

| PID | Proceso | CPU | Crítico |
|---:|---|---:|---|
| 410 | `ros2_daemon` | 2% | sí |
| 622 | `vision_node` | 98% | no |
| 701 | `motor_safety` | 1% | sí |
| 845 | `logger` | 4% | no |

**Enunciado:** “El computador se volvió lento. Identifica la causa y detén el
proceso sin apagar servicios críticos.” Comandos: `ps aux`, `top`, `kill`,
`killall`, `help`. La solución preferida es inspeccionar y ejecutar `kill 622`;
si no termina, el escenario puede requerir una segunda señal. Matar un proceso
crítico genera feedback inmediato y reinicia el escenario, conservando el
intento.

### SI3B — ¿Por qué no puedo hablar con el robot?

PC: `192.168.0.23/24`; robot: `192.168.1.52/24`; no hay ruta entre subredes.
Comandos: `ip addr`, `ip route`, `ping`, `help`. Después de inspeccionar, el
aspirante elige diagnóstico y corrección entre opciones. Respuesta: están en
subredes diferentes; deben configurarse en una red común o añadir una ruta
válida. No se acepta “el robot está apagado”, “ROS está dañado” o “cambiar el
puerto USB”.

### SI4 — Inspecciona un robot con ROS 2

Topología esperada:

```text
/camera/image_raw -> detector -> /objects -> planner -> /cmd_vel
```

Falla plantada: `planner` publica en `/cmd_vell` (typo), por lo que
`/cmd_vel` tiene cero publishers. Comandos simulados: `ros2 node list`,
`ros2 topic list`, `ros2 topic echo /objects`, `ros2 topic info /cmd_vel`,
`ros2 node info /planner`.

Se completa al demostrar que `/objects` sí contiene mensajes, detectar que
`/cmd_vel` no tiene publisher e identificar `/cmd_vell` como el tópico
incorrecto. La respuesta final pide “evidencia observada”, “causa” y
“corrección”, evitando una adivinanza de opción múltiple.

### SI5 — Trabaja como equipo con Git

Repositorio ficticio en la rama `feature/safety`: `controller.py` modificado,
`notes.txt` sin seguimiento y un conflicto sencillo en `config.yaml`.

Objetivo: inspeccionar cambios, resolver el conflicto conservando
`max_speed: 0.6` y `emergency_stop: true`, preparar sólo los archivos relevantes
y crear un commit descriptivo. Comandos: `git status`, `git diff`, `git branch`,
`git add`, `git commit`, más un editor visual seguro para el conflicto.

Se valida el estado del repo: conflicto resuelto, `notes.txt` sin incluir,
archivos correctos en staging y commit no vacío. Se puntúa inspección antes de
`add` y calidad básica del mensaje.

### SI6 — Ponlo a funcionar fuera de tu PC

Reto libre: “Empaqueta una aplicación que lee telemetría y expone un estado de
salud para que otra persona pueda ejecutarla de forma reproducible.”

Entrega mínima:

- repositorio o archivo comprimido;
- `README` con requisitos y pasos exactos;
- una de estas rutas: Dockerfile/Compose, script Bash idempotente, servicio
  systemd o paquete ROS 2;
- configuración mediante variables de entorno, sin secretos versionados;
- evidencia de ejecución y un log de arranque;
- explicación breve de una decisión y una limitación.

Rúbrica humana (100 puntos): reproducibilidad 30, corrección 25, manejo de
configuración/errores 20, documentación 15 y criterio técnico 10. Entregas
alternativas son válidas; no se exige Docker si otra solución cumple el objetivo.

## 5. Dashboard del evaluador (MVP)

Rutas propuestas:

- `/evaluador`: banco común de aspirantes con estado, fecha y progreso.
- `/evaluador/candidatos/[runId]`: perfil, mapa recorrido, métricas y entrega.
- `/evaluador/candidatos/[runId]/retos/[nodeId]`: secuencia de comandos,
  intentos, pistas, tiempos, archivos y formulario de rúbrica.

Filtros mínimos: no iniciado/en curso/enviado/evaluado, rama y candidato.
El evaluador nunca debe poder editar la respuesta original. Sus observaciones
se guardan aparte y cada cambio conserva autor y fecha.

## 6. Plan de implementación

### Fase 0 — Alinear reglas (medio día)

- Aprobar AND frente a OR en bifurcaciones.
- Aprobar ramas paralelas SI5/SI6.
- Definir convocatoria, fechas y quién crea evaluadores.

### Fase 1 — Backend y autenticación (2–4 días)

- Crear proyecto Supabase y variables `.env.local`/secretos de Actions.
- Versionar migraciones SQL, tablas, índices, triggers y RLS.
- Implementar registro, login, logout, recuperación y guardas por rol.
- Crear un evaluador de prueba mediante operación administrativa.
- Añadir pruebas de aislamiento: candidato A no puede leer/escribir a B;
  los evaluadores pueden leer el banco común, pero no editar las respuestas.

### Fase 2 — Persistencia y evidencias (3–5 días)

- Sustituir persistencia local por repositorio Supabase con caché local.
- Migrar perfiles, progreso, pasos, intentos y envío final.
- Migrar archivos a Storage con límites de tamaño/tipo y rutas privadas.
- Bloquear escrituras después del envío y probar reconexión/conflictos.

### Fase 3 — Evaluador (2–4 días)

- Implementar lista, detalle, visor de intentos/evidencias y rúbricas.
- Añadir asignaciones y exportación CSV básica si se necesita.

### Fase 4 — Sistemas (5–8 días)

- Construir motor de terminal y SI0 como prueba vertical.
- Añadir adaptadores filesystem, procesos, red, ROS y Git.
- Implementar SI1A–SI5 y el formulario/rúbrica de SI6.
- Pruebas unitarias del parser y estados; pruebas de recorrido completo.

### Fase 5 — Piloto (1–2 días)

- Probar con al menos dos aspirantes y dos cuentas evaluadoras.
- Verificar móvil, accesibilidad, red intermitente, archivos y cierre definitivo.
- Respaldar/exportar datos antes de la aplicación oficial.

## 7. Despliegue gratuito

### Recomendación inmediata: GitHub Pages + Supabase Free

El workflow de Pages ya existe y funciona con la exportación estática. Sólo hay
que añadir las variables públicas de Supabase al build de GitHub Actions. Esta
opción conserva la URL y reduce cambios. Supabase Free ofrece autenticación,
PostgreSQL y Storage suficientes para un piloto pequeño, pero sus límites y la
ausencia de backups automáticos obligan a exportar datos durante la convocatoria.

### Alternativa: Vercel Hobby + Supabase Free

Es más natural para Next.js y permite retirar `output: "export"`, `basePath` y
`assetPrefix`, usar route handlers y middleware. Es adecuada para prototipo
personal/no comercial; si el proyecto pasa a operación institucional, equipo
privado o requiere garantías, hay que revisar un plan pago. Para el MVP estático
actual, Vercel no es necesario.

### No recomendado

- Guardar contraseñas o roles en una base casera/JSON.
- Conectar el navegador a PostgreSQL con credenciales de administrador.
- Dejar evidencias privadas en buckets públicos.
- Confiar en validaciones del cliente o en `localStorage` para calificación.
- Usar GitHub Pages como si ejecutara un backend: sólo sirve contenido estático.

## 8. Criterios de aceptación

- Un aspirante puede registrarse, verificar/iniciar/cerrar/recuperar sesión y
  retomar el mismo progreso desde otro dispositivo.
- Aspirante y evaluador llegan a interfaces distintas por autorización real.
- Ningún aspirante puede consultar o modificar datos de otro, incluso llamando
  directamente la API.
- Un envío final queda inmutable para el aspirante.
- Un evaluador puede elegir cualquier recorrido enviado y su evaluación queda auditada.
- Archivos privados sobreviven al cierre del navegador y usan URLs firmadas.
- SI0–SI5 registran secuencia, errores, pistas y tiempo sin ejecutar shell real.
- SI6 admite evidencia y rúbrica humana.
- Lint, build y pruebas automatizadas pasan antes de desplegar.

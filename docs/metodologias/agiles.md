---
id: agiles
title: Metodologías Ágiles
sidebar_label: Metodologías Ágiles
sidebar_position: 1
description: Scrum, Kanban, XP, SAFe — ceremonias, roles, artefactos, historias de usuario, estimación y herramientas.
tags: [metodologias, scrum, kanban, agile, sprints, historias-usuario]
---

# Metodologías Ágiles

<span className="badge-tech">Scrum</span>
<span className="badge-tech">Kanban</span>
<span className="badge-tech">XP</span>
<span className="badge-tech">Sprints</span>
<span className="badge-tech">User Stories</span>

---

## Manifiesto Ágil (2001)

<div className="concept-card">
<strong>📌 Los 4 valores del Manifiesto Ágil</strong>

1. **Individuos e interacciones** sobre procesos y herramientas
2. **Software funcionando** sobre documentación exhaustiva
3. **Colaboración con el cliente** sobre negociación contractual
4. **Respuesta al cambio** sobre seguir un plan rígido

Los ítems de la derecha tienen valor, pero valoramos más los de la izquierda.
</div>

### Los 12 principios ágiles (síntesis)

| # | Principio |
|---|---|
| 1 | Satisfacer al cliente con entregas continuas y tempranas de software valioso |
| 2 | Bienvenidos los cambios de requisitos, incluso tardíos |
| 3 | Entregar software funcionando frecuentemente (semanas, no meses) |
| 4 | Personas de negocio y desarrolladores trabajan juntos diariamente |
| 5 | Construir proyectos en torno a individuos motivados |
| 6 | La comunicación cara a cara es la más eficiente |
| 7 | Software funcionando es la principal medida de progreso |
| 8 | Ritmo de desarrollo sostenible — no maratones |
| 9 | Atención continua a la excelencia técnica |
| 10 | La simplicidad — maximizar el trabajo no realizado — es esencial |
| 11 | Los mejores diseños emergen de equipos auto-organizados |
| 12 | El equipo reflexiona y ajusta su comportamiento periódicamente |

---

## Scrum

Scrum es el framework ágil más adoptado. Define roles, artefactos y eventos (ceremonias) para organizar el trabajo en ciclos cortos llamados **Sprints**.

### Roles

| Rol | Responsabilidades clave |
|---|---|
| **Product Owner (PO)** | Dueño del backlog; define y prioriza qué se construye; representa al cliente/negocio |
| **Scrum Master (SM)** | Facilita el proceso; elimina impedimentos; protege al equipo; no es un jefe |
| **Development Team** | Auto-organizado; entrega el incremento; 3-9 personas ideal |

:::info Scrum Master ≠ Project Manager
El SM no asigna tareas ni controla al equipo. Su rol es servir al equipo (Servant Leader): facilitar reuniones, remover obstáculos y promover la mejora continua.
:::

### Artefactos

```
Product Backlog              Sprint Backlog           Incremento
────────────────             ──────────────           ─────────────────
Lista priorizada             Items seleccionados      Software funcional
de TODO lo que               para ESTE sprint         y potencialmente
el producto necesita         + plan de trabajo        entregable al final
                                                       del sprint
```

**Definition of Done (DoD)** — Criterios que debe cumplir un ítem para considerarse terminado:
- Código revisado (code review)
- Tests escritos y pasando
- Documentación actualizada
- Deploy en entorno de staging
- Aprobado por el PO

### Eventos (Sprint de 2 semanas)

```
Día 1                 Días 2-9           Día 10          Día 10
──────────            ──────────         ──────────       ──────────────
Sprint Planning       Daily Scrum        Sprint Review    Retrospectiva
(4 horas max)         (15 min/día)       (2 horas max)    (1.5 horas max)

¿Qué hacemos          ¿Qué hice ayer?    Demo del         ¿Qué salió bien?
este sprint?          ¿Qué haré hoy?     incremento       ¿Qué mejorar?
¿Cómo lo hacemos?     ¿Impedimentos?     al cliente       ¿Compromisos?
```

### Daily Scrum — Las 3 preguntas

```
1. ¿Qué completé ayer que contribuye al Sprint Goal?
2. ¿Qué haré hoy para contribuir al Sprint Goal?
3. ¿Veo algún impedimento que nos impida lograr el Sprint Goal?
```

:::tip 15 minutos estrictos
El Daily es una sincronización, no una reunión de estatus para el jefe. Si hay temas que necesitan discusión profunda, se anotan para después del Daily con los involucrados.
:::

### Retrospectiva — Formatos

```
Formato: Start / Stop / Continue
──────────────────────────────────
START   ¿Qué deberíamos empezar a hacer?
STOP    ¿Qué deberíamos dejar de hacer?
CONTINUE ¿Qué está funcionando y debemos mantener?

Formato: 4Ls (Liked / Learned / Lacked / Longed For)
────────────────────────────────────────────────────────
LIKED    ¿Qué nos gustó?
LEARNED  ¿Qué aprendimos?
LACKED   ¿Qué nos faltó?
LONGED FOR ¿Qué desearíamos haber tenido?
```

---

## Historias de usuario

### Formato estándar

```
Como [tipo de usuario],
quiero [funcionalidad/acción],
para [beneficio/razón/valor de negocio].
```

### Criterios de aceptación (DADO/CUANDO/ENTONCES)

```
Historia:
Como cliente registrado,
quiero agregar productos a un carrito de compras,
para poder comprar varios artículos en una sola transacción.

Criterios de aceptación:

✅ Escenario 1 — Agregar producto disponible
   DADO que estoy viendo un producto con stock disponible
   CUANDO hago clic en "Agregar al carrito"
   ENTONCES el producto se agrega al carrito
   Y el contador del carrito se actualiza en la navbar

✅ Escenario 2 — Producto sin stock
   DADO que estoy viendo un producto sin stock
   CUANDO intento agregarlo al carrito
   ENTONCES el botón está deshabilitado
   Y veo el mensaje "Sin stock disponible"

✅ Escenario 3 — Límite de cantidad
   DADO que el producto tiene stock de 5 unidades
   CUANDO intento agregar 6 unidades
   ENTONCES veo un mensaje de error indicando el máximo disponible
```

### Características de una buena historia — INVEST

| Letra | Inglés | Español | Significa |
|---|---|---|---|
| **I** | Independent | Independiente | No depende de otras historias |
| **N** | Negotiable | Negociable | Los detalles son discutibles |
| **V** | Valuable | Valiosa | Aporta valor al usuario o negocio |
| **E** | Estimable | Estimable | El equipo puede estimarla |
| **S** | Small | Pequeña | Se completa en un sprint |
| **T** | Testable | Testeable | Tiene criterios de aceptación claros |

---

## Estimación ágil

### Planning Poker

```
Fibonacci modificada: 0 · 1 · 2 · 3 · 5 · 8 · 13 · 21 · 40 · 100 · ∞ · ?

Proceso:
1. PO presenta la historia
2. Cada miembro vota en secreto (cartas o app)
3. Se revelan todos al mismo tiempo
4. Los extremos explican su estimación
5. Se repite hasta converger (2-3 rondas max)
```

### Story Points vs Horas

```
Story Points                    Horas
────────────────────────        ────────────────────
Relativos — "más/menos"         Absolutas
que la historia de referencia

Capturan complejidad,           Solo capturan tiempo
incertidumbre y esfuerzo

No cambian por persona          Varían entre personas

Permiten medir velocidad        Generan presión innecesaria
del equipo en el tiempo
```

### Velocidad del equipo

```javascript
// Velocidad = story points completados por sprint (promedio últimos 3 sprints)
const sprintsHistoricos = [32, 28, 35, 30, 33];
const velocidad = sprintsHistoricos.slice(-3).reduce((a, b) => a + b, 0) / 3;
// velocidad = 32.67 SP/sprint

// Estimación de release:
const backlogTotal = 150;  // story points en el backlog
const sprintsEstimados = Math.ceil(backlogTotal / velocidad);
// ≈ 5 sprints = 10 semanas
```

---

## Kanban

Sistema visual para gestionar el flujo de trabajo. Sin sprints fijos — el trabajo fluye continuamente según la capacidad del equipo.

### Tablero Kanban

```
┌──────────┬──────────────┬──────────────┬──────────┬────────────┐
│ BACKLOG  │  POR HACER   │ EN PROGRESO  │ REVISIÓN │   HECHO    │
│          │              │  (WIP: 3)    │ (WIP: 2) │            │
├──────────┼──────────────┼──────────────┼──────────┼────────────┤
│ Historia │ Historia A   │ Historia C   │ Hist. E  │ Historia G │
│ 1        │              │              │          │            │
│ Historia │ Historia B   │ Historia D   │ Hist. F  │ Historia H │
│ 2        │              │              │          │            │
│ Historia │              │              │          │            │
│ 3        │              │              │          │            │
└──────────┴──────────────┴──────────────┴──────────┴────────────┘
```

<div className="concept-card">
<strong>📌 WIP Limit (Work In Progress Limit)</strong>
Limitar el trabajo en progreso simultáneo es la práctica más poderosa de Kanban. Reduce el context-switching, evidencia cuellos de botella y acelera la entrega real. La regla: terminar antes de empezar.
</div>

### Métricas Kanban

```
Lead Time    = tiempo desde que se crea la tarea hasta que se entrega
               → mide la perspectiva del cliente

Cycle Time   = tiempo desde que se empieza a trabajar hasta que se entrega
               → mide la eficiencia del equipo

Throughput   = número de tareas completadas por unidad de tiempo
               → mide la cadencia de entrega

CFD (Cumulative Flow Diagram) → visualiza el flujo a lo largo del tiempo
```

---

## Scrum vs Kanban

| Dimensión | Scrum | Kanban |
|---|---|---|
| **Cadencia** | Sprints fijos (1-4 semanas) | Flujo continuo, entrega cuando está listo |
| **Roles** | PO, SM, Dev Team (obligatorios) | No prescribe roles |
| **Cambios** | Al inicio del siguiente sprint | En cualquier momento (si el backlog lo permite) |
| **Estimación** | Story points, velocidad | Opcional |
| **Métricas** | Velocidad, burndown | Lead time, cycle time, CFD |
| **Mejor para** | Nuevos productos, entregas planeadas | Soporte, mantenimiento, flujo impredecible |
| **Reuniones** | Ceremonias definidas | Solo las necesarias |

---

## Extreme Programming (XP)

Framework ágil con foco en prácticas técnicas de ingeniería.

### Prácticas clave de XP

| Práctica | Descripción |
|---|---|
| **TDD** | Test-Driven Development — escribir el test antes que el código |
| **Pair Programming** | Dos programadores, un teclado — driver y navigator |
| **Refactoring continuo** | Mejorar el código constantemente sin cambiar comportamiento |
| **Integración continua** | Integrar y probar el código varias veces al día |
| **Releases pequeñas** | Entregar valor frecuentemente en incrementos pequeños |
| **Código colectivo** | Cualquier miembro puede modificar cualquier parte del código |
| **Estándares de código** | Todo el equipo sigue las mismas convenciones |

### TDD — Red, Green, Refactor

```
🔴 RED    → Escribir un test que FALLA (la funcionalidad no existe aún)
🟢 GREEN  → Escribir el MÍNIMO código para que el test pase
🔵 REFACTOR → Mejorar el código sin romper el test

Repetir para cada pequeño incremento de funcionalidad.
```

---

## SAFe — Scaled Agile Framework

Para organizaciones grandes que necesitan coordinar múltiples equipos ágiles.

```
Portfolio Level     ← Épicas, flujo de valor, presupuesto ágil
      │
Program Level       ← ART (Agile Release Train) — 50-125 personas
      │              Program Increment (PI) = 5 sprints
Team Level          ← Equipos Scrum/Kanban individuales
```

:::note ¿Cuándo SAFe?
SAFe es para empresas con 5+ equipos que necesitan sincronización. Para equipos pequeños o startups, es excesivo — Scrum o Kanban solos son suficientes.
:::

---

## Herramientas

| Herramienta | Tipo | Mejor para |
|---|---|---|
| **Jira** | Completo | Equipos grandes, SAFe, integración con código |
| **Linear** | Moderno | Startups y equipos de producto tech |
| **GitHub Projects** | Integrado | Proyectos open source, equipos pequeños |
| **Trello** | Simple | Kanban visual, proyectos sencillos |
| **Notion** | Flexible | Documentación + tableros |
| **Miro / Mural** | Pizarra digital | Retrospectivas y planning remotos |
| **Poker Planner** | Estimación | Planning Poker online |

---

## Recursos
- [Scrum Guide 2020 (español)](https://scrumguides.org/docs/scrumguide/v2020/2020-Scrum-Guide-Spanish-European.pdf)
- [Manifiesto Ágil](https://agilemanifesto.org/iso/es/manifesto.html)
- [Kanban Guide](https://kanbanguides.org)


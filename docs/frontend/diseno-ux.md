---
id: diseno-ux
title: Diseño UX/UI
sidebar_label: Diseño UX/UI
sidebar_position: 4
description: UX vs UI, principios de usabilidad Nielsen, jerarquía visual, color, tipografía, Gestalt, accesibilidad y atomic design.
tags: [frontend, ux, ui, figma, accesibilidad, color, tipografia]
---

# Diseño UX/UI

<span className="badge-tech">Figma</span>
<span className="badge-tech">Prototipado</span>
<span className="badge-tech">Accesibilidad</span>
<span className="badge-tech">Atomic Design</span>

---

## UX vs UI

<div className="concept-card">
<strong>📌 Diferencia clave</strong>
UX (User Experience) es cómo se SIENTE usar un producto. UI (User Interface) es cómo SE VE. Un producto puede verse hermoso (buena UI) pero ser frustrante de usar (mala UX), y viceversa.
</div>

| | UX — User Experience | UI — User Interface |
|---|---|---|
| **Pregunta** | ¿Es útil y fácil de usar? | ¿Es atractivo y consistente? |
| **Entregables** | Wireframes, flujos, prototipos | Componentes, paleta, tipografía |
| **Herramientas** | Figma, Maze, Hotjar | Figma, tokens de diseño, Storybook |
| **Proceso** | Investigación → síntesis → pruebas | Diseño → especificación → handoff |

---

## Los 10 principios de Nielsen

Jakob Nielsen definió las heurísticas de usabilidad más usadas en la industria.

| # | Principio | Qué significa |
|---|---|---|
| 1 | **Visibilidad del estado** | El usuario siempre sabe qué está pasando (loaders, confirmaciones, breadcrumbs) |
| 2 | **Match con el mundo real** | Usa lenguaje del usuario, no jerga técnica |
| 3 | **Control y libertad** | Siempre debe haber un "deshacer" y una "salida de emergencia" |
| 4 | **Consistencia** | Misma acción = mismo resultado en toda la app |
| 5 | **Prevención de errores** | Mejor prevenir que dar un buen mensaje de error |
| 6 | **Reconocimiento > Memoria** | Muestra opciones, no pidas que el usuario las recuerde |
| 7 | **Flexibilidad** | Atajos para usuarios expertos, guía para novatos |
| 8 | **Diseño minimalista** | Cada elemento extra compite con los importantes |
| 9 | **Recuperación de errores** | Mensajes claros + solución concreta |
| 10 | **Ayuda y documentación** | Fácil de buscar, orientada a la tarea |

---

## Jerarquía Visual

La jerarquía visual guía el ojo del usuario de lo más importante a lo menos importante.

```
Herramientas para crear jerarquía:
┌─────────────────────────────────────────┐
│  TAMAÑO      Grande = más importante    │
│  PESO        Bold = más importante      │
│  COLOR       Acento = llamada a acción  │
│  CONTRASTE   Alto contraste = destaca   │
│  ESPACIO     Más espacio = más peso     │
│  POSICIÓN    Arriba/izquierda = primero │
└─────────────────────────────────────────┘
```

```css title="Jerarquía tipográfica en código"
/* Nivel 1 — Título de página */
h1 {
  font-size: clamp(2rem, 5vw, 3.5rem);
  font-weight: 800;
  color: #f1f5f9;       /* casi blanco */
  letter-spacing: -0.02em;
}

/* Nivel 2 — Secciones */
h2 {
  font-size: clamp(1.4rem, 3vw, 2rem);
  font-weight: 700;
  color: #e2e8f0;
}

/* Nivel 3 — Subsecciones con acento de color */
h3 {
  font-size: 1.2rem;
  font-weight: 600;
  color: #22d3ee;       /* color de acento */
}

/* Cuerpo */
p {
  font-size: 1rem;
  line-height: 1.75;
  color: #94a3b8;       /* gris suave */
}

/* Texto de apoyo */
.caption {
  font-size: 0.85rem;
  color: #64748b;       /* aún más tenue */
}
```

---

## Teoría del Color

### Modelo de color para interfaces

```
Paleta mínima recomendada:
┌────────────────────────────────────────────┐
│  PRIMARIO     Color de marca, CTAs          │
│  SECUNDARIO   Variaciones del primario      │
│  NEUTRAL      Texto, fondos, bordes (grises)│
│  SEMÁNTICO    Éxito (verde), Error (rojo),  │
│               Advertencia (naranja),        │
│               Info (azul/cyan)              │
└────────────────────────────────────────────┘
```

```css title="Paleta dark mode — Cuaderno Técnico"
:root {
  /* Neutrales (escala de 50 a 950) */
  --gray-50:  #f8fafc;
  --gray-100: #f1f5f9;
  --gray-200: #e2e8f0;
  --gray-400: #94a3b8;
  --gray-500: #64748b;
  --gray-700: #334155;
  --gray-800: #1e293b;
  --gray-900: #0f172a;
  --gray-950: #0b0f17;

  /* Acento */
  --cyan-400: #22d3ee;
  --cyan-500: #06b6d4;
  --blue-400: #60a5fa;

  /* Semánticos */
  --success: #22c55e;
  --error:   #ef4444;
  --warning: #fbbf24;
  --info:    #22d3ee;
}
```

### Contraste WCAG

```
Nivel AA (mínimo legal):
  Texto normal  (< 18px): ratio ≥ 4.5:1
  Texto grande  (≥ 18px): ratio ≥ 3:1
  Componentes UI:          ratio ≥ 3:1

Nivel AAA (óptimo):
  Texto normal:  ratio ≥ 7:1
  Texto grande:  ratio ≥ 4.5:1

Herramienta: https://webaim.org/resources/contrastchecker/
```

:::danger Color como único indicador
Nunca uses color como el **único** medio para comunicar información. Los daltónicos no lo percibirán. Agrega siempre un ícono, texto o patrón adicional.
:::

---

## Tipografía

### Pares tipográficos que funcionan

| Display / Heading | Body | Mono (código) |
|---|---|---|
| **Inter** | Inter | JetBrains Mono |
| **Plus Jakarta Sans** | DM Sans | Fira Code |
| **Sora** | Nunito | Source Code Pro |
| **Cabinet Grotesk** | General Sans | Cascadia Code |

```css title="Configuración tipográfica base"
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono&display=swap');

body {
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  font-size: 16px;          /* base para rem */
  line-height: 1.75;        /* cuerpo cómodo para lectura */
  -webkit-font-smoothing: antialiased;
}

/* Escala tipográfica modular (ratio 1.25 — Major Third) */
--text-xs:   0.64rem;   /* 10.24px */
--text-sm:   0.8rem;    /* 12.8px */
--text-base: 1rem;      /* 16px */
--text-lg:   1.25rem;   /* 20px */
--text-xl:   1.563rem;  /* 25px */
--text-2xl:  1.953rem;  /* 31.25px */
--text-3xl:  2.441rem;  /* 39px */
--text-4xl:  3.052rem;  /* 48.8px */
```

---

## Principios Gestalt

Los principios Gestalt explican cómo el cerebro agrupa elementos visualmente.

| Principio | Descripción | Aplicación en UI |
|---|---|---|
| **Proximidad** | Elementos cercanos = relacionados | Agrupar labels con sus inputs |
| **Similitud** | Elementos similares = relacionados | Mismo estilo para botones del mismo tipo |
| **Cierre** | El cerebro completa formas incompletas | Íconos de contorno, logos simplificados |
| **Continuidad** | El ojo sigue líneas y curvas | Sliders, timelines, pasos de proceso |
| **Figura-Fondo** | Separar elemento del fondo | Cards con sombra, modales con overlay |
| **Simetría** | Las formas simétricas se perciben como unidad | Layouts centrados, grids equilibrados |
| **Destino común** | Elementos que se mueven juntos = relacionados | Animaciones de grupo, carruseles |
| **Conexión** | Líneas entre elementos los relacionan | Diagramas, org charts, flujos |

---

## Atomic Design

Sistema de diseño jerárquico propuesto por Brad Frost: los componentes van de lo más simple a lo más complejo.

```
ÁTOMOS         → Componentes mínimos: Button, Input, Label, Icon, Badge
     ↓
MOLÉCULAS      → Combinación de átomos: FormField (Label + Input), SearchBar
     ↓
ORGANISMOS     → Combinación de moléculas: Header (Navbar + SearchBar + UserMenu)
     ↓
PLANTILLAS     → Layout sin datos reales: estructura de página
     ↓
PÁGINAS        → Plantilla con datos reales: la pantalla final
```

```jsx title="Ejemplo — Átomo → Molécula → Organismo"
// ÁTOMO
function Button({ children, variant = 'primary', onClick }) {
  return (
    <button className={`btn btn--${variant}`} onClick={onClick}>
      {children}
    </button>
  );
}

// MOLÉCULA — combina átomos
function SearchBar({ onSearch }) {
  const [query, setQuery] = useState('');
  return (
    <div className="search-bar">
      <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Buscar..." />
      <Button onClick={() => onSearch(query)}>🔍 Buscar</Button>
    </div>
  );
}

// ORGANISMO — combina moléculas y átomos
function Header() {
  return (
    <header>
      <Logo />
      <SearchBar onSearch={handleSearch} />
      <nav>...</nav>
    </header>
  );
}
```

---

## Proceso de diseño UX

```
1. EMPATIZAR   → Research: entrevistas, encuestas, analytics
        ↓
2. DEFINIR     → Problem statement, personas, journey map
        ↓
3. IDEAR       → Brainstorming, crazy 8s, sketches
        ↓
4. PROTOTIPAR  → Wireframes (baja fidelidad) → Mockups (alta fidelidad)
        ↓
5. TESTEAR     → Tests de usabilidad, A/B testing, heatmaps
        ↓
(volver a cualquier paso según los hallazgos)
```

### Entregables por etapa

| Etapa | Entregable | Herramienta |
|---|---|---|
| Empatizar | User interviews, survey results | Notion, Google Forms |
| Definir | Persona, journey map, HMW | FigJam, Miro |
| Idear | Sketches, crazy 8s | Papel, FigJam |
| Prototipar | Wireframe → Mockup → Prototipo | Figma |
| Testear | Usability report, heatmaps | Maze, Hotjar, FullStory |

---

## Checklist de UI — antes de entregar

```
Tipografía:
  □ Jerarquía clara (mínimo 3 niveles)
  □ Line-height ≥ 1.5 para párrafos
  □ Máximo 2 familias tipográficas

Color:
  □ Contraste WCAG AA en todos los textos
  □ Color no es el único indicador de estado
  □ Estados hover/focus/active definidos

Espacio:
  □ Sistema de 8pt (espaciado múltiplo de 8)
  □ Márgenes consistentes entre secciones

Componentes:
  □ Estados interactivos definidos (default, hover, active, disabled, focus)
  □ Versión mobile y desktop
  □ Iconos con texto alternativo o label

Accesibilidad:
  □ Orden de tabulación lógico
  □ Formularios con labels asociados
  □ Imágenes con alt text
```

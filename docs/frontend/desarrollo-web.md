---
id: desarrollo-web
title: Desarrollo Web — HTML, CSS & JavaScript
sidebar_label: Desarrollo Web
sidebar_position: 1
description: Fundamentos sólidos de HTML semántico, CSS moderno, Flexbox, Grid, tipografía fluida, animaciones y JavaScript esencial.
tags: [frontend, html, css, javascript, flexbox, grid, responsive]
---

# Desarrollo Web — HTML, CSS & JavaScript

<span className="badge-tech">HTML5</span>
<span className="badge-tech">CSS3</span>
<span className="badge-tech">JavaScript</span>
<span className="badge-tech">Responsive</span>
<span className="badge-tech">Accesibilidad</span>

---

## HTML Semántico

El HTML semántico le da **significado** al contenido, mejora el SEO y la accesibilidad (lectores de pantalla, Lighthouse).

```html title="Estructura semántica completa"
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="description" content="Descripción de la página para SEO" />
  <title>Título de la página</title>
  <link rel="stylesheet" href="/css/style.css" />
</head>
<body>

  <header>
    <nav aria-label="Navegación principal">
      <ul>
        <li><a href="/">Inicio</a></li>
        <li><a href="/productos">Productos</a></li>
      </ul>
    </nav>
  </header>

  <main>
    <article>
      <h1>Título principal (solo uno por página)</h1>
      <section>
        <h2>Sección de contenido</h2>
        <p>Párrafo de contenido...</p>
      </section>
    </article>

    <aside aria-label="Contenido relacionado">
      <h2>Temas relacionados</h2>
    </aside>
  </main>

  <footer>
    <p>© 2025 Mi Sitio</p>
  </footer>

</body>
</html>
```

### Etiquetas semánticas clave

| Etiqueta | Uso |
|---|---|
| `<header>` | Encabezado de página o sección |
| `<nav>` | Navegación principal |
| `<main>` | Contenido principal (único por página) |
| `<article>` | Contenido independiente (post, producto) |
| `<section>` | Sección temática dentro de un artículo |
| `<aside>` | Contenido complementario (sidebar) |
| `<footer>` | Pie de página o sección |
| `<figure>` + `<figcaption>` | Imagen con descripción |
| `<time datetime="2025-01-15">` | Fecha legible por máquinas |

---

## CSS Moderno

### Variables (Custom Properties)

```css
:root {
  /* Paleta de colores */
  --color-primary:    #22d3ee;
  --color-bg:         #0b0f17;
  --color-surface:    #111827;
  --color-text:       #e2e8f0;
  --color-muted:      #64748b;

  /* Tipografía */
  --font-base:        'Inter', system-ui, sans-serif;
  --font-mono:        'JetBrains Mono', monospace;
  --font-size-base:   1rem;

  /* Espaciado */
  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
  --spacing-xl: 2rem;

  /* Bordes */
  --radius-sm: 6px;
  --radius-md: 12px;
  --radius-full: 9999px;

  /* Sombras */
  --shadow-card: 0 4px 24px rgba(0, 0, 0, 0.3);
  --glow-cyan:   0 0 20px rgba(34, 211, 238, 0.25);

  /* Transiciones */
  --transition: all 0.2s ease;
}

/* Uso de variables */
.card {
  background: var(--color-surface);
  border-radius: var(--radius-md);
  padding: var(--spacing-lg);
  transition: var(--transition);
}
```

---

## Flexbox

```css title="Referencia rápida de Flexbox"
.contenedor {
  display: flex;

  /* Dirección */
  flex-direction: row;           /* fila (default) */
  flex-direction: column;        /* columna */

  /* Alineación en el eje principal */
  justify-content: flex-start;   /* inicio */
  justify-content: center;       /* centro */
  justify-content: flex-end;     /* final */
  justify-content: space-between;/* espacio entre elementos */
  justify-content: space-around; /* espacio alrededor */

  /* Alineación en el eje cruzado */
  align-items: stretch;          /* estira (default) */
  align-items: center;           /* centra verticalmente */
  align-items: flex-start;       /* arriba */
  align-items: flex-end;         /* abajo */

  /* Envolver */
  flex-wrap: wrap;               /* permite varias filas */
  flex-wrap: nowrap;             /* una sola fila (default) */

  /* Espacio entre elementos */
  gap: 1rem;
  gap: 1rem 2rem;               /* fila columna */
}

/* En el hijo */
.item {
  flex: 1;                       /* crece para llenar espacio disponible */
  flex: 0 0 200px;               /* grow shrink basis — ancho fijo de 200px */
  align-self: center;            /* alineación individual */
}
```

```css title="Casos de uso frecuentes"
/* Centrar perfectamente */
.centrado {
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Navbar */
.navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 2rem;
  height: 64px;
}

/* Tarjetas que se envuelven */
.cards {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
}
.card { flex: 1 1 280px; } /* mínimo 280px, crece si puede */
```

---

## CSS Grid

```css title="Referencia rápida de Grid"
.grid {
  display: grid;

  /* Columnas explícitas */
  grid-template-columns: 1fr 2fr 1fr;          /* 3 columnas con proporciones */
  grid-template-columns: repeat(3, 1fr);        /* 3 columnas iguales */
  grid-template-columns: 200px auto 1fr;        /* fija, auto, flexible */

  /* Columnas responsivas sin media queries */
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));

  /* Filas */
  grid-template-rows: auto 1fr auto;            /* header, contenido, footer */

  /* Espacio */
  gap: 1.5rem;
  column-gap: 2rem;
  row-gap: 1rem;
}

/* Posicionar elementos específicos */
.hero {
  grid-column: 1 / -1;    /* ocupa todas las columnas */
  grid-row: 1 / 3;        /* ocupa filas 1 y 2 */
}
```

```css title="Layout clásico con Grid"
.layout {
  display: grid;
  grid-template-columns: 250px 1fr;
  grid-template-rows: 64px 1fr auto;
  grid-template-areas:
    "navbar  navbar"
    "sidebar main"
    "footer  footer";
  min-height: 100vh;
}

.navbar  { grid-area: navbar; }
.sidebar { grid-area: sidebar; }
.main    { grid-area: main; }
.footer  { grid-area: footer; }
```

---

## Tipografía fluida con `clamp()`

```css
/* clamp(mínimo, ideal, máximo) */
/* El valor ideal escala con el viewport (vw) */

h1 { font-size: clamp(1.75rem, 5vw, 3.5rem); }
h2 { font-size: clamp(1.35rem, 3.5vw, 2.25rem); }
h3 { font-size: clamp(1.15rem, 2.5vw, 1.75rem); }
p  { font-size: clamp(0.95rem, 1.5vw, 1.1rem); }

/* Padding fluido — adiós a los media queries para espaciado */
.section {
  padding: clamp(2rem, 8vw, 6rem) clamp(1rem, 5vw, 3rem);
}
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 clamp(1rem, 4vw, 2rem);
}
```

:::tip Sin media queries
`clamp()` escala suavemente entre el mínimo y el máximo según el ancho del viewport. Perfecto para headings, paddings y márgenes.
:::

---

## Responsive Design

```css title="Media queries esenciales"
/* Mobile First — estilos base para móvil, luego amplías */

/* Tablet */
@media (min-width: 768px) {
  .grid { grid-template-columns: repeat(2, 1fr); }
}

/* Desktop */
@media (min-width: 1024px) {
  .grid { grid-template-columns: repeat(3, 1fr); }
}

/* Desktop grande */
@media (min-width: 1280px) {
  .container { max-width: 1200px; }
}
```

```css title="Imágenes y videos responsivos"
img, video {
  max-width: 100%;
  height: auto;
  display: block;
}

/* Imagen de fondo responsiva */
.hero {
  background-image: url('/img/hero-mobile.webp');
}
@media (min-width: 768px) {
  .hero { background-image: url('/img/hero.webp'); }
}
```

---

## Animaciones CSS

```css title="Transiciones"
.btn {
  background: #22d3ee;
  transition: background 0.2s ease, transform 0.15s ease, box-shadow 0.2s ease;
}

.btn:hover {
  background: #06b6d4;
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(34, 211, 238, 0.3);
}

.btn:active {
  transform: translateY(0);
}
```

```css title="Keyframes — Animaciones"
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(30px); }
  to   { opacity: 1; transform: translateY(0); }
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50%       { opacity: 0.5; }
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Aplicar */
.card {
  animation: fadeInUp 0.5s ease forwards;
}

.loader {
  animation: spin 1s linear infinite;
}

/* Stagger con delay */
.card:nth-child(1) { animation-delay: 0s; }
.card:nth-child(2) { animation-delay: 0.1s; }
.card:nth-child(3) { animation-delay: 0.2s; }
```

---

## Accesibilidad (a11y)

```html title="Buenas prácticas de accesibilidad"
<!-- Texto alternativo en imágenes -->
<img src="mochila.jpg" alt="Mochila artesanal en lana roja con flecos dorados" />
<!-- Si es decorativa: -->
<img src="decoracion.svg" alt="" role="presentation" />

<!-- Labels en formularios -->
<label for="email">Correo electrónico</label>
<input id="email" type="email" name="email" required />

<!-- Botones con texto descriptivo -->
<button aria-label="Cerrar modal">✕</button>

<!-- Skip link para teclado -->
<a href="#main-content" class="skip-link">Saltar al contenido</a>

<!-- ARIA roles y estados -->
<nav aria-label="Breadcrumb">
  <ol>
    <li><a href="/">Inicio</a></li>
    <li aria-current="page">Productos</li>
  </ol>
</nav>

<!-- Menú desplegable accesible -->
<button aria-expanded="false" aria-controls="menu">Menú</button>
<ul id="menu" hidden>...</ul>
```

```css title="Focus visible — no eliminar el outline"
/* Nunca hagas outline: none sin reemplazarlo */
:focus-visible {
  outline: 2px solid #22d3ee;
  outline-offset: 3px;
  border-radius: 4px;
}

/* Skip link (visible solo con teclado) */
.skip-link {
  position: absolute;
  top: -100%;
  left: 1rem;
  padding: 0.5rem 1rem;
  background: #22d3ee;
  color: #0b0f17;
}
.skip-link:focus { top: 1rem; }
```

---

## Rendimiento Web

```html title="Optimizaciones esenciales"
<!-- Carga diferida de imágenes -->
<img src="foto.webp" loading="lazy" decoding="async" alt="..." />

<!-- Preload de recursos críticos -->
<link rel="preload" href="/fonts/Inter.woff2" as="font" type="font/woff2" crossorigin />

<!-- Formato WebP con fallback -->
<picture>
  <source srcset="imagen.webp" type="image/webp" />
  <img src="imagen.jpg" alt="..." />
</picture>
```

```css title="Propiedades CSS amigables con el rendimiento"
/* Promueve al compositor — evita repaints costosos */
.animado {
  will-change: transform, opacity;
}

/* Aislar el layout de los hijos */
.card {
  contain: layout style;
}

/* Optimizar scroll en listas largas */
.lista-larga {
  content-visibility: auto;
  contain-intrinsic-size: 0 200px;
}
```

---

## JavaScript esencial para el DOM

```javascript title="Selección y manipulación"
// Seleccionar elementos
const btn      = document.querySelector('.btn');           // primero que coincida
const cards    = document.querySelectorAll('.card');       // todos
const titulo   = document.getElementById('titulo');

// Modificar contenido
titulo.textContent = 'Nuevo título';            // texto (seguro)
div.innerHTML = '<strong>Negrita</strong>';     // HTML (cuidado con XSS)

// Clases
elemento.classList.add('activo');
elemento.classList.remove('activo');
elemento.classList.toggle('activo');
elemento.classList.contains('activo');          // → true/false

// Atributos
img.setAttribute('src', '/nueva-imagen.jpg');
input.getAttribute('placeholder');

// Estilos inline
elemento.style.display = 'none';
elemento.style.backgroundColor = '#22d3ee';
```

```javascript title="Eventos"
// Click
btn.addEventListener('click', (e) => {
  e.preventDefault();   // evitar comportamiento por defecto
  e.stopPropagation();  // evitar que el evento suba al padre
  console.log('Click!');
});

// Input en tiempo real
input.addEventListener('input', (e) => {
  console.log(e.target.value);
});

// Delegación de eventos (para elementos dinámicos)
document.querySelector('.lista').addEventListener('click', (e) => {
  if (e.target.matches('.btn-eliminar')) {
    e.target.closest('.item').remove();
  }
});

// Remover listener
const handler = () => console.log('click');
btn.addEventListener('click', handler);
btn.removeEventListener('click', handler);
```

```javascript title="Fetch API — Peticiones HTTP"
// GET
const getProductos = async () => {
  const res  = await fetch('/api/productos');
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return await res.json();
};

// POST
const crearProducto = async (datos) => {
  const res = await fetch('/api/productos', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(datos),
  });
  return await res.json();
};
```

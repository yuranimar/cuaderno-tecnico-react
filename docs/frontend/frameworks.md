---
id: frameworks
title: Frameworks Frontend
sidebar_label: Frameworks
sidebar_position: 5
description: Comparativa Next.js vs Vite, App Router, Server Components, Tailwind CSS v3 vs v4, y cuándo usar cada herramienta.
tags: [frontend, nextjs, vite, tailwind, react, astro, remix]
---

# Frameworks Frontend

<span className="badge-tech">Next.js 15</span>
<span className="badge-tech">Vite</span>
<span className="badge-tech">Tailwind CSS</span>
<span className="badge-tech">Astro</span>

---

## Comparativa de frameworks

| Framework | Tipo | Renderizado | Cuándo usarlo |
|---|---|---|---|
| **Next.js** | Full-stack React | SSR + SSG + ISR | SEO, e-commerce, apps con auth |
| **Vite + React** | SPA | CSR | Dashboards, herramientas internas |
| **Remix** | Full-stack React | SSR | Apps data-heavy con formularios |
| **Astro** | MPA con islas JS | SSG + SSR | Blogs, portfolios, contenido estático |
| **SvelteKit** | Full-stack Svelte | SSR + SSG | Alternativa más ligera a Next.js |

<div className="concept-card">
<strong>📌 Regla general para elegir</strong>
¿Necesitas SEO o datos en el servidor? → Next.js. ¿Es una herramienta interna o dashboard? → Vite + React. ¿Es mayormente contenido estático? → Astro.
</div>

---

## Next.js — App Router (v13+)

### Estructura de carpetas

```
app/
├── layout.tsx              ← Layout raíz — siempre se renderiza
├── page.tsx                ← Ruta: /
├── loading.tsx             ← Suspense automático para esta ruta
├── error.tsx               ← Error boundary para esta ruta
├── not-found.tsx           ← Página 404 personalizada
│
├── (marketing)/            ← Route Group — no afecta la URL
│   ├── layout.tsx          ← Layout solo para este grupo
│   └── about/
│       └── page.tsx        ← Ruta: /about
│
├── productos/
│   ├── page.tsx            ← Ruta: /productos
│   └── [id]/
│       └── page.tsx        ← Ruta: /productos/[id]  (dinámico)
│
└── api/
    └── productos/
        └── route.ts        ← API Route: GET/POST /api/productos
```

### Server vs Client Components

```tsx title="Server Component (por defecto en App Router)"
// Sin 'use client' → es Server Component
// Se renderiza en el servidor, sin JS en el cliente
// Puede: hacer fetch directo, leer BD, acceder a variables de entorno privadas
// No puede: useState, useEffect, eventos del DOM, hooks de React

async function ProductosPage() {
  // Fetch directo en el servidor — sin useEffect ni estados
  const res      = await fetch('https://api.tienda.com/productos', {
    next: { revalidate: 60 }, // ISR: revalidar cada 60 segundos
  });
  const productos = await res.json();

  return (
    <main>
      <h1>Productos</h1>
      {productos.map(p => (
        <TarjetaProducto key={p.id} producto={p} />
      ))}
    </main>
  );
}

export default ProductosPage;
```

```tsx title="Client Component — 'use client'"
'use client'; // 👈 Necesario para hooks, eventos, interactividad

import { useState } from 'react';

function BuscadorProductos() {
  const [query, setQuery] = useState('');
  const [resultados, setResultados] = useState([]);

  const buscar = async () => {
    const res = await fetch(`/api/productos?q=${query}`);
    setResultados(await res.json());
  };

  return (
    <div>
      <input
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder="Buscar productos..."
      />
      <button onClick={buscar}>Buscar</button>
      <ul>
        {resultados.map(r => <li key={r.id}>{r.nombre}</li>)}
      </ul>
    </div>
  );
}
```

:::tip Estrategia de composición
Mantén los Server Components lo más afuera posible del árbol de componentes. Los Client Components ('use client') deben ser hojas del árbol — componentes de UI interactivos específicos.
:::

### API Routes

```typescript title="app/api/productos/route.ts"
import { NextRequest, NextResponse } from 'next/server';

// GET /api/productos
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const categoria = searchParams.get('categoria');

  const productos = await db.productos.findMany({
    where: categoria ? { categoria } : {},
  });

  return NextResponse.json(productos);
}

// POST /api/productos
export async function POST(request: NextRequest) {
  const body = await request.json();

  const producto = await db.productos.create({ data: body });

  return NextResponse.json(producto, { status: 201 });
}
```

### Metadata y SEO

```typescript title="Metadata estática"
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Mi Tienda — Productos artesanales',
  description: 'Encuentra productos únicos hechos a mano en Medellín',
  openGraph: {
    title: 'Mi Tienda',
    description: 'Productos artesanales de Medellín',
    images: ['/og-image.jpg'],
  },
};
```

```typescript title="Metadata dinámica (páginas con parámetros)"
export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const producto = await getProducto(params.id);

  return {
    title: `${producto.nombre} — Mi Tienda`,
    description: producto.descripcion,
    openGraph: {
      images: [producto.imagen_url],
    },
  };
}
```

### Variables de entorno en Next.js

```bash title=".env.local"
# Accesibles SOLO en el servidor
DATABASE_URL=postgresql://...
JWT_SECRET=mi-secreto

# Accesibles en el cliente (expuestas al navegador)
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
```

:::danger NEXT_PUBLIC_
Solo las variables con prefijo `NEXT_PUBLIC_` se exponen al navegador. Nunca pongas credenciales privadas con ese prefijo.
:::

---

## Vite — SPA React

```bash
npm create vite@latest mi-app -- --template react
cd mi-app && npm install && npm run dev
```

```javascript title="vite.config.js — Configuración típica"
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'), // import desde '@/components/...'
    },
  },
  server: {
    port: 3000,
    proxy: {
      '/api': 'http://localhost:4000', // redirige /api al backend
    },
  },
});
```

```bash title=".env en Vite"
# Variables en Vite usan VITE_ como prefijo (no NEXT_PUBLIC_)
VITE_API_URL=http://localhost:4000
VITE_SUPABASE_URL=https://xxx.supabase.co

# Acceso en el código:
# import.meta.env.VITE_API_URL
```

### Estructura recomendada para SPA con Vite

```
src/
├── components/        ← Componentes reutilizables
│   ├── ui/            ← Átomos: Button, Input, Badge
│   └── layout/        ← Header, Sidebar, Footer
├── pages/             ← Una por ruta (con React Router)
├── hooks/             ← Custom hooks
├── context/           ← Contextos globales
├── services/          ← Llamadas a la API
│   └── api.js         ← Funciones fetch centralizadas
├── utils/             ← Funciones helper puras
├── assets/            ← Imágenes, fuentes
└── App.jsx            ← Router y layout principal
```

---

## Tailwind CSS

```bash
# Instalación en Vite
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# En Next.js viene incluido al crear el proyecto
```

```javascript title="tailwind.config.js (v3)"
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          400: '#22d3ee',
          500: '#06b6d4',
          600: '#0891b2',
        },
        dark: {
          DEFAULT: '#0b0f17',
          surface: '#111827',
          border: '#1e293b',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        glow: '0 0 20px rgba(34, 211, 238, 0.25)',
      },
    },
  },
  plugins: [],
};
```

### Clases más usadas

```html title="Layout"
<!-- Flexbox -->
<div class="flex items-center justify-between gap-4 flex-wrap">

<!-- Grid responsivo -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

<!-- Centrar -->
<div class="flex items-center justify-center min-h-screen">

<!-- Contenedor con max-width -->
<div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
```

```html title="Tipografía y color"
<h1 class="text-4xl font-extrabold text-slate-100 tracking-tight">
<p  class="text-base text-slate-400 leading-relaxed">
<span class="text-cyan-400 font-semibold">
<code class="font-mono text-sm bg-slate-800 px-2 py-0.5 rounded">
```

```html title="Componentes comunes"
<!-- Botón primario -->
<button class="bg-cyan-400 text-gray-900 font-bold px-6 py-3 rounded-xl
               hover:bg-cyan-300 active:scale-95 transition-all duration-200">
  Acción

<!-- Card -->
<div class="bg-gray-900 border border-slate-800 rounded-xl p-6
            hover:border-cyan-400/30 hover:shadow-glow transition-all duration-200">

<!-- Badge -->
<span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold
             bg-cyan-400/10 text-cyan-400 border border-cyan-400/30">
  NestJS
```

### Tailwind v3 vs v4

:::caution Diferencias importantes
| | Tailwind v3 | Tailwind v4 |
|---|---|---|
| Config | `tailwind.config.js` | Solo CSS (`@import "tailwindcss"`) |
| Dark mode | `dark:` class | CSS nativo con `@variant dark` |
| Contenido | `content: [...]` necesario | Detección automática |
| Compatibilidad | Amplia | Más nueva, verificar plugins |

El proyecto **Isamar** usa v3 — no mezcles sintaxis de v4.
:::

---

## Astro — Para contenido estático

```bash
npm create astro@latest
```

```astro title="src/pages/index.astro"
---
// Frontmatter — se ejecuta en el servidor (Node.js)
const posts = await fetch('/api/posts').then(r => r.json());
---

<!-- Template — HTML + componentes -->
<html lang="es">
  <head>
    <title>Mi Blog</title>
  </head>
  <body>
    <h1>Posts</h1>
    {posts.map(post => (
      <article>
        <h2><a href={`/posts/${post.slug}`}>{post.titulo}</a></h2>
        <p>{post.resumen}</p>
      </article>
    ))}
  </body>
</html>
```

```astro title="Islas de interactividad en Astro"
---
import BuscadorReact from '../components/Buscador.jsx';
---

<!-- El componente React solo carga JS cuando es visible -->
<BuscadorReact client:visible />

<!-- Carga inmediata -->
<Componente client:load />

<!-- Solo en el cliente, sin SSR -->
<Componente client:only="react" />
```

:::tip ¿Cuándo Astro?
Si el contenido es mayormente estático (blog, portfolio, landing page, documentación) y la interactividad es puntual, Astro genera HTML puro sin JS por defecto — mucho más rápido.
:::

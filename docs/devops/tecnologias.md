---
id: tecnologias
title: Tecnologías & Herramientas
sidebar_label: Tecnologías
sidebar_position: 4
description: Stack completo — Node.js, Express, Next.js, Vite, Supabase, MySQL, Railway, Vercel y herramientas del ecosistema.
tags: [devops, nodejs, express, nextjs, vite, supabase, mysql, vercel, railway]
---

# Tecnologías & Herramientas

<span className="badge-tech">Node.js</span>
<span className="badge-tech">Express</span>
<span className="badge-tech">Next.js 15</span>
<span className="badge-tech">Vite</span>
<span className="badge-tech">Supabase</span>
<span className="badge-tech">MySQL</span>
<span className="badge-tech">Vercel</span>
<span className="badge-tech">Railway</span>

---

## Stack personal

```
Capa              Tecnología                    Alternativas usadas
──────────────────────────────────────────────────────────────────
Frontend          React · Next.js 15 · Vite     —
Estilos           Tailwind CSS v3               CSS puro, clamp()
Animaciones       GSAP · Framer Motion          CSS transitions
Backend           Node.js + Express             NestJS, Django
Base de datos     MySQL · PostgreSQL            Supabase (PaaS)
Almacenamiento    Supabase Storage              Cloudinary
Autenticación     JWT · Google OAuth            Supabase Auth
Deploy frontend   Vercel                        GitHub Pages
Deploy backend    Railway                       Render, Fly.io
ORM / Query       mysql2, pg                    Prisma, TypeORM
```

---

## Node.js

Node.js es el runtime de JavaScript en el servidor. Usa el motor V8 de Chrome y un modelo de I/O no bloqueante orientado a eventos.

```bash
# Verificar versión
node -v && npm -v

# Ejecutar archivo
node app.js

# REPL interactivo
node

# Módulos instalados globalmente
npm list -g --depth=0
```

### Módulos built-in esenciales

```javascript
// ── path — rutas de archivos ──────────────────────────────────
import path from 'path';
const dir       = path.dirname('/users/yuri/app/index.js');  // '/users/yuri/app'
const base      = path.basename('/users/yuri/app/index.js'); // 'index.js'
const ext       = path.extname('archivo.min.js');             // '.js'
const fullPath  = path.join(__dirname, 'uploads', 'foto.jpg');
const absolute  = path.resolve('src', 'index.js');

// ── fs — sistema de archivos ──────────────────────────────────
import fs from 'fs/promises';  // versión async (preferida)

const contenido = await fs.readFile('datos.json', 'utf-8');
const datos     = JSON.parse(contenido);

await fs.writeFile('salida.json', JSON.stringify(datos, null, 2));
await fs.mkdir('uploads', { recursive: true });
await fs.copyFile('origen.txt', 'destino.txt');

const archivos  = await fs.readdir('./public');
const info      = await fs.stat('archivo.txt');
console.log(info.size, info.mtime);

// ── os — sistema operativo ────────────────────────────────────
import os from 'os';
console.log(os.platform());   // 'linux', 'darwin', 'win32'
console.log(os.cpus().length);
console.log(os.totalmem() / 1024 ** 3 + ' GB');

// ── crypto — criptografía ─────────────────────────────────────
import crypto from 'crypto';
const hash   = crypto.createHash('sha256').update('texto').digest('hex');
const token  = crypto.randomBytes(32).toString('hex');  // token seguro
```

---

## Express.js

Framework minimalista para APIs y aplicaciones web en Node.js.

```bash
npm install express
npm install -D @types/express  # si usas TypeScript
```

```javascript title="Servidor Express completo"
import express    from 'express';
import cors       from 'cors';
import helmet     from 'helmet';
import morgan     from 'morgan';
import rateLimit  from 'express-rate-limit';

const app = express();

// ── Middlewares globales ───────────────────────────────────────
app.use(helmet());                          // headers de seguridad
app.use(cors({ origin: process.env.CLIENT_URL }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));                     // logs de peticiones

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 minutos
  max: 100,                   // 100 peticiones por IP
});
app.use('/api', limiter);

// ── Rutas ─────────────────────────────────────────────────────
import productosRouter from './routes/productos.js';
import authRouter      from './routes/auth.js';

app.use('/api/productos', productosRouter);
app.use('/api/auth', authRouter);

app.get('/health', (req, res) => {
  res.json({ status: 'ok', uptime: process.uptime() });
});

// ── Manejo de errores ─────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: err.message || 'Error interno del servidor'
  });
});

// ── Iniciar ───────────────────────────────────────────────────
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API en http://localhost:${PORT}`));
```

```javascript title="Router de productos — routes/productos.js"
import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.js';
import * as ctrl from '../controllers/productos.controller.js';

const router = Router();

router.get('/',      ctrl.getAll);
router.get('/:id',   ctrl.getById);
router.post('/',     authMiddleware, ctrl.create);
router.put('/:id',   authMiddleware, ctrl.update);
router.delete('/:id', authMiddleware, ctrl.remove);

export default router;
```

---

## Next.js 15

Framework de React con renderizado del lado servidor, App Router, Server Components y API Routes integradas.

### App Router — Estructura de carpetas

```
app/
├── layout.js          ← Layout raíz (html, body, providers)
├── page.js            ← Página de inicio (/)
├── globals.css
│
├── (auth)/            ← Grupo de rutas (no afecta la URL)
│   ├── login/
│   │   └── page.js    ← /login
│   └── registro/
│       └── page.js    ← /registro
│
├── productos/
│   ├── page.js        ← /productos
│   ├── [id]/
│   │   └── page.js    ← /productos/42
│   └── loading.js     ← Skeleton mientras carga
│
└── api/
    └── productos/
        └── route.js   ← /api/productos (GET, POST, etc.)
```

```javascript title="app/page.js — Server Component (por defecto)"
// Sin 'use client' → Server Component
// Puede hacer fetch directo, acceder a la BD, leer env privadas

async function obtenerProductos() {
  const res = await fetch('https://api.ejemplo.com/productos', {
    next: { revalidate: 60 },  // revalidar cada 60 segundos (ISR)
  });
  return res.json();
}

export default async function HomePage() {
  const productos = await obtenerProductos();  // await directo en el componente

  return (
    <main>
      <h1>Productos</h1>
      <ul>
        {productos.map(p => <li key={p.id}>{p.nombre}</li>)}
      </ul>
    </main>
  );
}
```

```javascript title="app/api/productos/route.js — API Route"
import { NextResponse } from 'next/server';
import { supabase }     from '@/lib/supabase';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const categoria = searchParams.get('categoria');

  let query = supabase.from('productos').select('*').eq('activo', true);
  if (categoria) query = query.eq('categoria', categoria);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json(data);
}

export async function POST(request) {
  const body = await request.json();

  const { data, error } = await supabase
    .from('productos')
    .insert(body)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json(data, { status: 201 });
}
```

---

## Supabase

Plataforma Backend-as-a-Service basada en PostgreSQL. Alternativa open-source a Firebase.

```bash
npm install @supabase/supabase-js
```

```javascript title="lib/supabase.js"
import { createClient } from '@supabase/supabase-js';

// Cliente público (para el navegador)
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// Cliente admin (solo en el servidor — nunca en el cliente)
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);
```

### CRUD completo

```javascript
// ── SELECT ────────────────────────────────────────────────────
const { data } = await supabase
  .from('productos')
  .select('id, nombre, precio, categoria(nombre)')  // join
  .eq('activo', true)
  .gte('precio', 20000)                              // precio >= 20000
  .order('created_at', { ascending: false })
  .limit(10);

// ── INSERT ────────────────────────────────────────────────────
const { data: nuevo, error } = await supabase
  .from('productos')
  .insert({ nombre: 'Mochila', precio: 45000, activo: true })
  .select()
  .single();

// ── UPDATE ────────────────────────────────────────────────────
await supabase
  .from('productos')
  .update({ precio: 50000 })
  .eq('id', 1);

// ── DELETE ────────────────────────────────────────────────────
await supabase.from('productos').delete().eq('id', 1);

// ── UPSERT (insert o update) ──────────────────────────────────
await supabase
  .from('productos')
  .upsert({ id: 1, nombre: 'Mochila actualizada', precio: 48000 });
```

### Storage — Subir archivos

```javascript
// Subir imagen
const { data, error } = await supabase.storage
  .from('imagenes-productos')
  .upload(`public/${Date.now()}-${file.name}`, file, {
    cacheControl: '3600',
    upsert: false,
  });

// Obtener URL pública
const { data: urlData } = supabase.storage
  .from('imagenes-productos')
  .getPublicUrl(data.path);

const urlImagen = urlData.publicUrl;
```

### Auth

```javascript
// Registro
const { data, error } = await supabase.auth.signUp({
  email: 'usuario@email.com',
  password: 'contraseña123',
});

// Login
const { data: session } = await supabase.auth.signInWithPassword({
  email: 'usuario@email.com',
  password: 'contraseña123',
});

// Google OAuth
await supabase.auth.signInWithOAuth({ provider: 'google' });

// Cerrar sesión
await supabase.auth.signOut();

// Usuario actual
const { data: { user } } = await supabase.auth.getUser();
```

---

## MySQL con Node.js

```bash
npm install mysql2
```

```javascript title="config/database.js — Pool de conexiones"
import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host:            process.env.DB_HOST,
  user:            process.env.DB_USER,
  password:        process.env.DB_PASSWORD,
  database:        process.env.DB_NAME,
  port:            process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit:    10,
  queueLimit:         0,
  timezone:        '-05:00',  // Colombia (UTC-5)
});

// Probar conexión al iniciar
try {
  const conn = await pool.getConnection();
  console.log('✅ MySQL conectado');
  conn.release();
} catch (err) {
  console.error('❌ Error MySQL:', err.message);
}

export default pool;
```

```javascript title="Consultas parametrizadas (previenen SQL injection)"
import pool from '../config/database.js';

// SELECT con parámetros
const [rows] = await pool.execute(
  'SELECT * FROM productos WHERE activo = ? AND precio >= ?',
  [true, 20000]
);

// INSERT
const [result] = await pool.execute(
  'INSERT INTO productos (nombre, precio, activo) VALUES (?, ?, ?)',
  ['Mochila', 45000, true]
);
console.log(result.insertId);  // ID del nuevo registro

// UPDATE
const [update] = await pool.execute(
  'UPDATE productos SET precio = ? WHERE id = ?',
  [50000, 1]
);
console.log(update.affectedRows);

// Transacción
const conn = await pool.getConnection();
await conn.beginTransaction();
try {
  await conn.execute('INSERT INTO pedidos (usuario_id, total) VALUES (?, ?)', [1, 75000]);
  const [res] = await conn.execute('SELECT LAST_INSERT_ID() as id');
  await conn.execute('UPDATE inventario SET stock = stock - 1 WHERE producto_id = ?', [1]);
  await conn.commit();
} catch (err) {
  await conn.rollback();
  throw err;
} finally {
  conn.release();
}
```

---

## Deploy — Railway y Vercel

### Vercel (frontend Next.js)

```bash
# Instalar CLI
npm install -g vercel

# Deploy
vercel

# Deploy a producción
vercel --prod
```

```json title="vercel.json — Configuración"
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "env": {
    "NODE_ENV": "production"
  },
  "rewrites": [
    { "source": "/api/:path*", "destination": "https://mi-api.railway.app/api/:path*" }
  ]
}
```

### Railway (backend Node.js)

```json title="package.json — Scripts para Railway"
{
  "scripts": {
    "start": "node dist/main.js",
    "build": "tsc",
    "dev":   "nodemon src/main.ts"
  }
}
```

```bash title="Procfile (alternativa)"
web: node src/app.js
```

:::tip Variables en Railway
Railway inyecta `PORT` automáticamente. Siempre usa `process.env.PORT || 3000` — nunca hardcodees el puerto.
:::

### Checklist de deploy

```
Frontend (Vercel)                Backend (Railway)
─────────────────────────────    ─────────────────────────────
□ Variables de entorno           □ Variables de entorno
□ NEXT_PUBLIC_ para el cliente   □ PORT dinámico
□ Dominio configurado            □ /health endpoint
□ Build sin errores              □ Logs monitoreados
□ CORS apuntando a la API        □ CORS apuntando al frontend
```

---

## Herramientas del ecosistema

| Herramienta | Categoría | Para qué |
|---|---|---|
| **Postman / Thunder Client** | Testing API | Probar endpoints manualmente |
| **TablePlus** | BD GUI | Visualizar y editar bases de datos |
| **DBeaver** | BD GUI | Alternativa gratuita a TablePlus |
| **ESLint** | Linting | Detectar errores y malos patrones |
| **Prettier** | Formateo | Formateo automático de código |
| **Husky** | Git hooks | Ejecutar scripts antes de commits |
| **dotenv** | Config | Cargar variables de entorno |
| **nodemon** | Dev | Reiniciar servidor al guardar |
| **tsx** | Dev | Ejecutar TypeScript directo |
| **concurrently** | Dev | Correr varios scripts a la vez |

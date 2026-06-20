---
id: react
title: React — Biblioteca UI
sidebar_label: React
sidebar_position: 2
description: Hooks, componentes, estado, contexto, React Router, formularios, patrones y Next.js.
tags: [frontend, react, hooks, nextjs, vite]
---

# React — Biblioteca UI

<span className="badge-tech">JSX</span>
<span className="badge-tech">Hooks</span>
<span className="badge-tech">Vite</span>
<span className="badge-tech">Next.js</span>
<span className="badge-tech">React Router</span>

React es una biblioteca de JavaScript para construir interfaces de usuario basadas en componentes. Desarrollada por Meta, es declarativa, eficiente y flexible.

:::info ¿Biblioteca o Framework?
React es una **biblioteca** — solo maneja la capa de vista (UI). Para routing, state management, fetching de datos, etc., combinas React con otras herramientas (React Router, Zustand, React Query...).
:::

---

## Crear un proyecto

```bash title="Con Vite (SPA recomendado)"
npm create vite@latest mi-app -- --template react
cd mi-app
npm install
npm run dev
```

```bash title="Con Next.js (SSR / Full-stack)"
npx create-next-app@latest mi-app
cd mi-app
npm run dev
```

---

## Componentes

```jsx title="Componente funcional básico"
// Un componente = función que devuelve JSX
function Tarjeta({ titulo, descripcion, precio }) {
  return (
    <div className="card">
      <h2>{titulo}</h2>
      <p>{descripcion}</p>
      <span>${precio.toLocaleString('es-CO')}</span>
    </div>
  );
}

// Uso
<Tarjeta titulo="Mochila" descripcion="Hecha a mano" precio={45000} />
```

:::tip Props inmutables
Las props son de **solo lectura** — nunca las modifiques dentro del componente. Para datos que cambian, usa estado (`useState`).
:::

---

## Hooks esenciales

### useState

```jsx
import { useState } from 'react';

function Contador() {
  const [count, setCount] = useState(0);   // valor inicial = 0

  return (
    <div>
      <p>Clicks: {count}</p>
      <button onClick={() => setCount(count + 1)}>+1</button>
      <button onClick={() => setCount(0)}>Reset</button>
    </div>
  );
}
```

```jsx title="Estado con objetos"
const [form, setForm] = useState({ nombre: '', email: '' });

// ✅ Siempre spread para no perder el resto de campos
const handleChange = (e) => {
  setForm({ ...form, [e.target.name]: e.target.value });
};
```

### useEffect

```jsx
import { useState, useEffect } from 'react';

function Productos() {
  const [items, setItems]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  useEffect(() => {
    // Se ejecuta después del primer render
    const fetchData = async () => {
      try {
        const res  = await fetch('/api/productos');
        const data = await res.json();
        setItems(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []); // [] = solo al montar el componente

  if (loading) return <p>Cargando...</p>;
  if (error)   return <p>Error: {error}</p>;

  return <ul>{items.map(p => <li key={p.id}>{p.nombre}</li>)}</ul>;
}
```

```jsx title="useEffect — dependencias y cleanup"
useEffect(() => {
  // Ejecuta cuando cambia `userId`
  fetchUser(userId);
}, [userId]);

useEffect(() => {
  // Con cleanup — importante para suscripciones y timers
  const interval = setInterval(() => {
    setTiempo(t => t + 1);
  }, 1000);

  return () => clearInterval(interval); // cleanup al desmontar
}, []);
```

### useRef

```jsx
import { useRef } from 'react';

function InputAutoFocus() {
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current.focus(); // acceso directo al DOM
  }, []);

  return <input ref={inputRef} placeholder="Escribe aquí..." />;
}
```

```jsx title="useRef para guardar valores sin re-render"
const renderCount = useRef(0);

useEffect(() => {
  renderCount.current += 1;  // no causa re-render, a diferencia de useState
});
```

### useMemo y useCallback

```jsx
import { useMemo, useCallback } from 'react';

// useMemo — memoriza el RESULTADO de un cálculo costoso
const productosFiltrados = useMemo(() => {
  return productos.filter(p => p.precio < precioMax);
}, [productos, precioMax]); // recalcula solo cuando cambian

// useCallback — memoriza una FUNCIÓN (evita recrearla en cada render)
const handleDelete = useCallback((id) => {
  setProductos(prev => prev.filter(p => p.id !== id));
}, []); // la función no cambia entre renders
```

---

## Custom Hooks

```jsx title="hooks/useFetch.js — Hook reutilizable"
import { useState, useEffect } from 'react';

export function useFetch(url) {
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  useEffect(() => {
    let cancelled = false;

    fetch(url)
      .then(r => r.json())
      .then(data => { if (!cancelled) setData(data); })
      .catch(err => { if (!cancelled) setError(err.message); })
      .finally(() => { if (!cancelled) setLoading(false); });

    return () => { cancelled = true; }; // cleanup para evitar memory leaks
  }, [url]);

  return { data, loading, error };
}

// Uso
const { data: productos, loading, error } = useFetch('/api/productos');
```

```jsx title="hooks/useLocalStorage.js"
import { useState } from 'react';

export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setStoredValue = (newValue) => {
    setValue(newValue);
    window.localStorage.setItem(key, JSON.stringify(newValue));
  };

  return [value, setStoredValue];
}

// Uso
const [tema, setTema] = useLocalStorage('tema', 'dark');
```

---

## Context — Estado global

```jsx title="context/AuthContext.jsx"
import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

// Provider — envuelve la app
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const login = async (credenciales) => {
    const res = await fetch('/api/login', {
      method: 'POST',
      body: JSON.stringify(credenciales),
    });
    const data = await res.json();
    setUser(data.user);
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook personalizado para consumir el contexto
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return context;
}
```

```jsx title="main.jsx — Envolver la app"
import { AuthProvider } from './context/AuthContext';

ReactDOM.createRoot(document.getElementById('root')).render(
  <AuthProvider>
    <App />
  </AuthProvider>
);
```

```jsx title="Consumir en cualquier componente"
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav>
      {user ? (
        <>
          <span>Hola, {user.nombre}</span>
          <button onClick={logout}>Cerrar sesión</button>
        </>
      ) : (
        <a href="/login">Iniciar sesión</a>
      )}
    </nav>
  );
}
```

---

## React Router v6

```bash
npm install react-router-dom
```

```jsx title="main.jsx — Configurar rutas"
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"           element={<Inicio />} />
        <Route path="/productos"  element={<Productos />} />
        <Route path="/productos/:id" element={<DetalleProducto />} />
        <Route path="/login"      element={<Login />} />
        <Route path="*"           element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
```

```jsx title="Hooks de React Router"
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';

function DetalleProducto() {
  const { id }       = useParams();      // /productos/42 → id = '42'
  const navigate     = useNavigate();
  const location     = useLocation();    // ruta actual

  return (
    <div>
      <h1>Producto #{id}</h1>
      <Link to="/productos">← Volver</Link>
      <button onClick={() => navigate('/')}>Ir al inicio</button>
    </div>
  );
}
```

```jsx title="Ruta protegida (requiere login)"
function RutaProtegida({ children }) {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" replace />;
  return children;
}

// Uso
<Route path="/dashboard" element={<RutaProtegida><Dashboard /></RutaProtegida>} />
```

---

## Formularios

```jsx title="Formulario controlado"
function FormularioContacto() {
  const [form, setForm]   = useState({ nombre: '', email: '', mensaje: '' });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.nombre) return setError('El nombre es obligatorio');

    const res = await fetch('/api/contacto', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    if (res.ok) setForm({ nombre: '', email: '', mensaje: '' });
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <p className="error">{error}</p>}
      <input
        name="nombre"
        value={form.nombre}
        onChange={handleChange}
        placeholder="Tu nombre"
      />
      <input
        name="email"
        type="email"
        value={form.email}
        onChange={handleChange}
        placeholder="tu@email.com"
      />
      <textarea
        name="mensaje"
        value={form.mensaje}
        onChange={handleChange}
      />
      <button type="submit">Enviar</button>
    </form>
  );
}
```

---

## Patrones importantes

### Renderizado condicional

```jsx
// Operador ternario
{user ? <Dashboard /> : <Login />}

// Short-circuit (solo si es true)
{isAdmin && <PanelAdmin />}

// Null para no renderizar nada
{mostrarModal ? <Modal /> : null}
```

### Listas y keys

```jsx
// ✅ Key única y estable — usar id, nunca el índice del array
{productos.map(producto => (
  <TarjetaProducto
    key={producto.id}
    {...producto}
  />
))}

// ❌ Evitar — el índice como key causa bugs con listas dinámicas
{items.map((item, index) => <Item key={index} />)}
```

### Lifting state up

```jsx
// El estado vive en el padre, los hijos reciben props y callbacks
function Padre() {
  const [valor, setValor] = useState('');

  return (
    <>
      <Input valor={valor} onChange={setValor} />
      <Vista texto={valor} />
    </>
  );
}
```

---

## Tabla resumen de Hooks

| Hook | Para qué | Cuándo usarlo |
|---|---|---|
| `useState` | Estado local del componente | Datos que cambian y deben re-renderizar |
| `useEffect` | Efectos secundarios | Fetch, suscripciones, manipular DOM |
| `useRef` | Referencia sin re-render | Acceder al DOM, guardar valores previos |
| `useContext` | Consumir contexto global | Evitar prop drilling |
| `useMemo` | Memorizar cálculos | Listas filtradas, cálculos costosos |
| `useCallback` | Memorizar funciones | Pasar callbacks a hijos optimizados |
| `useReducer` | Estado complejo | Cuando useState se vuelve complicado |

---

## Recursos
- [Documentación oficial React](https://react.dev)
- [React Router docs](https://reactrouter.com)
- Ver apunte `frameworks` → Next.js App Router

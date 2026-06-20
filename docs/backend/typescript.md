---
id: typescript
title: TypeScript
sidebar_label: TypeScript
sidebar_position: 5
tags: [backend, frontend, typescript]
---

# TypeScript

<span className="badge-tech">JavaScript</span>
<span className="badge-tech">Tipado estático</span>
<span className="badge-tech">OOP</span>

TypeScript es un superset tipado de JavaScript que compila a JS puro. Añade tipos estáticos, interfaces, enums y decoradores.

## Tipos básicos

```typescript
// Primitivos
let nombre: string  = 'Yuri';
let edad: number    = 25;
let activo: boolean = true;

// Arrays
let tags: string[]       = ['nestjs', 'react'];
let numeros: Array<number> = [1, 2, 3];

// Objeto tipado
let usuario: { id: number; nombre: string } = { id: 1, nombre: 'Yuri' };

// Union types
let id: string | number = '123';  // puede ser string o number
```

## Interfaces vs Types

```typescript
// Interface — preferida para objetos y contratos
interface Usuario {
  id: number;
  nombre: string;
  email?: string;  // opcional
}

// Type — para uniones, intersecciones, primitivos
type Estado = 'activo' | 'inactivo' | 'pendiente';
type ID = string | number;
```

## Genéricos

```typescript
// Función genérica
function primero<T>(arr: T[]): T {
  return arr[0];
}

const num  = primero([1, 2, 3]);       // T = number
const str  = primero(['a', 'b', 'c']); // T = string

// Respuesta API genérica
interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}
```

:::note tsconfig.json esencial
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "strict": true,
    "esModuleInterop": true,
    "outDir": "./dist"
  }
}
```
:::

---

*Completa con: decoradores, utility types (Partial, Pick, Omit), enums.*

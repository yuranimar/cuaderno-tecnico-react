---
id: lenguajes-programacion
title: Lenguajes de Programación
sidebar_label: Lenguajes
sidebar_position: 3
description: JavaScript, TypeScript, Python y PHP — sintaxis, diferencias clave, tipado, paradigmas y cuándo usar cada uno.
tags: [devops, javascript, typescript, python, php, lenguajes]
---

# Lenguajes de Programación

<span className="badge-tech">JavaScript</span>
<span className="badge-tech">TypeScript</span>
<span className="badge-tech">Python</span>
<span className="badge-tech">PHP</span>

---

## Comparativa general

| Característica | JavaScript | TypeScript | Python | PHP |
|---|---|---|---|---|
| **Tipado** | Dinámico | Estático opcional | Dinámico | Dinámico |
| **Paradigma** | Multi | Multi | Multi | Multi (OOP) |
| **Entorno** | Browser + Node.js | Compila a JS | Servidor, scripts, IA | Servidor web |
| **Curva de aprendizaje** | Baja | Media | Baja | Baja |
| **Uso en tu stack** | Frontend + Node.js | NestJS, Next.js | Django, scripts | Proyectos legacy |

---

## JavaScript

JavaScript es el único lenguaje nativo del navegador. Con Node.js también corre en el servidor, lo que lo hace el lenguaje más versátil del stack web.

### Tipos de datos

```javascript
// Primitivos
let nombre   = "Yuri";          // string
let edad     = 25;              // number (enteros y decimales juntos)
let activo   = true;            // boolean
let nada     = null;            // null (ausencia intencional)
let undef    = undefined;       // undefined (no asignado)
let id       = Symbol("id");    // symbol (único e inmutable)
let bigNum   = 9007199254740993n; // bigint

// Referencia
let array  = [1, 2, 3];
let objeto = { nombre: "Yuri", edad: 25 };
let fn     = function() {};
```

### Operadores importantes

```javascript
// Igualdad estricta (siempre usar ===, nunca ==)
0 == false    // true  ← peligroso
0 === false   // false ← correcto

// Nullish coalescing — valor por defecto si null/undefined
const ciudad = usuario.ciudad ?? "Medellín";

// Optional chaining — acceso seguro a propiedades anidadas
const codigo = usuario?.direccion?.codigoPostal;

// Logical assignment
usuario.nombre ||= "Anónimo";   // asigna si es falsy
usuario.cache  ??= {};           // asigna si es null/undefined
```

### Funciones

```javascript
// Declaración (hoisting — disponible antes de definirla)
function sumar(a, b) { return a + b; }

// Expresión (no tiene hoisting)
const sumar = function(a, b) { return a + b; };

// Arrow function (no tiene su propio `this`)
const sumar = (a, b) => a + b;
const cuadrado = n => n ** 2;
const saludar = () => "Hola";

// Parámetros por defecto
const saludar = (nombre = "visitante") => `Hola, ${nombre}!`;

// Rest parameters
const sumarTodo = (...numeros) => numeros.reduce((a, b) => a + b, 0);

// Desestructuración en parámetros
const mostrar = ({ nombre, email }) => console.log(nombre, email);
```

### Arrays — Métodos esenciales

```javascript
const productos = [
  { id: 1, nombre: "Mochila",  precio: 45000, activo: true  },
  { id: 2, nombre: "Sombrero", precio: 28000, activo: false },
  { id: 3, nombre: "Bolso",    precio: 62000, activo: true  },
];

// filter — filtrar elementos
const activos = productos.filter(p => p.activo);

// map — transformar cada elemento
const nombres = productos.map(p => p.nombre);
const conIVA  = productos.map(p => ({ ...p, precio: p.precio * 1.19 }));

// reduce — acumular a un solo valor
const totalVentas = productos.reduce((acc, p) => acc + p.precio, 0);

// find / findIndex — buscar el primero que cumpla
const bolso = productos.find(p => p.nombre === "Bolso");
const indice = productos.findIndex(p => p.id === 2);

// some / every
const hayActivos  = productos.some(p => p.activo);   // al menos uno
const todosCaros  = productos.every(p => p.precio > 20000); // todos

// sort (¡cuidado — muta el array original!)
const ordenados = [...productos].sort((a, b) => a.precio - b.precio);

// flat / flatMap
const matrix  = [[1,2],[3,4]].flat();           // [1,2,3,4]
const dobles  = [[1,2],[3,4]].flatMap(a => a.map(x => x * 2));
```

### Async/Await y Promesas

```javascript
// Promesa básica
const esperar = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Async/Await — forma moderna y legible
const obtenerUsuario = async (id) => {
  try {
    const res  = await fetch(`/api/usuarios/${id}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (error) {
    console.error("Error:", error.message);
    throw error;  // re-lanzar para que el caller lo maneje
  }
};

// Promise.all — ejecutar en paralelo
const [usuarios, productos] = await Promise.all([
  fetch("/api/usuarios").then(r => r.json()),
  fetch("/api/productos").then(r => r.json()),
]);

// Promise.allSettled — esperar todas aunque fallen
const resultados = await Promise.allSettled([
  fetchUsuario(1),
  fetchUsuario(2),
  fetchUsuario(999),  // este puede fallar
]);
resultados.forEach(r => {
  if (r.status === "fulfilled") console.log(r.value);
  else console.error(r.reason);
});
```

### Módulos ES6

```javascript
// ── Exportar ──────────────────────────────────────────────────
// Nombrada
export const PI = 3.14159;
export function formatearPrecio(n) { return `$${n.toLocaleString('es-CO')}`; }
export class Producto { /* ... */ }

// Por defecto (solo una por archivo)
export default function App() { /* ... */ }

// ── Importar ──────────────────────────────────────────────────
import App from './App';                          // default
import { PI, formatearPrecio } from './utils';    // nombradas
import { formatearPrecio as fmt } from './utils'; // alias
import * as utils from './utils';                 // todas
```

---

## TypeScript

TypeScript es JavaScript con tipado estático opcional. Se compila a JavaScript puro. Hace el código más predecible, auto-documentado y fácil de refactorizar.

### Tipos básicos

```typescript
// Primitivos tipados
let nombre:  string  = "Yuri";
let edad:    number  = 25;
let activo:  boolean = true;
let nada:    null    = null;

// Arrays
let numeros: number[]    = [1, 2, 3];
let nombres: Array<string> = ["Ana", "Luis"];

// Tuplas — array de longitud y tipos fijos
let coordenada: [number, number] = [6.25, -75.56];  // lat, lng Medellín

// Any (evitar) y Unknown (más seguro que any)
let dato: unknown = fetchData();
if (typeof dato === "string") dato.toUpperCase();  // type guard obligatorio

// Never — función que nunca retorna
function error(msg: string): never { throw new Error(msg); }
```

### Interfaces y Types

```typescript
// Interface — para objetos (extensible, declaración merging)
interface Usuario {
  id:       number;
  nombre:   string;
  email:    string;
  avatar?:  string;        // opcional
  readonly createdAt: Date; // inmutable
}

// Type alias — más flexible (uniones, tuplas, primitivos)
type ID        = string | number;
type Estado    = "activo" | "inactivo" | "suspendido";  // union literal
type Callback  = (error: Error | null, data?: any) => void;
type Par<T>    = [T, T];

// Diferencia práctica: interface para objetos/clases, type para el resto
```

### Generics

```typescript
// Función genérica — reutilizable con cualquier tipo
function primero<T>(arr: T[]): T | undefined {
  return arr[0];
}

const num = primero([1, 2, 3]);     // T = number
const str = primero(["a", "b"]);    // T = string

// Respuesta de API genérica
interface ApiResponse<T> {
  data:    T;
  status:  number;
  message: string;
}

type ProductosResponse = ApiResponse<Producto[]>;
type UsuarioResponse   = ApiResponse<Usuario>;

// Constraint — T debe tener propiedad `id`
function buscarPorId<T extends { id: number }>(items: T[], id: number): T | undefined {
  return items.find(item => item.id === id);
}
```

### Utility Types

```typescript
interface Producto {
  id:          number;
  nombre:      string;
  precio:      number;
  descripcion: string;
  activo:      boolean;
}

// Partial — todos los campos opcionales
type ProductoUpdate = Partial<Producto>;

// Required — todos obligatorios
type ProductoCompleto = Required<Producto>;

// Pick — solo algunos campos
type ProductoResumen = Pick<Producto, "id" | "nombre" | "precio">;

// Omit — excluir campos
type ProductoSinId = Omit<Producto, "id">;

// Record — objeto con claves y valores tipados
type Precios = Record<string, number>;
// equivale a: { [key: string]: number }

// Readonly — inmutable
type ProductoFijo = Readonly<Producto>;
```

---

## Python

Python es el lenguaje más usado en ciencia de datos, IA y scripts de automatización. Su sintaxis limpia y legible lo hace ideal para prototipos rápidos y backends con Django.

### Tipos y estructuras de datos

```python
# Tipos básicos
nombre  = "Yuri"           # str
edad    = 25               # int
precio  = 45000.50         # float
activo  = True             # bool (mayúscula!)
nada    = None             # equivale a null

# Colecciones
lista    = [1, 2, 3]               # mutable, ordenada
tupla    = (1, 2, 3)               # inmutable
conjunto = {1, 2, 3}               # sin duplicados
diccionario = {"nombre": "Yuri", "edad": 25}

# F-strings (Python 3.6+)
msg = f"Hola, {nombre}! Tienes {edad} años."

# Multiline strings
sql = """
    SELECT *
    FROM usuarios
    WHERE activo = TRUE
"""
```

### List comprehensions y expresiones

```python
numeros = range(10)

# List comprehension
cuadrados = [x**2 for x in numeros]
pares     = [x for x in numeros if x % 2 == 0]
pares_sq  = [x**2 for x in numeros if x % 2 == 0]

# Dict comprehension
precios = {"mochila": 45000, "sombrero": 28000, "bolso": 62000}
con_iva = {k: v * 1.19 for k, v in precios.items()}

# Generator expression (más eficiente en memoria)
total = sum(x**2 for x in range(1000000))
```

### Funciones

```python
# Parámetros por defecto y keyword arguments
def saludar(nombre: str, formal: bool = False) -> str:
    if formal:
        return f"Buenos días, {nombre}."
    return f"¡Hola, {nombre}!"

saludar("Yuri")                  # posicional
saludar(nombre="Yuri", formal=True)  # keyword

# *args y **kwargs
def sumar(*numeros):
    return sum(numeros)

def crear_usuario(**datos):
    return datos  # {"nombre": "Yuri", "email": "..."}

# Lambda
cuadrado = lambda x: x ** 2
ordenar_por_precio = sorted(productos, key=lambda p: p["precio"])
```

### Clases

```python
from dataclasses import dataclass
from typing import Optional

# Dataclass (Python 3.7+) — la forma moderna y concisa
@dataclass
class Producto:
    id:          int
    nombre:      str
    precio:      float
    descripcion: str = ""          # valor por defecto
    activo:      bool = True

    def precio_con_iva(self) -> float:
        return self.precio * 1.19

    def __repr__(self) -> str:
        return f"Producto({self.nombre}, ${self.precio:,.0f})"

# Uso
p = Producto(id=1, nombre="Mochila", precio=45000)
print(p.precio_con_iva())   # 53550.0
print(p)                    # Producto(Mochila, $45,000)
```

### Manejo de errores

```python
# Try/except específico
try:
    resultado = int(input("Ingresa un número: "))
    division  = 100 / resultado
except ValueError:
    print("Eso no es un número")
except ZeroDivisionError:
    print("No se puede dividir entre cero")
except Exception as e:
    print(f"Error inesperado: {e}")
else:
    print(f"Resultado: {division}")    # se ejecuta si no hubo excepción
finally:
    print("Esto siempre se ejecuta")  # cierre de recursos

# Context manager (with) — manejo automático de recursos
with open("archivo.txt", "r", encoding="utf-8") as f:
    contenido = f.read()
# f se cierra automáticamente al salir del bloque
```

### Módulos y entorno virtual

```bash
# Crear entorno virtual (siempre en proyectos Python)
python -m venv venv
source venv/bin/activate         # Linux/Mac
venv\Scripts\activate            # Windows

# Instalar dependencias
pip install django requests pandas

# Guardar dependencias
pip freeze > requirements.txt

# Instalar desde requirements
pip install -r requirements.txt
```

---

## PHP

PHP es un lenguaje del lado servidor especialmente diseñado para la web. Aunque tiene una reputación mixta, sigue siendo el lenguaje que impulsa WordPress y muchos sistemas legacy.

### Sintaxis básica

```php
<?php

// Variables (siempre empiezan con $)
$nombre = "Yuri";
$edad   = 25;
$activo = true;
$nada   = null;

// Echo y print
echo "Hola, $nombre!";
echo "Hola, " . $nombre . "!";  // concatenación con punto

// Arrays
$colores = ["rojo", "verde", "azul"];
$usuario = [
    "nombre" => "Yuri",
    "email"  => "yuri@email.com",
    "edad"   => 25,
];

echo $usuario["nombre"];   // Yuri
echo $colores[0];          // rojo
```

### Funciones y clases

```php
<?php

// Función con tipos (PHP 7.4+)
function formatearPrecio(float $precio, string $moneda = "COP"): string {
    return number_format($precio, 0, ",", ".") . " " . $moneda;
}

// Clase
class Producto {
    public function __construct(
        private int    $id,
        private string $nombre,
        private float  $precio,
        private bool   $activo = true,
    ) {}

    public function getPrecioConIVA(): float {
        return $this->precio * 1.19;
    }

    public function toArray(): array {
        return [
            "id"     => $this->id,
            "nombre" => $this->nombre,
            "precio" => $this->precio,
        ];
    }
}

$p = new Producto(1, "Mochila", 45000);
echo $p->getPrecioConIVA();   // 53550
```

### PHP en el contexto actual

:::note ¿Cuándo usar PHP hoy?
PHP sigue siendo relevante para: mantener proyectos legacy, desarrollar con WordPress/WooCommerce, usar Laravel (uno de los frameworks mejor diseñados), o cuando el cliente ya tiene hosting compartido (cPanel) que no soporta Node.js.
:::

| Laravel | WordPress | PHP puro |
|---|---|---|
| API RESTful robusta | Sitios de contenido | Scripts simples de servidor |
| Eloquent ORM | Plugins / temas | Formularios de contacto |
| Blade templates | WooCommerce | Proyectos heredados |

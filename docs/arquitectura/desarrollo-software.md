---
id: desarrollo-software
title: Desarrollo de Software
sidebar_label: Desarrollo de Software
sidebar_position: 2
description: SDLC, principios SOLID, Clean Code, DRY, patrones de diseño, testing y herramientas de calidad.
tags: [arquitectura, solid, clean-code, patrones, testing, sdlc]
---

# Desarrollo de Software

<span className="badge-tech">SOLID</span>
<span className="badge-tech">Clean Code</span>
<span className="badge-tech">Patrones</span>
<span className="badge-tech">Testing</span>
<span className="badge-tech">SDLC</span>

---

## Ciclo de vida del software (SDLC)

```
┌─────────────┐    ┌──────────┐    ┌─────────┐    ┌────────────┐
│ Planificación│ →  │ Análisis │ →  │  Diseño │ →  │ Desarrollo │
└─────────────┘    └──────────┘    └─────────┘    └─────┬──────┘
       ▲                                                  │
       │                                                  ▼
┌──────────────┐    ┌──────────┐    ┌──────────────┐  ┌──────┐
│Mantenimiento │ ←  │  Deploy  │ ←  │    Pruebas   │← │Build │
└──────────────┘    └──────────┘    └──────────────┘  └──────┘
```

### Modelos de desarrollo

| Modelo | Enfoque | Cuándo usarlo |
|---|---|---|
| **Cascada (Waterfall)** | Fases secuenciales, sin retorno | Proyectos con requisitos muy fijos (gobierno, construcción) |
| **Ágil (Scrum/Kanban)** | Iterativo, entregas frecuentes | La mayoría de proyectos de software |
| **Espiral** | Iterativo con análisis de riesgos | Proyectos grandes y complejos |
| **DevOps** | Integración continua, deploy continuo | Productos con alta frecuencia de cambio |

---

## Principios SOLID

SOLID es el acrónimo de 5 principios de diseño orientado a objetos formulados por Robert C. Martin (Uncle Bob).

### S — Single Responsibility Principle

> Una clase debe tener una sola razón para cambiar.

```typescript
// ❌ Mal — UserService hace demasiado
class UserService {
  createUser(data: CreateUserDto) { /* lógica de creación */ }
  sendWelcomeEmail(user: User) { /* lógica de email */ }
  generateUserReport(userId: number) { /* lógica de reportes */ }
  hashPassword(password: string) { /* lógica de seguridad */ }
}

// ✅ Bien — cada clase tiene una sola responsabilidad
class UserService     { createUser(data: CreateUserDto) { /* ... */ } }
class EmailService    { sendWelcomeEmail(user: User)    { /* ... */ } }
class ReportService   { generateUserReport(id: number)  { /* ... */ } }
class CryptoService   { hashPassword(pass: string)      { /* ... */ } }
```

### O — Open/Closed Principle

> Una entidad debe estar abierta para extensión, pero cerrada para modificación.

```typescript
// ❌ Mal — hay que modificar la función para cada nuevo tipo de descuento
function calcularDescuento(tipo: string, precio: number): number {
  if (tipo === 'estudiante') return precio * 0.1;
  if (tipo === 'empleado')   return precio * 0.2;
  if (tipo === 'vip')        return precio * 0.3;
  // Si llega un nuevo tipo, hay que tocar este código ← problema
  return 0;
}

// ✅ Bien — extender sin modificar
interface EstrategiaDescuento {
  calcular(precio: number): number;
}

class DescuentoEstudiante implements EstrategiaDescuento {
  calcular(precio: number) { return precio * 0.1; }
}
class DescuentoEmpleado implements EstrategiaDescuento {
  calcular(precio: number) { return precio * 0.2; }
}
class DescuentoVIP implements EstrategiaDescuento {
  calcular(precio: number) { return precio * 0.3; }
}

// Agregar un nuevo descuento = nueva clase, sin tocar las existentes
class DescuentoTemporada implements EstrategiaDescuento {
  calcular(precio: number) { return precio * 0.15; }
}
```

### L — Liskov Substitution Principle

> Los objetos de una subclase deben poder reemplazar a los de la clase padre sin alterar el comportamiento correcto del programa.

```typescript
// ❌ Mal — Pinguino viola LSP: hereda volar() pero no puede volar
class Ave {
  volar() { console.log('Volando...'); }
}
class Pinguino extends Ave {
  volar() { throw new Error('¡Los pingüinos no vuelan!'); }
}

// ✅ Bien — separar las interfaces según comportamiento real
interface Ave { comer(): void; }
interface AveVoladora extends Ave { volar(): void; }

class Aguila  implements AveVoladora { comer() {} volar() {} }
class Pinguino implements Ave        { comer() {} }
```

### I — Interface Segregation Principle

> Los clientes no deben verse obligados a depender de interfaces que no usan.

```typescript
// ❌ Mal — una interfaz enorme que no todos implementan igual
interface Trabajador {
  trabajar(): void;
  comer(): void;
  dormir(): void;
  recargarBateria(): void;  // ← un humano no recarga batería
}

// ✅ Bien — interfaces pequeñas y específicas
interface Trabajable   { trabajar(): void; }
interface Descansable  { comer(): void; dormir(): void; }
interface Recargable   { recargarBateria(): void; }

class Humano  implements Trabajable, Descansable { /* ... */ }
class Robot   implements Trabajable, Recargable  { /* ... */ }
```

### D — Dependency Inversion Principle

> Los módulos de alto nivel no deben depender de módulos de bajo nivel. Ambos deben depender de abstracciones.

```typescript
// ❌ Mal — UserService depende directamente de la implementación concreta
class UserService {
  private db = new MySQLDatabase();  // acoplado a MySQL

  async findUser(id: number) {
    return this.db.query(`SELECT * FROM users WHERE id = ${id}`);
  }
}

// ✅ Bien — depender de la abstracción (interfaz), no de la implementación
interface Database {
  query(sql: string, params?: any[]): Promise<any>;
}

class MySQLDatabase  implements Database { async query(...) { /* ... */ } }
class PostgresDatabase implements Database { async query(...) { /* ... */ } }
class MockDatabase   implements Database { async query(...) { /* datos de prueba */ } }

class UserService {
  constructor(private db: Database) {}  // ← inyección de dependencias

  async findUser(id: number) {
    return this.db.query('SELECT * FROM users WHERE id = ?', [id]);
  }
}

// En producción: new UserService(new MySQLDatabase())
// En tests:      new UserService(new MockDatabase())
```

---

## Clean Code

Principios de Robert C. Martin para escribir código legible, mantenible y profesional.

### Nombres que revelan intención

```javascript
// ❌ Nombres crípticos
const d  = new Date();
const u  = getU();
const ys = users.filter(x => x.a && x.t > d);

// ✅ Nombres que se explican solos
const fechaHoy = new Date();
const usuario  = obtenerUsuarioActual();
const usuariosActivosHoy = users.filter(u => u.activo && u.ultimaConexion > fechaHoy);
```

### Funciones pequeñas y con un propósito

```javascript
// ❌ Función que hace todo
async function procesarPedido(pedidoId) {
  const pedido = await db.query(`SELECT * FROM pedidos WHERE id = ${pedidoId}`);
  if (!pedido) throw new Error('No encontrado');
  let total = 0;
  for (const item of pedido.items) {
    total += item.precio * item.cantidad;
    if (item.descuento) total -= item.descuento;
  }
  total += total * 0.19; // IVA
  await db.execute(`UPDATE pedidos SET total = ${total} WHERE id = ${pedidoId}`);
  await sendEmail(pedido.usuario.email, `Tu pedido: $${total}`);
  return total;
}

// ✅ Funciones pequeñas, una responsabilidad cada una
const calcularSubtotal = (items) =>
  items.reduce((acc, item) => acc + (item.precio * item.cantidad) - (item.descuento || 0), 0);

const aplicarIVA = (subtotal, tasa = 0.19) => subtotal * (1 + tasa);

const actualizarTotalPedido = (pedidoId, total) =>
  db.execute('UPDATE pedidos SET total = ? WHERE id = ?', [total, pedidoId]);

async function procesarPedido(pedidoId) {
  const pedido   = await obtenerPedido(pedidoId);
  const subtotal = calcularSubtotal(pedido.items);
  const total    = aplicarIVA(subtotal);

  await actualizarTotalPedido(pedidoId, total);
  await notificarUsuario(pedido.usuario.email, total);

  return total;
}
```

### Comentarios — cuándo sí y cuándo no

```javascript
// ❌ Comentario que repite el código (ruido)
// Incrementar i en 1
i++;

// ❌ Comentario que miente (peor que ninguno)
// Calcular el precio sin IVA
const precio = base * 1.19;

// ✅ Comentar el PORQUÉ, no el QUÉ
// El cliente acordó que los artesanos con menos de 6 meses
// no tienen comisión en los primeros 10 pedidos (acuerdo comercial 2024)
const comision = artesano.mesesActivo >= 6 ? total * 0.08 : 0;

// ✅ Comentarios de advertencia
// CUIDADO: esta operación no es transaccional — si falla a mitad
// puede dejar el inventario inconsistente. Ver issue #234
await actualizarInventario(items);
```

---

## Principios complementarios

### DRY — Don't Repeat Yourself

```javascript
// ❌ Código duplicado
function calcularIVAProducto(precio) { return precio * 0.19; }
function calcularIVAServicio(precio) { return precio * 0.19; }
function calcularIVAEnvio(precio)    { return precio * 0.19; }

// ✅ Una sola fuente de verdad
const TASA_IVA = 0.19;
const calcularIVA = (precio, tasa = TASA_IVA) => precio * tasa;
```

### KISS — Keep It Simple, Stupid

```javascript
// ❌ Solución compleja para un problema simple
const esMayorDeEdad = (edad) => {
  return edad >= 18 ? true : edad < 18 ? false : null;
};

// ✅ La solución más simple que funciona
const esMayorDeEdad = (edad) => edad >= 18;
```

### YAGNI — You Aren't Gonna Need It

```javascript
// ❌ Construir para un futuro imaginario
class UserService {
  // "por si acaso necesitamos varios tipos de usuarios en el futuro"
  createUser() {}
  createAdminUser() {}
  createSuperAdminUser() {}
  createGuestUser() {}
  createEnterpriseUser() {}
}

// ✅ Construir solo lo que necesitas HOY
class UserService {
  createUser() {}
}
// Si mañana necesitas admins, lo agregas entonces
```

---

## Patrones de diseño (Design Patterns)

### Creacionales

```typescript
// Singleton — una sola instancia en toda la app
class DatabaseConnection {
  private static instance: DatabaseConnection;

  private constructor() { /* conectar a la BD */ }

  static getInstance(): DatabaseConnection {
    if (!DatabaseConnection.instance) {
      DatabaseConnection.instance = new DatabaseConnection();
    }
    return DatabaseConnection.instance;
  }
}

const db1 = DatabaseConnection.getInstance();
const db2 = DatabaseConnection.getInstance();
console.log(db1 === db2); // true — misma instancia
```

```typescript
// Factory — crear objetos sin especificar la clase concreta
interface Notificacion { enviar(mensaje: string): void; }

class NotificacionEmail implements Notificacion {
  enviar(msg: string) { console.log(`Email: ${msg}`); }
}
class NotificacionSMS implements Notificacion {
  enviar(msg: string) { console.log(`SMS: ${msg}`); }
}
class NotificacionPush implements Notificacion {
  enviar(msg: string) { console.log(`Push: ${msg}`); }
}

class NotificacionFactory {
  static crear(tipo: 'email' | 'sms' | 'push'): Notificacion {
    const mapa = { email: NotificacionEmail, sms: NotificacionSMS, push: NotificacionPush };
    return new mapa[tipo]();
  }
}

const notif = NotificacionFactory.crear('email');
notif.enviar('Tu pedido fue confirmado');
```

### Estructurales

```typescript
// Repository — abstrae el acceso a datos
interface ProductoRepository {
  findAll(): Promise<Producto[]>;
  findById(id: number): Promise<Producto>;
  save(producto: Producto): Promise<Producto>;
  delete(id: number): Promise<void>;
}

class MySQLProductoRepository implements ProductoRepository {
  async findAll() { /* consulta MySQL */ }
  async findById(id) { /* consulta MySQL */ }
  async save(p)   { /* INSERT / UPDATE MySQL */ }
  async delete(id){ /* DELETE MySQL */ }
}

class SupabaseProductoRepository implements ProductoRepository {
  async findAll() { /* consulta Supabase */ }
  // ...
}
```

### Comportamentales

```typescript
// Observer — suscribirse a eventos
class EventEmitter {
  private listeners: Map<string, Function[]> = new Map();

  on(evento: string, callback: Function) {
    if (!this.listeners.has(evento)) this.listeners.set(evento, []);
    this.listeners.get(evento)!.push(callback);
  }

  emit(evento: string, data?: any) {
    this.listeners.get(evento)?.forEach(cb => cb(data));
  }
}

const bus = new EventEmitter();
bus.on('pedido:creado', (pedido) => enviarEmailConfirmacion(pedido));
bus.on('pedido:creado', (pedido) => actualizarInventario(pedido));
bus.emit('pedido:creado', { id: 1, total: 45000 });
```

---

## Testing

### Tipos de pruebas

```
Tests E2E (End-to-End)          ← Playwright, Cypress
        │ Más lentos, más costosos
        │
Tests de integración            ← Supertest (Express)
        │
Tests unitarios                 ← Jest, Vitest
        │ Más rápidos, más baratos
```

### Jest — Pruebas unitarias

```bash
npm install -D jest @types/jest
# o Vitest (más rápido, compatible con Vite):
npm install -D vitest
```

```typescript title="utils/precio.test.ts"
import { calcularIVA, formatearPrecio } from './precio';

describe('calcularIVA', () => {
  it('calcula el 19% correctamente', () => {
    expect(calcularIVA(100000)).toBe(19000);
  });

  it('acepta una tasa personalizada', () => {
    expect(calcularIVA(100000, 0.05)).toBe(5000);
  });

  it('devuelve 0 para precios de 0', () => {
    expect(calcularIVA(0)).toBe(0);
  });
});

describe('formatearPrecio', () => {
  it('formatea con símbolo de peso colombiano', () => {
    expect(formatearPrecio(45000)).toBe('$45.000');
  });
});
```

```typescript title="Mocks — simular dependencias"
// Mockear un módulo
jest.mock('../services/email.service');
import { EmailService } from '../services/email.service';

it('envía email al crear un usuario', async () => {
  const mockSend = jest.fn().mockResolvedValue({ sent: true });
  (EmailService as jest.Mock).mockImplementation(() => ({ send: mockSend }));

  await userService.create({ nombre: 'Yuri', email: 'yuri@test.com' });

  expect(mockSend).toHaveBeenCalledTimes(1);
  expect(mockSend).toHaveBeenCalledWith(expect.objectContaining({
    to: 'yuri@test.com',
  }));
});
```

---

## Herramientas de calidad

```bash
# ESLint — detectar errores y malos patrones
npm install -D eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin
npx eslint --init

# Prettier — formateo consistente
npm install -D prettier
# .prettierrc:
# { "singleQuote": true, "semi": true, "tabWidth": 2, "trailingComma": "es5" }

# Husky + lint-staged — verificar ANTES del commit
npm install -D husky lint-staged
npx husky init
# .husky/pre-commit:
# npx lint-staged

# package.json:
# "lint-staged": { "*.{ts,js}": ["eslint --fix", "prettier --write"] }
```

:::tip Automatizar la calidad
La calidad de código que depende de la disciplina individual falla. Automatiza con Husky para que ESLint y Prettier corran en cada commit, y agrega los tests en CI/CD. Lo que no se verifica automáticamente, eventualmente se olvida.
:::

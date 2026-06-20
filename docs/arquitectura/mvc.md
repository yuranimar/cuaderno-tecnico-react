---
id: mvc
title: Patrón MVC
sidebar_label: MVC
sidebar_position: 1
description: Model-View-Controller — separación de responsabilidades, flujo de datos, implementación en Express y Django, y variantes del patrón.
tags: [arquitectura, mvc, patrones, express, django, mvvm]
---

# Patrón MVC — Model View Controller

<span className="badge-tech">Express</span>
<span className="badge-tech">Django</span>
<span className="badge-tech">Arquitectura</span>
<span className="badge-tech">Patrones</span>

MVC es un patrón de arquitectura de software que separa una aplicación en tres componentes interconectados, con el objetivo de separar la representación de la información de la lógica del negocio.

<div className="concept-card">
<strong>📌 ¿Por qué MVC?</strong>
Facilita el mantenimiento (cada capa tiene una responsabilidad clara), el trabajo en equipo (frontend y backend pueden trabajar en paralelo), las pruebas unitarias (se testea cada capa por separado) y la reutilización de código.
</div>

---

## Los tres componentes

```
                    ┌─────────────┐
    HTTP Request    │             │
  ─────────────────►  Controller │
                    │             │
                    └──────┬──────┘
                           │ llama
                    ┌──────▼──────┐
                    │             │◄──── Base de datos
                    │    Model    │
                    │             │
                    └──────┬──────┘
                           │ datos
                    ┌──────▼──────┐
                    │             │
                    │    View     │────► HTTP Response
                    │             │
                    └─────────────┘
```

| Componente | Responsabilidad | Ejemplo en Express |
|---|---|---|
| **Model** | Datos, validación, lógica de negocio, acceso a BD | `user.model.js` |
| **View** | Presentación — HTML, JSON, plantillas | `users/index.ejs` o `res.json()` |
| **Controller** | Recibe la petición, orquesta Model y View, devuelve respuesta | `user.controller.js` |

---

## MVC en Express — Implementación completa

### Estructura de carpetas

```
src/
├── config/
│   └── database.js          ← Conexión a la BD
│
├── models/
│   └── producto.model.js    ← Consultas SQL / lógica de datos
│
├── controllers/
│   └── producto.controller.js  ← Lógica de cada petición HTTP
│
├── routes/
│   └── producto.routes.js   ← Definición de rutas → apunta a controllers
│
├── middlewares/
│   ├── auth.middleware.js   ← Verificar JWT
│   └── validate.middleware.js  ← Validar body
│
├── views/                   ← Si usas EJS/Pug (omitir si es API REST)
│   └── productos/
│       └── index.ejs
│
└── app.js                   ← Bootstrap: Express + rutas + middlewares
```

### Model

```javascript title="models/producto.model.js"
import pool from '../config/database.js';

const ProductoModel = {

  // Obtener todos con filtros opcionales
  async findAll({ categoria, precioMax, activo = true } = {}) {
    let sql    = 'SELECT * FROM productos WHERE activo = ?';
    let params = [activo];

    if (categoria) { sql += ' AND categoria_id = ?'; params.push(categoria); }
    if (precioMax) { sql += ' AND precio <= ?';      params.push(precioMax); }

    sql += ' ORDER BY created_at DESC';
    const [rows] = await pool.execute(sql, params);
    return rows;
  },

  // Buscar por ID — lanza error si no existe
  async findById(id) {
    const [rows] = await pool.execute(
      `SELECT p.*, c.nombre AS categoria_nombre
       FROM productos p
       LEFT JOIN categorias c ON p.categoria_id = c.id
       WHERE p.id = ?`,
      [id]
    );
    if (!rows.length) throw new Error(`Producto #${id} no encontrado`);
    return rows[0];
  },

  // Crear
  async create({ nombre, precio, categoria_id, descripcion }) {
    const [result] = await pool.execute(
      'INSERT INTO productos (nombre, precio, categoria_id, descripcion) VALUES (?, ?, ?, ?)',
      [nombre, precio, categoria_id, descripcion]
    );
    return this.findById(result.insertId);
  },

  // Actualizar
  async update(id, campos) {
    const keys   = Object.keys(campos);
    const values = Object.values(campos);
    const set    = keys.map(k => `${k} = ?`).join(', ');

    const [result] = await pool.execute(
      `UPDATE productos SET ${set}, updated_at = NOW() WHERE id = ?`,
      [...values, id]
    );
    if (!result.affectedRows) throw new Error(`Producto #${id} no encontrado`);
    return this.findById(id);
  },

  // Eliminar (soft delete)
  async delete(id) {
    const [result] = await pool.execute(
      'UPDATE productos SET activo = FALSE, updated_at = NOW() WHERE id = ?',
      [id]
    );
    if (!result.affectedRows) throw new Error(`Producto #${id} no encontrado`);
    return { deleted: true, id };
  },
};

export default ProductoModel;
```

### Controller

```javascript title="controllers/producto.controller.js"
import ProductoModel from '../models/producto.model.js';

// GET /api/productos
export const getAll = async (req, res, next) => {
  try {
    const filtros   = req.query;  // ?categoria=1&precioMax=50000
    const productos = await ProductoModel.findAll(filtros);
    res.json({ data: productos, total: productos.length });
  } catch (error) {
    next(error);  // pasa al middleware de errores
  }
};

// GET /api/productos/:id
export const getById = async (req, res, next) => {
  try {
    const producto = await ProductoModel.findById(Number(req.params.id));
    res.json({ data: producto });
  } catch (error) {
    if (error.message.includes('no encontrado')) {
      return res.status(404).json({ error: error.message });
    }
    next(error);
  }
};

// POST /api/productos
export const create = async (req, res, next) => {
  try {
    const producto = await ProductoModel.create(req.body);
    res.status(201).json({ data: producto, message: 'Producto creado' });
  } catch (error) {
    next(error);
  }
};

// PUT /api/productos/:id
export const update = async (req, res, next) => {
  try {
    const producto = await ProductoModel.update(Number(req.params.id), req.body);
    res.json({ data: producto, message: 'Producto actualizado' });
  } catch (error) {
    if (error.message.includes('no encontrado')) {
      return res.status(404).json({ error: error.message });
    }
    next(error);
  }
};

// DELETE /api/productos/:id
export const remove = async (req, res, next) => {
  try {
    const result = await ProductoModel.delete(Number(req.params.id));
    res.json(result);
  } catch (error) {
    if (error.message.includes('no encontrado')) {
      return res.status(404).json({ error: error.message });
    }
    next(error);
  }
};
```

### Routes

```javascript title="routes/producto.routes.js"
import { Router }         from 'express';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import * as ctrl          from '../controllers/producto.controller.js';

const router = Router();

// Públicas
router.get('/',    ctrl.getAll);
router.get('/:id', ctrl.getById);

// Protegidas (requieren token JWT)
router.post('/',     authMiddleware, ctrl.create);
router.put('/:id',   authMiddleware, ctrl.update);
router.delete('/:id', authMiddleware, ctrl.remove);

export default router;
```

### Middleware de autenticación

```javascript title="middlewares/auth.middleware.js"
import jwt from 'jsonwebtoken';

export const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];  // 'Bearer <token>'

  if (!token) {
    return res.status(401).json({ error: 'Token requerido' });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload;  // disponible en el controller
    next();
  } catch {
    return res.status(401).json({ error: 'Token inválido o expirado' });
  }
};
```

---

## MVC en Django — MVT

:::note Django usa MVT
En Django el patrón se llama **MVT** (Model-View-Template). La "View" de Django equivale al Controller de MVC clásico; el "Template" es la View.
:::

```
MVC clásico          Django MVT
───────────          ──────────
Model           →    Model    (models.py)
Controller      →    View     (views.py)
View            →    Template (templates/*.html)
```

```python title="models.py"
from django.db import models
from django.contrib.auth.models import User

class Categoria(models.Model):
    nombre = models.CharField(max_length=100)
    slug   = models.SlugField(unique=True)

    def __str__(self): return self.nombre

class Producto(models.Model):
    nombre      = models.CharField(max_length=200)
    descripcion = models.TextField(blank=True)
    precio      = models.DecimalField(max_digits=12, decimal_places=2)
    imagen      = models.ImageField(upload_to='productos/', blank=True)
    categoria   = models.ForeignKey(Categoria, on_delete=models.PROTECT, related_name='productos')
    activo      = models.BooleanField(default=True)
    created_at  = models.DateTimeField(auto_now_add=True)
    updated_at  = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name_plural = 'productos'

    def __str__(self): return self.nombre

    @property
    def precio_con_iva(self):
        return self.precio * 1.19
```

```python title="views.py — Class-Based Views"
from django.views.generic import ListView, DetailView, CreateView
from django.contrib.auth.mixins import LoginRequiredMixin
from django.urls import reverse_lazy
from .models import Producto

class ProductoListView(ListView):
    model               = Producto
    template_name       = 'productos/lista.html'
    context_object_name = 'productos'
    paginate_by         = 12

    def get_queryset(self):
        qs = super().get_queryset().filter(activo=True)
        categoria = self.request.GET.get('categoria')
        if categoria:
            qs = qs.filter(categoria__slug=categoria)
        return qs

class ProductoDetailView(DetailView):
    model               = Producto
    template_name       = 'productos/detalle.html'
    context_object_name = 'producto'

class ProductoCreateView(LoginRequiredMixin, CreateView):
    model         = Producto
    fields        = ['nombre', 'descripcion', 'precio', 'imagen', 'categoria']
    template_name = 'productos/crear.html'
    success_url   = reverse_lazy('productos:lista')
```

```python title="urls.py"
from django.urls import path
from . import views

app_name = 'productos'

urlpatterns = [
    path('',          views.ProductoListView.as_view(),   name='lista'),
    path('<int:pk>/', views.ProductoDetailView.as_view(), name='detalle'),
    path('nuevo/',    views.ProductoCreateView.as_view(), name='crear'),
]
```

---

## Variantes del patrón

| Patrón | Diferencia con MVC | Usado en |
|---|---|---|
| **MVP** (Model-View-Presenter) | El Presenter no conoce la View directamente | Android nativo |
| **MVVM** (Model-View-ViewModel) | La View se bindea al ViewModel reactivamente | Vue.js, Angular, React con hooks |
| **MVT** | View = Controller, Template = View | Django |
| **MVC API** | Sin View de HTML — el Controller devuelve JSON | APIs REST (Express, NestJS) |

---

## Reglas de oro del MVC

:::tip Fat Models, Thin Controllers
Pon la lógica de negocio en el Model, no en el Controller. El Controller debe ser un orquestador delgado: recibe, delega y responde. Si tu controller tiene más de 30 líneas, algo de lógica pertenece al Model o a un Service.
:::

```javascript
// ❌ Controller gordo — lógica de negocio en el lugar equivocado
export const create = async (req, res) => {
  const { nombre, precio } = req.body;
  if (!nombre) return res.status(400).json({ error: 'Nombre requerido' });
  if (precio < 0) return res.status(400).json({ error: 'Precio inválido' });
  const precioConIVA = precio * 1.19;
  const [result] = await pool.execute('INSERT INTO ...', [...]);
  // emails, notificaciones, logs...
  res.status(201).json({ ... });
};

// ✅ Controller delgado — delega al Model/Service
export const create = async (req, res, next) => {
  try {
    const producto = await ProductoModel.create(req.body);
    res.status(201).json({ data: producto });
  } catch (error) {
    next(error);
  }
};
```

---
id: bases-datos
title: Bases de Datos
sidebar_label: Bases de Datos
sidebar_position: 4
tags: [backend, sql, mysql, postgresql, supabase]
---

# Bases de Datos

<span className="badge-tech">SQL</span>
<span className="badge-tech">MySQL</span>
<span className="badge-tech">PostgreSQL</span>
<span className="badge-tech">Supabase</span>

## Tipos de bases de datos

| Tipo | Ejemplos | Cuándo usar |
|---|---|---|
| **Relacional (SQL)** | MySQL, PostgreSQL | Datos estructurados, relaciones claras |
| **No relacional** | MongoDB, Redis | Datos flexibles, alta velocidad |
| **BaaS** | Supabase, Firebase | Proyectos rápidos con auth incluida |

## SQL Esencial

```sql title="CRUD básico"
-- Crear tabla
CREATE TABLE usuarios (
  id      INT AUTO_INCREMENT PRIMARY KEY,
  nombre  VARCHAR(100) NOT NULL,
  email   VARCHAR(150) UNIQUE NOT NULL,
  creado  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insertar
INSERT INTO usuarios (nombre, email) VALUES ('Yuri', 'yuri@ejemplo.com');

-- Leer
SELECT * FROM usuarios WHERE id = 1;
SELECT nombre, email FROM usuarios ORDER BY creado DESC LIMIT 10;

-- Actualizar
UPDATE usuarios SET nombre = 'Yurani' WHERE id = 1;

-- Eliminar
DELETE FROM usuarios WHERE id = 1;
```

```sql title="JOINs"
-- INNER JOIN — solo coincidencias en ambas tablas
SELECT u.nombre, p.titulo
FROM usuarios u
INNER JOIN pedidos p ON p.usuario_id = u.id;

-- LEFT JOIN — todos los usuarios, con o sin pedidos
SELECT u.nombre, COUNT(p.id) AS total_pedidos
FROM usuarios u
LEFT JOIN pedidos p ON p.usuario_id = u.id
GROUP BY u.id;
```

## Supabase (PostgreSQL como servicio)

```javascript title="Consulta con Supabase JS Client"
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

// SELECT
const { data, error } = await supabase
  .from('productos')
  .select('*')
  .eq('activo', true)
  .order('creado', { ascending: false });

// INSERT
const { data, error } = await supabase
  .from('productos')
  .insert({ nombre: 'Tejido Isamar', precio: 45000 })
  .select();
```

:::tip Supabase Storage
Para archivos e imágenes usa `supabase.storage.from('bucket').upload(path, file)`. Ya lo usaste en el proyecto Isamar 🧶
:::

---

*Completa con: índices, transacciones, ORM con Prisma/TypeORM, migraciones.*

---
id: apis
title: APIs REST
sidebar_label: APIs REST
sidebar_position: 3
tags: [backend, api, rest, http]
---

# APIs REST

<span className="badge-tech">HTTP</span>
<span className="badge-tech">JSON</span>
<span className="badge-tech">REST</span>
<span className="badge-tech">JWT</span>

Una **API REST** (Representational State Transfer) es una interfaz que permite la comunicación entre sistemas usando el protocolo HTTP con verbos estandarizados.

## Verbos HTTP y su uso correcto

| Verbo | Acción | Ejemplo |
|---|---|---|
| `GET` | Leer / listar | `GET /usuarios` |
| `POST` | Crear | `POST /usuarios` |
| `PUT` | Reemplazar completo | `PUT /usuarios/1` |
| `PATCH` | Actualizar parcial | `PATCH /usuarios/1` |
| `DELETE` | Eliminar | `DELETE /usuarios/1` |

## Códigos de estado

| Código | Significado |
|---|---|
| `200 OK` | Éxito general |
| `201 Created` | Recurso creado |
| `204 No Content` | Éxito sin cuerpo (DELETE) |
| `400 Bad Request` | Error del cliente |
| `401 Unauthorized` | Sin autenticación |
| `403 Forbidden` | Sin permisos |
| `404 Not Found` | Recurso no existe |
| `500 Internal Server Error` | Error del servidor |

## Estructura de una respuesta estándar

```json title="Respuesta exitosa"
{
  "success": true,
  "data": {
    "id": 1,
    "nombre": "Yuri",
    "email": "yuri@ejemplo.com"
  },
  "message": "Usuario encontrado"
}
```

```json title="Respuesta de error"
{
  "success": false,
  "error": {
    "code": "USER_NOT_FOUND",
    "message": "El usuario con id 99 no existe"
  }
}
```

## Autenticación con JWT

```bash
# Flujo completo:
# 1. POST /auth/login  → devuelve { access_token, refresh_token }
# 2. Todas las rutas protegidas: Header Authorization: Bearer <token>
# 3. POST /auth/refresh → renueva el access_token
```

```http title="Header de autenticación"
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

:::caution Seguridad básica
Nunca guardes el JWT en `localStorage` en producción. Usa `httpOnly cookies` para evitar ataques XSS.
:::

---

*Completa con: paginación, filtros, versionado de APIs, documentación con Swagger.*

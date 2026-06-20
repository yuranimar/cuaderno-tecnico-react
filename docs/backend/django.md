---
id: django
title: Django — Framework Backend Python
sidebar_label: Django
sidebar_position: 2
tags: [backend, django, python]
---

# Django — Framework Backend Python

<span className="badge-tech">Python</span>
<span className="badge-tech">ORM</span>
<span className="badge-tech">MVT</span>

Django es un framework web de alto nivel escrito en Python que fomenta el desarrollo rápido y el diseño limpio y pragmático. Sigue el patrón **MVT (Model-View-Template)**.

:::info Filosofía
"Batteries included" — Django viene con ORM, admin, autenticación, sistema de URLs y más, listo para usar sin configuración extra.
:::

## Instalación

```bash
pip install django
django-admin startproject mi_proyecto
cd mi_proyecto
python manage.py startapp usuarios
python manage.py runserver
```

## Estructura del Proyecto

```
mi_proyecto/
├── manage.py
├── mi_proyecto/
│   ├── settings.py      ← Configuración global
│   ├── urls.py          ← URLs raíz
│   └── wsgi.py
└── usuarios/            ← App de ejemplo
    ├── models.py        ← Modelos (ORM)
    ├── views.py         ← Lógica de vistas
    ├── urls.py          ← URLs de la app
    └── admin.py         ← Panel admin
```

## Modelo (ORM)

```python title="usuarios/models.py"
from django.db import models

class Usuario(models.Model):
    nombre = models.CharField(max_length=100)
    email  = models.EmailField(unique=True)
    activo = models.BooleanField(default=True)
    creado = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.nombre

    class Meta:
        ordering = ['-creado']
```

```bash
# Aplicar cambios al modelo
python manage.py makemigrations
python manage.py migrate
```

## Vista basada en función

```python title="usuarios/views.py"
from django.http import JsonResponse
from .models import Usuario

def lista_usuarios(request):
    usuarios = list(Usuario.objects.values('id', 'nombre', 'email'))
    return JsonResponse({'usuarios': usuarios})
```

## URLs

```python title="usuarios/urls.py"
from django.urls import path
from . import views

urlpatterns = [
    path('usuarios/', views.lista_usuarios, name='lista-usuarios'),
]
```

:::tip Django REST Framework
Para construir APIs JSON robustas, instala `djangorestframework` y usa `ModelViewSet` + `Router` en lugar de vistas manuales.
:::

---

*Completa este apunte con: autenticación, Django REST Framework, deployment en Railway.*

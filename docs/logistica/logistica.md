---
id: logistica
title: Desarrollo de Software en Logística
sidebar_label: Logística
sidebar_position: 1
description: Sistemas de gestión logística, modelado de datos para inventarios y pedidos, APIs de tracking, automatización y proyecto LogiWeb con Django.
tags: [logistica, django, supply-chain, inventarios, wms, apis, logiWeb]
---

# Desarrollo de Software en Logística

<span className="badge-tech">Django</span>
<span className="badge-tech">Python</span>
<span className="badge-tech">PostgreSQL</span>
<span className="badge-tech">WMS</span>
<span className="badge-tech">APIs REST</span>

La logística es uno de los dominios más ricos para el desarrollo de software: volumen de datos, automatización de procesos, integraciones con terceros y reglas de negocio complejas hacen de este campo un área de alto impacto técnico.

---

## Tipos de sistemas logísticos

| Sistema | Sigla | Función principal |
|---|---|---|
| **Warehouse Management System** | WMS | Gestión de bodegas: ubicaciones, entradas, salidas, inventario |
| **Transportation Management System** | TMS | Gestión de flotas, rutas, carriers, tracking |
| **Order Management System** | OMS | Ciclo de vida del pedido desde la compra hasta la entrega |
| **Enterprise Resource Planning** | ERP | Sistema integrado: finanzas, compras, inventario, ventas |
| **Inventory Management System** | IMS | Control de stock, alertas de reorden, valoración |
| **Last Mile Delivery** | LMD | Entrega final al cliente: asignación, seguimiento, prueba de entrega |

---

## Modelado de datos — Core logístico

### Entidades principales y sus relaciones

```
Proveedor ──┐
            ├──► OrdenCompra ──► Recepción ──► Inventario ──► Ubicación
Cliente  ──┐│
           ├┘
           └──► Pedido ──► LineaPedido ──► Despacho ──► Tracking
                              │
                          Producto ──► Lote ──► Vencimiento
```

### Modelos Django — WMS completo

```python title="models.py — Productos e Inventario"
from django.db import models
from django.contrib.auth.models import User
from decimal import Decimal


class Categoria(models.Model):
    nombre = models.CharField(max_length=100)
    slug   = models.SlugField(unique=True)

    def __str__(self): return self.nombre


class Producto(models.Model):
    UNIDADES = [
        ('UND', 'Unidad'),
        ('KG',  'Kilogramo'),
        ('LT',  'Litro'),
        ('MT',  'Metro'),
        ('CJA', 'Caja'),
    ]

    codigo       = models.CharField(max_length=50, unique=True)
    nombre       = models.CharField(max_length=200)
    descripcion  = models.TextField(blank=True)
    categoria    = models.ForeignKey(Categoria, on_delete=models.PROTECT,
                                     related_name='productos')
    unidad_medida = models.CharField(max_length=3, choices=UNIDADES, default='UND')
    peso_kg      = models.DecimalField(max_digits=8, decimal_places=3, default=0)
    volumen_m3   = models.DecimalField(max_digits=8, decimal_places=4, default=0)
    activo       = models.BooleanField(default=True)
    created_at   = models.DateTimeField(auto_now_add=True)

    def __str__(self): return f'{self.codigo} — {self.nombre}'


class Ubicacion(models.Model):
    """Posición física dentro de la bodega: pasillo-rack-nivel-posicion"""
    bodega  = models.CharField(max_length=50)
    pasillo = models.CharField(max_length=10)
    rack    = models.CharField(max_length=10)
    nivel   = models.IntegerField()
    posicion = models.IntegerField()
    activa  = models.BooleanField(default=True)

    class Meta:
        unique_together = ['bodega', 'pasillo', 'rack', 'nivel', 'posicion']

    def __str__(self):
        return f'{self.bodega}-{self.pasillo}{self.rack}-{self.nivel}-{self.posicion}'


class Inventario(models.Model):
    producto   = models.ForeignKey(Producto,  on_delete=models.PROTECT,
                                   related_name='inventarios')
    ubicacion  = models.ForeignKey(Ubicacion, on_delete=models.PROTECT,
                                   related_name='inventarios')
    lote       = models.CharField(max_length=100, blank=True)
    cantidad   = models.DecimalField(max_digits=12, decimal_places=3)
    costo_unit = models.DecimalField(max_digits=12, decimal_places=2)
    vencimiento = models.DateField(null=True, blank=True)
    updated_at  = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ['producto', 'ubicacion', 'lote']

    @property
    def valor_total(self):
        return self.cantidad * self.costo_unit

    def __str__(self):
        return f'{self.producto.codigo} | {self.ubicacion} | {self.cantidad}'
```

```python title="models.py — Pedidos y Despacho"
class Cliente(models.Model):
    nombre    = models.CharField(max_length=200)
    nit       = models.CharField(max_length=20, unique=True)
    email     = models.EmailField()
    telefono  = models.CharField(max_length=20, blank=True)
    direccion = models.TextField()
    ciudad    = models.CharField(max_length=100)
    activo    = models.BooleanField(default=True)

    def __str__(self): return f'{self.nit} — {self.nombre}'


class Pedido(models.Model):
    ESTADOS = [
        ('BORRADOR',   'Borrador'),
        ('CONFIRMADO', 'Confirmado'),
        ('EN_PICKING', 'En picking'),
        ('DESPACHADO', 'Despachado'),
        ('ENTREGADO',  'Entregado'),
        ('CANCELADO',  'Cancelado'),
    ]

    numero     = models.CharField(max_length=20, unique=True, editable=False)
    cliente    = models.ForeignKey(Cliente, on_delete=models.PROTECT,
                                   related_name='pedidos')
    estado     = models.CharField(max_length=20, choices=ESTADOS, default='BORRADOR')
    fecha_req  = models.DateField(help_text='Fecha requerida de entrega')
    observaciones = models.TextField(blank=True)
    creado_por = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def save(self, *args, **kwargs):
        if not self.numero:
            from datetime import date
            ultimo = Pedido.objects.filter(
                created_at__year=date.today().year
            ).count() + 1
            self.numero = f'PED-{date.today().year}-{ultimo:05d}'
        super().save(*args, **kwargs)

    @property
    def total(self):
        return sum(l.subtotal for l in self.lineas.all())

    def __str__(self): return f'{self.numero} | {self.cliente.nombre}'


class LineaPedido(models.Model):
    pedido    = models.ForeignKey(Pedido,   on_delete=models.CASCADE,
                                  related_name='lineas')
    producto  = models.ForeignKey(Producto, on_delete=models.PROTECT)
    cantidad  = models.DecimalField(max_digits=12, decimal_places=3)
    precio    = models.DecimalField(max_digits=12, decimal_places=2)
    descuento = models.DecimalField(max_digits=5,  decimal_places=2, default=0)

    @property
    def subtotal(self):
        return self.cantidad * self.precio * (1 - self.descuento / 100)
```

---

## Lógica de negocio — Servicios

```python title="services/inventario_service.py"
from django.db import transaction
from django.utils import timezone
from ..models import Inventario, Producto, MovimientoInventario


class InventarioService:

    @staticmethod
    @transaction.atomic
    def entrada(producto_id: int, ubicacion_id: int, cantidad: float,
                costo_unit: float, lote: str = '', referencia: str = ''):
        """
        Registra una entrada de mercancía al inventario.
        Usa select_for_update() para evitar condiciones de carrera.
        """
        inventario, creado = Inventario.objects.select_for_update().get_or_create(
            producto_id  = producto_id,
            ubicacion_id = ubicacion_id,
            lote         = lote,
            defaults     = {'cantidad': 0, 'costo_unit': costo_unit},
        )

        # Actualizar costo promedio ponderado si ya existía
        if not creado:
            stock_actual  = inventario.cantidad
            costo_actual  = inventario.costo_unit
            nuevo_stock   = stock_actual + cantidad
            inventario.costo_unit = (
                (stock_actual * costo_actual + cantidad * costo_unit) / nuevo_stock
            )

        inventario.cantidad += cantidad
        inventario.save()

        # Registrar movimiento para auditoría
        MovimientoInventario.objects.create(
            inventario   = inventario,
            tipo         = 'ENTRADA',
            cantidad     = cantidad,
            referencia   = referencia,
            fecha        = timezone.now(),
        )

        return inventario

    @staticmethod
    @transaction.atomic
    def salida(producto_id: int, cantidad: float, referencia: str = ''):
        """
        FIFO — sale del inventario más antiguo primero.
        """
        inventarios = Inventario.objects.select_for_update().filter(
            producto_id = producto_id,
            cantidad__gt = 0,
        ).order_by('updated_at')  # el más antiguo primero

        pendiente = cantidad
        movimientos = []

        for inv in inventarios:
            if pendiente <= 0:
                break

            a_descontar  = min(inv.cantidad, pendiente)
            inv.cantidad -= a_descontar
            inv.save()
            pendiente   -= a_descontar

            movimientos.append(MovimientoInventario(
                inventario = inv,
                tipo       = 'SALIDA',
                cantidad   = a_descontar,
                referencia = referencia,
                fecha      = timezone.now(),
            ))

        if pendiente > 0:
            raise ValueError(
                f'Stock insuficiente. Falta: {pendiente} unidades del producto #{producto_id}'
            )

        MovimientoInventario.objects.bulk_create(movimientos)
        return True

    @staticmethod
    def stock_disponible(producto_id: int) -> float:
        from django.db.models import Sum
        resultado = Inventario.objects.filter(
            producto_id=producto_id,
            cantidad__gt=0,
        ).aggregate(total=Sum('cantidad'))
        return float(resultado['total'] or 0)

    @staticmethod
    def alertas_reorden():
        """Productos cuyo stock está en o por debajo del punto de reorden."""
        from django.db.models import Sum, F
        return Producto.objects.annotate(
            stock_total=Sum('inventarios__cantidad')
        ).filter(
            activo=True,
            stock_total__lte=F('punto_reorden'),
        ).order_by('stock_total')
```

---

## API REST para logística

```python title="serializers.py"
from rest_framework import serializers
from .models import Pedido, LineaPedido, Producto, Inventario


class LineaPedidoSerializer(serializers.ModelSerializer):
    producto_nombre = serializers.CharField(source='producto.nombre', read_only=True)
    subtotal        = serializers.DecimalField(max_digits=12, decimal_places=2, read_only=True)

    class Meta:
        model  = LineaPedido
        fields = ['id', 'producto', 'producto_nombre', 'cantidad', 'precio',
                  'descuento', 'subtotal']


class PedidoSerializer(serializers.ModelSerializer):
    lineas        = LineaPedidoSerializer(many=True, read_only=True)
    cliente_nombre = serializers.CharField(source='cliente.nombre', read_only=True)
    total         = serializers.DecimalField(max_digits=12, decimal_places=2, read_only=True)

    class Meta:
        model  = Pedido
        fields = ['id', 'numero', 'cliente', 'cliente_nombre', 'estado',
                  'fecha_req', 'total', 'lineas', 'created_at']
        read_only_fields = ['numero', 'created_at']


class StockSerializer(serializers.ModelSerializer):
    producto_codigo = serializers.CharField(source='producto.codigo', read_only=True)
    producto_nombre = serializers.CharField(source='producto.nombre', read_only=True)
    ubicacion_str   = serializers.CharField(source='ubicacion.__str__', read_only=True)
    valor_total     = serializers.DecimalField(max_digits=14, decimal_places=2, read_only=True)

    class Meta:
        model  = Inventario
        fields = ['id', 'producto_codigo', 'producto_nombre', 'ubicacion_str',
                  'lote', 'cantidad', 'costo_unit', 'valor_total', 'vencimiento']
```

```python title="views.py — ViewSets con filtros"
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from .models import Pedido, Inventario
from .serializers import PedidoSerializer, StockSerializer
from .services.inventario_service import InventarioService


class PedidoViewSet(viewsets.ModelViewSet):
    queryset           = Pedido.objects.select_related('cliente').prefetch_related('lineas__producto')
    serializer_class   = PedidoSerializer
    permission_classes = [IsAuthenticated]
    filter_backends    = [DjangoFilterBackend]
    filterset_fields   = ['estado', 'cliente', 'fecha_req']

    def perform_create(self, serializer):
        serializer.save(creado_por=self.request.user)

    @action(detail=True, methods=['post'])
    def confirmar(self, request, pk=None):
        """POST /api/pedidos/{id}/confirmar/"""
        pedido = self.get_object()
        if pedido.estado != 'BORRADOR':
            return Response(
                {'error': f'No se puede confirmar un pedido en estado {pedido.estado}'},
                status=status.HTTP_400_BAD_REQUEST
            )
        pedido.estado = 'CONFIRMADO'
        pedido.save()
        return Response({'estado': pedido.estado, 'numero': pedido.numero})

    @action(detail=True, methods=['post'])
    def despachar(self, request, pk=None):
        """POST /api/pedidos/{id}/despachar/ — descuenta inventario (FIFO)"""
        pedido = self.get_object()
        try:
            for linea in pedido.lineas.all():
                InventarioService.salida(
                    producto_id = linea.producto_id,
                    cantidad    = float(linea.cantidad),
                    referencia  = pedido.numero,
                )
            pedido.estado = 'DESPACHADO'
            pedido.save()
            return Response({'estado': pedido.estado})
        except ValueError as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


class InventarioViewSet(viewsets.ReadOnlyModelViewSet):
    queryset         = Inventario.objects.select_related('producto', 'ubicacion')
    serializer_class = StockSerializer

    @action(detail=False, methods=['get'])
    def alertas(self, request):
        """GET /api/inventario/alertas/ — productos bajo el punto de reorden"""
        productos = InventarioService.alertas_reorden()
        return Response({
            'total': productos.count(),
            'productos': [
                {
                    'codigo':       p.codigo,
                    'nombre':       p.nombre,
                    'stock_actual': p.stock_total or 0,
                }
                for p in productos
            ]
        })
```

---

## Tracking de pedidos

```python title="models.py — Historial de estados"
class EventoTracking(models.Model):
    EVENTOS = [
        ('PEDIDO_RECIBIDO',  '📋 Pedido recibido'),
        ('EN_PREPARACION',   '📦 En preparación'),
        ('LISTO_DESPACHO',   '✅ Listo para despacho'),
        ('EN_CAMINO',        '🚚 En camino'),
        ('EN_CIUDAD',        '🏙️ En ciudad destino'),
        ('EN_REPARTO',       '🛵 En reparto'),
        ('ENTREGADO',        '✅ Entregado'),
        ('INTENTO_FALLIDO',  '⚠️ Intento de entrega fallido'),
        ('DEVUELTO',         '↩️ Devuelto al origen'),
    ]

    pedido    = models.ForeignKey(Pedido, on_delete=models.CASCADE,
                                  related_name='tracking')
    evento    = models.CharField(max_length=30, choices=EVENTOS)
    ciudad    = models.CharField(max_length=100, blank=True)
    detalle   = models.TextField(blank=True)
    latitud   = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    longitud  = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)
    registrado_por = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)

    class Meta:
        ordering = ['timestamp']

    def __str__(self):
        return f'{self.pedido.numero} | {self.get_evento_display()} | {self.timestamp}'
```

```python title="Endpoint público de tracking (sin auth)"
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny

@api_view(['GET'])
@permission_classes([AllowAny])
def tracking_publico(request, numero_pedido):
    """GET /api/tracking/{numero_pedido}/ — para que el cliente consulte su pedido"""
    try:
        pedido = Pedido.objects.prefetch_related('tracking').get(numero=numero_pedido)
    except Pedido.DoesNotExist:
        return Response({'error': 'Pedido no encontrado'}, status=404)

    eventos = pedido.tracking.values(
        'evento', 'ciudad', 'detalle', 'timestamp'
    )

    return Response({
        'numero':  pedido.numero,
        'estado':  pedido.get_estado_display(),
        'cliente': pedido.cliente.nombre,
        'fecha_req': pedido.fecha_req,
        'timeline': list(eventos),
    })
```

---

## KPIs — Queries analíticos

```python title="analytics/kpis.py"
from django.db.models import Count, Sum, Avg, F, ExpressionWrapper, DurationField
from django.utils import timezone
from datetime import timedelta
from ..models import Pedido, EventoTracking


def fill_rate(fecha_inicio, fecha_fin):
    """% de pedidos entregados completos en el período"""
    total     = Pedido.objects.filter(created_at__range=[fecha_inicio, fecha_fin]).count()
    completos = Pedido.objects.filter(
        created_at__range=[fecha_inicio, fecha_fin],
        estado='ENTREGADO'
    ).count()
    return round((completos / total * 100) if total else 0, 2)


def on_time_delivery(fecha_inicio, fecha_fin):
    """% de pedidos entregados en o antes de la fecha requerida"""
    entregados = Pedido.objects.filter(
        created_at__range=[fecha_inicio, fecha_fin],
        estado='ENTREGADO'
    )
    a_tiempo = entregados.filter(
        tracking__evento='ENTREGADO',
        tracking__timestamp__date__lte=F('fecha_req')
    ).distinct().count()

    total = entregados.count()
    return round((a_tiempo / total * 100) if total else 0, 2)


def pedidos_por_estado():
    return Pedido.objects.values('estado').annotate(
        cantidad=Count('id'),
        valor_total=Sum('lineas__precio')
    ).order_by('estado')
```

---

## LogiWeb — Proyecto Django

Sistema de gestión logística desarrollado como proyecto de portafolio.

### Stack técnico

```
Backend:    Django 4.2 + Django REST Framework
Base datos: PostgreSQL (Railway en producción)
Auth:       Django Auth + JWT (djangorestframework-simplejwt)
Admin:      Django Admin personalizado
Deploy:     Railway
```

### Comandos de desarrollo

```bash
# Clonar y configurar
git clone https://github.com/yuranimar/logiweb.git
cd logiweb
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Variables de entorno (.env)
cp .env.example .env
# Editar: SECRET_KEY, DATABASE_URL, DEBUG

# Migrar y cargar datos de ejemplo
python manage.py migrate
python manage.py loaddata fixtures/initial_data.json
python manage.py createsuperuser

# Correr servidor
python manage.py runserver
```

```python title="settings.py — Configuración clave"
import os
from pathlib import Path
from decouple import config

BASE_DIR = Path(__file__).resolve().parent.parent

SECRET_KEY = config('SECRET_KEY')
DEBUG      = config('DEBUG', default=False, cast=bool)

ALLOWED_HOSTS = config('ALLOWED_HOSTS', default='localhost').split(',')

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME':   config('DB_NAME'),
        'USER':   config('DB_USER'),
        'PASSWORD': config('DB_PASSWORD'),
        'HOST':   config('DB_HOST', default='localhost'),
        'PORT':   config('DB_PORT', default='5432'),
    }
}

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    # Terceros
    'rest_framework',
    'corsheaders',
    'django_filters',
    # Propios
    'inventario',
    'pedidos',
    'clientes',
    'tracking',
]

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ],
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticated',
    ],
    'DEFAULT_FILTER_BACKENDS': [
        'django_filters.rest_framework.DjangoFilterBackend',
    ],
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 20,
}
```

---

## Conceptos logísticos clave para el desarrollador

| Concepto | Relevancia técnica |
|---|---|
| **FIFO / FEFO** | Algoritmo de salida de inventario (First In First Out / First Expired First Out) |
| **Lote** | Agrupación trazable de productos — campo en el modelo de inventario |
| **Punto de reorden** | Umbral para alertas automáticas — query con `stock__lte=F('punto_reorden')` |
| **Lead time** | Tiempo entre pedido y entrega — calculado con diferencia de fechas |
| **Picking** | Proceso de recolección de productos para un pedido — estado en el workflow |
| **Cross-docking** | Mercancía que no se almacena — flujo directo recepción → despacho |
| **SKU** | Stock Keeping Unit — código único por variante de producto |
| **Trazabilidad** | Capacidad de rastrear cada movimiento — `MovimientoInventario` y `EventoTracking` |

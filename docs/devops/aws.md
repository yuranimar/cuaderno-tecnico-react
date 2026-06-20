---
id: aws
title: AWS — Amazon Web Services
sidebar_label: AWS
sidebar_position: 2
description: Servicios principales de AWS — EC2, S3, Lambda, RDS, IAM, CloudFront y despliegue de aplicaciones Node.js y Python.
tags: [devops, aws, cloud, deploy, ec2, s3, lambda, rds]
---

# AWS — Amazon Web Services

<span className="badge-tech">EC2</span>
<span className="badge-tech">S3</span>
<span className="badge-tech">Lambda</span>
<span className="badge-tech">RDS</span>
<span className="badge-tech">IAM</span>
<span className="badge-tech">CloudFront</span>

AWS (Amazon Web Services) es la plataforma de servicios en la nube más completa del mundo. Ofrece más de 200 servicios bajo demanda: cómputo, almacenamiento, bases de datos, redes, IA, seguridad y más.

:::info Modelo de responsabilidad compartida
AWS es responsable de la seguridad **de** la nube (infraestructura física). Tú eres responsable de la seguridad **en** la nube (configuración, datos, accesos, aplicaciones).
:::

---

## Servicios principales

| Servicio | Categoría | Descripción |
|---|---|---|
| **EC2** | Cómputo | Servidores virtuales configurables |
| **S3** | Almacenamiento | Archivos, imágenes, backups, hosting estático |
| **Lambda** | Serverless | Funciones sin servidor, pago por ejecución |
| **RDS** | Base de datos | MySQL, PostgreSQL, Aurora gestionados |
| **DynamoDB** | NoSQL | Base de datos clave-valor serverless |
| **IAM** | Seguridad | Usuarios, roles y políticas de acceso |
| **CloudFront** | CDN | Distribución de contenido global |
| **Elastic Beanstalk** | PaaS | Deploy automático de apps |
| **ECS / EKS** | Contenedores | Docker y Kubernetes gestionados |
| **VPC** | Redes | Red privada virtual aislada |
| **Route 53** | DNS | Gestión de dominios y DNS |
| **SES** | Email | Envío de emails transaccionales |
| **SNS / SQS** | Mensajería | Notificaciones y colas de mensajes |

---

## IAM — Identidad y Acceso

<div className="concept-card">
<strong>📌 Principio de mínimo privilegio</strong>
Cada usuario, rol o servicio debe tener solo los permisos estrictamente necesarios para su función. Nunca usar el usuario root para tareas del día a día.
</div>

```bash
# Nunca hacer esto en producción:
# - Usar credenciales root para la app
# - Dejar access keys en el código fuente
# - Dar permisos AdministratorAccess a una función Lambda
```

```json title="Política IAM — Acceso solo a un bucket S3"
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:GetObject",
        "s3:PutObject",
        "s3:DeleteObject"
      ],
      "Resource": "arn:aws:s3:::mi-bucket-produccion/*"
    },
    {
      "Effect": "Allow",
      "Action": "s3:ListBucket",
      "Resource": "arn:aws:s3:::mi-bucket-produccion"
    }
  ]
}
```

---

## EC2 — Instancias virtuales

### Tipos de instancias más usados

| Familia | Optimizado para | Ejemplo |
|---|---|---|
| **t3 / t4g** | Uso general / dev | `t3.micro` (free tier) |
| **m6i** | Uso general producción | `m6i.large` |
| **c6i** | Cómputo intensivo | `c6i.xlarge` |
| **r6i** | Memoria (bases de datos) | `r6i.large` |

```bash title="Conectarse via SSH"
# Dar permisos correctos a la clave
chmod 400 mi-clave.pem

# Conectar
ssh -i "mi-clave.pem" ubuntu@ec2-xx-xx-xx-xx.compute.amazonaws.com

# Conectar con alias (agregar en ~/.ssh/config)
# Host mi-servidor
#   HostName ec2-xx-xx-xx-xx.compute.amazonaws.com
#   User ubuntu
#   IdentityFile ~/.ssh/mi-clave.pem
ssh mi-servidor
```

```bash title="Setup de servidor Ubuntu — Node.js"
# Actualizar sistema
sudo apt update && sudo apt upgrade -y

# Instalar Node.js 20 LTS
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verificar
node -v && npm -v

# Instalar PM2 — process manager para Node.js
sudo npm install -g pm2

# Iniciar aplicación
pm2 start dist/main.js --name "mi-api"
pm2 startup                    # configurar inicio automático
pm2 save                       # guardar configuración

# Comandos PM2
pm2 list                       # ver procesos
pm2 logs mi-api                # ver logs en tiempo real
pm2 restart mi-api
pm2 stop mi-api
```

```bash title="Instalar Nginx como reverse proxy"
sudo apt install -y nginx

# Configurar sitio
sudo nano /etc/nginx/sites-available/mi-app
```

```nginx title="/etc/nginx/sites-available/mi-app"
server {
    listen 80;
    server_name mi-dominio.com www.mi-dominio.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Activar sitio y recargar Nginx
sudo ln -s /etc/nginx/sites-available/mi-app /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx

# SSL gratuito con Let's Encrypt
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d mi-dominio.com
```

---

## S3 — Almacenamiento de objetos

```bash title="CLI — Operaciones básicas"
# Configurar credenciales
aws configure

# Listar buckets
aws s3 ls

# Listar contenido de un bucket
aws s3 ls s3://mi-bucket/

# Subir archivo
aws s3 cp foto.jpg s3://mi-bucket/uploads/foto.jpg

# Subir carpeta completa
aws s3 sync ./dist s3://mi-bucket/ --delete

# Descargar archivo
aws s3 cp s3://mi-bucket/archivo.pdf ./local/

# Eliminar archivo
aws s3 rm s3://mi-bucket/uploads/foto.jpg
```

```javascript title="SDK JavaScript — Subir archivo desde Node.js"
import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId:     process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// ── Subir archivo ──────────────────────────────────────────────
export const uploadFile = async (buffer, filename, mimetype) => {
  const command = new PutObjectCommand({
    Bucket:      process.env.S3_BUCKET,
    Key:         `uploads/${Date.now()}-${filename}`,
    Body:        buffer,
    ContentType: mimetype,
  });
  const result = await s3.send(command);
  return `https://${process.env.S3_BUCKET}.s3.amazonaws.com/uploads/${filename}`;
};

// ── URL firmada (acceso temporal a archivos privados) ──────────
export const getSignedFileUrl = async (key, expiresIn = 3600) => {
  const command = new GetObjectCommand({
    Bucket: process.env.S3_BUCKET,
    Key:    key,
  });
  return await getSignedUrl(s3, command, { expiresIn });
};
```

### Hosting estático con S3 + CloudFront

```bash
# 1. Crear bucket con nombre del dominio
# 2. Habilitar "Static website hosting"
# 3. Bucket policy para acceso público:
```

```json title="Bucket policy — Acceso público de solo lectura"
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::mi-sitio.com/*"
    }
  ]
}
```

---

## Lambda — Funciones Serverless

```javascript title="Handler básico de Lambda"
export const handler = async (event, context) => {
  console.log('Evento recibido:', JSON.stringify(event, null, 2));

  try {
    // Lógica de la función
    const { nombre } = event.body ? JSON.parse(event.body) : event;

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        mensaje: `Hola, ${nombre}!`,
        timestamp: new Date().toISOString(),
      }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
```

### Casos de uso de Lambda

```
Trigger                    Lambda                    Destino
──────────────────────────────────────────────────────────
API Gateway (HTTP)    →    Procesar petición    →    DynamoDB / RDS
S3 (nuevo archivo)    →    Redimensionar imagen  →    S3 (thumbnail)
SQS (mensaje)         →    Procesar pedido      →    Email (SES)
EventBridge (cron)    →    Tarea programada     →    BD / Reporte
```

---

## RDS — Bases de datos gestionadas

```bash title="Conexión a RDS PostgreSQL desde EC2"
# Instalar cliente
sudo apt install -y postgresql-client

# Conectar
psql -h mi-rds.xxxxx.us-east-1.rds.amazonaws.com \
     -U admin \
     -d mi_base_datos
```

```javascript title="Pool de conexiones con pg (Node.js)"
import { Pool } from 'pg';

const pool = new Pool({
  host:     process.env.DB_HOST,      // endpoint RDS
  port:     5432,
  user:     process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl:      { rejectUnauthorized: false },  // requerido en RDS
  max:      10,                             // máximo de conexiones
  idleTimeoutMillis: 30000,
});

export default pool;
```

---

## Variables de entorno — Gestión segura

```bash title=".env (nunca subir a Git)"
AWS_ACCESS_KEY_ID=AKIA...
AWS_SECRET_ACCESS_KEY=...
AWS_REGION=us-east-1
S3_BUCKET=mi-bucket-produccion
DB_HOST=mi-rds.xxxxx.us-east-1.rds.amazonaws.com
DB_USER=admin
DB_PASSWORD=...
DB_NAME=produccion
```

:::tip AWS Secrets Manager
Para producción seria, usa **AWS Secrets Manager** o **Parameter Store** en lugar de variables de entorno. Permite rotar secretos automáticamente y auditar accesos.
:::

---

## Arquitectura típica de una app en AWS

```
Internet
   │
   ▼
Route 53 (DNS)
   │
   ▼
CloudFront (CDN + SSL)
   │          │
   ▼          ▼
S3 (estático)  ALB (Load Balancer)
                    │
              ┌─────┴─────┐
              ▼           ▼
           EC2 #1      EC2 #2  (Auto Scaling Group)
              │           │
              └─────┬─────┘
                    ▼
                RDS Multi-AZ
                (Primary + Replica)
```

---

## Costos — Free Tier (12 meses)

| Servicio | Free Tier |
|---|---|
| **EC2** | 750 h/mes `t2.micro` o `t3.micro` |
| **S3** | 5 GB almacenamiento, 20K GET, 2K PUT |
| **RDS** | 750 h/mes `db.t3.micro` + 20 GB SSD |
| **Lambda** | 1M invocaciones/mes + 400K GB-s |
| **CloudFront** | 1 TB transferencia/mes |

:::caution Monitorear costos
Configura una **alarma de billing** en CloudWatch desde el primer día. Con `$5 USD` de umbral ya tienes aviso si algo se sale de control.
:::

---

## Recursos
- [AWS Free Tier](https://aws.amazon.com/free/)
- [AWS CLI Docs](https://docs.aws.amazon.com/cli/)
- [SDK JavaScript v3](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/)
- [AWS Architecture Center](https://aws.amazon.com/architecture/)


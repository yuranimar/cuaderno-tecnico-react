---
id: nestjs
title: NestJS — Guía Completa
sidebar_label: NestJS
sidebar_position: 1
description: Fundamentos, arquitectura y patrones avanzados de NestJS para backend TypeScript.
tags: [nestjs, backend, typescript, node]
last_update:
  date: 2026-06-15
  author: Yuri Martínez
---

# NestJS — Guía Completa

NestJS es un framework de Node.js construido sobre TypeScript que implementa **arquitectura modular** inspirada en Angular, combinando OOP, FP y FRP.

---

## ¿Qué es NestJS?

NestJS provee una capa de abstracción sobre Express (o Fastify) que fuerza una estructura clara desde el inicio:

```
src/
├── app.module.ts          ← Módulo raíz
├── app.controller.ts
├── app.service.ts
└── main.ts                ← Bootstrap
```

:::info Ventaja clave
NestJS genera **código predecible y testeable** gracias a la inyección de dependencias. En proyectos grandes, esto reduce el acoplamiento entre módulos drásticamente.
:::

---

## Instalación

```bash title="Terminal"
# CLI global
npm install -g @nestjs/cli

# Nuevo proyecto
nest new mi-proyecto

# Estructura generada automáticamente
cd mi-proyecto && npm run start:dev
```

---

## Conceptos Fundamentales

### Módulos

El sistema de módulos es la unidad organizativa de NestJS. Cada feature tiene su propio módulo.

```typescript title="src/users/users.module.ts"
import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  controllers: [UsersController],   // Maneja las peticiones HTTP
  providers:   [UsersService],      // Lógica de negocio
  exports:     [UsersService],      // Disponible para otros módulos
})
export class UsersModule {}
```

:::tip Regla de oro
**Un módulo por feature.** Si el módulo supera ~200 líneas en cualquier archivo, probablemente necesita dividirse.
:::

### Controllers

Los controllers definen las rutas y delegan la lógica al servicio correspondiente.

```typescript title="src/users/users.controller.ts"
import { Controller, Get, Post, Body, Param, HttpCode } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')   // Prefijo: /users
export class UsersController {

  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Post()
  @HttpCode(201)
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }
}
```

### Services (Providers)

La lógica de negocio va en los servicios. Son clases marcadas con `@Injectable()`.

```typescript title="src/users/users.service.ts"
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {

  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async findOne(id: number): Promise<User> {
    const user = await this.usersRepository.findOneBy({ id });
    if (!user) throw new NotFoundException(`Usuario #${id} no encontrado`);
    return user;
  }

  async create(dto: CreateUserDto): Promise<User> {
    const user = this.usersRepository.create(dto);
    return this.usersRepository.save(user);
  }
}
```

---

## DTOs y Validación

Los **Data Transfer Objects** definen la forma de los datos entrantes. Con `class-validator` se validan automáticamente.

```bash
npm install class-validator class-transformer
```

```typescript title="src/users/dto/create-user.dto.ts"
import { IsEmail, IsString, MinLength, IsOptional } from 'class-validator';

export class CreateUserDto {

  @IsString()
  @MinLength(2, { message: 'El nombre debe tener al menos 2 caracteres' })
  nombre: string;

  @IsEmail({}, { message: 'Email inválido' })
  email: string;

  @IsString()
  @MinLength(8)
  password: string;

  @IsOptional()
  @IsString()
  rol?: string;
}
```

:::warning Activar la validación global
Sin este paso, los decoradores de `class-validator` **no tienen efecto**:

```typescript title="src/main.ts"
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ← Esta línea es obligatoria
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  await app.listen(3000);
}
```
:::

---

## Tabla de Decoradores Más Usados

| Decorador | Contexto | Descripción |
|---|---|---|
| `@Module()` | Clase | Define un módulo |
| `@Controller('ruta')` | Clase | Define un controlador |
| `@Injectable()` | Clase | Marca como provider inyectable |
| `@Get()` `@Post()` `@Put()` `@Delete()` | Método | Método HTTP |
| `@Body()` | Parámetro | Extrae el body de la petición |
| `@Param('id')` | Parámetro | Extrae un parámetro de la URL |
| `@Query('page')` | Parámetro | Extrae un query param |
| `@Headers()` | Parámetro | Extrae headers |
| `@UseGuards()` | Clase/Método | Aplica un guard de autenticación |
| `@UseInterceptors()` | Clase/Método | Aplica transformaciones |

---

## Guards (Autenticación)

Los guards determinan si una petición puede proceder.

```typescript title="src/auth/jwt-auth.guard.ts"
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtAuthGuard implements CanActivate {

  constructor(private jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization?.split(' ')[1];

    if (!token) return false;

    try {
      request.user = this.jwtService.verify(token);
      return true;
    } catch {
      return false;
    }
  }
}
```

```typescript
// Aplicar a una ruta específica
@UseGuards(JwtAuthGuard)
@Get('perfil')
getPerfil(@Request() req) {
  return req.user;
}
```

---

## CLI — Comandos Esenciales

```bash
# Generar recursos completos (CRUD automático)
nest generate resource productos

# Generar componentes individuales
nest g module  auth
nest g controller auth
nest g service  auth
nest g guard    auth/jwt

# Ver la estructura del proyecto
nest info
```

:::danger No mezcles lógica de base de datos en el Controller
El Controller solo debe **recibir** la petición y **devolver** la respuesta. Toda interacción con la DB va en el Service. Violarlo hace el código imposible de testear.
:::

---

## Siguiente Paso

Una vez dominados los módulos y controllers, el siguiente tema clave es **TypeORM con NestJS** para la persistencia de datos, y luego **Passport.js + JWT** para la autenticación completa.

---
id: git
title: Git & GitHub — Control de Versiones
sidebar_label: Git & GitHub
sidebar_position: 1
description: Comandos esenciales, flujos de trabajo, ramas, merge, rebase, stash, tags y buenas prácticas con GitHub.
tags: [devops, git, github, control-versiones]
---

# Git & GitHub — Control de Versiones

<span className="badge-tech">Git</span>
<span className="badge-tech">GitHub</span>
<span className="badge-tech">CLI</span>
<span className="badge-tech">Branching</span>

Git es un sistema de control de versiones distribuido que registra los cambios en archivos a lo largo del tiempo. GitHub es la plataforma de alojamiento de repositorios Git más usada.

:::info ¿Por qué Git?
Permite trabajar en equipo sin pisarse el código, revertir errores, mantener un historial completo y desplegar con confianza. Es la habilidad técnica más transversal del desarrollo de software.
:::

---

## Configuración inicial

```bash
# Identidad global (una sola vez por máquina)
git config --global user.name "Tu Nombre"
git config --global user.email "tu@email.com"

# Editor por defecto
git config --global core.editor "code --wait"   # VS Code

# Ver configuración actual
git config --list

# Inicializar repositorio en un proyecto existente
git init
```

---

## Los 3 estados de Git

```
Directorio de trabajo  →  Staging Area (índice)  →  Repositorio (.git)
   (modificado)              git add                   git commit
```

| Estado | Descripción |
|---|---|
| **Modified** | Archivo cambiado pero no preparado |
| **Staged** | Preparado para el próximo commit |
| **Committed** | Guardado permanentemente en el historial |

---

## Comandos del día a día

```bash
# ── Estado y diferencias ─────────────────────────────────────────
git status                     # estado del área de trabajo
git diff                       # cambios no staged
git diff --staged              # cambios staged (listos para commit)

# ── Staging ──────────────────────────────────────────────────────
git add .                      # agregar todo
git add src/componentes/       # agregar carpeta específica
git add -p                     # agregar interactivamente (por hunks)

# ── Commit ───────────────────────────────────────────────────────
git commit -m "feat: agregar carrito de compras"
git commit --amend             # modificar el último commit (sin push)

# ── Historial ────────────────────────────────────────────────────
git log --oneline --graph --all
git log -5                     # últimos 5 commits
git show abc1234               # ver detalles de un commit específico
```

---

## Convención de commits (Conventional Commits)

```bash
# Formato:
# tipo(scope): descripción corta en imperativo

feat: agregar autenticación con JWT
fix: corregir error de CORS en producción
docs: actualizar README con instrucciones de deploy
style: aplicar formato con Prettier
refactor: extraer lógica de validación a utils
test: agregar tests para el módulo de usuarios
chore: actualizar dependencias a última versión
```

<div className="concept-card">
<strong>📌 ¿Por qué Conventional Commits?</strong>
Permite generar changelogs automáticos, entender el historial de un vistazo y trabajar en equipo con un estándar compartido. Herramientas como `semantic-release` los usan para versionar automáticamente.
</div>

---

## Ramas (Branches)

```bash
# ── Operaciones básicas ──────────────────────────────────────────
git branch                     # listar ramas locales
git branch -a                  # listar todas (incluye remotas)
git branch feature/login       # crear rama
git checkout feature/login     # cambiar a rama
git checkout -b feature/login  # crear Y cambiar (atajo)
git switch -c feature/login    # forma moderna (Git 2.23+)

# ── Eliminar ramas ───────────────────────────────────────────────
git branch -d feature/login    # eliminar (solo si ya mergeada)
git branch -D feature/login    # forzar eliminación
git push origin --delete feature/login  # eliminar en remoto
```

### Flujo de ramas recomendado

```
main          ──────────────────────────────────── producción estable
               │                          │
develop        ▼──────────────────────────▼──────── integración
               │              │
feature/x      ▼──────────────▼                     funcionalidad
               │
hotfix/x       ▼──────────────▼                     corrección urgente
```

---

## Merge vs Rebase

```bash
# ── MERGE — crea un commit de fusión, preserva el historial ──────
git checkout main
git merge feature/login
# resultado: historial con bifurcaciones visibles (honesto)

# ── REBASE — reescribe el historial, lineal y limpio ─────────────
git checkout feature/login
git rebase main
# resultado: commits de feature/ como si hubieran partido de main
```

:::caution Regla de oro del rebase
**Nunca hagas rebase de ramas que otros desarrolladores están usando.** Reescribir historial compartido causa conflictos serios. Rebase solo en ramas propias que no has pusheado.
:::

```bash
# Rebase interactivo — reorganizar, unir o editar commits
git rebase -i HEAD~3           # editar últimos 3 commits
# opciones: pick, squash (unir), reword (renombrar), drop (eliminar)
```

---

## Deshacer cambios

```bash
# ── Antes del staging ────────────────────────────────────────────
git restore archivo.js         # descartar cambios en un archivo
git restore .                  # descartar todos los cambios

# ── Sacar del staging (sin perder cambios) ───────────────────────
git restore --staged archivo.js

# ── Deshacer commits (sin perder código) ─────────────────────────
git reset --soft HEAD~1        # deshace el commit, deja cambios staged
git reset --mixed HEAD~1       # deshace el commit, deja cambios unstaged
git reset --hard HEAD~1        # ⚠️ deshace el commit Y descarta cambios

# ── Revertir un commit (seguro para ramas compartidas) ───────────
git revert abc1234             # crea un nuevo commit que deshace el anterior

# ── Recuperar un archivo de un commit anterior ───────────────────
git checkout abc1234 -- src/archivo.js
```

:::danger git reset --hard
Descarta cambios permanentemente. Si ya hiciste push, necesitarás `git push --force` y avisarás a tu equipo. Prefiere `git revert` en ramas compartidas.
:::

---

## Stash — Guardar trabajo temporal

```bash
# Guardar cambios actuales sin commitear
git stash
git stash push -m "WIP: formulario de login"

# Ver lista de stashes
git stash list

# Aplicar el último stash (y eliminarlo de la lista)
git stash pop

# Aplicar sin eliminar (puedes aplicarlo varias veces)
git stash apply stash@{0}

# Eliminar stash específico
git stash drop stash@{0}

# Limpiar todos los stashes
git stash clear
```

---

## Trabajar con remotos

```bash
# ── Configurar remoto ────────────────────────────────────────────
git remote add origin https://github.com/yuranimar/repo.git
git remote -v                  # ver remotos configurados

# ── Sincronizar ──────────────────────────────────────────────────
git fetch origin               # descargar sin mergear
git pull origin main           # fetch + merge
git pull --rebase origin main  # fetch + rebase (historial más limpio)

# ── Publicar ─────────────────────────────────────────────────────
git push origin main
git push -u origin feature/login   # -u = establecer upstream
git push --force-with-lease        # force push seguro (verifica antes)
```

---

## Tags — Versiones

```bash
# Crear tag anotado (recomendado para releases)
git tag -a v1.0.0 -m "Primera versión estable"

# Crear tag ligero
git tag v1.0.0

# Listar tags
git tag

# Publicar tags al remoto
git push origin v1.0.0
git push origin --tags         # publicar todos

# Eliminar tag
git tag -d v1.0.0
git push origin --delete v1.0.0
```

---

## GitHub — Flujo Pull Request

```bash
# 1. Fork del repositorio (desde GitHub UI)

# 2. Clonar tu fork
git clone https://github.com/tu-usuario/repo.git
cd repo

# 3. Agregar el repo original como upstream
git remote add upstream https://github.com/original/repo.git

# 4. Crear rama para tu feature
git checkout -b feature/mi-mejora

# 5. Trabajar y commitear...

# 6. Sincronizar con upstream antes de hacer PR
git fetch upstream
git rebase upstream/main

# 7. Push y abrir PR desde GitHub UI
git push origin feature/mi-mejora
```

---

## .gitignore

```gitignore title=".gitignore"
# Dependencias
node_modules/
__pycache__/
*.pyc
.venv/
vendor/

# Variables de entorno (¡nunca subir!)
.env
.env.local
.env.production
.env*.local

# Builds y compilados
dist/
build/
.next/
out/
*.egg-info/

# IDEs
.vscode/
.idea/
*.swp
*.swo

# Sistema operativo
.DS_Store
Thumbs.db
desktop.ini

# Logs
*.log
npm-debug.log*

# Cobertura de tests
coverage/
.nyc_output/
```

---

## Alias útiles

```bash
# Agregar en ~/.gitconfig bajo [alias]
git config --global alias.st "status"
git config --global alias.co "checkout"
git config --global alias.br "branch"
git config --global alias.lg "log --oneline --graph --all --decorate"
git config --global alias.undo "reset --soft HEAD~1"

# Uso
git st
git lg
git undo
```

---

## Resolución de conflictos

```bash
# Al hacer merge o rebase con conflictos:
# Git marca los archivos conflictivos con:

<<<<<<< HEAD
código de tu rama actual
=======
código de la rama que estás mergeando
>>>>>>> feature/login

# Pasos:
# 1. Abrir el archivo y elegir qué conservar
# 2. Eliminar los marcadores <<<<, ====, >>>>
# 3. git add archivo-resuelto.js
# 4. git commit (o git rebase --continue)
```

:::tip VS Code para conflictos
VS Code muestra los conflictos con botones visuales: "Accept Current", "Accept Incoming", "Accept Both". Mucho más cómodo que editar a mano.
:::

---

## Recursos
- [Pro Git Book (español, gratis)](https://git-scm.com/book/es/v2)
- [GitHub Docs](https://docs.github.com)
- [Conventional Commits](https://www.conventionalcommits.org/es)
- [Oh Shit, Git!](https://ohshitgit.com/es) — soluciones a errores comunes

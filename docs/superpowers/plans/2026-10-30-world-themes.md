# World Themes Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans.

**Goal:** Nueve mundos visualmente diferentes e intercambiables en Temas.
**Architecture:** Registro declarativo, SVG local, adaptador DOM y CSS por tema; conserva catálogo y estado.
**Tech Stack:** HTML/CSS/ECMAScript; Node test y Playwright; sin dependencias nuevas de producción.
**Spec:** docs/superpowers/specs/2026-10-30-world-themes-design.md

## Global Constraints
No apuestas ni despliegue. Preservar datos y favoritos. Mantener base, Ascua y Abisal. Arte original. Movimiento desactivable.

## Review Focus
Repetidos cambios sin IDs duplicados, contexto y foco preservados, storage bloqueado, temas corruptos, reduced-motion, textos largos en móvil.

### Task 1: Registro y arte
- [x] Tests primero: 9 temas válidos, tokens idénticos, ilustraciones diferentes y namespace seguro.
- [x] Crear themes/worlds.mjs y themes/art.mjs, integrar registro en model.mjs.
- [x] Verificar 15 tests de temas, incluido contraste de tokens y aislamiento de transformaciones.

### Task 2: Interfaz intercambiable
- [x] Tests de selector, escenas, retorno a base, persistencia, filtros/favoritos, viewport y motion.
- [x] Crear themes/engine.mjs y themes/worlds.css; conectar en app.js e index.html.
- [x] Capturar desktop/móvil y revisar visualmente. Corregidos el solapamiento de espiral y la transformación del emblema western.
- [x] Comprobación offline de 9 temas en 6 anchos (360, 390, 768, 1024, 1440 y 1920), foco, estado y movimiento.

### Task 3: Entrega
- [x] Documentar contrato y animaciones; generar HTML autónomo con los mismos archivos.
- [ ] Publicar con avance seguro de main y comprobar CI HTTP.

## Evidencia y límites

En el entorno de trabajo la navegación Chromium a localhost devolvió ERR_BLOCKED_BY_ADMINISTRATOR. Se respetó la política: la revisión visual local usó `set_content` con un documento offline creado solo a partir de los archivos propios. No se desactivaron restricciones. La persistencia HTTP real, URL y carga de módulos se prueban mediante el workflow nativo de GitHub Actions. La revisión de código es del implementador, no una auditoría independiente.

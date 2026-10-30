# Neutral Lobby Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans. Steps use checkbox syntax.

**Goal:** Entregar en Temas una base visual responsive, original y tematizable.
**Architecture:** Shell estático; modelo puro; DOM progresivo; temas mediante variables y capas decorativas; sin backend.
**Tech Stack:** HTML, CSS, ECMAScript, Node test, Python Playwright, Cloudflare Static Assets.
**Spec:** docs/superpowers/specs/2026-10-30-neutral-lobby-design.md

## Global Constraints
Sin apuestas reales ni credenciales; sin dependencias de producción; no modificar producción; no fuentes ni imágenes externas; temas no duplican markup.

## Review Focus
Preferencias corruptas o almacenamiento denegado no impiden cargar; búsqueda y filtros combinados muestran estado vacío útil; foco vuelve al disparador al cerrar diálogos; reduced-motion domina preferencias; ninguna acción simula una sesión real.

### Task 1: Modelo y preferencias
- [x] Escribir tests en tests/model.test.mjs: 12 juegos únicos, búsqueda sin acentos, combinación de filtros, favoritos, orden y saneamiento de preferencias.
- [x] Verificar fallo inicial por módulo ausente.
- [x] Implementar public/model.mjs con exports GAMES, THEMES, filterGames(games, filters), normalizePreferences(value).
- [x] Ejecutar node --test tests/model.test.mjs y comprobar verde.

### Task 2: Interfaz y temas
- [x] Escribir tests de navegador en tests/browser.py: render, filtros, modal, favoritos, temas, persistencia, móvil, errores de consola y movimiento reducido.
- [x] Intentar verificación inicial: navegación local bloqueada por política del navegador del entorno. No se alteró esa política.
- [x] Implementar public/index.html, styles.css, app.js y arte SVG.
- [x] Revisar capturas desktop/mobile y ausencia de overflow en fixture offline sin navegación.
- [ ] Verificar suite HTTP nativa mediante GitHub Actions.

### Task 3: Entrega
- [x] Añadir scripts/dev.mjs, package.json, wrangler.jsonc, headers, CI y documentación.
- [x] Revisar límites y ejecutar sintaxis y pruebas de modelo.
- [ ] Publicar código comprobado en GitHub y leer de nuevo el commit.

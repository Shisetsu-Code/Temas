# Iconos temáticos — integración aprobada

**Objetivo:** aplicar los 54 iconos aprobados a los controles reales de las nueve plantillas cinematográficas.
**Arquitectura:** nueve tiras transparentes locales, registro declarativo por función, adaptador DOM idempotente y CSS independiente. Sin cambios a backend, catálogo ni estado.

- [x] Pruebas de registro: nueve familias, 54 celdas y rechazo de identificadores desconocidos.
- [x] Recursos transparentes y manifiesto de procedencia/resolución.
- [x] Categorías, navegación, búsqueda, cuenta, favoritos y selector integrados.
- [x] Ocho pruebas locales sobre HTML autónomo: cambios repetidos, filtros/favoritos, foco, movimiento reducido, recurso faltante y seis anchos.
- [x] Publicación con comprobación de main y verificación HTTP en GitHub Actions.

## Evidencia final — 30 de octubre de 2026

Código verificado: `7d0cadabb06654ddd6603410e003bca23abcec80`.
Workflow: https://github.com/Shisetsu-Code/Temas/actions/runs/41108322660
Job `124243878888`: `completed`, `success`.

35 pruebas unitarias correctas. 36 pruebas HTTP en Chromium correctas: 9 del lobby original, 8 de mundos, 11 de la interfaz cinematográfica y 8 específicas de iconos. Dos comprobaciones adicionales del HTML autónomo exportado también correctas. Se generaron capturas reales de las barras de navegación de los nueve mundos, selector, escritorio y móvil en el artefacto `interface-screenshots`.

Las pruebas de iconos cubren 54 recursos, nueve familias diferentes, cambios reiterados sin duplicación de nodos, filtros y favoritos conservados, foco y etiquetas accesibles, movimiento reducido, respaldo SVG ante un recurso fallido y anchos de 360, 390, 768, 1024, 1440 y 1920 px.

Evidencia local anterior: `node --test tests/icons.test.mjs` (3 correctas), `OFFLINE_HTML=... python tests/icons-browser.py` (8 correctas). La verificación local usó `set_content` del documento propio, no navegación HTTP; los resultados HTTP proceden del workflow.

Revisión del implementador; no una auditoría independiente ni una prueba de todos los navegadores. Arte raster del concepto aprobado, no vectorial ni 4K. No se desplegó Cloudflare ni se conectaron cuentas, apuestas o pagos. Este commit documental no cambia el código verificado.

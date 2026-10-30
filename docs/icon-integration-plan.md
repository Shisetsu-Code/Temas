# Iconos temáticos — integración aprobada

**Objetivo:** aplicar los 54 iconos aprobados a los controles reales de las nueve plantillas cinematográficas.
**Arquitectura:** nueve tiras transparentes locales, registro declarativo por función, adaptador DOM idempotente y CSS independiente. Sin cambios a backend, catálogo ni estado.

- [x] Pruebas de registro: nueve familias, 54 celdas y rechazo de identificadores desconocidos.
- [x] Recursos transparentes y manifiesto de procedencia/resolución.
- [x] Categorías, navegación, búsqueda, cuenta, favoritos y selector integrados.
- [x] Ocho pruebas locales sobre HTML autónomo: cambios repetidos, filtros/favoritos, foco, movimiento reducido, recurso faltante y seis anchos.
- [ ] Publicación con comprobación de main y verificación HTTP en GitHub Actions.

Evidencia local: `node --test tests/icons.test.mjs` (3 correctas), `OFFLINE_HTML=... python tests/icons-browser.py` (8 correctas). La verificación local usa `set_content` del documento propio, no navegación HTTP. El workflow mantiene las pruebas anteriores y agrega las pruebas HTTP de iconos y dos comprobaciones del exportador.

Revisión del implementador; no una auditoría independiente. Arte raster del concepto aprobado, no vectorial ni 4K. No se despliega Cloudflare ni se conectan cuentas, apuestas o pagos.

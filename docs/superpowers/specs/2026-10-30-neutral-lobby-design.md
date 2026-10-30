# Temas — base visual de casino

## Encargo
Una plantilla original, moderna y sencilla para aplicar posteriormente distintas temáticas y animaciones. Repositorio nuevo y vacío: Shisetsu-Code/Temas. No se modifica ningún despliegue existente.

## Decisiones de implementación
Decisiones del implementador: frontend HTML/CSS y módulos ECMAScript nativos, sin framework ni dependencias de producción. Un backend Rust se podrá conectar después mediante eventos documentados. Marca provisional NÓRD, paleta grafito/marfil, tipografía de sistema, composición editorial y arte vectorial propio. Catálogo y marcas de juegos ficticios, claramente identificados como demostración. Nada de balances, premios, testimonios o licencias inventadas.

Alternativas consideradas: SPA de framework (dependencias innecesarias en esta fase), frontend WASM/Rust (compilación y peso extra sin backend solicitado), web estándar elegida por portabilidad y ligereza. Estas son decisiones del implementador, no preferencias adicionales atribuidas al usuario.

## Alcance
Header, navegación, hero, catálogo responsive, búsqueda insensible a acentos, categorías, proveedores, orden, favoritos persistentes y estados vacíos. Panel de apariencia con temas base/ascua/abisal como pruebas de tokens, no diseños finales de Fénix/Poseidón. Movimiento optativo con respeto a prefers-reduced-motion. Diálogos accesibles para vista previa, acceso e información; no se solicitan credenciales ni hay enlaces a apuestas.

## Arquitectura
`public/index.html`: shell accesible; `styles.css`: layout y componentes; `app.js`: interacción DOM; `model.mjs`: catálogo, temas, preferencias y filtros puros; `assets/`: arte SVG local; `themes/README.md`: contrato de temas. `scripts/dev.mjs`: servidor local con Node; `tests/`: unidades y navegador. Cloudflare Workers Static Assets configurado sin Worker backend. Sin carga de fuentes, trackers o imágenes externas.

## Calidad y límites
Teclado, foco visible, Escape, lectores de pantalla, sin desbordamiento horizontal de 360 a 1920 px, persistencia corrupta/bloqueada tolerada, todas las acciones visibles honestas. No se conectan pagos, cuentas, wallet ni proveedores. Sin despliegue en producción; solo entrega en GitHub. Arte e identidad son placeholders originales para reemplazar con las futuras temáticas.

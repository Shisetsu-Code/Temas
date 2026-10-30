# Temas · Nórd / Base 01

Base web original para diseñar distintas identidades de casino sobre una misma estructura. **Es un prototipo visual, no un casino operativo.** Nórd, los estudios, el catálogo y sus ilustraciones son ejemplos de diseño. No hay apuestas, pagos, saldo, cuentas ni licencias simuladas.

## Incluye

- Layout editorial grafito/marfil, ilustraciones SVG propias y responsive entre 360 y 1920 px.
- Catálogo de 12 juegos ficticios, búsqueda sin acentos, categorías, filtro por estudio, orden y favoritos persistentes.
- Panel Apariencia: Estudio, Ascua y Abisal; pruebas de paleta para la futura tematización.
- Movimiento ambiental desactivable y respeto por `prefers-reduced-motion`.
- Diálogos nativos, navegación con teclado, foco visible, salto al catálogo y estados vacíos.
- Cero frameworks y cero dependencias de producción. Sin fuentes externas, trackers ni imágenes de terceros.

## Ver la web

Con Node 22 o superior (CI usa Node 24):

```sh
npm run dev
```

Abrir **http://127.0.0.1:4173**. No hace falta `npm install`: no hay dependencias de ejecución. No abrir `public/index.html` mediante `file://`, porque usa módulos ES y recursos SVG locales.

## Estructura

```text
public/
  index.html           shell y diálogos
  styles.css           diseño, responsive y movimiento
  app.js               interacciones DOM
  model.mjs            datos ficticios, filtros, preferencias y temas
  assets/              ilustraciones vectoriales propias
  themes/README.md     contrato y hooks para futuras temáticas
  _headers             política de seguridad para Cloudflare
scripts/dev.mjs        servidor de vista previa, no de producción
tests/                 unidades y navegador
wrangler.jsonc         Cloudflare Workers Static Assets, sin backend
```

El backend puede implementarse en Rust sin cambiar esta base: HTML/CSS y el JavaScript del navegador solo manejan presentación. No se agregó un backend JS/TS.

## Pruebas

```sh
npm run check
python -m pip install playwright==1.57.0
python -m playwright install chromium
# En otra terminal: npm run dev
python tests/browser.py
```

El workflow `Interface checks` ejecuta sintaxis, unidades, navegador y genera capturas desktop/móvil. `BASE_URL`, `CHROMIUM_PATH` y `SCREENSHOT_DIR` permiten configurar las pruebas. No despliega nada.

## Cloudflare

Preparado para Workers Static Assets. El repositorio **no se despliega automáticamente** ni toca recursos existentes. Para crear conscientemente un nuevo preview en tu cuenta:

```sh
npx wrangler@4 login
npx wrangler@4 deploy
```

Revisar el nombre `temas-preview` en `wrangler.jsonc` antes de desplegar; cambiarlo si ya existe un Worker con ese nombre. Para builds reproducibles de despliegue, instalar y fijar la versión exacta de Wrangler que se valide en esa cuenta. `_headers` configura CSP y no permite API, frames ni formularios: habrá que actualizar esos permisos al integrar proveedores/autenticación.

## Límites deliberados

Ingresar, Crear cuenta y los juegos abren avisos/vistas previas, no operaciones ficticias. Favoritos, paleta y movimiento se guardan solo en `localStorage`; si está bloqueado o corrupto, la web sigue funcionando. La preferencia del sistema de movimiento reducido manda sobre el interruptor.

Antes de un servicio real faltan backend, sesiones, wallet, integración de juegos, verificación de edad, límites y autoexclusión, revisión de licencias/marcas, privacidad y requisitos de la jurisdicción. No hay afirmaciones de conformidad legal en esta plantilla.

Diseño y plan: `docs/superpowers/`. Integración visual: `public/themes/README.md`.

# Temas · Cinematic edition

Nueve identidades ilustradas sobre una interfaz funcional: piratas, dioses griegos, cyberpunk, steampunk, espacial/aliens, vaqueros, Candyworld, dinosaurios y fénix. **Demo visual 18+, sin apuestas, cuentas, saldo ni pagos reales.**

## Abrir

Con Node 22 o superior (CI usa Node 24):

```sh
npm run dev
```

Abrir `http://127.0.0.1:4173`. No necesita dependencias de producción ni compilación. La nueva portada está en `/`; la anterior permanece en `/studio.html`.

**Cambiar universo** abre la galería. También funcionan las flechas y `?theme=pirates`, `olympus`, `cyberpunk`, `steampunk`, `space`, `western`, `candy`, `dinosaurs`, `phoenix`. Los valores desconocidos se ignoran.

## Qué está implementado

Portadas con arte ilustrado, marca y emblema por mundo; navegación y texto HTML reales, catálogo de 12 juegos ficticios, búsqueda sin acentos, filtros por categoría/estudio, orden, favoritos persistentes, diálogos y vista móvil. Cambiar mundo no altera IDs, proveedores, filtros ni favoritos.

Atmósfera con lluvia, vapor, polvo, estrellas, esporas, confites o brasas; profundidad con un desplazamiento leve del arte. Un solo bucle de animación, hasta 36 partículas (18 en móvil), lienzo con DPR máximo 1.5. Se pausa con movimiento reducido, interruptor, documento oculto, portada fuera de pantalla o diálogo abierto. No hay audio, vídeo ni giros automáticos.

## Límite del arte actual

**Las nueve imágenes son recortes del tablero conceptual generado y aprobado en la conversación, no ilustraciones individuales de alta resolución.** Se integraron como AVIF locales. Las dimensiones de origen son pequeñas; la nitidez en pantallas grandes no equivale a un render independiente de 1920/4K. No se presenta esta entrega como arte final de producción.

El manifiesto `public/assets/cinematic/manifest.json` registra procedencia, recortes, dimensiones y hashes. Los textos, botones y catálogos NO están aplanados dentro de una captura: son elementos funcionales. Las animaciones son ambientales; los personajes no tienen rigging ni animación 3D.

Para sustituir el arte, cambiar `art` en `public/cinematic/schema.mjs` y conservar los mismos IDs. Revisar encuadre y contraste en móvil/escritorio. Las marcas son nombres conceptuales; no se verificó su disponibilidad comercial.

## Estructura

```text
public/index.html               shell cinematográfico
public/cinematic/schema.mjs     identidades y estado saneado
public/cinematic/app.mjs        navegación, catálogo y selector
public/cinematic/motion.mjs     atmósfera y pausa
public/cinematic/styles.css     diseño responsive y temas
public/assets/cinematic/        arte AVIF local y procedencia
public/studio.html              versión anterior preservada
public/model.mjs                catálogo y filtros compartidos
```

HTML/CSS y JavaScript de navegador, sin frameworks ni dependencias de producción. El backend futuro puede ser Rust. No se agregó un backend JS/TS.

## Exportar vista previa sin servidor

```sh
python scripts/cinematic-preview.py
```

Genera `test-results/Temas-cinematic.html` con módulos, CSS y arte incorporados. Este archivo se puede abrir directamente; la persistencia mediante `file://` depende del navegador. Si localStorage está bloqueado, las interacciones siguen funcionando. El archivo modular `public/index.html` se sirve por HTTP.

## Verificación

```sh
npm run check
python -m pip install playwright==1.57.0
python -m playwright install chromium
# Con npm run dev en otra terminal:
npm run test:browser
```

CI mantiene además las pruebas originales en un servidor separado (`PORT=4174 LEGACY_PREVIEW=1 npm run dev`, `BASE_URL=http://127.0.0.1:4174 npm run test:legacy`). Genera capturas desktop/móvil y el HTML autónomo como artefactos. La suite no equivale a una auditoría completa de accesibilidad o compatibilidad de todos los navegadores.

## Integración y seguridad

Se conservan `temas:themechange`, `temas:preview` y `temas:accountrequest`; son notificaciones de presentación, no autorizaciones de operaciones. El navegador no inventa saldos ni solicita contraseñas. Se conserva la CSP restrictiva y `wrangler.jsonc` para Workers Static Assets. **No se desplegó en Cloudflare ni se modificaron servicios existentes.**

Antes de producción faltan arte HD independiente, autenticación, wallet, proveedores, verificación de edad, límites/autoexclusión y revisión de marcas, licencias y requisitos aplicables.

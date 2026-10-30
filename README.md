# Temas · Nueve mundos, una base

Lobby visual original, responsive e intercambiable. **Demo de interfaz 18+: sin apuestas, pagos, cuentas ni juegos reales.** Los nombres son conceptos de diseño, no marcas cuya disponibilidad se haya verificado.

## Probar

```sh
npm run dev
```

Con Node 22+; CI usa Node 24. Abrir `http://127.0.0.1:4173` y pulsar **Cambiar mundo** o **Apariencia**. No requiere instalar dependencias de producción.

| Tema | Identidad conceptual | Escena y movimiento |
|---|---|---|
| Piratas | Marea | Barco, cartografía, oleaje y oro envejecido |
| Dioses griegos | Olimpo | Templo, rayo, mármol nocturno y nubes |
| Cyberpunk | Neon | Androides, ciudad eléctrica y escáner lento |
| Steampunk | Æther | Latón, engranajes y dirigible |
| Espacial / aliens | Sector 09 | Visitante, platillo, órbitas y planetas |
| Vaqueros | Dust & Gold | Desierto, cobre, polvo y rueda de carreta |
| Candyworld | Bonbon | Confitería editorial adulta, espirales y confites |
| Dinosaurios | Terranova | Gigante jurásico, selva y bruma |
| Fénix | Ignis | Alas doradas, obsidiana y brasas |

Cada mundo cambia marca conceptual, emblema, portada, textos, paleta, tipografía de sistema, bordes, paneles y animaciones. No se altera el catálogo: nombres, IDs, favoritos y filtros siguen siendo los mismos. El cambio no recarga la página. Se conservan Estudio, Ascua y Abisal.

La elección se guarda localmente y también puede indicarse por URL: `?theme=pirates`, `olympus`, `cyberpunk`, `steampunk`, `space`, `western`, `candy`, `dinosaurs`, `phoenix`. Una elección manual actualiza el parámetro en HTTP/HTTPS para que no se pierda al recargar. Un parámetro desconocido se ignora.

## Vista previa autónoma

```sh
python scripts/preview.py
```

Genera `test-results/Temas-nueve-mundos.html` con CSS, JavaScript y SVG incorporados. Ese archivo sí puede abrirse directamente, sin servidor. La persistencia en archivos locales depende de las políticas del navegador; una restricción no impide usar la interfaz. El `public/index.html` modular original se sirve por HTTP, no por `file://`.

## Estructura

- `public/themes/worlds.mjs`: registro, textos e identidades.
- `public/themes/art.mjs`: nueve escenas y emblemas SVG originales, con IDs aislados por instancia.
- `public/themes/engine.mjs`: selector y reemplazo reversible de la presentación.
- `public/themes/worlds.css`: componentes temáticos, responsive y movimiento.
- `public/model.mjs`: catálogo independiente, filtros y preferencias saneadas.
- `public/app.js`: interacción y eventos de integración futura.
- `public/themes/README.md`: contrato de extensión.

HTML/CSS y JavaScript nativo; cero frameworks, fuentes externas, trackers o dependencias de producción. No se agregó backend JS/TS: la API futura puede ser Rust.

## Pruebas

```sh
npm run check
python -m pip install playwright==1.57.0
python -m playwright install chromium
# Con npm run dev en otra terminal:
npm run test:browser
```

El workflow `Interface checks` prueba el catálogo original y los nueve mundos, y adjunta capturas desktop/móvil y la vista previa autónoma. Incluye seis anchos entre 360 y 1920 px, persistencia, almacenamiento bloqueado, URL, foco, IDs SVG, retorno a base, contraste de tokens principales y movimiento reducido. Esto no sustituye una auditoría integral de accesibilidad ni pruebas en todos los navegadores.

## Movimiento y alojamiento

Animaciones CSS suaves, sin audio ni flashes rápidos. Se desactivan desde Apariencia y con `prefers-reduced-motion`; se pausan al ocultar el documento o abrir el selector. Las miniaturas nunca animan.

Se conserva `wrangler.jsonc` para Workers Static Assets. **No hay despliegue automático ni se modificaron servicios Cloudflare.** Para crear conscientemente un preview en tu cuenta, revisar el nombre `temas-preview` y ejecutar `npx wrangler@4 deploy` después de autenticar. Fijar una versión exacta de Wrangler al preparar un despliegue reproducible.

Antes de producción faltan autenticación, wallet, proveedores, verificación de edad, límites/autoexclusión, privacidad y revisión de marcas/licencias. La CSP actual no permite llamadas a API, frames ni formularios; hay que adaptarla al integrar servicios reales.

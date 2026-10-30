# Iconos ilustrados reales — nueve familias

54 iconos del tablero aprobado en esta conversación, recortados sin sus rótulos y preparados con transparencia. No son un nuevo mockup ni variantes recoloreadas de una biblioteca genérica.

## Recursos

Cada `WORLD.avif` es una tira RGBA de **384 × 64 px**, con seis celdas de **64 × 64 px**. Las nueve tiras pesan conjuntamente **52.399 bytes**. El orden de las celdas se declara en `cinematic/icon-registry.mjs`. Cada instancia visible es un elemento DOM independiente con su recorte CSS: `background-size: 600% 100%`, posiciones 0, 20, 40, 60, 80 y 100%. No hay llamadas a un servicio externo.

Piratas: cofre, timón, brújula, sables, mapa, catalejo. Olimpo: templo, laureles, rayo, ánfora, tridente, búho. Cyberpunk: ficha, visor, corazón, estrella, cubo, radar. Steampunk: corazón mecánico, manómetro, brújula, monóculo, válvula, engranaje alado. Espacial: platillo, órbita, alien, planeta, portal, haz. Vaqueros: insignia, revólver, herradura, saloon, rueda, cactus. Candyworld: espiral, caramelo, gema, paleta, cupcake, estrella. Dinosaurios: fósil, garras, huevo, hoja, volcán, cráneo. Fénix: pluma, corazón, alas, cristal, sol, cresta.

## Integración

`cinematic/icons.mjs` adapta los controles existentes y escucha `temas:themechange`. `icons.css` define tamaños, estados y movimiento. No modifica funciones, etiquetas, tabulación, filtros, juegos, sesión ni wallet. Incluye categorías, navegación superior/móvil, búsqueda, cuenta, favoritos, marca y galería. Las flechas, cierre y reproducción/pausa conservan símbolos convencionales.

El SVG previo se mantiene como respaldo hasta verificar la carga del recurso. Si una tira falla o el navegador no puede decodificarla, esos controles conservan el SVG y su funcionalidad. Los iconos decorativos usan `aria-hidden` y no capturan clics. Los controles conservan su texto/etiqueta accesible. El movimiento reducido del sistema y el botón de pausa también desactivan las transiciones añadidas.

## Edición y calidad

Cambiar un mapeo funcional en `ICON_FAMILIES[world].roles`, no el catálogo. Para sustituir el arte, exportar seis celdas cuadradas en el mismo orden y mantener 384 × 64 px, o actualizar conjuntamente el validador de dimensiones y el CSS. No aplicar filtros de tono para simular otra familia.

Es **arte raster derivado de la lámina de concepto**. La ilustración original de cada icono ronda 60–100 px y no se presenta como vector ni como recurso 4K. El tamaño de uso habitual es 24–48 px. El manifiesto registra procedencia, dimensiones y hashes de los archivos entregados.

El exportador `scripts/cinematic-preview.py` incorpora las nueve tiras y el código en el HTML autónomo. Las pruebas `tests/icons.test.mjs` y `tests/icons-browser.py` comprueban mapeo, integración y comportamiento.

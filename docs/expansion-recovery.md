# Integración de las 18 temáticas adicionales

## Alcance

27 mundos en la plantilla cinematográfica: los nueve originales más Egipto oscuro, Japón samurái, China imperial, India palaciega, Vikingos, Atlántida, Dragones, Vampiros, Art Déco, Baile de máscaras, Día de Muertos, Alquimia, Hielo, Bosque, Automovilismo, Desierto posapocalíptico, El Dorado y Palacio astral.

Base remota: `3370909b82c40ee1d8d91768dc6e22ed706132d8`. Se conserva el catálogo, IDs de juegos, favoritos, diálogo de acceso y la plantilla legacy. No se sustituyen los controles por una imagen.

## Cambios

`expansion.mjs` registra identidades y tokens; `expansion-art.mjs` define los recortes de cuatro atlas AVIF locales; `expansion-icons.mjs` agrega 108 iconos vectoriales con siluetas específicas. Los 54 iconos raster originales se conservan. `expansion-ui.mjs` actualiza contadores y añade búsqueda de mundos y filtros Todos/Nuevos/Originales. `expansion.css` aporta acabados por mundo. `motion.mjs` conserva un único loop acotado y sus cinco condiciones de pausa.

Los datos de imagen se decodifican desde archivos locales en canvas y se reutilizan. CSP permite imágenes `data:`; no se habilitan APIs, scripts externos, frames o formularios. El exportador incorpora todos los recursos en un único HTML autónomo.

## Resolución y alcance gráfico

La integración es funcional; **el arte de portada todavía es provisional**. Seis recortes proceden de conceptos individuales y tienen entre 539 y 600 px de ancho. Los otros doce proceden de un tablero y tienen 247 px de ancho. El manifiesto registra dimensiones, procedencia y hashes. No son renders individuales HD/4K y pierden nitidez ampliados. Los nuevos iconos son vectores de interfaz, no renders 3D equivalentes a los 54 iconos ilustrados originales.

## Verificación

Pruebas de registro escritas antes de implementar y comprobadas en rojo (9 en lugar de 27), después en verde. Verificación local: 14 pruebas unitarias correctas, sintaxis de todos los módulos, carga de los 27 temas y 162 iconos, estado/foco/movimiento y filtros; seis anchos de 360 a 1920 px sin desbordamiento. Las capturas locales usan un documento propio autónomo con `set_content`; la navegación HTTP local está bloqueada por el entorno y no se intentó eludir esa política. La captura local masiva se interrumpió por tiempo de ejecución; no se declara que esa ejecución completa haya terminado.

El workflow mantiene las suites anteriores, actualiza únicamente conteos ampliados y añade `tests/expansion-browser.py`. La evidencia HTTP final debe consultarse en Actions para el commit publicado, no inferirse de pruebas offline. No hubo revisor independiente.

No se despliega Cloudflare ni se conectan cuentas, wallet, proveedores o apuestas reales.

# Temas · 27 mundos intercambiables

Plantilla cinematográfica con controles HTML reales, catálogo de demostración, búsqueda, filtros, favoritos, vistas previas y 27 identidades intercambiables. **Demo visual 18+: sin apuestas, cuentas, pagos ni premios reales.**

## Ver la web

```sh
npm run dev
```

Con Node 22+ (CI usa Node 24), abrir `http://127.0.0.1:4173`. No hay dependencias de producción que instalar. Pulsar **Cambiar universo**; el selector permite buscar por nombre y filtrar **Todos (27)**, **Nuevos (18)** y **Originales (9)**. Cambiar el tema no reinicia los favoritos ni los filtros de juegos.

## Temáticas

Originales: Piratas, Dioses griegos, Cyberpunk, Steampunk, Espacial/aliens, Vaqueros, Candyworld, Dinosaurios y Fénix.

Añadidas: Egipto oscuro, Japón samurái, China imperial, India palaciega, Vikingos y runas, Atlántida, Dragones medievales, Vampiros góticos, Años veinte/Art Déco, Baile de máscaras, Día de Muertos, Alquimia y magia, Reino de hielo, Bosque encantado, Automovilismo de lujo, Desierto posapocalíptico, El Dorado fantástico y Palacio astral.

URL directa: `?theme=egypt`, `japan`, `china`, `india`, `vikings`, `atlantis`, `dragons`, `vampires`, `artdeco`, `masquerade`, `muertos`, `alchemy`, `ice`, `forest`, `racing`, `wasteland`, `eldorado` o `astral`. Los nueve IDs originales permanecen. El parámetro y las preferencias guardadas se validan con una lista cerrada.

## Iconos y movimiento

162 recursos: 54 iconos ilustrados originales y 108 iconos vectoriales nuevos, seis por temática, con formas propias. Se aplican a categorías, navegación, búsqueda, cuenta, favoritos y selector. Flechas, cierre y pausa mantienen símbolos convencionales. Los nombres y marcas son conceptos de diseño, no disponibilidad comercial verificada.

Partículas ambientales por temática, desplazamiento suave y acabados específicos. La animación se detiene por pausa manual, `prefers-reduced-motion`, documento oculto, portada fuera de pantalla o diálogo abierto. Los personajes no tienen animación corporal 3D o esqueletal.

## Limitación visual importante

**La ampliación está integrada, pero sus portadas no son arte HD definitivo.** Seis recortes proceden de diseños individuales (539–600 px de ancho); los otros doce provienen de un tablero (247 px). Se verán menos nítidos al ampliarlos. El código no convierte esos recortes en imágenes 4K. Pueden reemplazarse por renders independientes sin cambiar controles ni datos. Procedencia, recortes y hashes: `public/assets/expansion/manifest.json`.

## Archivo autónomo

```sh
python scripts/cinematic-preview.py
```

Genera `test-results/Temas-cinematic.html` con los 27 temas, sus imágenes, iconos y código incluidos. Ese HTML sí puede abrirse directamente. El `public/index.html` modular debe servirse por HTTP. La persistencia en archivos locales depende del navegador; un bloqueo de almacenamiento no impide usar la interfaz.

## Arquitectura

- `public/cinematic/schema.mjs`: mundos y estado; reutiliza el catálogo independiente de `public/model.mjs`.
- `expansion.mjs`, `expansion-art.mjs`, `expansion-icons.mjs`: registro, escenas e iconos nuevos.
- `expansion-ui.mjs`, `expansion.css`: selector de 27 mundos y estilos específicos.
- `app.mjs`, `motion.mjs`, `icons.mjs`: interacción y animación; sin framework.
- `public/assets/expansion/`: cuatro atlas locales; no servicios de terceros.
- `public/studio.html`: versión anterior conservada.

## Pruebas

```sh
npm run check
python -m pip install playwright==1.57.0
python -m playwright install chromium
# Con npm run dev activo:
npm run test:browser
python tests/icons-browser.py
python tests/expansion-browser.py
```

`Interface checks` mantiene las pruebas legacy y cinematográficas, añade cobertura de los 18 temas nuevos y genera capturas como artefactos. Prueba seis anchos (360–1920 px), cambio de mundo, imágenes, iconos, foco, preferencias, errores de carga y movimiento reducido. No equivale a una auditoría completa de accesibilidad o a pruebas en todos los navegadores.

## Cloudflare

Se conserva `wrangler.jsonc` para Workers Static Assets. Este repositorio no despliega automáticamente ni modifica servicios Cloudflare. Revisar el nombre `temas-preview` antes de un despliegue manual. El backend futuro puede ser Rust; no se agregó un backend JS/TS.

Antes de producción faltan autenticación, wallet, proveedores, verificación de edad, límites, autoexclusión y revisión de marcas, privacidad y licencias. La CSP no permite APIs ni frames; habrá que adaptarla conscientemente al integrar servicios.

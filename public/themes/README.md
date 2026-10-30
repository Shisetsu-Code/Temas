# Contrato de mundos

No duplicar `index.html` para crear un tema. El catálogo de juegos y la presentación son independientes.

## Archivos

`worlds.mjs` exporta `WORLD_THEMES`, con exactamente nueve mundos; `model.mjs` agrega las tres paletas originales. Cada mundo declara `name`, `brand`, `signature`, `number`, `description`, `eyebrow`, `title` (dos líneas), `copy`, `caption`, `side`, `motion`, `font`, `texture` y `tokens`.

Tokens obligatorios: `--page`, `--panel`, `--panel-raised`, `--ink`, `--muted`, `--line`, `--accent`, `--accent-ink`, `--glow`, `--hero`. La información de juegos nunca se cambia para simular que un proveedor pertenece a una temática.

`art.mjs`: `scene(id, prefix)` genera una escena SVG; `emblem(id)` genera un emblema. Solo admite IDs conocidos y namespaces alfanuméricos seguros. Usar un prefijo distinto para cada instancia (`hero-pirates`, `option-pirates`, etc.). No interpolar contenido de usuarios o de APIs en el HTML/SVG. Los únicos fragmentos analizados con `innerHTML` son vectores estáticos del propio proyecto.

`engine.mjs` guarda la presentación original y la restaura antes de aplicar otra identidad. No recrea el catálogo ni toca filtros/favoritos. Inicialización idempotente; cambiar movimiento no reconstruye la escena. Los nombres son conceptos, no comprobaciones de disponibilidad comercial.

`worlds.css` usa `data-world` y `data-world-font`, sin modificar el layout base. `texture` documenta la intención visual; los detalles efectivos se implementan con selectores explícitos por mundo, no con CSS remoto.

## Agregar otro mundo

1. Agregar configuración con el mismo contrato de tokens.
2. Agregar escena y emblema originales. Mantener los grupos de posicionamiento SVG separados de los grupos con transformaciones animadas.
3. Agregar los estilos particulares y conservar la lectura en móvil.
4. Extender la lista de IDs de las pruebas y generar capturas desktop/móvil.
5. Verificar contraste, desbordamiento, conservación del estado y retorno a base.

La paleta base y las antiguas Ascua/Abisal siguen funcionando y son compatibles con preferencias existentes en `temas:v1`.

## Movimiento

Las capas decorativas tienen `pointer-events:none` y `aria-hidden=true`. Todo movimiento se detiene mediante `data-motion=off` o `prefers-reduced-motion: reduce`. La visibilidad del documento pausa animaciones; el selector usa miniaturas estáticas. No hay timers de render ni bucles de partículas en JavaScript.

El campo `motion` describe la intención de cada escena, no instala un runtime externo. Los efectos implementados son movimientos SVG/CSS suaves, no personajes 3D, videos ni animación esqueletal.

## Hooks

Se mantienen `temas:themechange` (`detail.theme`, `detail.motion`), `temas:preview` (`detail.gameId`) y `temas:accountrequest` (`detail.action`). Son notificaciones visuales, no autorizaciones de apuestas o sesiones.

La URL HTTP/HTTPS admite `?theme=ID`; el selector la actualiza sin navegación. Los IDs desconocidos se ignoran. La preferencia se guarda en localStorage si está disponible. La UI funciona también cuando ese almacenamiento está bloqueado.

Fuentes de API consultadas: MDN, `prefers-reduced-motion` y elemento SVG. El arte, textos y código son específicos de esta plantilla.

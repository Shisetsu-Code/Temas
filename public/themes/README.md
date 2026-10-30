# Contrato de temas

El primer diseño usa la marca provisional Nórd. No son marcas de casino reales ni juegos integrados.

## Cambiar o agregar una atmósfera

1. Agregar una entrada a `THEMES` en `../model.mjs` con `name`, `description` y todos los `tokens` del tema base.
2. No duplicar `index.html`. Componentes, estados y navegación permanecen iguales.
3. Para ilustraciones específicas, agregar SVG/WebP/AVIF locales a `../assets/`. El arte de catálogo es independiente del tema del sitio.
4. Usar `html[data-theme="id"]` para capas específicas y `--accent`, `--glow`, `--hero` para conectarlas a la paleta.
5. Probar desktop, móvil, teclado, contraste y `prefers-reduced-motion`.

Tokens: `--page`, `--panel`, `--panel-raised`, `--ink`, `--muted`, `--line`, `--accent`, `--accent-ink`, `--glow`, `--hero`.

`Estudio`, `Ascua` y `Abisal` son estudios cromáticos. No sustituyen diseños completos de Fénix, Poseidón, etc. El héroe contiene por ahora un SVG neutral; las futuras mascotas o animaciones pueden reemplazar esa capa manteniendo las acciones y el texto.

## Movimiento

Escuchar `temas:themechange` para conectar un motor de animación más adelante. Para CSS, respetar `html[data-motion="off"]` y `@media (prefers-reduced-motion: reduce)`. La preferencia del sistema tiene prioridad. No bloquear clics, teclado ni lectura con capas decorativas; usar `aria-hidden="true"` y `pointer-events:none` cuando corresponda. Al cambiar de tema, desmontar los recursos del anterior. No se incluyen runtimes de animación hasta necesitarlos.

## Hooks actuales

```js
document.addEventListener('temas:preview', ({ detail }) => {
  console.log(detail.gameId); // vista previa, NO una solicitud de apuesta
});
document.addEventListener('temas:accountrequest', ({ detail }) => {
  console.log(detail.action); // login | register; todavía se muestra aviso de demo
});
document.addEventListener('temas:themechange', ({ detail }) => {
  console.log(detail.theme, detail.motion);
});
```

Son notificaciones de presentación. No autorizan operaciones ni reemplazan la verificación de sesión en servidor. La integración deberá reemplazar explícitamente los diálogos de demo y adaptar CSP: actualmente `connect-src 'none'` y `form-action 'none'` impiden solicitudes de red y formularios.

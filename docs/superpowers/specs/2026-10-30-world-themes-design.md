# Nueve mundos intercambiables

Solicitud: piratas, dioses griegos, cyberpunk, steampunk, espacial/aliens, vaqueros, Candyworld, dinosaurios y fénix sobre Temas, conservando la plantilla.

Decisión de implementación: escenas SVG originales, sistema de tokens y un único DOM. Cada mundo tiene marca conceptual, emblema, portada, microcopy, tipografía de sistema, textura y movimiento propios. Se conserva el catálogo independiente, sin cambiar nombres o proveedores al tematizar. Cero dependencias de producción; compatible con el alojamiento estático existente. Las tres paletas anteriores siguen disponibles.

Alternativas: solo paletas no cumple la diferenciación solicitada; nueve sitios duplicados impedirían mantenimiento e intercambio; un registro declarativo con arte separado conserva navegación y estado.

Mundos: Marea Negra (piratas), Olimpo (griegos), Neon District (cyberpunk), Aether Works (steampunk), Sector 09 (aliens), Dust & Gold (vaqueros), Bonbon Club (Candyworld adulto), Terranova (dinosaurios), Ignis (fénix). Nombres conceptuales, no comprobados como marcas registrables.

Al cambiar: actualizar tokens, textos visuales y escena sin recarga, sin tocar favoritos, filtros, modal de juego o IDs. Persistencia existente. Selector con miniaturas y selección visible; acceso a un clic desde portada y navegación. Paletas previas y retorno a base completos. Capas decorativas sin captura de eventos. IDs de SVG únicos incluso cuando selector y portada coinciden.

Animaciones CSS suaves; apagado manual y prefers-reduced-motion; pausadas con documento oculto. Nada de flashes rápidos, audio, autoplay de juegos ni promesas de premios. Candyworld usa confitería editorial para adultos, no personajes infantiles. Demo 18+ sin apuestas, pagos o autenticación real.

Verificar: 9 temas, contratos de tokens, arte único y seguro, persistencia, ida y vuelta sin residuos, teclado, no desbordamiento en móvil/escritorio, estado de catálogo preservado, consola/red, movimiento reducido. Sin despliegue en Cloudflare.

# FletePro — entrega del código fuente

Exportación del 16 de noviembre de 2026. Corresponde a la versión publicada 39.
Commit: 119b10332fe4fcb42c154d2b937ee00806d90eda.
Sitio publicado: https://fletepro-oscar-mx.orojas32.chatgpt.site/

## Qué contiene

Todos los archivos versionados del proyecto: interfaz gratuita y premium, cálculo de rutas y costos, catálogo de unidades, consultas de casetas, medios de pago y datos públicos, API de rutas y combustible, persistencia por cuenta, esquema de base de datos, migraciones, recursos, bibliotecas incluidas y archivos de configuración.

- `public/tool/`: interfaz HTML, CSS y JavaScript del planeador, datos de carreteras y casetas.
- `public/tool/toll-payments.json`: base de medios de pago, evidencias y fuentes.
- `public/tool/toll-payments.js`: coincidencias por plaza y contexto de carretera, con pendientes explícitos.
- `app/`: portada, página autenticada y rutas API del servidor.
- `lib/`, `db/`, `drizzle/`: lógica compartida, esquema y migraciones.
- `scripts/`: preparación del proyecto y compilación.
- `package.json` y `package-lock.json`: dependencias y versiones.

## Ejecutar en desarrollo

1. Extraer el ZIP y abrir una terminal dentro de `FletePro`.
2. Instalar Node.js compatible con `package.json` (22.13 o posterior).
3. Ejecutar `npm ci`.
4. Ejecutar `npm run dev` y abrir la dirección que indique la terminal.
5. Para compilar: `npm run build`. Para probar la compilación: `npm start`.

La interfaz utiliza servicios del servidor: abrir el HTML con doble clic no equivale a ejecutar el sistema completo. El funcionamiento de autenticación, almacenamiento y rutas requiere configurar el entorno y los servicios descritos a continuación. No se ha validado una instalación nueva en otra plataforma en esta entrega.

## Configuración de servicios

- `INEGI_SAKBE_TOKEN`: clave de rutas, guardada únicamente como secreto del servidor. No incluirla en JavaScript público.
- Enlace `DB`: base Cloudflare D1 utilizada por las cuentas. Revisar esquema y migraciones antes de inicializar una base nueva.
- Identidad: el proyecto utiliza inicio de sesión de ChatGPT administrado por Sites. En otro proveedor se necesita adaptar y verificar la autenticación y autorización del servidor.
- Revisar las variables `FLETEPRO_ADMIN_USER_IDS`, `FLETEPRO_PRO_USER_IDS` y `FLETEPRO_TRIAL_USER_IDS` según las cuentas autorizadas. El código conserva las comprobaciones de acceso; no concede privilegios por sí solo.
- `.openai/hosting.json` identifica el proyecto existente y sus enlaces. Conservarlo para trabajar sobre el sitio actual; no reutilizar su identidad para crear otro sitio independiente.

No se incluyen claves privadas, sesiones, archivos de entorno locales, dependencias instaladas ni el contenido privado de la base de datos de producción. Los esquemas y el código de acceso sí están incluidos. Para migrar cuentas, unidades y cotizaciones reales hace falta un respaldo separado de la base de datos.

## Publicación y estado actual

El proyecto está preparado para Sites/Cloudflare Workers con Vinext. Otro alojamiento requiere adaptar enlaces, identidad y secretos; no basta con subirlo a un alojamiento estático. Los archivos generados `dist` y las dependencias `node_modules` se regeneran con los comandos anteriores.

La integración con `dipartsqro.mx/rutas` NO se ha completado. Google AdSense NO está activado y este ZIP no contiene una cuenta de editor configurada. La publicidad propia de DIPARTS sí forma parte del sitio.

La información carretera y de peajes es informativa. La cobertura de TAG y las referencias CAPUFE conservan distintos estados de comprobación. No afirmar que todas las casetas o restricciones NOM-012 están verificadas. El catálogo RNC corresponde a su edición incluida; las tarifas y condiciones pueden requerir actualización.

Se incluyen bibliotecas de terceros y sus avisos existentes. Conservar los créditos y atribuciones del mapa y revisar las condiciones de cada proveedor antes de redistribuir o cambiar de plataforma.

`README.md` conserva notas históricas de desarrollo; para el estado de esta entrega usar este documento y el código actual. La versión gratuita permite consultar rutas sin registro; no hay cobro automático de suscripciones implementado.

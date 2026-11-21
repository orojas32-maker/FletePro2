# FletePro

Portada, planes y cotizador con identidad de ChatGPT administrada por Sites. Plan gratuito activo, Profesional y Equipos próximos sin precios ni cobros.

`public/tool` es la fuente del cotizador. `dist` es salida generada; los antiguos scripts que escriben dist no deben ejecutarse sin adaptación. `app/api/account/route.ts` guarda en D1 por usuario con autorización y control de revisión. Los datos previos del navegador no se migran automáticamente entre cuentas. No se cambia el acceso privado del sitio.

## INEGI SAKBÉ

`INEGI_SAKBE_TOKEN` se configura como secreto de Sites. Nunca se incorpora al cliente. `POST /api/sakbe` exige identidad y origen de la misma web, valida coordenadas/categoría y consulta por HTTPS. `lib/sakbe.ts` normaliza las respuestas, conserva MultiLineString sin unir líneas artificialmente y compara el total contra el detalle de peajes. Las categorías de 2–9 ejes corresponden a tarifas, no a autorización NOM-012. El formulario usa automáticamente la ruta sugerida y solo solicita origen, destino, categoría por ejes y combustible. Los medios de telepeaje y el precio diario del combustible no provienen de SAKBÉ.

Prueba real: Querétaro–Ciudad de México, sugerida: 217.26 km, C2 $929, C5 $1715. Cada suma del detalle coincidió con el total de la API. No se publica ningún archivo de prueba ni credencial.


Combustible: `/api/fuel-prices` consulta el XML oficial CNE, con caché de una hora y medias separadas para regular, premium y diésel. Se conserva la fecha de consulta; el XML no informa la fecha interna de cada precio. La UI descarta precios al cambiar de combustible y solicita captura verificada si la consulta falla y el respaldo está vencido. Rendimientos independientes por perfil/categoría/combustible; valores iniciales diésel son ejemplos explícitos. Sin rendimiento válido, costos y cotización quedan incompletos.

## Catálogo de suscripción
`FLETEPRO_PRO_USER_IDS` (lista de IDs separados por coma, administrada en servidor) habilita el catálogo profesional. No hay checkout, cargos ni activación automática de pagos. GET /api/account devuelve el plan; PUT compara el catálogo previo y rechaza cambios de cuentas gratuitas y datos incompletos/malformados. El catálogo usa el estado D1 existente por cuenta, hasta 100 unidades.
Cada concepto permite pendiente/capturado/no aplica, monto, periodicidad, fecha y referencia. Los presupuestos anuales de desgaste se asignan por km anuales; los gastos fijos por días productivos. El resultado guarda una copia de la base de costos; conceptos pendientes bloquean el precio completo. El selector de búsqueda carga categoría, combustible y rendimiento de la unidad.
El gratuito usa escenarios internos orientativos fechados 14/11/2026: NO son medias de mercado ni cifras publicadas por IMT. Se muestran las exclusiones y supuestos (80,000 km, 250 días). Antes del lanzamiento comercial deben validarse/calibrarse con datos representativos. No se atribuyen estos importes a fuentes oficiales.

`FLETEPRO_TRIAL_USER_IDS` habilita acceso Premium de desarrollo, sin cobros, solo para las identidades configuradas en servidor. La búsqueda muestra el nombre y la categoría de cada unidad guardada; la categoría se usa internamente para casetas y la ficha seleccionada para gastos. La lista vacía enlaza al catálogo. Los demás usuarios conservan el plan gratuito.

`FLETEPRO_ADMIN_USER_IDS` asigna el rol de administrador de desarrollo, con acceso al catálogo sin suscripción ni cobros. No concede acceso a datos de otras cuentas ni implementa administración de facturación.

## Beta pública y DEF
DEF se registra por separado del combustible (usa / no usa / por confirmar), con precio MXN/l y porcentaje de los litros de diésel. Se guarda en el catálogo y se puede ajustar en la cotización. El renglón anterior de costo genérico DEF se sustituye en el cálculo, sin duplicación. El precio de referencia es 24.38 MXN/l IVA incluido, media simple de tres ofertas de 20 L consultadas 14/11/2026 (Zapata, AMSA y Megamak); no es un promedio nacional ni tiene actualización automática. El 4% de consumo inicial es hipótesis editable, compatible con referencias de Cummins que citan 3–5%, no especificación universal. Fuentes y normalización en def-reference.js.
Se muestra publicidad propia de DIPARTS México en portada y cotizador, sin trackers ni anuncios externos. No hay integración de AdSense ni cobros. La beta permite portada pública y cotizador con inicio de sesión; cada cuenta mantiene sus datos aislados por identidad del sitio.

## Espera de rutas y resultados
SAKBÉ tiene un plazo total de 55 s y límite de 40 s por petición. Los timeouts no disparan reintentos de escala. El cliente permite cancelar, informa el tiempo transcurrido y corta a los 60 s. Las rutas completas se almacenan 15 minutos en caché interna con clave SHA-256 de usuario, coordenadas, categoría y variante; cada respuesta al navegador sigue siendo private/no-store y conserva la fecha de consulta original. La primera consulta depende del proveedor.
La vista de resultados oculta los campos de búsqueda y presenta mapa, casetas, gastos y propuesta en secciones. Fórmulas y conceptos sin costo se despliegan a demanda. Los controles movidos conservan asociación al formulario y recálculo de costos/margen.

## Presentación informativa
La interfaz, portada y reportes CSV/PDF omiten proveedores, fuentes y fechas de consulta. Los datos se presentan como informativos con advertencias de revisión. Los metadatos internos y los créditos de atribución del mapa se conservan. La verificación en navegador incluyó detalles de ruta, casetas, combustible y sección de datos; no hubo menciones visibles a los proveedores de datos.

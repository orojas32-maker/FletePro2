const fs=require('fs');
let h=fs.readFileSync('dist/index.html','utf8');
h=h.replace('</head>','<link rel="stylesheet" href="vendor/maplibre-gl.css"></head>');
h=h.replace('<script src="map-context.js"></script>','<script src="vendor/maplibre-gl.js"></script><script src="vendor/leaflet-maplibre-gl.js"></script><script src="map-context.js?v=openfreemap-1"></script>');
h=h.replace('CARRETERAS · ESTADOS · LOCALIDADES','OPENFREEMAP · MAPA DE CARRETERAS');
fs.writeFileSync('dist/index.html',h);
let b=fs.readFileSync('bundle.cjs','utf8').replace('`<script src="${name}.js"></script>`','`<script src="${name}.js${name===\'map-context\'?\'?v=openfreemap-1\':\'\'}"></script>`');fs.writeFileSync('bundle.cjs',b);

const fs=require('fs');
const lines=fs.readFileSync('tarifas-source.txt','utf8').split('\n');let page=1,rows=[],rejected=0;
for(let i=0;i<lines.length;i++){const l=lines[i];const pg=l.match(/PARSED TEXT FOR PAGE: (\d+)/);if(pg)page=Number(pg[1]);const m=l.match(/^\s*(.*?)\s+(\d[\d,]*\.\d+)\s+(\d{2}\/\d{2}\/\d{4})\s+(.+)$/);if(!m)continue;const vals=m[4].trim().split(/\s+/).map(s=>Number(s.replace(/,/g,'')));if(vals.length!==13||vals.some(n=>!Number.isFinite(n))){rejected++;continue}if(!m[1].trim()){rejected++;continue}rows.push({name:m[1].trim(),km:Number(m[2].replace(/,/g,'')),date:m[3],truck:vals.slice(5),page,source:'descargar.pdf',review:'Verificar nombre completo y tramo en PDF'});}
rows=rows.filter((r,i,a)=>a.findIndex(x=>x.name===r.name&&x.date===r.date&&x.km===r.km&&JSON.stringify(x.truck)===JSON.stringify(r.truck))===i);
fs.writeFileSync('dist/tariffs.js','window.FLETE_TARIFFS='+JSON.stringify(rows)+';');console.log(JSON.stringify({catalog:rows.length,rejected}));
let html=fs.readFileSync('dist/index.html','utf8');
html=html.replace('<link rel="stylesheet" href="style.css">','<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"><link rel="stylesheet" href="style.css">');
html=html.replace('<div class="notice"><b>◈ Modo de planeación manual</b><span>Captura kilómetros y casetas. Las rutas y restricciones todavía no se consultan a un proveedor.</span></div>','<div class="notice"><b>Planeador gratuito · versión de prueba</b><span>Mapa y rutas de referencia. La opción gratuita de automóvil no valida circulación para carga.</span></div>');
html=html.replace('<div class="workspace">',fs.readFileSync('map-panel.html','utf8')+'<div class="workspace">');
html=html.replace('<div id="tolls"></div>','<div class="catalog-tools"><label>Buscar tramo en tu PDF<input id="tariffSearch" placeholder="Ej. Querétaro, Palmillas, Chamapa"></label><p class="hint" id="catalogInfo"></p><div id="tariffResults"></div></div><div id="tolls"></div>');
html=html.replace('<span class="private">● Espacio privado</span>','<span class="private">Datos guardados en este navegador</span>');
html=html.replace('<h2>Motor de rutas y casetas</h2>','<h2>Rutas para camión · conexión opcional</h2>');
html=html.replace('<script src="app.js"></script>','<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script><script src="tariffs.js"></script><script src="app.js"></script><script src="map.js"></script>');
fs.writeFileSync('dist/index.html',html);

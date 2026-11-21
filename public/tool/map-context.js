if(routeMap){
  document.querySelectorAll('a[href="https://www.openstreetmap.org/copyright"]').forEach(a=>{const p=a.closest("p");if(p)p.remove();});
  const note=document.createElement('p');note.className='hint';note.id='basemapStatus';note.setAttribute('role','status');note.textContent='Cargando mapa de carreteras · OpenFreeMap…';$('#routeMap').after(note);
  routeMap.setMinZoom(2);
  routeMap.attributionControl.addAttribution('<a href="https://openfreemap.org/" target="_blank" rel="noopener">OpenFreeMap</a> · © <a href="https://openmaptiles.org/" target="_blank" rel="noopener">OpenMapTiles</a> · © <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a>');
  try{
    const base=L.maplibreGL({style:'https://tiles.openfreemap.org/styles/liberty',interactive:false,pane:'tilePane',attribution:''}).addTo(routeMap);
    const gl=base.getMaplibreMap();
    gl.on('load',()=>{note.textContent='Mapa de carreteras y localidades. Sin tráfico en tiempo real.';});
    gl.on('error',()=>{note.textContent='OpenFreeMap: no se pudieron cargar algunos datos del mapa. Revisa tu conexión. El cálculo de la ruta se conserva.';});
    new ResizeObserver(()=>{routeMap.invalidateSize({pan:false});gl.resize();}).observe($('#routeMap'));
  }catch(e){note.textContent='Este navegador no pudo mostrar el mapa. Revisa que permita aceleración gráfica. El cálculo y el desglose siguen disponibles.';}
  function fitProviderRoute(){const coords=routeGeometryParts(currentRoute?.geometry).flat();if(!coords?.length)return;routeMap.invalidateSize({pan:false});routeMap.fitBounds(L.latLngBounds(coords.map(p=>[p[1],p[0]])),{padding:[38,38],maxZoom:13,animate:false});}
  $('#fitRouteMap').onclick=fitProviderRoute;
  $('#routeOptions').addEventListener('click',e=>{if(e.target.dataset.applyRoute!==undefined)requestAnimationFrame(fitProviderRoute);});
}

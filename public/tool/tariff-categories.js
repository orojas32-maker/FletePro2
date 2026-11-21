const TARIFF_CATEGORIES=[{id:'moto',label:'Motos',kind:'moto',axles:null},{id:'auto',label:'Autos',kind:'auto',axles:null},...[2,3,4].map(axles=>({id:'bus'+axles,label:'Autobuses · '+axles+' ejes',kind:'bus',axles})),...[2,3,4,5,6,7,8,9].map(axles=>({id:'truck'+axles,label:'Camiones · '+axles+' ejes totales',kind:'truck',axles}))];
vehicleRouteLabel.hidden=true;
const tariffLabel=document.createElement('label');tariffLabel.innerHTML='Vehículo / categoría de la tarifa<select id="tariffCategory" name="tariffCategory" form="quoteForm">'+TARIFF_CATEGORIES.map(c=>'<option value="'+c.id+'">'+c.label+'</option>').join('')+'</select>';vehicleRouteLabel.before(tariffLabel);
const tariffExplanation=document.createElement('p');tariffExplanation.className='hint';tariffExplanation.textContent='Para camiones y tractocamiones se cuentan todos los ejes de la configuración, incluidos los remolques. El rendimiento y los costos siguen usando el perfil de unidad seleccionado.';tariffLabel.after(tariffExplanation);
function selectedTariffCategory(){return TARIFF_CATEGORIES.find(c=>c.id===$('#tariffCategory').value)||TARIFF_CATEGORIES.find(c=>c.id==='truck2');}
function tariffAmount(t,category){if(!t)return null;if(category.kind==='moto')return t.moto;if(category.kind==='auto')return t.car;if(category.kind==='bus')return t.bus?.[category.axles-2];return t.truck?.[category.axles-2];}
pricedRoutePlazas=function(plazas,tariffs){const c=selectedTariffCategory(),position=new Map(plazas.map((p,i)=>[p.id,i]));return plazas.map((p,i)=>{const fixed=tariffs.filter(t=>t.entryId===p.id&&t.exitId===p.id),pairs=tariffs.filter(t=>t.exitId===p.id&&t.entryId!==p.id&&position.has(t.entryId)&&position.get(t.entryId)<i),choices=fixed.length?fixed:pairs,t=choices.length===1?choices[0]:null,value=tariffAmount(t,c);return{name:p.name+' · '+c.label,amount:Number.isFinite(value)&&value>0?value:'',direction:'Ida',autoRoute:true,plazaId:p.id,rncTariffId:t?.id||null,source:RNC.source,updated:t?.updated||p.updated,axles:c.axles,tariffCategory:c.id,reviewRequired:true,reviewNote:Number.isFinite(value)&&value>0?'Tarifa histórica RNC 2025; pendiente de actualización.':'Sin importe determinado para '+c.label+'; no se considera paso gratuito.'};});};
const previousCategoryStatus=routeVehicleStatus;
routeVehicleStatus=function(){previousCategoryStatus();const c=selectedTariffCategory(),v=db.vehicles.find(v=>v.id===f.elements.vehicle.value);validationBox.textContent=c.label+' · casetas calculadas con esta categoría. Perfil de consumo: '+v.name+'. La categoría tarifaria no valida permisos, pesos, dimensiones ni conectividad de circulación.';};
function syncCategoryWithProfile(){const v=db.vehicles.find(v=>v.id===f.elements.vehicle.value),key='truck'+Number(v.axles);$('#tariffCategory').value=TARIFF_CATEGORIES.some(c=>c.id===key)?key:'truck2';$('#routeVehicleClass').value=/^T\d/i.test(v.config)?'tractor':'truck';routeVehicleStatus();}
$('#tariffCategory').onchange=()=>{const c=selectedTariffCategory();$('#routeVehicleClass').value=['moto','auto'].includes(c.kind)?'car':c.kind==='truck'&&c.axles>=4?'tractor':'truck';f.elements.tollsComplete.checked=false;if(currentRoute?.segments?.length)$('#rncDetect').click();else if(tolls.length){tolls=[];renderTolls();}routeVehicleStatus();};
f.addEventListener('change',e=>{if(e.target.name==='vehicle'){syncCategoryWithProfile();if(currentRoute?.segments?.length)$('#rncDetect').click();}});
f.addEventListener('reset',()=>queueMicrotask(syncCategoryWithProfile));
syncCategoryWithProfile();
// Un solo motor operativo; el selector interno se conserva para el cálculo.
$('#routeEngine').replaceChildren(new Option('RNC 2025','rnc'));
$('#routeEngine').value='rnc';
$('#routeEngine').closest('label').hidden=true;
$('#truckConfig').hidden=true;
// La unidad del viaje refleja la categoría de la ruta, sin otra selección.
const unitProfileControl=f.elements.vehicle;
unitProfileControl.hidden=true;
const unitCategoryDisplay=document.createElement('input');
unitCategoryDisplay.name='unitCategoryLabel';
unitCategoryDisplay.readOnly=true;
unitCategoryDisplay.setAttribute('aria-label','Unidad según la ruta');
unitProfileControl.before(unitCategoryDisplay);
const consumptionProfileNote=document.createElement('p');
consumptionProfileNote.className='hint';
unitProfileControl.closest('label').append(consumptionProfileNote);
function syncUnitCategoryDisplay(){const c=selectedTariffCategory(),v=db.vehicles.find(v=>v.id===unitProfileControl.value);unitCategoryDisplay.value=c.label;consumptionProfileNote.textContent='Consumo y costos: perfil '+v.name+'. Se configura en Mis unidades.';}
const updateBeforeUnitDisplay=update;
update=function(){updateBeforeUnitDisplay();syncUnitCategoryDisplay();};
const onTariffBeforeUnitSync=$('#tariffCategory').onchange;
$('#tariffCategory').onchange=()=>{const c=selectedTariffCategory();if(c.kind==='truck'){const match=db.vehicles.find(v=>Number(v.axles)===c.axles);if(match)unitProfileControl.value=match.id;}onTariffBeforeUnitSync();update();};
syncUnitCategoryDisplay();

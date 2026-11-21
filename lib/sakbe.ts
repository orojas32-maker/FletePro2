export class RouteServiceError extends Error {code:string;constructor(code:string){super(code==='not_found'?'No se encontró una ruta con esos puntos. Revisa el origen y destino.':'No se pudo completar la consulta de ruta. Intenta nuevamente.');this.name='RouteServiceError';this.code=code;}}
export type Coordinate=[number,number];
export type TransportQuery={origin:Coordinate;destination:Coordinate;vehicle:number;variant:'optima'|'cuota'|'libre'};
const first=(d:any)=>Array.isArray(d)?d[0]:d;
function geometry(value:any){if(!value)return null;try{const g=typeof value==='string'?JSON.parse(value):value;return g?.type&&g.coordinates?{type:g.type,coordinates:g.coordinates}:null}catch{return null}}
function distance(a:Coordinate,b:Coordinate){const rad=Math.PI/180,lat=(b[1]-a[1])*rad,lon=(b[0]-a[0])*rad;const h=Math.sin(lat/2)**2+Math.cos(a[1]*rad)*Math.cos(b[1]*rad)*Math.sin(lon/2)**2;return 6371000*2*Math.atan2(Math.sqrt(h),Math.sqrt(1-h));}
export async function sakbeRoute(query:TransportQuery,key:string,fetcher:typeof fetch=fetch){
const deadline=AbortSignal.timeout(55000);
async function call(fn:string,values:Record<string,string>){
for(let attempt=0;attempt<2;attempt++){
 let status=0,contentType='';
 try{
 const response=await fetcher('https://gaia.inegi.org.mx/sakbe_v3.1/'+fn,{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded','Accept':'application/json'},body:new URLSearchParams({...values,key,type:'json',proj:'GRS80'}),signal:AbortSignal.any([deadline,AbortSignal.timeout(25000)])});
 status=response.status;contentType=response.headers.get('content-type')||'';
 if(!response.ok){if(response.status===429||response.status>=500)throw new RouteServiceError('unavailable');throw new RouteServiceError('rejected');}
 const raw=(await response.text()).replace(/^\uFEFF/,'').trim();let result;
 try{result=JSON.parse(raw)}catch{throw new RouteServiceError('invalid_response')}
 if(!result||typeof result!=='object'||!result.response||typeof result.response.success!=='boolean')throw new RouteServiceError('invalid_response');
 if(!result.response.success)throw new RouteServiceError('not_found');return result;
 }catch(error){
 if(deadline.aborted)throw error;
 const code=error instanceof RouteServiceError?error.code:'unavailable';
 if(['not_found','rejected'].includes(code))throw error;
 console.warn('route_provider_failure',{method:fn,status,contentType,code,attempt:attempt+1});
 if(attempt===1)throw new RouteServiceError(code);
 }
}
throw new RouteServiceError('unavailable');}

async function line(point:Coordinate){for(const scale of ['10000','100000','1000000']){try{const r=await call('buscalinea',{x:String(point[0]),y:String(point[1]),escala:scale});const data=first(r.data);if(data?.id_routing_net&&geometry(data.geojson)?.type==='Point')return data;}catch(error){if(deadline.aborted||error instanceof RouteServiceError&&error.code!=='not_found'||error instanceof Error&&['TimeoutError','AbortError'].includes(error.name))throw error;if(scale==='1000000')throw Error('No se pudo asociar el punto a una carretera. Ajusta la ubicación.');}}throw Error('Punto fuera de la red carretera.');}
const [a,b]=await Promise.all([line(query.origin),line(query.destination)]);
const params={id_i:String(a.id_routing_net),source_i:String(a.source),target_i:String(a.target),id_f:String(b.id_routing_net),source_f:String(b.source),target_f:String(b.target),v:String(query.vehicle),e:'0'};
const detailMethod={optima:'detalle_o',cuota:'detalle_c',libre:'detalle_l'}[query.variant];
const [route,details]=await Promise.all([call(query.variant,params),call(detailMethod,params)]);const r=first(route.data),g=geometry(r?.geojson),rows=details.data;
if(!g||!['LineString','MultiLineString'].includes(g.type)||!Number.isFinite(Number(r.long_km))||Number(r.long_km)<=0||!Array.isArray(rows))throw Error('No se recibió un recorrido completo. Intenta nuevamente.');
const consulted=new Date().toISOString(),tolls=rows.filter((x:any)=>x.punto_caseta!==null&&x.punto_caseta!==undefined||Number(x.costo_caseta)>0).map((x:any,i:number)=>{const amount=Number(x.costo_caseta);return{name:String(x.direccion||'Caseta '+(i+1)).replace(/^Cruce la caseta\s*/i,''),amount:Number.isFinite(amount)&&amount>=0?amount:null,point:geometry(x.punto_caseta),source:'INEGI · API SAKBÉ',consulted};});
const tollTotal=Number(r.costo_caseta),tollSum=tolls.reduce((s:number,t:any)=>s+(t.amount||0),0),tollsConsistent=Number.isFinite(tollTotal)&&Math.abs(tollSum-tollTotal)<.02&&tolls.every((t:any)=>t.amount!==null);
const start=geometry(a.geojson)!.coordinates as Coordinate,end=geometry(b.geojson)!.coordinates as Coordinate;
return {km:Number(r.long_km),hours:Number(r.tiempo_min)/60,geometry:g,tolls,tollTotal,tollsConsistent,accessStart:[start[1],start[0]],accessEnd:[end[1],end[0]],snapStart:distance(query.origin,start),snapEnd:distance(query.destination,end),variant:query.variant,vehicle:query.vehicle,source:String(route.meta?.fuente||'INEGI · API SAKBÉ'),consulted,warning:String(r.advertencia||''),itinerary:rows.map((x:any)=>({instruction:String(x.direccion||''),meters:Number(x.long_m)||0,minutes:Number(x.tiempo_min)||0,toll:Number(x.costo_caseta)||0}))};
}

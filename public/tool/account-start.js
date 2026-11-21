(async()=>{
try{
const assetsPromise=fetch('script-assets.json',{cache:'no-store'}).then(r=>{if(!r.ok)throw Error('No se pudo cargar el planeador.');return r.json()});assetsPromise.catch(()=>{});const res=await fetch('/api/account',{cache:'no-store'});let account;if(res.status===401){account={user:{id:'guest',name:'Visitante'},plan:'free',role:'guest',revision:0,state:null,guest:true};}else{if(!res.ok)throw Error('No se pudo abrir el sitio. Intenta nuevamente.');account=await res.json();}
window.FLETE_ACCOUNT=account;window.FLETE_ROUTE_ONLY=account.plan!=='professional'||new URLSearchParams(location.search).get('mode')==='free';try{let guestKey=sessionStorage.getItem('fletepro-route-session');if(!guestKey){guestKey=crypto.randomUUID();sessionStorage.setItem('fletepro-route-session',guestKey);}window.FLETE_GUEST_KEY=guestKey;}catch{window.FLETE_GUEST_KEY=crypto.randomUUID();}
const key='fletepro-account-'+account.user.id;if(!account.guest){if(account.state)localStorage.setItem(key,JSON.stringify(account.state));else localStorage.removeItem(key);}
const scripts=await assetsPromise;
// Dynamic classic scripts download concurrently but async=false preserves execution order
// and their shared top-level bindings. Do not replace with modules or async scripts.
await Promise.all(scripts.map(src=>new Promise((resolve,reject)=>{const tag=document.createElement('script');tag.async=false;tag.src=src;tag.onload=resolve;tag.onerror=()=>reject(Error('No se pudo cargar el planeador. Revisa tu conexión.'));document.body.append(tag)})));
if(typeof window.fleteCalculateRoute!=='function'||!document.querySelector(window.FLETE_ROUTE_ONLY?'#basicHeader':'#paidCatalog'))throw Error('No se pudo preparar el planeador. Recarga la página.');
document.querySelector('main').setAttribute('aria-busy','false');document.documentElement.classList.remove('planner-loading');document.querySelector('#plannerBoot')?.remove();

if(!account.guest){const sync=document.createElement('script');sync.src='account-sync.js?v=locality-search-2';document.body.append(sync);}
}catch(e){const boot=document.querySelector('#plannerBoot');if(boot){boot.replaceChildren();const title=document.createElement('strong');title.textContent='FletePro';const message=document.createElement('p');message.textContent=e.message||'No se pudo abrir el planeador.';const retry=document.createElement('button');retry.type='button';retry.textContent='Volver a intentar';retry.onclick=()=>location.reload();const home=document.createElement('a');home.href='/';home.textContent='Volver al inicio';boot.append(title,message,retry,home);}else{document.documentElement.classList.remove('planner-loading');document.querySelector('main').textContent='No se pudo abrir el planeador. Recarga la página.';}}
})();

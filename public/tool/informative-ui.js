{
for(const name of ['fuelSource','fuelDate'])f.elements[name].closest('label').hidden=true;
const fuelArticle=$('#fuelMath').closest('article');fuelArticle.querySelector('.tag').textContent='DATOS INFORMATIVOS';
const hint=fuelArticle.querySelector('p.hint:not(#fuelReferenceStatus):not(#fuelMath)');if(hint)hint.textContent='Precio por litro informativo y editable. Verifica el importe vigente antes del viaje.';
for(const article of $$('#data article'))if(article!==dataNote&&article.querySelector('a[href*="globalmap"],a[href*="inegi"],a[href*="cne.gob"]'))article.hidden=true;
const oldMapMsg=mapMsg;mapMsg=function(message){oldMapMsg(String(message).replace(/INEGI(?:\s*[·-]?\s*(?:API\s*)?SAKBÉ)?|API\s*SAKBÉ|CNE|RNC\s*2025/gi,'el servicio de información'));};
}

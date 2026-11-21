import {readFileSync,writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
const root=new URL('../public/tool/',import.meta.url);
const sources=JSON.parse(readFileSync(new URL('script-list.json',root),'utf8'));
const urls=sources.map(source=>{if(/^https:\/\//.test(source))return source;const pathname=source.split('?')[0];const hash=createHash('sha256').update(readFileSync(new URL(pathname,root))).digest('hex').slice(0,12);return pathname+'?v='+hash;});
writeFileSync(new URL('script-assets.json',root),JSON.stringify(urls));
console.log('Prepared '+urls.length+' versioned planner assets');

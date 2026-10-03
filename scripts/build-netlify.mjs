import {cp,mkdir,readdir,rm} from 'node:fs/promises';
const root=new URL('../',import.meta.url),target=new URL('../dist/',import.meta.url);
await rm(target,{recursive:true,force:true});await mkdir(target,{recursive:true});
const excluded=new Set(['dist','netlify','scripts','support-backend','node_modules','.git','.openai']);
for(const entry of await readdir(root,{withFileTypes:true})) {
 if(excluded.has(entry.name)||entry.name.startsWith('.')||/\.(md|toml|test\.js)$/.test(entry.name)||entry.name==='package.json'||entry.name==='package-lock.json'||entry.name.includes('.env')||entry.name==='google-live-backend')continue;
 await cp(new URL(entry.name,root),new URL(entry.name,target),{recursive:true});
}

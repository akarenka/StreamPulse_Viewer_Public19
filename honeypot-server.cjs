'use strict';
const crypto=require('crypto');
function createGuard({now=Date.now,secret=crypto.randomBytes(32),onEvent=()=>{}}={}) {
  const used=new Map(), rates=new Map();
  const ttl=15*60*1000;
  function cleanup(){const time=now();for(const [k,v]of used)if(v<=time)used.delete(k);for(const[k,v]of rates)if(time-v.start>=60000)rates.delete(k);}
  function identity(req){return crypto.createHmac('sha256',secret).update(String(req.socket.remoteAddress||'unknown')).digest('hex');}
  function binding(req){return crypto.createHmac('sha256',secret).update(identity(req)+'|'+String(req.headers.origin||'')).digest('hex');}
  function rate(req,action,max){cleanup();const key=identity(req)+':'+action;let v=rates.get(key);if(!v){if(rates.size>=5000)return false;v={start:now(),count:0};rates.set(key,v);}return ++v.count<=max;}
  function reject(req,reason,status=403){onEvent({type:reason,client:identity(req).slice(0,16),time:new Date(now()).toISOString()});return {status,body:{error:'security_check_failed',message:status===429?'請稍後再試 / Please try again later':'上傳驗證未通過，請重試 / Upload verification failed'}};}
  function challenge(req){if(!rate(req,'challenge',30))return reject(req,'challenge_limit',429);const payload=Buffer.from(JSON.stringify({nonce:crypto.randomBytes(16).toString('hex'),expires:now()+ttl,binding:binding(req)})).toString('base64url');const sig=crypto.createHmac('sha256',secret).update(payload).digest('base64url');return{status:200,body:{token:payload+'.'+sig}};}
  function upload(req){
    if(!rate(req,'upload',10))return reject(req,'upload_limit',429);
    if(req.headers['x-sp-website'])return reject(req,'honeypot');
    const token=req.headers['x-sp-challenge'];if(typeof token!=='string'||token.length>1000)return reject(req,'missing_challenge');
    const parts=token.split('.');if(parts.length!==2||!parts.every(part=>/^[A-Za-z0-9_-]+$/.test(part)))return reject(req,'invalid_challenge');
    const sig=crypto.createHmac('sha256',secret).update(parts[0]).digest('base64url');
    if(parts[1].length!==sig.length||!crypto.timingSafeEqual(Buffer.from(parts[1]),Buffer.from(sig)))return reject(req,'invalid_signature');
    let data;try{data=JSON.parse(Buffer.from(parts[0],'base64url').toString());}catch{return reject(req,'invalid_payload');}
    if(!Number.isFinite(data.expires)||data.expires<=now()||data.expires>now()+ttl||data.binding!==binding(req)||typeof data.nonce!=='string'||used.has(data.nonce))return reject(req,'expired_or_replayed');
    if(used.size>=5000)return reject(req,'capacity',429);used.set(data.nonce,data.expires);return null;
  }
  return {challenge,upload};
}
module.exports={createGuard};

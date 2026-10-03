import { createHash } from 'node:crypto';
export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  const allowed = (process.env.ALLOWED_ORIGINS || '').split(',').map(x=>x.trim()).filter(Boolean);
  const origin = req.headers.origin;
  if (!origin || !allowed.includes(origin)) return res.status(403).json({error:'來源未允許'});
  res.setHeader('Access-Control-Allow-Origin',origin);
  res.setHeader('Vary','Origin');
  res.setHeader('Access-Control-Allow-Methods','POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers','Content-Type');
  if(req.method==='OPTIONS')return res.status(204).end();
  if(req.method!=='POST')return res.status(405).json({error:'不支援此方法'});
  const {OPENAI_API_KEY, OPENAI_MODEL, UPSTASH_REDIS_REST_URL, UPSTASH_REDIS_REST_TOKEN, RATE_LIMIT_SALT}=process.env;
  if(!OPENAI_API_KEY||!OPENAI_MODEL||!UPSTASH_REDIS_REST_URL||!UPSTASH_REDIS_REST_TOKEN||!RATE_LIMIT_SALT)return res.status(503).json({error:'AI 客服尚未設定完成'});
  let body;try{body=typeof req.body==='string'?JSON.parse(req.body):req.body;}catch{return res.status(400).json({error:'格式錯誤'});}
  if(!body||typeof body.message!=='string'||!body.message.trim()||body.message.length>1000||!Array.isArray(body.history)||body.history.length>8||body.history.some(x=>!x||!['user','assistant'].includes(x.role)||typeof x.content!=='string'||x.content.length>4000))return res.status(400).json({error:'訊息或歷史格式錯誤'});
  const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),20000);
  try{
    // Identity is supplied by Netlify context.ip, never a client header.
    const ip=req.trustedClientIp;
    if(!ip)throw new Error('missing IP');
    const hash=createHash('sha256').update(RATE_LIMIT_SALT+ip).digest('hex');
    const minute=Math.floor(Date.now()/60000),day=Math.floor(Date.now()/86400000);
    const script="local a=redis.call('INCR',KEYS[1]); if a==1 then redis.call('EXPIRE',KEYS[1],120) end; local b=redis.call('INCR',KEYS[2]); if b==1 then redis.call('EXPIRE',KEYS[2],172800) end; return {a,b}";
    const budget=await fetch(UPSTASH_REDIS_REST_URL,{method:'POST',headers:{Authorization:`Bearer ${UPSTASH_REDIS_REST_TOKEN}`,'Content-Type':'application/json'},body:JSON.stringify(['EVAL',script,'2',`support:ip:${hash}:${minute}`,`support:day:${day}`]),signal:controller.signal});
    if(!budget.ok)throw new Error('budget');const counts=await budget.json();
    if(!Array.isArray(counts.result)||counts.result.length!==2||counts.result.some(x=>!Number.isFinite(Number(x))))throw new Error('budget');
    const daily=Number(process.env.DAILY_REQUEST_LIMIT||100);if(!Number.isInteger(daily)||daily<1)throw new Error('config');
    if(Number(counts.result[0])>5||Number(counts.result[1])>daily){res.setHeader('Retry-After','60');return res.status(429).json({error:'客服使用額度已達限制，請稍後再試'});}
    const reply=await fetch('https://api.openai.com/v1/responses',{method:'POST',headers:{Authorization:`Bearer ${OPENAI_API_KEY}`,'Content-Type':'application/json'},signal:controller.signal,body:JSON.stringify({model:OPENAI_MODEL,store:false,max_output_tokens:600,instructions:'你是 StreamPulse 網站客服，依使用者語言簡短回答。網站有 Google 登入、影音播放及個人影音庫。無法查閱私人資料、訂單或修改帳號。對價格、付款、管理設定等未知內容請坦承不確定並請使用者聯絡管理員。不要索取密碼、密鑰、信用卡。不可聲稱完成任何操作。',input:[...body.history,{role:'user',content:body.message.trim()}]})});
    if(!reply.ok)throw new Error('upstream');const data=await reply.json();
    const text=(data.output||[]).filter(x=>x.type==='message').flatMap(x=>x.content||[]).filter(x=>x.type==='output_text').map(x=>x.text).join('\n');
    if(!text)throw new Error('empty');return res.status(200).json({reply:text});
  }catch{return res.status(503).json({error:'AI 客服暫時無法回覆，請稍後再試'});}finally{clearTimeout(timer);}
}

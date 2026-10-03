import core from '../lib/chat-core.mjs';
export default async function chat(request, context) {
  const headers = Object.fromEntries(request.headers.entries());
  let body='';
  if(request.method==='POST') {
    if(!headers['content-type']?.startsWith('application/json'))return Response.json({error:'需要 JSON 格式'}, {status:415});
    body=await request.text();
    if(new TextEncoder().encode(body).length>40000)return Response.json({error:'請求太大'},{status:413});
  }
  const output={headers:{},code:200,body:null,setHeader(k,v){this.headers[k]=v;},status(code){this.code=code;return this;},json(body){this.body=JSON.stringify(body);this.headers['Content-Type']='application/json; charset=utf-8';return this;},end(){return this;}};
  await core({headers,body,method:request.method,trustedClientIp:context.ip}, output);
  return new Response(output.body,{status:output.code,headers:output.headers});
}

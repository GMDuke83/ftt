// functions/api/trades.js
export async function onRequestGet({ env }) {
  const json = await env.TRADES.get('ftt:data');
  return new Response(json || '{"trades":[],"cash":[],"updated":0}', {
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }
  });
}

export async function onRequestPost({ request, env }) {
  try{
    const body = await request.text(); // raw JSON
    if(body && body.trim().startsWith('{')){
      await env.TRADES.put('ftt:data', body);
      return new Response('OK', { status: 200 });
    }else{
      return new Response('Bad Request', { status: 400 });
    }
  }catch(e){
    return new Response('Error: ' + (e?.message || 'unknown'), { status: 500 });
  }
}

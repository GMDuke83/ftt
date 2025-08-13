// Cloudflare Pages Function: /api/trades
const HEADERS = {
  "content-type": "application/json; charset=utf-8",
  "cache-control": "no-store"
};

export async function onRequestGet({ env }) {
  try {
    const raw = await env.TRADES.get("DATA_V1");
    if (!raw) {
      return new Response(
        JSON.stringify({ trades: [], cash: [], updated: Date.now(), autoCash: true }),
        { headers: HEADERS }
      );
    }
    return new Response(raw, { headers: HEADERS });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), { status: 500, headers: HEADERS });
  }
}

export async function onRequestPost({ request, env }) {
  try {
    const body = await request.json(); // {trades, cash, autoCash, ...}
    await env.TRADES.put("DATA_V1", JSON.stringify(body));
    return new Response(JSON.stringify({ ok: true, updated: Date.now() }), { headers: HEADERS });
  } catch (e) {
    return new Response(JSON.stringify({ error: "invalid JSON or KV error", detail: String(e) }), { status: 400, headers: HEADERS });
  }
}

/*
  Duttiva AI relay: a Cloudflare Worker that lets the Duttiva preview on
  karenedegware.com use a real AI model without any key in the web page.

  It uses Cloudflare's own free AI models by default (no API key needed).
  If an OPENAI_API_KEY secret is added to the Worker, it uses OpenAI instead.

  Limits keep it cheap and hard to abuse: only karenedegware.com may call it,
  each visitor gets a handful of requests a minute, and answers are capped.
*/
const ALLOWED = ["https://karenedegware.com", "https://www.karenedegware.com"];
const PER_MINUTE = 8;
const MAX_INPUT = 12000;
const hits = new Map();

function cors(origin) {
  return {
    "Access-Control-Allow-Origin": ALLOWED.includes(origin) ? origin : ALLOWED[0],
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
    Vary: "Origin",
  };
}

function limited(ip) {
  const now = Date.now();
  const list = (hits.get(ip) || []).filter((t) => now - t < 60000);
  list.push(now);
  hits.set(ip, list);
  if (hits.size > 5000) hits.clear();
  return list.length > PER_MINUTE;
}

function clean(messages) {
  if (!Array.isArray(messages)) return null;
  let total = 0;
  const out = [];
  for (const m of messages.slice(-6)) {
    if (!m || (m.role !== "system" && m.role !== "user" && m.role !== "assistant")) continue;
    const content = String(m.content || "").slice(0, MAX_INPUT - total);
    total += content.length;
    out.push({ role: m.role, content });
    if (total >= MAX_INPUT) break;
  }
  return out.some((m) => m.role === "user") ? out : null;
}

/* Turn a server-sent event stream into plain text chunks */
function sseToText(body, pick) {
  const dec = new TextDecoder();
  const enc = new TextEncoder();
  let buf = "";
  return body.pipeThrough(new TransformStream({
    transform(chunk, controller) {
      buf += dec.decode(chunk, { stream: true });
      const lines = buf.split("\n");
      buf = lines.pop();
      for (const line of lines) {
        const l = line.trim();
        if (!l.startsWith("data:")) continue;
        const data = l.slice(5).trim();
        if (!data || data === "[DONE]") continue;
        try { const t = pick(JSON.parse(data)); if (t) controller.enqueue(enc.encode(t)); } catch (e) { /* partial line */ }
      }
    },
  }));
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get("Origin") || "";
    const headers = cors(origin);
    if (request.method === "OPTIONS") return new Response(null, { headers });
    if (request.method !== "POST" || !ALLOWED.includes(origin)) return new Response("Not allowed", { status: 403, headers });
    if (limited(request.headers.get("CF-Connecting-IP") || "anon")) return new Response("Too many requests. Try again in a minute.", { status: 429, headers });

    let body;
    try { body = await request.json(); } catch (e) { return new Response("Bad request", { status: 400, headers }); }
    const messages = clean(body && body.messages);
    if (!messages) return new Response("Bad request", { status: 400, headers });

    const out = { ...headers, "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store" };

    if (env.OPENAI_API_KEY) {
      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: "Bearer " + env.OPENAI_API_KEY },
        body: JSON.stringify({ model: "gpt-4o-mini", messages, temperature: 0.5, max_tokens: 700, stream: true }),
      });
      if (!res.ok) return new Response("The AI model is busy", { status: 502, headers });
      return new Response(sseToText(res.body, (j) => j.choices && j.choices[0] && j.choices[0].delta && j.choices[0].delta.content), { headers: out });
    }

    if (env.AI) {
      const stream = await env.AI.run("@cf/meta/llama-3.1-8b-instruct", { messages, max_tokens: 700, stream: true });
      return new Response(sseToText(stream, (j) => j.response), { headers: out });
    }

    return new Response("The relay has no AI model connected yet", { status: 503, headers });
  },
};

// VELOX: receptor de homologacao. Nao registra jornada e nao envia mensagens.
const encoder = new TextEncoder();
const MAX_BYTES = 262144;
function reply(status, text) {
  return new Response(text, { status, headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-store' } });
}
async function boundedBody(request) {
  if (!request.body) return new Uint8Array();
  const reader = request.body.getReader();
  const chunks = []; let size = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.length;
    if (size > MAX_BYTES) { await reader.cancel(); throw new Error('size'); }
    chunks.push(value);
  }
  const result = new Uint8Array(size); let offset = 0;
  for (const chunk of chunks) { result.set(chunk, offset); offset += chunk.length; }
  return result;
}
async function authentic(body, signature, secret) {
  if (!/^sha256=[a-f0-9]{64}$/i.test(signature || '')) return false;
  const bytes = Uint8Array.from(signature.slice(7).match(/../g), x => parseInt(x, 16));
  const key = await crypto.subtle.importKey('raw', encoder.encode(secret), {name:'HMAC',hash:'SHA-256'}, false, ['verify']);
  return crypto.subtle.verify('HMAC', key, bytes, body);
}
Deno.serve(async request => {
  try {
    const url = new URL(request.url);
    if (request.method === 'GET') {
      const token = Deno.env.get('WA_VERIFY_TOKEN');
      if (!token) return reply(503, 'Not configured');
      const challenge = url.searchParams.get('hub.challenge');
      if (url.searchParams.get('hub.mode') !== 'subscribe' || url.searchParams.get('hub.verify_token') !== token || !challenge || !/^\d{1,100}$/.test(challenge)) return reply(403, 'Forbidden');
      return reply(200, challenge);
    }
    if (request.method !== 'POST') return reply(405, 'Method not allowed');
    const secret = Deno.env.get('WA_APP_SECRET');
    const waba = Deno.env.get('WA_EXPECTED_WABA_ID');
    const phone = Deno.env.get('WA_EXPECTED_PHONE_NUMBER_ID');
    const allowed = new Set((Deno.env.get('WA_TEST_SENDERS') || '').split(',').map(x => x.trim()).filter(x => /^\d{8,15}$/.test(x)));
    if (!secret || !waba || !phone || !allowed.size) return reply(503, 'Not configured');
    let body;
    try { body = await boundedBody(request); } catch { return reply(413, 'Payload too large'); }
    if (!await authentic(body, request.headers.get('x-hub-signature-256'), secret)) return reply(401, 'Unauthorized');
    let payload;
    try { payload = JSON.parse(new TextDecoder().decode(body)); } catch { return reply(400, 'Invalid JSON'); }
    if (payload.object !== 'whatsapp_business_account' || !Array.isArray(payload.entry) || payload.entry.length > 100) return reply(400, 'Invalid event');
    const records = [];
    for (const entry of payload.entry) {
      if (entry.id !== waba) return reply(403, 'Account mismatch');
      if (!Array.isArray(entry.changes) || entry.changes.length > 100) return reply(400, 'Invalid changes');
      for (const change of entry.changes) {
        if (change.field !== 'messages') continue;
        const value = change.value;
        if (!value || value.metadata?.phone_number_id !== phone) return reply(403, 'Phone mismatch');
        if (!value.messages) continue; // status de entrega nao e marcacao
        if (!Array.isArray(value.messages) || value.messages.length > 100) return reply(400, 'Invalid messages');
        for (const message of value.messages) {
          if (!allowed.has(message.from)) continue;
          if (message.type !== 'text' || typeof message.text?.body !== 'string' || message.text.body.trim().toUpperCase() !== 'PONTO') continue;
          if (typeof message.id !== 'string' || !message.id.length || message.id.length > 512 || !/^\d{1,12}$/.test(message.timestamp || '')) return reply(400, 'Invalid message');
          const time = new Date(Number(message.timestamp) * 1000);
          if (!Number.isFinite(time.getTime())) return reply(400, 'Invalid timestamp');
          records.push({ provider_message_id: message.id, waba_id: waba, phone_number_id: phone, sender: message.from, provider_timestamp: time.toISOString(), command: 'PONTO', stage: 'test_received' });
        }
      }
    }
    if (!records.length) return reply(200, 'EVENT_RECEIVED');
    const base = Deno.env.get('SUPABASE_URL');
    const key = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    if (!base || !key) return reply(503, 'Storage unavailable');
    const stored = await fetch(base + '/rest/v1/velox_wa_test_inbox?on_conflict=phone_number_id,provider_message_id', {
      method: 'POST', headers: { 'apikey': key, 'Authorization': 'Bearer ' + key, 'Content-Type': 'application/json', 'Prefer': 'resolution=ignore-duplicates,return=minimal' },
      body: JSON.stringify(records), signal: AbortSignal.timeout(10000)
    });
    if (!stored.ok) return reply(503, 'Storage unavailable'); // Meta deve reenviar
    return reply(200, 'EVENT_RECEIVED');
  } catch { return reply(503, 'Temporarily unavailable'); }
});

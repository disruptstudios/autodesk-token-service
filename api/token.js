// Edge Function: issues a short-lived APS access token
export const config = { runtime: 'edge' };

export default async function handler() {
  try {
    // Build the OAuth request body
    const params = new URLSearchParams();
    params.append('client_id',    Deno.env.get('APS_CLIENT_ID'));
    params.append('client_secret',Deno.env.get('APS_CLIENT_SECRET'));
    params.append('grant_type',   'client_credentials');
    params.append('scope',        'data:read bucket:read viewables:read');

    // Request token from Autodesk
    const r = await fetch('https://developer.api.autodesk.com/authentication/v1/authenticate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params
    });

    const body = await r.text();
    return new Response(body, {
      status: r.status,
      headers: {
        'content-type': 'application/json',
        'access-control-allow-origin': '*' // let Squarespace call it
      }
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500,
      headers: {
        'content-type': 'application/json',
        'access-control-allow-origin': '*'
      }
    });
  }
}

// Vercel Serverless Function for APS Token
export default async function handler(req, res) {
  try {
    const params = new URLSearchParams();
    params.append('client_id', process.env.APS_CLIENT_ID);
    params.append('client_secret', process.env.APS_CLIENT_SECRET);
    params.append('grant_type', 'client_credentials');
    params.append('scope', 'data:read bucket:read viewables:read');

    const r = await fetch('https://developer.api.autodesk.com/authentication/v1/authenticate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params
    });

    if (!r.ok) {
      const t = await r.text();
      return res.status(r.status).json({ error: t });
    }
    const json = await r.json();

    // Allow Squarespace to call this (CORS)
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.status(200).json(json);
  } catch (e) {
    res.status(500).json({ error: e.message });
    
  }
}

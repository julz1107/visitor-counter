export const config = {
  runtime: 'edge',
};

export default async function handler(req) {
  const KV_URL = 'https://api.vercel.com/v1/kv/';
  const KV_REST_API_URL = `${KV_URL}get?key=visitCount`;
  const KV_REST_API_PUT = `${KV_URL}set`;

  const headers = {
    Authorization: `Bearer ${process.env.KV_REST_API_TOKEN}`,
    'Content-Type': 'application/json',
  };

  try {
    const getRes = await fetch(KV_REST_API_URL, { headers });
    let count = 0;
    if (getRes.ok) {
      const data = await getRes.json();
      count = parseInt(data.result || 0);
    }
    count += 1;

    await fetch(KV_REST_API_PUT, {
      method: 'POST',
      headers,
      body: JSON.stringify({ key: 'visitCount', value: count }),
    });

    return new Response(JSON.stringify({ count }), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}

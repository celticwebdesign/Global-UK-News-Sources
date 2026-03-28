// Netlify serverless function — fetches RSS feeds server-side to avoid CORS
// Available at: /api/proxy?url=<encoded-rss-url>

exports.handler = async function (event) {
  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers: corsHeaders(),
      body: '',
    };
  }

  const rawUrl = event.queryStringParameters?.url;

  if (!rawUrl) {
    return jsonError(400, 'Missing url parameter');
  }

  let decoded;
  try {
    decoded = decodeURIComponent(rawUrl);
    const parsed = new URL(decoded);
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      throw new Error('Only http/https URLs are allowed');
    }
  } catch (err) {
    return jsonError(400, `Invalid URL: ${err.message}`);
  }

  try {
    const res = await fetch(decoded, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; RSSReader/1.0)',
        'Accept': 'application/rss+xml, application/atom+xml, application/xml, text/xml, */*',
      },
      signal: AbortSignal.timeout(10000),
    });

    if (!res.ok) {
      return jsonError(res.status, `Upstream returned ${res.status}`);
    }

    const body = await res.text();

    return {
      statusCode: 200,
      headers: {
        ...corsHeaders(),
        'Content-Type': 'text/xml; charset=utf-8',
        'Cache-Control': 'public, max-age=300', // cache 5 minutes
      },
      body,
    };
  } catch (err) {
    return jsonError(500, `Fetch failed: ${err.message}`);
  }
};

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
}

function jsonError(status, message) {
  return {
    statusCode: status,
    headers: { ...corsHeaders(), 'Content-Type': 'application/json' },
    body: JSON.stringify({ error: message }),
  };
}

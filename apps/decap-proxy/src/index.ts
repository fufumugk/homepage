export interface Env {
  CLIENT_ID: string;
  CLIENT_SECRET: string;
}

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Methods": "POST, OPTIONS"
};

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders });
    }

    const url = new URL(request.url);

    if (request.method === "POST" && url.pathname === "/auth") {
      let code: string | undefined;
      try {
        const data = await request.json();
        code = data.code;
      } catch (_) {
        return new Response(JSON.stringify({ error: "invalid request" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      }

      if (!code) {
        return new Response(JSON.stringify({ error: "missing code" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      }

      const body = JSON.stringify({
        client_id: env.CLIENT_ID,
        client_secret: env.CLIENT_SECRET,
        code
      });

      const githubResponse = await fetch(
        "https://github.com/login/oauth/access_token",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json"
          },
          body
        }
      );

      const resultText = await githubResponse.text();
      return new Response(resultText, {
        status: githubResponse.status,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json"
        }
      });
    }

    if (request.method === "GET" && url.pathname === "/") {
      return new Response("Decap Proxy", { headers: corsHeaders });
    }

    return new Response("Not found", { status: 404, headers: corsHeaders });
  }
};

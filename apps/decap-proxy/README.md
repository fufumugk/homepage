# Decap Proxy (Cloudflare Functions)

This Cloudflare Worker provides a minimal OAuth proxy for Decap CMS using GitHub authentication. It exchanges an OAuth `code` for an access token and returns the result.

## Local Development

Install dependencies and start the development server:

```bash
pnpm install
pnpm dev
```

## Deployment

Set the `CLIENT_ID` and `CLIENT_SECRET` variables in your Cloudflare project or via `wrangler` secrets and deploy:

```bash
pnpm deploy
```

Requests should be sent to the `/auth` endpoint with a JSON body containing the GitHub OAuth `code`.

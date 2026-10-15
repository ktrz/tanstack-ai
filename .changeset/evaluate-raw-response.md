---
'@tanstack/ai': minor
'@tanstack/ai-typesafe': minor
'@tanstack/ai-ollaya': minor
'@tanstack/ai-openrouter': minor
'@tanstack/ai-vercel-gateway': minor
'@tanstack/ai-openai': minor
'@tanstack/ai-cloudflare': minor
---

`decide()` accepts a new `includeRaw` option. With `includeRaw: true`, `result.meta.raw` holds the provider response as the adapter received it, before `decide()` maps the answers. Use it to log what the provider returned, for audits and to debug a wrong answer. The option defaults to `false`, so results do not change and do not hold the full response unless you ask for it. The `raw` field is on the `meta` type (`EvaluateRawResultMeta`) only when you pass `includeRaw: true`, so existing result types do not change. For example, a TanStack Start server function that returns a `decide()` result still type-checks. Adapters return the response on a new optional `raw` field of `EvaluateAdapterResult`. The shape of `raw` belongs to the provider and is typed `unknown`.

The evaluate adapters return the response on `raw`:

- `typesafeDecider`, `ollayaDecider`, `openRouterDecider`, and `vercelGatewayDecider`: the parsed JSON body.
- `openaiDecider`: the `Decision` object that the OpenAI SDK returns.
- `cloudflareDecider`: the Workers AI model output. Over REST, this is the `result` field of the response.

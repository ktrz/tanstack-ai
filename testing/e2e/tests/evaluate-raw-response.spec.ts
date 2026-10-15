import { test, expect } from './fixtures'

/**
 * With `includeRaw: true`, `decide()` puts the provider response on
 * `meta.raw`. Without it, `meta` has no `raw` key.
 *
 * The `/api/evaluate-raw-response` route drives the OpenAI evaluate adapter
 * against an aimock mount that serves a valid `/v1/decisions` response.
 */
test.describe('evaluate: raw provider response', () => {
  test('meta.raw holds the response only with includeRaw', async ({
    request,
  }) => {
    const res = await request.post('/api/evaluate-raw-response')
    expect(res.ok()).toBe(true)

    const { withRaw, withoutRaw } = (await res.json()) as {
      withRaw: Record<string, unknown>
      withoutRaw: Record<string, unknown>
    }

    expect(withRaw.raw).toEqual({
      model: 'gpt-6-luna',
      answers: [
        {
          type: 'choice',
          name: 'queue',
          choice: 'billing',
          confidence: 0.9,
          probabilities: [
            { value: 'billing', probability: 0.8 },
            { value: 'tech', probability: 0.2 },
          ],
        },
      ],
      usage: {
        input_tokens: 30,
        input_tokens_details: { cache_write_tokens: 0, cached_tokens: 0 },
        output_tokens: 5,
        output_tokens_details: { reasoning_tokens: 0 },
        total_tokens: 35,
      },
    })
    expect(withRaw.model).toBe('gpt-6-luna')
    expect('raw' in withoutRaw).toBe(false)
  })
})

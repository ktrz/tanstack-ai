import { createFileRoute } from '@tanstack/react-router'
import { choice, decide } from '@tanstack/ai'
import { createOpenaiDecider } from '@tanstack/ai-openai'

const LLMOCK_DEFAULT_BASE = process.env.LLMOCK_URL || 'http://127.0.0.1:4010'
const DUMMY_KEY = 'sk-e2e-test-dummy-key'

/**
 * Drives `decide()` through the OpenAI evaluate adapter against the
 * `/evaluate-raw-response` aimock mount twice: once with `includeRaw: true`
 * and once without. The route returns both `meta` objects.
 */
export const Route = createFileRoute('/api/evaluate-raw-response')({
  server: {
    handlers: {
      POST: async () => {
        const adapter = createOpenaiDecider('gpt-6-luna', DUMMY_KEY, {
          baseURL: `${LLMOCK_DEFAULT_BASE}/evaluate-raw-response/v1`,
        })
        const options = {
          adapter,
          state: { ticket: 'I was charged twice this month.' },
          questions: {
            queue: choice({
              instructions: 'Which team should handle this ticket?',
              options: { billing: null, tech: null },
            }),
          },
        }

        const withRaw = await decide({ ...options, includeRaw: true })
        const withoutRaw = await decide(options)

        return Response.json({
          withRaw: withRaw.meta,
          withoutRaw: withoutRaw.meta,
        })
      },
    },
  },
})

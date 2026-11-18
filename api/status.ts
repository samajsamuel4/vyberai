import { getPublicStatus } from '../server/status'

/** Published Cursor Apps / Vercel host — Web Request handler. */
export async function GET(): Promise<Response> {
  return new Response(JSON.stringify(getPublicStatus()), {
    status: 200,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'private, no-store',
    },
  })
}

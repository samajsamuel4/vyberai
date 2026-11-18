import { handleChatApi, type ChatApiBody } from '../server/chat-api'
import {
  BodyTooLargeError,
  InvalidJsonError,
  readJsonFromWebRequest,
} from '../server/read-body'

function jsonResponse(
  status: number,
  body: unknown,
  extraHeaders?: Record<string, string>,
): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'private, no-store',
      ...extraHeaders,
    },
  })
}

/**
 * Published Cursor Apps / Vercel host — Web Request handler.
 * Local Vite + `npm start` keep using the Node middleware / serve.ts.
 */
export async function POST(request: Request): Promise<Response> {
  let body: ChatApiBody
  try {
    body = (await readJsonFromWebRequest(request)) as ChatApiBody
  } catch (err) {
    if (err instanceof BodyTooLargeError) {
      return jsonResponse(413, { error: err.message })
    }
    if (err instanceof InvalidJsonError) {
      return jsonResponse(400, { error: err.message })
    }
    return jsonResponse(400, { error: 'Neplatný JSON.' })
  }

  const result = await handleChatApi(request, body)
  if ('error' in result) {
    return jsonResponse(result.status, { error: result.error }, result.headers)
  }
  return jsonResponse(200, result)
}

export async function OPTIONS(): Promise<Response> {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'content-type',
      'Cache-Control': 'no-store',
    },
  })
}

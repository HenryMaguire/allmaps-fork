import { json, type RequestHandler } from '@sveltejs/kit'

const STORE = new Map<string, { annotation: unknown; updatedAt: number }>()
const TTL_MS = 10 * 60 * 1000

function gc(now: number) {
  for (const [eid, entry] of STORE) {
    if (now - entry.updatedAt > TTL_MS) STORE.delete(eid)
  }
}

export const POST: RequestHandler = async ({ params, request }) => {
  const eid = params.eid
  if (!eid) return json({ error: 'missing eid' }, { status: 400 })

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return json({ error: 'invalid json' }, { status: 400 })
  }

  const now = Date.now()
  STORE.set(eid, { annotation: body, updatedAt: now })
  gc(now)
  return json({ ok: true, updatedAt: now })
}

export const GET: RequestHandler = async ({ params }) => {
  const eid = params.eid
  if (!eid) return json({ error: 'missing eid' }, { status: 400 })

  const entry = STORE.get(eid)
  if (!entry) return json({ error: 'not found' }, { status: 404 })
  return json({ annotation: entry.annotation, updatedAt: entry.updatedAt })
}

export const DELETE: RequestHandler = async ({ params }) => {
  const eid = params.eid
  if (!eid) return json({ error: 'missing eid' }, { status: 400 })
  STORE.delete(eid)
  return json({ ok: true })
}

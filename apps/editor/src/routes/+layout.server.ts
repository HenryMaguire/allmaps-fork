import type { LayoutServerLoad } from './$types'

// ground-control fork: under adapter-node (Railway), platform.env is gone.
// Use process.env directly, with the upstream Cloudflare defaults as
// fallbacks so the Editor works out of the box without per-deploy config.
const DEFAULTS: Record<string, string> = {
  PUBLIC_ALLMAPS_API_WS_URL: 'wss://api.allmaps.org',
  PUBLIC_ALLMAPS_API_URL: 'https://api.allmaps.org',
  PUBLIC_ALLMAPS_ANNOTATIONS_API_URL: 'https://annotations.allmaps.org',
  PUBLIC_ALLMAPS_PREVIEW_URL: 'https://preview.allmaps.org/apps/editor',
  PUBLIC_ALLMAPS_VIEWER_URL: 'https://viewer.allmaps.org',
  PUBLIC_ALLMAPS_TILE_SERVER_URL: 'https://allmaps.xyz',
  PUBLIC_EXAMPLES_API_URL: 'https://sammeltassen-allmaps.web.val.run',
  PUBLIC_STATS_WEBSITE_ID: '',
  PUBLIC_GEOCODE_EARTH_KEY: ''
}

function envOr(key: string, fallback: string): string {
  const v = process.env[key]
  return v !== undefined && v !== '' ? v : fallback
}

export const load: LayoutServerLoad = async () => {
  const vars: Record<string, unknown> = {}
  for (const [k, v] of Object.entries(DEFAULTS)) {
    vars[k] = envOr(k, v)
  }
  vars.VITE_BANNER_ENABLED = process.env.VITE_BANNER_ENABLED === 'true'
  vars.VITE_BANNER_TEXT = process.env.VITE_BANNER_TEXT ?? ''
  return { vars }
}

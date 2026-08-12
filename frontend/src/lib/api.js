import { API_BASE } from './constants'

/**
 * Centralized API client using native fetch().
 * All functions return { data, error } for consistent error handling.
 * Routes through Vite proxy (/api → localhost:8000) in development.
 */

async function request(path, options = {}) {
  try {
    const res = await fetch(`${API_BASE}${path}`, {
      headers: { 'Content-Type': 'application/json' },
      ...options,
    })

    if (!res.ok) {
      const errorBody = await res.json().catch(() => ({}))
      return {
        data: null,
        error: errorBody.detail || `Request failed (${res.status})`,
      }
    }

    const data = await res.json()
    return { data, error: null }
  } catch (err) {
    return {
      data: null,
      error: err.message === 'Failed to fetch'
        ? 'Backend unreachable — is the server running?'
        : err.message,
    }
  }
}

/** GET /health — server status check */
export function fetchHealth() {
  return request('/health')
}

/** GET /players — searchable, filterable player directory */
export function fetchPlayers({ search, position_group, league, u21_only, limit = 100, offset = 0 } = {}) {
  const params = new URLSearchParams()
  if (search) params.set('search', search)
  if (position_group) params.set('position_group', position_group)
  if (league) params.set('league', league)
  if (u21_only) params.set('u21_only', 'true')
  params.set('limit', String(limit))
  params.set('offset', String(offset))
  return request(`/players?${params}`)
}

/** GET /players/{player_id} — full player profile with stats + GMM */
export function fetchPlayerDetail(playerId) {
  return request(`/players/${encodeURIComponent(playerId)}`)
}

/** GET /similar/{player_id} — tactical similarity matches */
export function fetchSimilar(playerId, n = 5, u21Only = false) {
  const params = new URLSearchParams({ n: String(n) })
  if (u21Only) params.set('u21_only', 'true')
  return request(`/similar/${encodeURIComponent(playerId)}?${params}`)
}

/** GET /clusters — all tactical archetypes grouped by position */
export function fetchClusters() {
  return request('/clusters')
}

/** POST /scout-agent/query — AI Scout Agent natural language queries */
export function postScoutQuery(query) {
  return request('/scout-agent/query', {
    method: 'POST',
    body: JSON.stringify({ query }),
  })
}

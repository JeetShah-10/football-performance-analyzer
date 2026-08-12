import { useState, useEffect } from 'react'
import { fetchHealth } from '../lib/api'
import { MOCK_HEALTH } from '../lib/mockData'

export default function HealthBadge() {
  const [status, setStatus] = useState('connecting') // connecting, online, offline
  const [details, setDetails] = useState(null)

  useEffect(() => {
    let mounted = true
    
    const checkHealth = async () => {
      const { data, error } = await fetchHealth()
      if (!mounted) return
      
      if (error) {
        // Fallback to mock data if backend is offline during dev
        setStatus('offline (mock)')
        setDetails(MOCK_HEALTH)
      } else {
        setStatus('online')
        setDetails(data)
      }
    }

    checkHealth()
    const interval = setInterval(checkHealth, 30000)
    return () => {
      mounted = false
      clearInterval(interval)
    }
  }, [])

  const isOnline = status === 'online'
  const isMock = status === 'offline (mock)'
  
  let dotColor = 'bg-zinc-500'
  if (isOnline) dotColor = 'bg-emerald-500'
  if (isMock) dotColor = 'bg-amber-500'

  return (
    <div 
      className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-900/50 border border-zinc-800 text-xs text-zinc-300"
      title={details ? `Dataset: ${details.dataset} | Players: ${details.total_players} | v${details.version}` : 'Connecting...'}
    >
      <div className="relative flex h-2 w-2">
        {(isOnline || isMock) && (
          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${dotColor}`}></span>
        )}
        <span className={`relative inline-flex rounded-full h-2 w-2 ${dotColor}`}></span>
      </div>
      <span className="capitalize">{status}</span>
    </div>
  )
}

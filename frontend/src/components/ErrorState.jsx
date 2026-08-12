import { AlertCircle, RefreshCw } from 'lucide-react'

export default function ErrorState({ message, onRetry }) {
  const isNetworkError = message?.toLowerCase().includes('unreachable') || 
                         message?.toLowerCase().includes('failed to fetch')

  return (
    <div className="flex flex-col items-center justify-center p-8 text-center bg-zinc-900/50 border border-zinc-800 rounded-lg max-w-md mx-auto my-8">
      <AlertCircle className="w-12 h-12 text-red-soft mb-4 opacity-80" />
      <h3 className="text-lg font-semibold text-zinc-100 mb-2">
        {isNetworkError ? 'Connection Error' : 'Something went wrong'}
      </h3>
      <p className="text-sm text-zinc-400 mb-6 max-w-[280px]">
        {message || 'An unexpected error occurred while loading data.'}
      </p>
      {onRetry && (
        <button 
          onClick={onRetry}
          className="btn-secondary flex items-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          Try Again
        </button>
      )}
    </div>
  )
}

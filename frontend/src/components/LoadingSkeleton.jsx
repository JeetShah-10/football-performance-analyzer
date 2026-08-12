export default function LoadingSkeleton({ variant = 'card', count = 1 }) {
  const renderSkeleton = (key) => {
    switch (variant) {
      case 'card':
        return (
          <div key={key} className="card flex flex-col gap-4">
            <div className="flex justify-between items-start">
              <div className="flex flex-col gap-2 w-2/3">
                <div className="skeleton h-6 w-full rounded" />
                <div className="skeleton h-4 w-3/4 rounded" />
              </div>
              <div className="skeleton h-6 w-12 rounded-full" />
            </div>
            <div className="skeleton h-4 w-1/2 rounded mt-2" />
          </div>
        )
      case 'radar':
        return (
          <div key={key} className="flex justify-center items-center w-full h-[400px]">
            <div className="skeleton w-[300px] h-[300px] rounded-full" />
          </div>
        )
      case 'chat':
        return (
          <div key={key} className="flex gap-4 p-4 max-w-[80%] mb-4">
            <div className="skeleton w-8 h-8 rounded-full flex-shrink-0" />
            <div className="flex flex-col gap-2 w-full">
              <div className="skeleton h-4 w-full rounded" />
              <div className="skeleton h-4 w-5/6 rounded" />
              <div className="skeleton h-4 w-4/6 rounded" />
            </div>
          </div>
        )
      default:
        return <div key={key} className="skeleton h-24 w-full rounded" />
    }
  }

  return (
    <>
      {Array.from({ length: count }).map((_, i) => renderSkeleton(i))}
    </>
  )
}

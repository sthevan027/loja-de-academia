export default function ProductsLoading() {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="h-56 rounded-lg bg-gray-200 animate-pulse"></div>
      ))}
    </div>
  )
}

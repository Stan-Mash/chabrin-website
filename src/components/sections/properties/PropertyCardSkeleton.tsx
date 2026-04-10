/**
 * Skeleton loader for property cards while fetching data.
 * Used in PropertiesGrid to provide visual feedback during loading.
 */
export function PropertyCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-card animate-pulse">
      {/* Image skeleton */}
      <div className="h-48 bg-slate-200" />

      <div className="p-5 space-y-4">
        {/* Title */}
        <div className="h-6 bg-slate-200 rounded w-3/4" />

        {/* Zone + Area */}
        <div className="flex items-center gap-2">
          <div className="h-4 bg-slate-100 rounded w-20" />
          <div className="h-4 bg-slate-100 rounded w-24" />
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4 border-t border-slate-100 pt-3">
          <div className="h-4 bg-slate-100 rounded w-16" />
          <div className="h-4 bg-slate-100 rounded w-16" />
          <div className="h-4 bg-slate-100 rounded w-16" />
        </div>

        {/* Price */}
        <div className="space-y-2 mt-4">
          <div className="h-6 bg-slate-200 rounded w-1/2" />
        </div>

        {/* Buttons */}
        <div className="flex gap-2 mt-5">
          <div className="flex-1 h-10 bg-slate-200 rounded-full" />
          <div className="flex-1 h-10 bg-slate-200 rounded-full" />
        </div>
      </div>
    </div>
  );
}

/**
 * Grid of skeleton loaders.
 * Shows 6 placeholders while fetching listings.
 */
export function PropertyGridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <PropertyCardSkeleton key={i} />
      ))}
    </div>
  );
}

import { Suspense } from "react";
import { getPublishedListings, getAvailableZones } from "@/db/queries/listings";
import PropertiesGridClient from "./PropertiesGridClient";
import { PropertyGridSkeleton } from "./PropertyCardSkeleton";

/**
 * Server component that fetches listings data.
 * Wraps client component for interactivity and rendering.
 */
async function PropertiesGridContent() {
  try {
    const [listings, zones] = await Promise.all([
      getPublishedListings(undefined, undefined, 50, 0),
      getAvailableZones(),
    ]);

    return <PropertiesGridClient initialListings={listings} availableZones={zones} />;
  } catch (error) {
    console.error("Error fetching listings:", error);
    return (
      <div className="text-center py-12">
        <p className="text-slate-500">Unable to load properties. Please try again later.</p>
      </div>
    );
  }
}

/**
 * Server-side wrapper with Suspense for streaming.
 */
export default function PropertiesGrid() {
  return (
    <Suspense fallback={<PropertyGridSkeleton />}>
      <PropertiesGridContent />
    </Suspense>
  );
}

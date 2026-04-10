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
          {filtered.length}{" "}
          propert{filtered.length === 1 ? "y" : "ies"}
        </p>

        {/* ── Grid ─────────────────────────────────────────────────────── */}
        {filtered.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((listing) => (
              <PropertyCard key={listing.id} listing={listing} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <span className="text-6xl mb-4 block">🔍</span>
            <h3 className="text-xl font-bold text-brand-navy mb-2">{t("no_results")}</h3>
            <p className="text-slate-500 mb-6">
              {t("coming_soon")}
            </p>
            <button
              onClick={() => { setZone("All Zones"); setType("All Types"); }}
              className="px-6 py-2.5 rounded-full bg-brand-navy text-white text-sm font-semibold
                         hover:bg-brand-navy-dark transition-colors"
            >
              {t("no_results_action")}
            </button>
          </div>
        )}

        {/* ── Coming soon notice ────────────────────────────────────────── */}
        <div className="mt-12 text-center p-6 rounded-2xl bg-brand-navy/5 border border-brand-navy/10">
          <p className="text-slate-600 text-sm">
            🏗️{" "}
            <strong>{t("coming_soon").split(".")[0]}.</strong>{" "}
            <Link href="/en/contact" className="text-brand-cyan font-semibold hover:underline">
              {t("enquire")}
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}

import { ImageResponse } from "@vercel/og";

/**
 * Dynamic Open Graph image generation.
 * Creates branded social media preview images for properties and pages.
 *
 * Usage:
 * - /api/og?title=Property%20Title&zone=Zone%20AB&price=50000
 * - /api/og?title=Blog%20Post&type=blog
 *
 * @see https://vercel.com/docs/og-image-generation/overview
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    
    const title = searchParams.get("title") || "Chabrin Agencies Limited";
    const subtitle = searchParams.get("subtitle") || "Premier Property Management";
    const zone = searchParams.get("zone") || "";
    const price = searchParams.get("price") || "";
    const type = searchParams.get("type") || "property";

    // Brand colors (exact from CLAUDE.md)
    const brandNavy = "#0D1B8E";
    const brandCyan = "#00C9C9";

    // Format price if present
    const formattedPrice =
      price && type === "property"
        ? `KES ${parseInt(price).toLocaleString()}`
        : "";

    return new ImageResponse(
      (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
            height: "100%",
            backgroundColor: brandNavy,
            fontFamily: '"Plus Jakarta Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Background decorative elements */}
          <div
            style={{
              position: "absolute",
              top: "-10%",
              right: "-5%",
              width: "40%",
              height: "40%",
              borderRadius: "50%",
              backgroundColor: brandCyan,
              opacity: 0.15,
              filter: "blur(80px)",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: "-10%",
              left: "-5%",
              width: "35%",
              height: "35%",
              borderRadius: "50%",
              backgroundColor: "rgba(255,255,255,0.1)",
              opacity: 0.2,
              filter: "blur(60px)",
            }}
          />

          {/* Content */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              height: "100%",
              padding: "60px",
              position: "relative",
              zIndex: 1,
            }}
          >
            {/* Header with logo */}
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <div
                style={{
                  width: "60px",
                  height: "60px",
                  backgroundColor: brandCyan,
                  borderRadius: "12px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "32px",
                  fontWeight: "bold",
                  color: brandNavy,
                }}
              >
                CAL
              </div>
              <div style={{ color: "white", fontSize: "18px", fontWeight: "600" }}>
                CHABRIN AGENCIES
              </div>
            </div>

            {/* Main content */}
            <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
              {/* Title */}
              <h1
                style={{
                  fontSize: "56px",
                  fontWeight: "700",
                  color: "white",
                  margin: 0,
                  lineHeight: "1.2",
                  maxWidth: "90%",
                }}
              >
                {title}
              </h1>

              {/* Details row */}
              <div style={{ display: "flex", gap: "24px", alignItems: "center" }}>
                {zone && (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      padding: "8px 16px",
                      backgroundColor: "rgba(0, 201, 201, 0.2)",
                      borderRadius: "8px",
                      border: `1px solid ${brandCyan}`,
                    }}
                  >
                    <span style={{ color: brandCyan, fontSize: "14px", fontWeight: "600" }}>
                      📍 {zone}
                    </span>
                  </div>
                )}
                {formattedPrice && (
                  <div
                    style={{
                      fontSize: "24px",
                      fontWeight: "700",
                      color: brandCyan,
                    }}
                  >
                    {formattedPrice}
                  </div>
                )}
              </div>

              {/* Subtitle */}
              {subtitle && (
                <p
                  style={{
                    fontSize: "20px",
                    color: "rgba(255, 255, 255, 0.7)",
                    margin: 0,
                    maxWidth: "80%",
                  }}
                >
                  {subtitle}
                </p>
              )}
            </div>

            {/* Footer */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                borderTop: "1px solid rgba(255, 255, 255, 0.2)",
                paddingTop: "24px",
              }}
            >
              <span
                style={{
                  fontSize: "16px",
                  color: "rgba(255, 255, 255, 0.6)",
                }}
              >
                chabrinagencies.com
              </span>
              <div
                style={{
                  display: "flex",
                  gap: "12px",
                  fontSize: "28px",
                }}
              >
                📱 🏠 ✨
              </div>
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
        headers: {
          "Content-Type": "image/png",
          "Cache-Control": "public, max-age=86400", // Cache for 24 hours
        },
      }
    );
  } catch (error) {
    console.error("OG image generation error:", error);
    return new Response("Failed to generate image", { status: 500 });
  }
}

export const runtime = "edge";

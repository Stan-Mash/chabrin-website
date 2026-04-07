import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        // Plus Jakarta Sans — approved geometric sans-serif for Chabrin
        // (Century Gothic equivalent; free for commercial web use)
        sans: ["Plus Jakarta Sans", "ui-sans-serif", "system-ui"],
        display: ["Plus Jakarta Sans", "ui-sans-serif", "system-ui"],
        body: ["Plus Jakarta Sans", "ui-sans-serif", "system-ui"],
      },
      colors: {
        brand: {
          navy: "#0D1B8E",   // Primary — deep backgrounds, headings, nav
          cyan: "#00C9C9",   // Accent — CTAs, highlights, "LIMITED" wordmark
          "navy-dark": "#091466",   // Hover state for navy
          "cyan-dark": "#00A8A8",   // Hover state for cyan
          "navy-light": "#1A2FB5",  // Light variant for gradients
          "cyan-light": "#33D4D4",  // Light variant for highlights
        },
        // Neutral palette tuned for property listing cards
        surface: {
          DEFAULT: "#F4F6FF",  // Light lavender-white page background
          card: "#FFFFFF",
          muted: "#EEF0FB",
        },
      },
      spacing: {
        "18": "4.5rem",
        "22": "5.5rem",
        "88": "22rem",
        "128": "32rem",
      },
      borderRadius: {
        "4xl": "2rem",
      },
      boxShadow: {
        card: "0 2px 16px 0 rgba(13, 27, 142, 0.08)",
        "card-hover": "0 8px 32px 0 rgba(13, 27, 142, 0.16)",
        navy: "0 4px 24px 0 rgba(13, 27, 142, 0.24)",
        cyan: "0 4px 24px 0 rgba(0, 201, 201, 0.32)",
      },
      backgroundImage: {
        "hero-gradient": "linear-gradient(135deg, #0D1B8E 0%, #1A2FB5 60%, #00C9C9 100%)",
        "navy-gradient": "linear-gradient(180deg, #0D1B8E 0%, #091466 100%)",
        "cyan-gradient": "linear-gradient(135deg, #00C9C9 0%, #00A8A8 100%)",
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-in-out",
        "slide-up": "slideUp 0.4s ease-out",
        "slide-in-right": "slideInRight 0.4s ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideInRight: {
          "0%": { opacity: "0", transform: "translateX(20px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;

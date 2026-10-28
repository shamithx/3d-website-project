import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./content/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        parchment: {
          50: "#FFFDF7",
          100: "#FBF5E7",
          200: "#F4EAD5",
          300: "#EADCC0",
          400: "#DCC9A4",
        },
        forest: {
          700: "#2A4C38",
          800: "#1E3A2B",
          900: "#152A1F",
        },
        emerald: {
          600: "#1D5A46",
          700: "#164838",
          800: "#10382C",
          900: "#0B2A22",
        },
        gold: {
          300: "#E4C98A",
          400: "#D3AF6A",
          500: "#C0943F",
          600: "#A2762C",
        },
        river: {
          400: "#6FA3AE",
          500: "#4E8A9B",
          600: "#3A6E80",
          700: "#2C5568",
        },
        sunset: {
          400: "#E0A06A",
          500: "#C4693C",
          600: "#A34F2A",
        },
        midnight: {
          700: "#1B2E42",
          800: "#122234",
          900: "#0B1622",
        },
        ink: {
          500: "#5C5647",
          700: "#363226",
          900: "#1B1A16",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "var(--font-sinhala)", "Georgia", "serif"],
        body: ["var(--font-body)", "var(--font-sinhala)", "system-ui", "sans-serif"],
        sinhala: ["var(--font-sinhala)", "Iskoola Pota", "sans-serif"],
      },
      fontSize: {
        "display-xl": ["clamp(3.2rem, 11vw, 9rem)", { lineHeight: "0.95", letterSpacing: "-0.02em" }],
        "display-lg": ["clamp(2.4rem, 6vw, 4.4rem)", { lineHeight: "1.02", letterSpacing: "-0.015em" }],
        "display-md": ["clamp(1.9rem, 4vw, 3rem)", { lineHeight: "1.08", letterSpacing: "-0.01em" }],
        "display-sm": ["clamp(1.5rem, 2.6vw, 2.1rem)", { lineHeight: "1.15" }],
        "eyebrow": ["0.7rem", { lineHeight: "1", letterSpacing: "0.22em" }],
      },
      spacing: {
        gutter: "clamp(1.25rem, 5vw, 5rem)",
        section: "clamp(4.5rem, 10vw, 9rem)",
      },
      maxWidth: {
        page: "84rem",
        reading: "38rem",
        prose: "46rem",
      },
      borderRadius: {
        arch: "50% 50% 6px 6px / 38% 38% 4px 4px",
      },
      boxShadow: {
        lift: "0 24px 60px -30px rgba(21, 42, 31, 0.45)",
        panel: "0 30px 80px -40px rgba(11, 22, 34, 0.6)",
      },
      transitionTimingFunction: {
        "soft-out": "cubic-bezier(0.22, 1, 0.36, 1)",
      },
      keyframes: {
        "drift-down": {
          "0%": { transform: "translateY(-12px)", opacity: "0" },
          "30%": { opacity: "0.9" },
          "100%": { transform: "translateY(14px)", opacity: "0" },
        },
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(18px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "0%": { opacity: "0.35" },
          "50%": { opacity: "0.8" },
          "100%": { opacity: "0.35" },
        },
        "slow-spin": {
          from: { transform: "rotate(0deg)" },
          to: { transform: "rotate(360deg)" },
        },
      },
      animation: {
        "drift-down": "drift-down 2.6s ease-in-out infinite",
        "fade-up": "fade-up 0.9s cubic-bezier(0.22, 1, 0.36, 1) both",
        shimmer: "shimmer 4s ease-in-out infinite",
        "slow-spin": "slow-spin 60s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;

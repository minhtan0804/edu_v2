/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        sans: [
          "Jost",
          "Exo",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "Oxygen",
          "Ubuntu",
          "Cantarell",
          "Fira Sans",
          "Droid Sans",
          "Helvetica Neue",
          "sans-serif",
        ],
        heading: [
          "Exo",
          "Jost",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
      },
      colors: {
        // shadcn/ui semantic colors (mapped to CSS variables)
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          50: "#FFF7ED",
          100: "#FFEDD5",
          200: "#FED7AA",
          300: "#FDBA74",
          400: "#FB923C",
          500: "#FF782D", // Main orange from Figma (Default)
          600: "#FFAB2D", // Hover state
          700: "#F8620E", // Pressed state
          800: "#C2410C",
          900: "#7C2D12",
          DEFAULT: "hsl(var(--primary))", // Uses CSS variable
          foreground: "hsl(var(--primary-foreground))",
          hover: "#FFAB2D", // Hover state (alias)
          pressed: "#F8620E", // Pressed state (alias)
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        // Design System Colors (Figma Palette)
        // Primary Orange Scale
        orange: {
          DEFAULT: "#FF782D", // Primary default
          hover: "#FFAB2D", // Hover state
          pressed: "#F8620E", // Pressed state
        },
        // Neutral Grays
        gray: {
          dark: "#555555", // Dark grey
          DEFAULT: "#9D9D9D", // Grey
          light: "#EAEAEA", // Light grey
          "white-grey": "#F5F5F5", // White grey
        },
        // Status Colors
        info: {
          DEFAULT: "#2580D5", // Blue
        },
        success: {
          DEFAULT: "#55BE24", // Green
        },
        warning: {
          DEFAULT: "#F6B40A", // Orange/Yellow
        },
        danger: {
          DEFAULT: "#E02200", // Red (also #F51A1A in some variants)
        },
        // Input specific colors
        input: {
          border: "#9D9D9D", // Default border color
          borderFocus: "#FF782D", // Focus border color (primary)
          placeholder: "#9D9D9D", // Placeholder text color
          DEFAULT: "hsl(var(--input))", // Legacy compatibility
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

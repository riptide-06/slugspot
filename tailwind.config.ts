import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    container: { center: true, padding: '1rem' },
    extend: {
      boxShadow: {
        card: '0 1px 2px rgba(16,24,40,0.06), 0 1px 3px rgba(16,24,40,0.10)',
      },
      colors: {
        brand: { DEFAULT: '#0B3B76' },
        primary: '#1E40AF',   // UCSC Blue
        secondary: '#FBBF24', // UCSC Gold
      },
    },
  },
  plugins: [],
}

export default config


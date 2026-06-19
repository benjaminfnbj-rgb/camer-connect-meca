import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Brand primaire — Orange motorisation camerounaise
        brand: {
          50:  '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#f97316',  // Primary
          600: '#ea6105',  // Dark
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
          950: '#431407',
        },
        // Accent — Vert Cameroun
        accent: {
          50:  '#f0fdf4',
          100: '#dcfce7',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
        },
        // Noir métal
        steel: {
          50:  '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
          950: '#020617',
        },
        // Forfaits
        bronze: '#CD7F32',
        silver: '#C0C0C0',
        gold: '#FFD700',
      },
      fontFamily: {
        display: ['var(--font-display)', 'system-ui', 'sans-serif'],
        body: ['var(--font-body)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      backgroundImage: {
        'hero-pattern': "url('/images/hero-pattern.svg')",
        'metal-texture': "linear-gradient(135deg, #1e293b 0%, #0f172a 50%, #1e293b 100%)",
        'orange-glow': "radial-gradient(ellipse at center, #f97316 0%, transparent 70%)",
        'brand-gradient': "linear-gradient(135deg, #ea6105 0%, #f97316 50%, #fb923c 100%)",
      },
      boxShadow: {
        'garage-card': '0 4px 24px -4px rgba(249, 115, 22, 0.15)',
        'gold-glow': '0 0 30px rgba(255, 215, 0, 0.3)',
        'orange-glow': '0 0 20px rgba(249, 115, 22, 0.4)',
        'inner-dark': 'inset 0 2px 4px rgba(0,0,0,0.3)',
      },
      animation: {
        'slide-up': 'slideUp 0.5s ease-out',
        'fade-in': 'fadeIn 0.4s ease-out',
        'pulse-orange': 'pulseOrange 2s infinite',
        'spin-slow': 'spin 8s linear infinite',
      },
      keyframes: {
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        pulseOrange: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(249, 115, 22, 0.4)' },
          '50%': { boxShadow: '0 0 0 12px rgba(249, 115, 22, 0)' },
        },
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      },
    },
  },
  plugins: [],
};

export default config;

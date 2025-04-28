/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1E3E6A', // Lightened from #1A365D
          50: '#E6ECF4',      // Lightened from #E2E8F0
          100: '#D0DBE7',     // Lightened from #CBD5E1
          200: '#9AABBE',     // Lightened from #94A3B8
          300: '#6D7F97',     // Lightened from #64748B
          400: '#4E5E75',     // Lightened from #475569
          500: '#394861',     // Lightened from #334155
          600: '#243247',     // Lightened from #1E293B
          700: '#1E3E6A',     // Lightened from #1A365D
          800: '#142236',     // Lightened from #0F172A
          900: '#071123',     // Lightened from #020617
        },
        secondary: {
          DEFAULT: '#339873', // Lightened from #2D8E6A
          50: '#CDEAD9',      // Lightened from #C7E5D6
          100: '#ADF5D4',     // Lightened from #A7F3D0
          200: '#74E9BB',     // Lightened from #6EE7B7
          300: '#3AD59D',     // Lightened from #34D399
          400: '#16BB85',     // Lightened from #10B981
          500: '#0B9C6D',     // Lightened from #059669
          600: '#0A7D5B',     // Lightened from #047857
          700: '#339873',     // Lightened from #2D8E6A
          800: '#0C654A',     // Lightened from #065F46
          900: '#0C543F',     // Lightened from #064E3B
        },
        accent: {
          DEFAULT: '#F2B632', // Lightened from #F0B429
          50: '#FEF5CB',      // Lightened from #FEF3C7
          100: '#FEF5CB',     // Lightened from #FEF3C7
          200: '#FDE88E',     // Lightened from #FDE68A
          300: '#FCD551',     // Lightened from #FCD34D
          400: '#F2B632',     // Lightened from #F0B429
          500: '#DB7A0A',     // Lightened from #D97706
          600: '#B8560D',     // Lightened from #B45309
          700: '#964312',     // Lightened from #92400E
          800: '#7C4013',     // Lightened from #783C0F
          900: '#693A15',     // Lightened from #653611
        },
        neutral: {
          DEFAULT: '#4A5568', // Neutral Gray
          50: '#F7FAFC',      // Very Light Gray
          100: '#EDF2F7',
          200: '#E2E8F0',
          300: '#CBD5E1',
          400: '#94A3B8',
          500: '#718096',     // Slate
          600: '#4A5568',
          700: '#2D3748',     // Charcoal
          800: '#1A202C',
          900: '#171923',
        },
        teal: {
          DEFAULT: '#155E75', // Deep Teal
          50: '#ECFEFF',
          100: '#CFFAFE',
          200: '#A5F3FC',
          300: '#67E8F9',
          400: '#22D3EE',
          500: '#06B6D4',
          600: '#0891B2',
          700: '#155E75',
          800: '#164E63',
          900: '#083344',
        },
      },
      fontFamily: {
        sans: ['Inter var', 'sans-serif'],
      },
      boxShadow: {
        card: '0 2px 4px rgba(0, 0, 0, 0.05), 0 1px 2px rgba(0, 0, 0, 0.1)',
        dropdown: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      },
      borderRadius: {
        'card': '0.5rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'slide-right': 'slideRight 0.4s ease-out',
        'scale': 'scale 0.3s ease-in-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideRight: {
          '0%': { transform: 'translateX(-20px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        scale: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
  safelist: [
    'border-[#4ade80]',
    'border-[#f87171]',
    'border-[#facc15]',
    'text-[#4ade80]',
    'text-[#f87171]',
    'text-[#facc15]',
    'bg-primary-50',
    'bg-primary-100',
    'bg-primary-700',
    'bg-primary-800',
    'text-primary-700',
    'text-primary-800',
    'bg-secondary-50',
    'bg-secondary-100',
    'text-secondary-700',
    'text-secondary-800',
    'bg-accent-50',
    'bg-accent-100', 
    'bg-accent-400',
    'text-accent-400',
    'text-accent-700',
    'bg-neutral-50',
    'bg-neutral-100',
    'bg-neutral-500',
    'text-neutral-600',
    'text-neutral-700',
    'bg-teal-700',
    'text-teal-700',
    'animate-fade-in',
    'animate-slide-up',
    'animate-slide-right',
    'animate-scale',
    'animate-pulse-slow',
  ]
};
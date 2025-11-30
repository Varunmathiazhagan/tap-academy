/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      // Modern font family stack
      fontFamily: {
        'sans': ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
        'display': ['Poppins', 'Inter', 'system-ui', 'sans-serif'],
        'body': ['DM Sans', 'Inter', 'system-ui', 'sans-serif'],
        'soft': ['Nunito', 'Inter', 'system-ui', 'sans-serif'],
      },
      
      // Enhanced color palette for modern UI
      colors: {
        'primary': {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        'success': {
          50: '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
        },
        // Glassmorphism color palette
        'glass': {
          50: 'rgba(255, 255, 255, 0.05)',
          100: 'rgba(255, 255, 255, 0.08)',
          150: 'rgba(255, 255, 255, 0.10)',
          200: 'rgba(255, 255, 255, 0.12)',
          250: 'rgba(255, 255, 255, 0.15)',
          300: 'rgba(255, 255, 255, 0.18)',
          400: 'rgba(255, 255, 255, 0.20)',
          500: 'rgba(255, 255, 255, 0.25)',
        },
        'glass-dark': {
          50: 'rgba(0, 0, 0, 0.05)',
          100: 'rgba(0, 0, 0, 0.08)',
          200: 'rgba(0, 0, 0, 0.12)',
          300: 'rgba(0, 0, 0, 0.15)',
          400: 'rgba(0, 0, 0, 0.18)',
          500: 'rgba(0, 0, 0, 0.25)',
        },
        'neon': {
          'blue': '#00d2ff',
          'purple': '#8b5cf6',
          'pink': '#f093fb',
          'cyan': '#06ffa5',
          'orange': '#ff6b35',
        }
      },
      
      // Enhanced animations and transitions
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'fade-in-up': 'fadeInUp 0.6s ease-out forwards',
        'slide-in-right': 'slideInRight 0.4s ease-out forwards',
        'slide-in-left': 'slideInLeft 0.4s ease-out forwards',
        'scale-in': 'scaleIn 0.3s ease-out forwards',
        'bounce-subtle': 'bounceSubtle 0.6s ease-out',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'shimmer': 'shimmer 2s linear infinite',
        'ripple': 'ripple 0.6s ease-out',
        'confetti': 'confetti 3s ease-out forwards',
        'skeleton': 'skeleton 1.2s ease-in-out infinite',
      },
      
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(30px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideInLeft: {
          '0%': { opacity: '0', transform: 'translateX(-30px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        bounceSubtle: {
          '0%, 20%, 53%, 80%, 100%': { transform: 'translateY(0px)' },
          '40%, 43%': { transform: 'translateY(-10px)' },
          '70%': { transform: 'translateY(-5px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 20px rgba(59, 130, 246, 0.5)' },
          '100%': { boxShadow: '0 0 40px rgba(59, 130, 246, 0.8)' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        ripple: {
          '0%': { transform: 'scale(0)', opacity: '0.6' },
          '100%': { transform: 'scale(4)', opacity: '0' },
        },
        confetti: {
          '0%': { transform: 'translateY(0) rotate(0deg)', opacity: '1' },
          '100%': { transform: 'translateY(-100vh) rotate(720deg)', opacity: '0' },
        },
        skeleton: {
          '0%': { backgroundPosition: '-200px 0' },
          '100%': { backgroundPosition: 'calc(200px + 100%) 0' },
        },
      },
      
      // Enhanced shadows for depth
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
        'glass-hover': '0 12px 48px 0 rgba(31, 38, 135, 0.5)',
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'card-hover': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        'soft': '0 2px 15px 0 rgba(0, 0, 0, 0.08)',
        'glow-sm': '0 0 10px rgba(59, 130, 246, 0.3)',
        'glow': '0 0 20px rgba(59, 130, 246, 0.4)',
        'glow-lg': '0 0 40px rgba(59, 130, 246, 0.5)',
      },
      
      // Enhanced backdrop blur for glassmorphism
      backdropBlur: {
        'xs': '2px',
        'sm': '4px',
        'base': '8px',
        'md': '12px',
        'lg': '16px',
        'xl': '20px',
        '2xl': '25px',
        '3xl': '30px',
      },
    },
  },
  plugins: [],
}


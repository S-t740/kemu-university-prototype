/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        kemu: {
          purple: '#871054',
          gold: '#a0672e',
          blue: '#2e3192',
          purple10: '#f3e7ee',
          purple30: '#dbb7cb',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Merriweather', 'serif'],
      },
      boxShadow: {
        'soft-3d': '0 8px 20px rgba(0,0,0,0.15)',
        'deep-3d': '0 12px 28px rgba(0,0,0,0.22)',
        'glow-gold': '0 0 10px rgba(160,103,46,0.8)',
        'glow-purple': '0 0 10px rgba(135,16,84,0.8)',
      },
      borderRadius: {
        'card-radius': '1.2rem',
        'xl': '1.5rem',
      },
      keyframes: {
        'fade-up': {
          '0%': {
            opacity: '0',
            transform: 'translateY(20px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
        'fade-in': {
          '0%': {
            opacity: '0',
          },
          '100%': {
            opacity: '1',
          },
        },
        'slide-left': {
          '0%': {
            opacity: '0',
            transform: 'translateX(20px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateX(0)',
          },
        },
        'slide-right': {
          '0%': {
            opacity: '0',
            transform: 'translateX(-20px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateX(0)',
          },
        },
        'subtle-bounce': {
          '0%, 100%': {
            transform: 'translateY(0)',
          },
          '50%': {
            transform: 'translateY(-5px)',
          },
        },
        'soft-pulse': {
          '0%, 100%': {
            opacity: '0.6',
          },
          '50%': {
            opacity: '0.9',
          },
        },
        'floating': {
          '0%, 100%': {
            transform: 'translateY(0px)',
          },
          '50%': {
            transform: 'translateY(-10px)',
          },
        },
        'sweep': {
          '0%': {
            transform: 'translateX(-100%)',
          },
          '100%': {
            transform: 'translateX(100%)',
          },
        },
        'slide-up-fade': {
          '0%': {
            opacity: '0',
            transform: 'translateY(30px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
        'pulse-glow': {
          '0%, 100%': {
            boxShadow: '0 0 20px rgba(160, 103, 46, 0.3)',
          },
          '50%': {
            boxShadow: '0 0 30px rgba(160, 103, 46, 0.6)',
          },
        },
        'slide-up': {
          '0%': {
            transform: 'translateY(100%)',
            opacity: '0',
          },
          '100%': {
            transform: 'translateY(0)',
            opacity: '1',
          },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.6s ease-out',
        'fade-in': 'fade-in 0.5s ease-out',
        'fadeIn': 'fade-in 0.5s ease-out',
        'slide-left': 'slide-left 0.5s ease-out',
        'slide-right': 'slide-right 0.5s ease-out',
        'slideUp': 'slide-up 0.3s ease-out',
        'subtle-bounce': 'subtle-bounce 2s ease-in-out infinite',
        'soft-pulse': 'soft-pulse 2s ease-in-out infinite',
        'floating': 'floating 3s ease-in-out infinite',
        'sweep': 'sweep 15s ease-in-out infinite',
        'slide-up-fade': 'slide-up-fade 0.6s ease-out',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}


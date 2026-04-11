module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#3b82f6', // Bleu principal
        secondary: '#a855f7', // Violet
        accent: '#10b981', // Vert success
        danger: '#ef4444', // Rouge
      },
      keyframes: {
        nudge: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-5px)' },
        },
      },
      animation: {
        nudge: 'nudge 1.3s ease-in-out infinite',
      },   
    },
  },
  plugins: [],
};
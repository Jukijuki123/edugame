/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        game: {
          yellow: '#FACC15',
          sky: '#38BDF8',
          grass: '#4ADE80',
          coral: '#FB7185',
          purple: '#A855F7',
          orange: '#FB923C',
          cream: '#FEFCE8',
          dark: '#1E293B',
          softCard: '#FFFFFF',
        }
      },
      fontFamily: {
        fredoka: ['Fredoka', 'Quicksand', 'Nunito', 'sans-serif'],
      },
      boxShadow: {
        'bubbly': '0 8px 0 rgba(0,0,0,0.12), 0 15px 25px rgba(0,0,0,0.08)',
        'bubbly-active': '0 2px 0 rgba(0,0,0,0.12), 0 5px 10px rgba(0,0,0,0.08)',
        'card-kid': '0 6px 0 #E2E8F0, 0 12px 20px -3px rgba(0, 0, 0, 0.08)',
        'btn-yellow': '0 6px 0 #CA8A04',
        'btn-sky': '0 6px 0 #0284C7',
        'btn-grass': '0 6px 0 #16A34A',
        'btn-coral': '0 6px 0 #E11D48',
        'btn-purple': '0 6px 0 #7E22CE',
      }
    },
  },
  plugins: [],
}

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Warm travel-journal palette
        cream: '#FBF3E4',
        parchment: '#F3E7CE',
        ink: '#3A2E25',
        cocoa: '#6B4E3D',
        sunset: '#E8743B',
        sky: '#5B8DB8',
        sage: '#7A9471',
        gold: '#D9A441',
      },
      fontFamily: {
        display: ['"Georgia"', 'serif'],
        body: ['"Inter"', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

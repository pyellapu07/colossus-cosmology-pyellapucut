const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  content: [
    './templates/*.{html,js}'
  ],
  theme: {
    extend: {
      fontFamily: {
        'sans': ['Inter', ...defaultTheme.fontFamily.sans],
      },
    },
  },
}
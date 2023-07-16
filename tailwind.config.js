/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}", //-- App Directory
    "./src/pages/**/*.{js,ts,jsx,tsx}", //-- Pages Directory
    "./src/components/**/*.{js,ts,jsx,tsx}",
    './src/content/**/*.mdx',
    // "./layouts/**/*.{js,ts,jsx,tsx}",
    // "./lib/**/*.{js,ts,jsx,tsx}",
    "./src/public/**}",
    "./src/public/**.xml}",

  ],
  theme: {
    extend: {
      backgroundImage: {
        'placeholder': "url('/src/assets/images/placeholder.svg')",
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'grid': "url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoBAMAAAB+0KVeAAAAHlBMVEUAAABkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGSH0mEbAAAACnRSTlMAzDPDPPPYnGMw2CgMzQAAAChJREFUKM9jgAPOAgZMwGIwKkhXQSUY0BCCMxkEYUAsEM4cjI4fwYIAf2QMNbUsZjcAAAAASUVORK5CYII=')",
        // 'grid-url'           : "url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoBAMAAAB+0KVeAAAAHlBMVEUAAABkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGSH0mEbAAAACnRSTlMAzDPDPPPYnGMw2CgMzQAAAChJREFUKM9jgAPOAgZMwGIwKkhXQSUY0BCCMxkEYUAsEM4cjI4fwYIAf2QMNbUsZjcAAAAASUVORK5CYII=')",
        // 'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
      colors: {
        "success": 'var(--success)',
        "error": 'var(--error)',
        "danger": 'var(--danger)',
        "warning": 'var(--warning)',
        "info": 'var(--info)',

        'primary': "var(--color-primary)",
        // 'secondary' : "bg-blue-700/10",
        'secondary': "var(--color-secondary)",
        'tertiary': "var(--color-tertiary)",
        'quaternary': "var(--color-quaternary)",
        'quinary': "var(--color-quinary)",

        '100': "var(--color-primary)",
        '200': "var(--color-secondary)",
        '300': "var(--color-tertiary)",
        '400': "var(--color-quaternary)",
        '500': "var(--color-quinary)"
      },
      textColor: {
        'primary': "var(--text-color-primary)",
        'secondary': "var(--text-color-secondary)",
        'tertiary': "var(--text-color-tertiary)",
        'quaternary': "var(--text-color-quaternary)",
        'quinary': "var(--text-color-quinary)",

        "text-success": 'var(--success)',
        "text-error": 'var(--error)',
        "text-danger": 'var(--danger)',
        "text-warning": 'var(--warning)',
        "text-info": 'var(--info)',

      },
      fontFamily: {
        sans: ['var(--font-sans)', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', '"Helvetica Neue"', 'Arial', '"Noto Sans"', 'sans-serif', '"Apple Color Emoji"', '"Segoe UI Emoji"', '"Segoe UI Symbol"', '"Noto Color Emoji"'],
        serif: ['var(--font-serif)', 'Georgia', 'Cambria', '"Times New Roman"', 'Times', 'serif'],
      },
      typography: {
        quoteless: {
          css: {
            'blockquote p:first-of-type::before': { content: 'none' },
            'blockquote p:first-of-type::after': { content: 'none' },
          },
        },
      },
      hljs: {
        theme: 'night-owl',
      },
      border: {
        primary: 'border-solid border-b-1 border-l-[0] border-r-[0] border-t-1 border-slate-700 dark:border-slate-700',
      }
    }
  },
  future: {
    hoverOnlyWhenSupported: true,
  },
  safelist: [{}],
  plugins: [require('@tailwindcss/typography')],
}
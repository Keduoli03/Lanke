import colors from 'tailwindcss/colors';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Corrected: Color names should be simple, without prefixes.
        // Tailwind will automatically generate `bg-page`, `text-page`, etc.
        'page': 'rgb(var(--color-bg-page) / <alpha-value>)',
        'content-pane': 'rgb(var(--color-bg-content-pane) / <alpha-value>)',
        'sidebar': 'rgb(var(--color-bg-sidebar) / <alpha-value>)',
        'tag': 'rgb(var(--color-bg-tag) / <alpha-value>)',
        'sidebar-icon': 'rgb(var(--color-bg-sidebar-icon) / <alpha-value>)',
        'primary': 'rgb(var(--color-text-primary) / <alpha-value>)',
        'secondary': 'rgb(var(--color-text-secondary) / <alpha-value>)',
        'border': 'rgb(var(--color-border-color) / <alpha-value>)',
        'theme': 'rgb(var(--color-theme) / <alpha-value>)',
        'theme-secondary': 'rgb(var(--color-theme-secondary) / <alpha-value>)',
        'teal': colors.teal,
        'orange': colors.orange,
      },
      typography(theme) {
        return {
          DEFAULT: {
            css: {
              'code::before': {
                content: '""'
              },
              'code::after': {
                content: '""'
              }
            }
          }
        }
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
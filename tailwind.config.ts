import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#007AFF',
        secondary: '#5AC8FA',
        success: '#4CD964',
        warning: '#FF9500',
        danger: '#FF3B30',
      },
      spacing: {
        'safe': 'max(env(safe-area-inset-top), 1rem)',
      },
    },
  },
  plugins: [],
}
export default config

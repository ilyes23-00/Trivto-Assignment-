/**
 * PostCSS configuration for Tailwind CSS processing.
 * This file exists so Next.js can transform global styles and component classes at build time.
 * It interacts with src/app/globals.css and the Tailwind dependency declared in package.json.
 */
const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};

export default config;

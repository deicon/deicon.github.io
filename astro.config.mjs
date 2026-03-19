import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://www.deicon.de',
  i18n: {
    locales: ['de', 'en'],
    defaultLocale: 'de',
  },
  integrations: [sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
});

// @ts-check
import { defineConfig } from 'astro/config';

import node from '@astrojs/node';

// https://astro.build/config
export default defineConfig({
  site: 'https://ramstric.github.io',
  base: 'switch-management-app',
  output: 'server',
  adapter: node({
    mode: 'standalone'
  })
})
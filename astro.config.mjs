// @ts-check
import { defineConfig, envField } from 'astro/config';

import node from '@astrojs/node';

// https://astro.build/config
export default defineConfig({
  site: 'https://ramstric.github.io',
  base: 'switch-management-app',
  output: 'server',

  adapter: node({
    mode: 'standalone'
  }),

    env: {
      schema: {
        DATABASE_NAME: envField.string({
          context: "client",
          access: "public",
        }),

        TABLE_NAME: envField.string({
          context: "client",
          access: "public",
        }),

        TELNET_HOST: envField.string({
          context: "client",
          access: "public",
        }),

        TELNET_PORT: envField.string({
          context: "client",
          access: "public",
        })

      },
    },
  
})
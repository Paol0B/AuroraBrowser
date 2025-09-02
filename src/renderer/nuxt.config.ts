export default defineNuxtConfig({
  // Disable server-side rendering for electron
  ssr: false,
  
  // Generate static files for production
  nitro: {
    preset: 'static'
  },

  // UI framework
  modules: [
    '@nuxt/ui'
  ],

  // Security headers
  runtimeConfig: {
    public: {
      aurora: {
        version: '0.1.0'
      }
    }
  },

  // App configuration
  app: {
    head: {
      title: 'Aurora Browser',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { 
          'http-equiv': 'Content-Security-Policy', 
          content: "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';" 
        }
      ]
    }
  },

  // Disable telemetry
  telemetry: false,

  // Development configuration
  devtools: { enabled: true },

  // CSS configuration
  css: ['~/assets/css/main.css']
})
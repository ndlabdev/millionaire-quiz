// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    modules: ['@nuxt/eslint', '@nuxt/image', '@nuxt/ui'],

    ssr: false,
    devtools: { enabled: true },

    runtimeConfig: {
        public: {
            siteUrl: process.env.NUXT_PUBLIC_SITE_URL || 'http://localhost:5173'
        }
    },

    compatibilityDate: '2025-07-15',

    eslint: {
        config: {
            stylistic: true
        }
    }
})

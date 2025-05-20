// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  runtimeConfig: {
    // Private variables (server-side only)
    JWT_SECRET: process.env.JWT_SECRET || 'default-secret', // Fallback for safety
    // Public variables (accessible on client-side)
    public: {
      // Avoid exposing JWT_SECRET here
      BLOG_NAME: process.env.BLOG_NAME || 'HIT-TECH-BLOG',
      HERO_TITLE: process.env.HERO_TITLE || 'Welcome to Hit Tech Blog!',
      HERO_CONTENT: process.env.HERO_CONTENT || 'TOTALLY FREE DEPLOYED INDEPENDENT BLOG CMS SYSTEM BASED ON CLOUDFLARE PAGES AND D1 DATABASE.',
      LINK1LABEL: process.env.LINK1LABEL,
      LINK2LABEL: process.env.LINK2LABEL,
      LINK3LABEL: process.env.LINK3LABEL,
      LINK4LABEL: process.env.LINK4LABEL,
      LINK5LABEL: process.env.LINK5LABEL,
      LINK1URL: process.env.LINK1URL,
      LINK2URL: process.env.LINK2URL,
      LINK3URL: process.env.LINK3URL,
      LINK4URL: process.env.LINK4URL,
      LINK5URL: process.env.LINK5URL

    }
  },
  app: {
    head: {
      title: 'HitTechBlog',
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }
      ]
    }
  },

  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  css: ['~/assets/css/main.css','highlight.js/styles/github.css'],
  vite: {
    plugins: [
      tailwindcss(),
    ],
  },
  nitro: {
    preset: "cloudflare-pages",

    cloudflare: {
      deployConfig: true,
      nodeCompat: true
    }
  },

  modules: ["nitro-cloudflare-dev", 'nuxt-tiptap-editor'],
 
})
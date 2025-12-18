// https://nuxt.com/docs/api/configuration/nuxt-config

export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  css: ["~/assets/scss/main.scss"],
  runtimeConfig: {
    apiBase: process.env.API_URL,
    baseUrl: process.env.BASE_URL,
  },
  modules: [
    "@nuxt/eslint",
    "@nuxt/content",
    "@nuxt/fonts",
    "@nuxt/icon",
    "@nuxt/image",
    "@nuxt/scripts",
    "@nuxtjs/i18n",
    "nuxt-auth-utils",
  ],
  i18n: {
    strategy: "prefix_except_default",
    locales: [
      { code: "en", iso: "en-US", name: "English", file: "en.json" },
      { code: "ar", iso: "ar-AR", name: "Arabic", file: "ar.json" },
    ],
    defaultLocale: "ar",
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: "i18n_redirected",
      redirectOn: "root",
      alwaysRedirect: false,
    },
  },
  vite: {
    build: {
      cssMinify: true, //Minify CSS output
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@use "sass:color";`,
        },
      },
    },
  },
  app: {
    head: {
      script: [{ src: "/assets/bootstrap.bundle.min.js", defer: true }],
      link: [
        // {
        //   rel: "preload",
        //   as: "font",
        //   type: "font/woff2",
        //   href: "/assets/fonts/static/Quicksand-Regular.woff2",
        //   crossorigin: "anonymous",
        // },
        // {
        //   rel: "preload",
        //   as: "font",
        //   type: "font/woff2",
        //   href: "/assets/fonts/static/Quicksand-Bold.woff2",
        //   crossorigin: "anonymous",
        // },
        // {
        //   rel: "preload",
        //   as: "font",
        //   type: "font/woff2",
        //   href: "/assets/fonts/static/Quicksand-Medium.woff2",
        //   crossorigin: "anonymous",
        // },
        // {
        //   rel: "preload",
        //   as: "font",
        //   type: "font/woff2",
        //   href: "/assets/fonts/static/Quicksand-SemiBold.woff2",
        //   crossorigin: "anonymous",
        // },
        // {
        //   rel: "preload",
        //   as: "font",
        //   type: "font/woff2",
        //   href: "/assets/fonts/Tajawal/Tajawal-Regular.woff2",
        //   crossorigin: "anonymous",
        // },
        // {
        //   rel: "preload",
        //   as: "font",
        //   type: "font/woff2",
        //   href: "/assets/fonts/Tajawal/Tajawal-Bold.woff2",
        //   crossorigin: "anonymous",
        // },
        // {
        //   rel: "preload",
        //   as: "font",
        //   type: "font/woff2",
        //   href: "/assets/fonts/Tajawal/Tajawal-Medium.woff2",
        //   crossorigin: "anonymous",
        // },
        // Modern scalable icon
        {
          rel: "icon",
          type: "image/png",
          href: "/assets/favicons/favicon-16x16.png",
        },
        // Classic fallbacks
        {
          rel: "icon",
          type: "image/x-icon",
          href: "/assets/favicons/favicon-32x32.png",
        },
        {
          rel: "icon",
          type: "image/png",
          sizes: "32x32",
          href: "/assets/favicons/favicon-32x32.png",
        },
        {
          rel: "icon",
          type: "image/png",
          sizes: "16x16",
          href: "/assets/favicons/favicon-16x16.png",
        },
        // PWA / mobile
        {
          rel: "apple-touch-icon",
          sizes: "180x180",
          href: "/assets/favicons/apple-icon-180x180.png",
        },
        // { rel: "manifest", href: "/assets/favicons/site.webmanifest" },
      ],
    },
  },
});

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-04-03",

  devtools: {
    enabled: true,
  },

  typescript: {
    typeCheck: false,
  },

  nitro: {
    experimental: {
      openAPI: true,
    },
  },

  runtimeConfig: {
    accessTokenLife: 0,
    accessTokenSecret: "",
  },

  modules: ["@nuxt/eslint", "nuxt-zod-i18n", "@nuxtjs/i18n"],

  i18n: {
    strategy: "prefix",
    langDir: "locales",
    locales: [
      {
        name: "Français",
        code: "fr",
        iso: "fr-FR",
        file: "fr.json",
      },
    ],
    defaultLocale: "fr",
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: "i18n_redirected",
      alwaysRedirect: true,
      fallbackLocale: "fr",
      redirectOn: "root",
    },
    experimental: {
      localeDetector: "./localeDetector.ts",
    },
  },

  zodI18n: {
    /**
     * Since we choose to use "en" and "fr" as locales' code,
     * we have to tell zod errors to use those codes.
     */
    localeCodesMapping: {
      "en-GB": "en",
      "fr-FR": "fr",
    },
    useModuleLocale: true,
  },
});

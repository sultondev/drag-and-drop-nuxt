// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },
  modules: ["@nuxt/eslint", "@nuxt/fonts", "@nuxt/icon", "@pinia/nuxt"],
  srcDir: "./src",
  css: ["assets/main.css"],
  typescript: {
    strict: true,
  },
  vite: {
    resolve: {
      extensions: [".js", ".ts", ".json"],
    },
  },
  fonts: {
    families: [
      {
        name: "Manrope",
        provider: "google",
      },
    ],
  },
});

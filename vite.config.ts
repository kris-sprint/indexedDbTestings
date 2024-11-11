import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";
import { manifest } from "./src/config/manifest";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      // devOptions: { enabled: true }, // - to run service worker in dev
      strategies: "injectManifest",
      srcDir: "src",
      filename: "sw.ts",
      manifest: manifest,
    }),
  ],
});

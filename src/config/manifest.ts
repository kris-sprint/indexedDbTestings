import { ManifestOptions } from "vite-plugin-pwa";

export const manifest: Partial<ManifestOptions> = {
  name: "My PWA App",
  short_name: "PWA",
  description: "A Progressive Web App using Vite and React",
  theme_color: "#ffffff",
  background_color: "#ffffff",
  display: "standalone",
  scope: "/",
  start_url: "/",
  icons: [
    {
      src: "icons/icon-192.png",
      sizes: "192x192",
      type: "image/png",
    },
    {
      src: "icons/icon-512.png",
      sizes: "512x512",
      type: "image/png",
    },
  ],
};

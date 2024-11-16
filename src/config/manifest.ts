import { ManifestOptions } from "vite-plugin-pwa";

export const manifest: Partial<ManifestOptions> = {
  name: "FAST DEMO",
  short_name: "FAST",
  description: "An app to aid frontline comms.",
  theme_color: "#f60",
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

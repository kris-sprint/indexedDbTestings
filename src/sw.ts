/// <reference lib="webworker" />
import { precacheAndRoute } from "workbox-precaching";

import { registerRoute } from "workbox-routing";
import { CacheFirst } from "workbox-strategies";
import { ExpirationPlugin } from "workbox-expiration";

declare let self: ServiceWorkerGlobalScope;
precacheAndRoute(self.__WB_MANIFEST);

registerRoute(
  ({ request }) =>
    request.destination === "style" || // CSS
    request.destination === "script" || // JavaScript
    request.destination === "document" || // HTML
    (request.destination === "image" && /\.(?:png|jpg|jpeg|svg|gif)$/.test(request.url)), // Images

  // CacheFirst strategy for fast loading
  new CacheFirst({
    cacheName: "assets-cache",
    plugins: [
      new ExpirationPlugin({
        maxEntries: 100, // Cache up to 100 files
        maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
      }),
    ],
  })
);

self.addEventListener("install", (event: any) => {
  console.log("Service Worker installing.", event);
});

self.addEventListener("activate", (event: any) => {
  console.log("Service Worker activating.", event);
});

self.addEventListener("fetch", (event: any) => {
  console.log("Fetching:", event.request.url);
});


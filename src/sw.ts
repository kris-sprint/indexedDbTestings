/// <reference lib="webworker" />
import { precacheAndRoute } from "workbox-precaching";

import { registerRoute } from "workbox-routing";
import { CacheFirst } from "workbox-strategies";
import { ExpirationPlugin } from "workbox-expiration";
import { setCatchHandler } from "workbox-routing";

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

// Fallback to the offline page for document requests when offline
setCatchHandler(async ({ request }) => {
  if (request.destination === "document") {
    // Attempt to find the offline page in cache
    const cache = await caches.open("assets-cache");
    const cachedResponse = await cache.match("/offline.html");

    return cachedResponse || Response.error(); // Return cached offline.html or an error
  }
  return Response.error(); // Return an error response for other requests
});

self.addEventListener("install", (event: any) => {
  console.log("Service Worker installing.", event);
});

self.addEventListener("activate", (event: any) => {
  console.log("Service Worker activating.", event);
});

self.addEventListener("fetch", (event: any) => {
  console.log("Fetching:", event.request.url);
});

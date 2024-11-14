/// <reference lib="webworker" />
import { precacheAndRoute } from "workbox-precaching";

import { registerRoute } from "workbox-routing";
import { CacheFirst } from "workbox-strategies";
import { ExpirationPlugin } from "workbox-expiration";

import { FlightDBOperations } from "./database/flightsDb";
// import { cacheFlights } from "./database/flightsDb";

declare let self: ServiceWorkerGlobalScope;

self.addEventListener("fetch", (event) => {
  console.log("fetch listener ran:", event.request.url);

  // Check if this is an API request
  if (event.request.url.includes("/get-data")) {
    console.log("Intercepting flight data request");
    // console.log("event.request", event.request);
    event.respondWith(FlightDBOperations.handleFlightDataFetch(event.request));
    // event.respondWith(FlightDBOperations.handleFlightDataFetch(event.request));
    // return; // Early return after handling flight data
  }
});

precacheAndRoute(self.__WB_MANIFEST);

const VERSION = "8";
console.log('VERSION', VERSION)

registerRoute(
  ({ request }) =>
    request.destination === "style" ||
    request.destination === "script" ||
    request.destination === "document" ||
    (request.destination === "image" && /\.(?:png|jpg|jpeg|svg|gif)$/.test(request.url)),

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
  console.log("version", VERSION);

  console.log("Service Worker activating.", event);
});

self.addEventListener("push", function (event) {
  const data = event.data ? event.data.json() : {};

  const options = {
    body: data.body || "You have a new notification",
    icon: data.icon || "/icon.png",
    badge: data.badge || "/badge.png",
    data: {
      url: data.url || "/",
    },
  };

  event.waitUntil(self.registration.showNotification(data.title || "Notification Title", options));
});

// self.addEventListener('notificationclick', function (event) {
//   event.notification.close();
//   event.waitUntil(
//     clients.openWindow(event.notification.data.url)
//   );
// });

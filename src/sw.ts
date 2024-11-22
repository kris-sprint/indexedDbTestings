/// <reference lib="webworker" />

import { precacheAndRoute } from "workbox-precaching";

import { registerRoute } from "workbox-routing";
import { CacheFirst } from "workbox-strategies";
import { ExpirationPlugin } from "workbox-expiration";

import { FlightDBOperations } from "./database/flightsDb";
// import { cacheFlights } from "./database/flightsDb";

import { initializeApp } from '@firebase/app';
// importScripts('https://www.gstatic.com/firebasejs/9.6.8/firebase-messaging-compat.js');
import { getMessaging, onBackgroundMessage } from '@firebase/messaging/sw';


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

const VERSION = "10";

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

  // event.waitUntil(self.registration.showNotification(data.title || "Notification Title", options));
});

// self.addEventListener('notificationclick', function (event) {
//   event.notification.close();
//   event.waitUntil(
//     clients.openWindow(event.notification.data.url)
//   );
// });

const firebaseConfig = {
  apiKey: "AIzaSyAqkmdTEdSblfmpf236_RKibuks-3zGRBI",
  authDomain: "pinpoint-fdef8.firebaseapp.com",
  projectId: "pinpoint-fdef8",
  storageBucket: "pinpoint-fdef8.firebasestorage.app",
  messagingSenderId: "855562263974",
  appId: "1:855562263974:web:faa12bd356b8b9e3b9c367",
};

//Initialize Firebase and get the messaging module
const firebaseApp = initializeApp(firebaseConfig);
const messaging = getMessaging(firebaseApp);

// //Handle Background Firebase Messages that come in while the app is closed
onBackgroundMessage(messaging, (payload: any) => {
  console.log("Received background message ", payload);
});

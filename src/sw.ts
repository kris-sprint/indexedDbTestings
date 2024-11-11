/// <reference lib="webworker" />
import { precacheAndRoute } from "workbox-precaching";

declare let self: ServiceWorkerGlobalScope;
precacheAndRoute(self.__WB_MANIFEST);

self.addEventListener("install", (event: any) => {
  console.log("Service Worker installing.", event);
});

self.addEventListener("activate", (event: any) => {
  console.log("Service Worker activating.", event);
});

self.addEventListener("fetch", (event: any) => {
  console.log("Fetching:", event.request.url);
});

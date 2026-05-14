const CACHE_NAME = "prisma13-mobile-v21";
const APP_ASSETS = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./mobile-shell.css",
  "./mobile-shell.js",
  "./prisma13-icon.svg",
  "./assets/sol-1985.jpg",
  "./assets/esbelteza-imc22.jpg",
  "./tela02/index.html",
  "./tela03/index.html",
  "./tela04/index.html",
  "./tela05/index.html",
  "./tela06/index.html",
  "./tela06/frasesSemana01.js",
  "./tela06/frasesSemana02.js",
  "./tela06/frasesSemana03.js",
  "./tela06/frasesSemana04.js",
  "./tela06/frasesSemana05.js",
  "./tela06/frasesSemana06.js",
  "./tela06/frasesSemana07.js",
  "./tela06/frasesSemana08.js",
  "./tela06/frasesSemana09.js",
  "./tela06/frasesSemana10.js",
  "./tela06/frasesSemana11.js",
  "./tela06/frasesSemana12.js",
  "./tela06/frasesSemana13.js",
  "./tela07/index.html",
  "./tela08/index.html",
  "./tela09/index.html",
  "./tela10/index.html",
  "./tela11/index.html",
  "./tela12/index.html",
  "./tela13/index.html",
  "./tela14/index.html",
  "./tela15/index.html",
  "./tela16/index.html",
  "./tela17/index.html",
  "./tela18/index.html",
  "./tela19/index.html",
  "./tela20/index.html"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(APP_ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  const url = new URL(request.url);

  if(request.method !== "GET" || url.origin !== self.location.origin){
    return;
  }

  event.respondWith(
    caches.match(request)
      .then((cached) => {
        if(cached) return cached;

        return fetch(request)
          .then((response) => {
            if(!response || response.status !== 200) return response;
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
            return response;
          })
          .catch(() => {
            if(request.mode === "navigate"){
              return caches.match("./index.html").then((response) => response || Response.error());
            }
            return Response.error();
          });
      })
  );
});

const CACHE_NAME="ma-caisse-v2";
const APP_FILES=["./","./index.html","./manifest.webmanifest","./icon-192.png","./icon-512.png","./icon-512-maskable.png"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(CACHE_NAME).then(c=>c.addAll(APP_FILES)));self.skipWaiting();});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE_NAME).map(k=>caches.delete(k)))));self.clients.claim();});
self.addEventListener("fetch",e=>{
 const r=e.request;
 if(r.method!=="GET"||new URL(r.url).origin!==self.location.origin)return;
 e.respondWith(caches.match(r).then(cached=>cached||fetch(r).then(response=>{
   if(response&&response.ok){const copy=response.clone();caches.open(CACHE_NAME).then(c=>c.put(r,copy));}
   return response;
 }).catch(()=>{if(r.mode==="navigate")return caches.match("./index.html");throw new Error("Hors connexion");})));
});

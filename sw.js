/* Specter Angler BH — offline support */
const VER = "sab-v1.4";
const SHELL = ["./", "./index.html", "./manifest.webmanifest", "./icons/icon-192.png", "./icons/icon-512.png", "./icons/apple-touch-icon.png"];
self.addEventListener("install", e => {
  e.waitUntil(caches.open(VER).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== VER).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  // Live data: always network (never serve stale sea conditions)
  if (/open-meteo\.com|overpass-api\.de/.test(url.hostname)) return;
  // App page: network first, fall back to cache when offline
  if (req.mode === "navigate" || url.pathname.endsWith("/index.html")) {
    e.respondWith(fetch(req).then(r => { const c = r.clone(); caches.open(VER).then(x => x.put("./index.html", c)); return r; })
      .catch(() => caches.match("./index.html")));
    return;
  }
  // Libraries, fonts, fish photos, map tiles: cache first, then network
  if (/cdnjs\.cloudflare\.com|fonts\.(googleapis|gstatic)\.com|commons\.wikimedia\.org|upload\.wikimedia\.org|arcgisonline\.com|tile\.openstreetmap\.org/.test(url.hostname) || url.origin === location.origin) {
    e.respondWith(caches.match(req).then(hit => hit || fetch(req).then(r => {
      if (r && (r.ok || r.type === "opaque")) { const c = r.clone(); caches.open(VER).then(x => x.put(req, c)); }
      return r;
    })));
  }
});

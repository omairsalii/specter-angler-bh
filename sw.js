/* Specter Angler BH — offline support */
const VER = "sab-v4.1";
const SHELL = ["./", "./index.html", "./tide.js", "./solunar.js", "./tidepro.js", "./visuals.js", "./gear.js", "./beginner.js", "./knots3d.js", "./motion.js", "./manifest.webmanifest", "./icons/icon-192.png", "./icons/icon-512.png", "./icons/apple-touch-icon.png"];
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
  // App's own files (page, scripts): always fetch the newest copy, bypassing the phone's HTTP cache;
  // fall back to the saved copy only when offline
  if (url.origin === location.origin && (req.mode === "navigate" || /\.(html|js|webmanifest)$/.test(url.pathname) || url.pathname.endsWith("/"))) {
    // a unique query string also bypasses GitHub Pages' CDN cache (it keeps files ~10 minutes)
    const fresh = new URL(req.mode === "navigate" ? "./index.html" : req.url, location.href); fresh.searchParams.set("__cb", Date.now());
    e.respondWith(fetch(fresh.href, {cache: "no-store"}).then(r => { const c = r.clone(); caches.open(VER).then(x => x.put(req.mode === "navigate" ? "./index.html" : req, c)); return r; })
      .catch(() => caches.match(req.mode === "navigate" ? "./index.html" : req)));
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

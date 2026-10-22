const ALWAYS_NETWORK = /(?:index\.html|precache\.js|precache\.json|sw\.js)$/;
// 演示站 Service Worker：首次加载后全量缓存，二次打开秒开
const CACHE = 'zdks-cdn-a-v1';
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  if (ALWAYS_NETWORK.test(e.request.url.split('?')[0])) return;
  e.respondWith((async () => {
    const cache = await caches.open(CACHE);
    const hit = await cache.match(e.request, { ignoreSearch: true });
    if (hit) return hit;
    try {
      const res = await fetch(e.request);
      if (res && res.ok) cache.put(e.request, res.clone());
      return res;
    } catch (err) {
      return hit || Response.error();
    }
  })());
});

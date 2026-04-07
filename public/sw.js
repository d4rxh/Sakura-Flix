const CACHE_NAME = 'sakuraflix-v5';
const AD_DOMAINS = [
  'doubleclick.net', 'googleadservices.com', 'googlesyndication.com',
  'adservice.google.com', 'pagead2.googlesyndication.com', 'popads.net',
  'popcash.net', 'propellerads.com', 'adsterra.com', 'exoclick.com',
  'juicyads.com', 'trafficjunky.com', 'revcontent.com', 'outbrain.com',
  'taboola.com', 'media.net', 'pubmatic.com', 'rubiconproject.com',
  'adsystem.com', 'adnxs.com', 'advertising.com', 'adsafeprotected.com',
  'scorecardresearch.com', 'quantserve.com', 'chartbeat.com',
];

function isAdRequest(url) {
  try {
    const hostname = new URL(url).hostname;
    return AD_DOMAINS.some(domain => hostname.includes(domain));
  } catch (e) { return false; }
}

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const url = event.request.url;
  
  // Block ad requests
  if (isAdRequest(url)) {
    event.respondWith(new Response('', { status: 204, statusText: 'Blocked by SakuraFlix AdBlock' }));
    return;
  }

  // Cache static assets
  if (event.request.method === 'GET' && !url.includes('firebase') && !url.includes('api')) {
    event.respondWith(
      caches.match(event.request).then(cached => {
        if (cached) return cached;
        return fetch(event.request).then(response => {
          if (response && response.status === 200 && response.type === 'basic') {
            const cloned = response.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(event.request, cloned));
          }
          return response;
        }).catch(() => cached || new Response('Offline'));
      })
    );
  }
});

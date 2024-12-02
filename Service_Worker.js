const CACHE_NAME = 'market-sop-cache-v2';
const urlsToCache = [
    './',
    './index.html',
    './login.html',
    './nosotros.html',
    './styles.css',
    './js/products.js',
    './js/app.js',
    './js/carrito.js',
    './assests/20241114224856.jpg',
    './assests/20241114224712.jpg',
    './assests/20241114225634.jpg',
    './assests/20241114103012.jpg',
    './Banner.PNG',
    './carritoyfon.PNG',
    './manifest.json',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css',
    'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css',
    'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js',

];

// Estrategia de caché para recursos externos
self.addEventListener('fetch', event => {
    const url = new URL(event.request.url);

    // Si es una imagen externa, aplica la estrategia de caché.
    if (url.origin !== location.origin && event.request.destination === 'image') {
        event.respondWith(
            caches.match(event.request).then(cachedResponse => {
                if (cachedResponse) {
                    return cachedResponse;
                }
                return fetch(event.request).then(networkResponse => {
                    return caches.open(CACHE_NAME).then(cache => {
                        cache.put(event.request, networkResponse.clone());
                        return networkResponse;
                    });
                });
            }).catch(() => {
                // Opcional: Imagen de reemplazo en caso de fallo.
                return caches.match('./icons/icon-192x192.png');
            })
        );
        return;
    }

    // Para otros recursos.
    event.respondWith(
        caches.match(event.request).then(cachedResponse => {
            return cachedResponse || fetch(event.request);
        })
    );
});

// Instalación y precarga
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Archivos en caché correctamente');
                return cache.addAll(urlsToCache);
            })
            .catch(err => console.error('Error al cachear archivos', err))
    );
    // Forzar que el nuevo Service Worker se active inmediatamente
    self.skipWaiting();
});


// Activación y limpieza de caché antigua
self.addEventListener('activate', event => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then(cacheNames =>
            Promise.all(
                cacheNames.map(cacheName => {
                    if (!cacheWhitelist.includes(cacheName)) {
                        console.log(`Eliminando caché antigua: ${cacheName}`);
                        return caches.delete(cacheName);
                    }
                })
            )
        )
    );
    // Forzar que el nuevo SW controle las páginas ya abiertas
    return self.clients.claim();
});

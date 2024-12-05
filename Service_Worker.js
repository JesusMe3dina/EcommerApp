const CACHE_NAME = 'market-sop-cache-v4'; // Cambia el nombre para evitar conflictos con versiones anteriores
const urlsToCache = [
    './',
    './index.html',
    './login.html',
    './nosotros.html',
    './crud.html', // Asegúrate de incluir crud.html si es necesario
    './styles.css',
    './js/carrito.js',
    './js/app.js',
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


    "https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css",
"https://cdn.jsdelivr.net/npm/pica/dist/pica.min.js",
"https://code.jquery.com/jquery-3.5.1.slim.min.js",
"https://cdn.jsdelivr.net/npm/@popperjs/core@2.9.3/dist/umd/popper.min.js"



];

// Precache de recursos en la instalación
self.addEventListener('install', event => {
    console.log('Service Worker instalando...');
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            console.log('Archivos precargados');
            return cache.addAll(urlsToCache);
        }).catch(error => console.error('Error en precache:', error))
    );
});

// Limpieza de caché antigua en activación
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames =>
            Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Eliminando caché obsoleta:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            )
        )
    );
});

// Manejo de solicitudes
self.addEventListener('fetch', event => {
    event.respondWith(
        (async () => {
            const cachedResponse = await caches.match(event.request);
            if (cachedResponse) {
                return cachedResponse; // Devuelve la respuesta en caché si existe
            }

            try {
                const networkResponse = await fetch(event.request);
                // Solo guardar respuestas exitosas en caché
                if (networkResponse && networkResponse.status === 200) {
                    const cache = await caches.open(CACHE_NAME);
                    cache.put(event.request, networkResponse.clone());
                }
                return networkResponse;
            } catch (error) {
                console.error('Error al obtener el recurso:', error);
                // Si es una solicitud de navegación, devuelve index.html
                if (event.request.mode === 'navigate') {
                    return caches.match('./index.html');
                }
            }
        })()
    );
});
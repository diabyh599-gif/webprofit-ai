// ==========================================
// SERVICE-WORKER.JS - VERSION PRO
// ==========================================

const CACHE_NAME = 'webprofit-v2';
const OFFLINE_URL = '/index.html';

// Liste des fichiers à mettre en cache
const urlsToCache = [
    '/',
    '/index.html',
    '/style.css',
    '/firebase.js',
    '/products.js',
    '/cart.js',
    '/ai.js',
    '/app.js',
    '/manifest.json'
];

// ===== INSTALLATION =====
self.addEventListener('install', event => {
    console.log('🔄 Service Worker: Installation...');
    
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('📦 Cache: Ajout des fichiers...');
                return cache.addAll(urlsToCache)
                    .then(() => {
                        console.log('✅ Cache: Tous les fichiers sont en cache !');
                    })
                    .catch(error => {
                        console.error('❌ Cache: Erreur lors de l\'ajout:', error);
                    });
            })
            .then(() => {
                // Force l'activation immédiate
                return self.skipWaiting();
            })
    );
});

// ===== ACTIVATION =====
self.addEventListener('activate', event => {
    console.log('🔄 Service Worker: Activation...');
    
    event.waitUntil(
        caches.keys()
            .then(cacheNames => {
                // Supprimer les anciens caches
                const deletePromises = cacheNames
                    .filter(name => name !== CACHE_NAME)
                    .map(name => {
                        console.log('🗑️ Suppression de l\'ancien cache:', name);
                        return caches.delete(name);
                    });
                
                return Promise.all(deletePromises);
            })
            .then(() => {
                console.log('✅ Service Worker: Activé');
                // Prendre le contrôle de toutes les pages
                return self.clients.claim();
            })
    );
});

// ===== INTERCEPTION DES REQUÊTES =====
self.addEventListener('fetch', event => {
    // Stratégie: Cache d'abord, puis réseau
    event.respondWith(
        caches.match(event.request)
            .then(cachedResponse => {
                // Si la requête est dans le cache, la retourner
                if (cachedResponse) {
                    console.log('📦 Cache: Réponse trouvée pour', event.request.url);
                    return cachedResponse;
                }

                // Sinon, faire la requête réseau
                console.log('🌐 Réseau: Chargement de', event.request.url);
                return fetch(event.request)
                    .then(response => {
                        // Mettre en cache les nouvelles requêtes (images, etc.)
                        if (response && response.status === 200) {
                            const responseToCache = response.clone();
                            caches.open(CACHE_NAME)
                                .then(cache => {
                                    cache.put(event.request, responseToCache);
                                });
                        }
                        return response;
                    })
                    .catch(error => {
                        console.warn('⚠️ Erreur réseau pour', event.request.url);
                        // Si la requête est pour une page HTML, retourner la page hors-ligne
                        if (event.request.headers.get('accept').includes('text/html')) {
                            return caches.match(OFFLINE_URL);
                        }
                        return new Response('🛒 Vous êtes hors ligne', {
                            status: 503,
                            statusText: 'Service Unavailable'
                        });
                    });
            })
    );
});

// ===== GESTION DES MESSAGES =====
self.addEventListener('message', event => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});

console.log('📦 Service Worker chargé avec succès !');
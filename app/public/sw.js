// Service Worker for PWA notifications
const CACHE_NAME = 'savor-cache-v1';

self.addEventListener('install', (event) => {
    console.log('Service Worker installed');
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    console.log('Service Worker activated');
    event.waitUntil(clients.claim());
});

// Handle push notifications
self.addEventListener('push', (event) => {
    const data = event.data?.json() || {
        title: 'Savor Reminder',
        body: 'Don\'t forget to log your meals today!',
        icon: '/icon-192.png'
    };

    event.waitUntil(
        self.registration.showNotification(data.title, {
            body: data.body,
            icon: data.icon || '/icon-192.png',
            badge: '/icon-192.png',
            vibrate: [200, 100, 200],
            tag: 'savor-reminder',
            requireInteraction: false,
            actions: [
                { action: 'log', title: 'Log Meal' },
                { action: 'dismiss', title: 'Dismiss' }
            ]
        })
    );
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
    event.notification.close();

    if (event.action === 'log') {
        event.waitUntil(
            clients.openWindow('/log/photo')
        );
    } else {
        event.waitUntil(
            clients.openWindow('/')
        );
    }
});

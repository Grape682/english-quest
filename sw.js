/* English Quest：讓手機可以「安裝」到桌面。不快取任何東西，每次都抓最新版，避免看到舊網頁。 */
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", e => e.waitUntil(self.clients.claim()));
self.addEventListener("fetch", () => { });

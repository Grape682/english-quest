/* English Quest：讓手機可以「安裝」到桌面，也可以離線打開。
   有網路時一律先抓最新版（不會看到舊網頁），抓到後順便存一份；沒網路時才用存起來的那一份。
   只處理同一個網站的檔案；Google 後台、AI 語音等其他網站的連線完全不碰。 */
const CACHE = "eq-shell-v1";
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", e => e.waitUntil(self.clients.claim()));
self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET") return;
  let url; try { url = new URL(req.url); } catch (err) { return; }
  if (url.origin !== self.location.origin) return;
  e.respondWith(
    fetch(req).then(res => {
      if (res && res.ok) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)).catch(() => { }); }
      return res;
    }).catch(() => caches.open(CACHE).then(c => c.match(req, { ignoreSearch: true }).then(m => m || (req.mode === "navigate" ? c.match("./", { ignoreSearch: true }).then(x => x || c.match("index.html", { ignoreSearch: true })) : undefined)))
      .then(m => m || new Response("離線中，這個檔案還沒有存到手機裡。", { status: 503, headers: { "Content-Type": "text/plain; charset=utf-8" } })))
  );
});

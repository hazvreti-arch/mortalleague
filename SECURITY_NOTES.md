# MortaLeague güvenlik notu

Bu sürüm statik GitHub Pages üzerinde çalışır.

- HTML tarafında temel CSP ve Referrer Policy eklendi.
- Sistem araması ve responsive/mobile iyileştirmeleri eklendi.
- Hareket azaltma ve mobilde daha az parçacık ile CPU kullanımı düşürüldü.
- robots.txt ve sitemap.xml eklendi.

Gerçek bot/DDoS/rate-limit koruması GitHub Pages içinden HTML/JS ile yapılamaz.
Canlı koruma için alan adı Cloudflare üzerinden proxy edildiğinde WAF, Bot Fight Mode,
Rate Limiting ve gerekirse Turnstile katmanı ayrıca açılmalıdır.

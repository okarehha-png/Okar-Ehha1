const fs = require('fs');
let sitemap = fs.readFileSync('public/sitemap.xml', 'utf8');

const additionalSitemap = `  <url>
    <loc>https://okarehha.in/interior-cleaning</loc>
    <lastmod>2026-08-25</lastmod>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://okarehha.in/car-detailing</loc>
    <lastmod>2026-08-25</lastmod>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://okarehha.in/monthly-car-wash</loc>
    <lastmod>2026-08-25</lastmod>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://okarehha.in/home-cleaning</loc>
    <lastmod>2026-08-25</lastmod>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://okarehha.in/solar-panel-cleaning</loc>
    <lastmod>2026-08-25</lastmod>
    <priority>0.8</priority>
  </url>`;

sitemap = sitemap.replace('</urlset>', additionalSitemap + '\n</urlset>');
fs.writeFileSync('public/sitemap.xml', sitemap);

const fs = require('fs');
let sitemap = fs.readFileSync('public/sitemap.xml', 'utf8');

const regexesToRemove = [
  /<url>\s*<loc>https:\/\/okarehha.in\/interior-cleaning<\/loc>.*?<\/url>/s,
  /<url>\s*<loc>https:\/\/okarehha.in\/car-detailing<\/loc>.*?<\/url>/s,
  /<url>\s*<loc>https:\/\/okarehha.in\/monthly-car-wash<\/loc>.*?<\/url>/s
];

regexesToRemove.forEach(regex => {
  sitemap = sitemap.replace(regex, '');
});

// also need to add bike-wash
const bikeWashSitemap = `  <url>
    <loc>https://okarehha.in/bike-wash</loc>
    <lastmod>2026-08-25</lastmod>
    <priority>0.9</priority>
  </url>`;

sitemap = sitemap.replace('</urlset>', bikeWashSitemap + '\n</urlset>');
fs.writeFileSync('public/sitemap.xml', sitemap);

const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const toRemove = [
  '<Route path="interior-cleaning" element={<ServiceDetailPage serviceSlug="interior-cleaning" />} />',
  '<Route path="car-detailing" element={<ServiceDetailPage serviceSlug="car-detailing" />} />',
  '<Route path="monthly-car-wash" element={<ServiceDetailPage serviceSlug="monthly-car-wash" />} />',
  '<Route path="home-cleaning" element={<ServiceDetailPage serviceSlug="home-cleaning" />} />',
  '<Route path="solar-panel-cleaning" element={<ServiceDetailPage serviceSlug="solar-panel-cleaning" />} />'
];

toRemove.forEach(route => {
  content = content.replace(route, '');
});

fs.writeFileSync('src/App.tsx', content);

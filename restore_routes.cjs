const fs = require('fs');
let appContent = fs.readFileSync('src/App.tsx', 'utf8');

const routesToAdd = `
          <Route path="interior-cleaning" element={<ServiceDetailPage serviceSlug="interior-cleaning" />} />
          <Route path="car-detailing" element={<ServiceDetailPage serviceSlug="car-detailing" />} />
          <Route path="monthly-car-wash" element={<ServiceDetailPage serviceSlug="monthly-car-wash" />} />
          <Route path="home-cleaning" element={<ServiceDetailPage serviceSlug="home-cleaning" />} />
          <Route path="solar-panel-cleaning" element={<ServiceDetailPage serviceSlug="solar-panel-cleaning" />} />`;

// insert right after <Route path="water-tank-cleaning"... />
appContent = appContent.replace(
  '<Route path="water-tank-cleaning" element={<ServiceDetailPage serviceSlug="water-tank-cleaning" />} />',
  '<Route path="water-tank-cleaning" element={<ServiceDetailPage serviceSlug="water-tank-cleaning" />} />' + routesToAdd
);

fs.writeFileSync('src/App.tsx', appContent);

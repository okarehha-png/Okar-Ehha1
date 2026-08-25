import waterTankImg from '../assets/images/white_sintex_tank_cleaning_1787639372101.jpg';
import homeCleaningImg from '../assets/images/man_cleaning_home_1787638533125.jpg';
export interface Package {
  id: string;
  name: string;
  price: number;
  description?: string;
  features: string[];
}

export interface ServiceData {
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  fullDescription: string;
  icon: string;
  image: string;
  startingPrice: number;
  rating: number;
  reviews: number;
  packages: Package[];
  faqs: { question: string; answer: string }[];
}

export const servicesData: Record<string, ServiceData> = {
  "car-wash": {
    id: "car-wash",
    title: "Doorstep Car Wash",
    slug: "car-wash",
    shortDescription: "Professional car cleaning at your doorstep.",
    fullDescription: "Get your car looking brand new with our professional doorstep car wash services. We bring our own equipment and use premium cleaning products.",
    icon: "Car",
    image: "https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    startingPrice: 199,
    rating: 4.8,
    reviews: 124,
    packages: [
      {
        id: "cw-hatchback",
        name: "Hatchback",
        price: 199,
        features: ["Exterior Wash", "Foam Wash", "Interior Vacuum", "Dashboard Cleaning", "Tyre Cleaning", "Tyre Polish"]
      },
      {
        id: "cw-sedan",
        name: "Sedan",
        price: 249,
        features: ["Exterior Wash", "Foam Wash", "Interior Vacuum", "Dashboard Cleaning", "Tyre Cleaning", "Tyre Polish"]
      },
      {
        id: "cw-suv",
        name: "SUV / MUV",
        price: 299,
        features: ["Exterior Wash", "Foam Wash", "Interior Vacuum", "Dashboard Cleaning", "Tyre Cleaning", "Tyre Polish"]
      }
    ],
    faqs: [
      { question: "Do I need to provide water/electricity?", answer: "Yes, we require access to a water tap and a standard electrical point." },
      { question: "How long does a car wash take?", answer: "Typically, it takes about 45 minutes to 1 hour depending on the vehicle size." }
    ]
  },
  "bike-wash": {
    id: "bike-wash",
    title: "Bike Wash",
    slug: "bike-wash",
    shortDescription: "Detailed bike cleaning and polishing.",
    fullDescription: "Comprehensive cleaning for your two-wheeler, including foam wash, engine degreasing, and chain lubrication.",
    icon: "Bike",
    image: "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    startingPrice: 99,
    rating: 4.7,
    reviews: 89,
    packages: [
      {
        id: "bw-standard",
        name: "Standard Bike Wash",
        price: 99,
        features: ["Foam Wash", "Engine Degreasing", "Chain Cleaning", "Alloy Cleaning", "Wax Polish"]
      },
      {
        id: "bw-superbike",
        name: "Superbike Wash",
        price: 199,
        features: ["Foam Wash", "Engine & Chain Degreasing", "Detailed Scrubbing", "Premium Wax Polish", "Metal Polishing"]
      }
    ],
    faqs: [
      { question: "Do you clean the chain?", answer: "Yes, chain cleaning and basic lubrication is included." }
    ]
  },
  "sofa-cleaning": {
    id: "sofa-cleaning",
    title: "Sofa Cleaning",
    slug: "sofa-cleaning",
    shortDescription: "Deep cleaning for your sofas & couches.",
    fullDescription: "Revitalize your living room with our professional sofa dry cleaning service. We remove dust, stains, and allergens.",
    icon: "Sofa",
    image: "https://images.unsplash.com/photo-1512212621149-107ffe572d2f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    startingPrice: 499,
    rating: 4.9,
    reviews: 210,
    packages: [
      { id: "sc-1", name: "1 Seater", price: 199, features: ["Dry Vacuuming", "Shampooing", "Wet Vacuuming", "Stain Treatment"] },
      { id: "sc-2", name: "2 Seater", price: 399, features: ["Dry Vacuuming", "Shampooing", "Wet Vacuuming", "Stain Treatment"] },
      { id: "sc-3", name: "3 Seater", price: 499, features: ["Dry Vacuuming", "Shampooing", "Wet Vacuuming", "Stain Treatment"] },
      { id: "sc-4", name: "4 Seater", price: 699, features: ["Dry Vacuuming", "Shampooing", "Wet Vacuuming", "Stain Treatment"] },
      { id: "sc-5", name: "5+ Seater", price: 899, features: ["Dry Vacuuming", "Shampooing", "Wet Vacuuming", "Stain Treatment"] }
    ],
    faqs: [
      { question: "How long will the sofa take to dry?", answer: "Typically 3-4 hours under normal ceiling fan ventilation." },
      { question: "Will all stains be removed?", answer: "We remove up to 90% of stains. Extremely old or harsh chemical stains may lighten but not disappear completely." }
    ]
  },
  "water-tank-cleaning": {
    id: "water-tank-cleaning",
    title: "Water Tank Cleaning",
    slug: "water-tank-cleaning",
    shortDescription: "Mechanized water tank cleaning.",
    fullDescription: "Ensure your family's health with our 6-stage mechanized water tank cleaning process. Removes sludge, algae, and bacteria.",
    icon: "Droplets",
    image: waterTankImg,
    startingPrice: 799,
    rating: 4.8,
    reviews: 156,
    packages: [
      { id: "wt-1000", name: "Up to 1000 L", price: 799, features: ["Tank Inspection", "Sludge Removal", "Scrubbing", "Pressure Cleaning", "Disinfection", "Final Rinse"] },
      { id: "wt-2000", name: "Up to 2000 L", price: 1500, features: ["Tank Inspection", "Sludge Removal", "Scrubbing", "Pressure Cleaning", "Disinfection", "Final Rinse"] },
      { id: "wt-3000", name: "Up to 3000 L", price: 2100, features: ["Tank Inspection", "Sludge Removal", "Scrubbing", "Pressure Cleaning", "Disinfection", "Final Rinse"] },
      { id: "wt-custom", name: "Larger Tanks", price: 0, description: "Contact us for custom pricing", features: ["Tank Inspection", "Sludge Removal", "Scrubbing", "Pressure Cleaning", "Disinfection", "Final Rinse"] }
    ],
    faqs: [
      { question: "Is it safe to use the water immediately after?", answer: "Yes, after our final rinse and flush, the tank is completely safe to fill and use." }
    ]
  },
  "home-cleaning": {
    id: "home-cleaning",
    title: "Home Cleaning",
    slug: "home-cleaning",
    shortDescription: "Complete deep cleaning for your home.",
    fullDescription: "A thorough top-to-bottom deep clean of your entire home, perfect for moving in/out or festive preparations.",
    icon: "Home",
    image: homeCleaningImg,
    startingPrice: 2499,
    rating: 4.7,
    reviews: 342,
    packages: [
      { id: "hc-1bhk", name: "1 BHK", price: 2499, features: ["Kitchen Deep Clean", "Bathroom Deep Clean", "Floor Scrubbing", "Dry Dusting", "Cobweb Removal"] },
      { id: "hc-2bhk", name: "2 BHK", price: 3499, features: ["Kitchen Deep Clean", "2 Bathrooms Deep Clean", "Floor Scrubbing", "Dry Dusting", "Cobweb Removal"] },
      { id: "hc-3bhk", name: "3 BHK", price: 4499, features: ["Kitchen Deep Clean", "3 Bathrooms Deep Clean", "Floor Scrubbing", "Dry Dusting", "Cobweb Removal"] },
      { id: "hc-4bhk", name: "4 BHK", price: 5499, features: ["Kitchen Deep Clean", "Bathrooms Deep Clean", "Floor Scrubbing", "Dry Dusting", "Cobweb Removal"] },
      { id: "hc-custom", name: "Custom / Villa", price: 0, description: "Contact us for custom pricing", features: ["Tailored Deep Cleaning Services"] }
    ],
    faqs: [
      { question: "Do you clean the insides of cupboards?", answer: "Yes, if they are emptied prior to our arrival." }
    ]
  },
  "solar-panel-cleaning": {
    id: "solar-panel-cleaning",
    title: "Solar Panel Cleaning",
    slug: "solar-panel-cleaning",
    shortDescription: "Boost solar efficiency with clean panels.",
    fullDescription: "Dust and bird droppings can reduce your solar panel efficiency by up to 30%. Our professional cleaning restores optimal performance safely.",
    icon: "Sun",
    image: "https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    startingPrice: 499,
    rating: 4.9,
    reviews: 42,
    packages: [
      { id: "sp-1-10", name: "1 to 10 Panels", price: 499, features: ["Dust Removal", "Water Washing", "Soft Scrubbing", "Final Inspection"] },
      { id: "sp-11-20", name: "11 to 20 Panels", price: 899, features: ["Dust Removal", "Water Washing", "Soft Scrubbing", "Final Inspection"] },
      { id: "sp-20plus", name: "20+ Panels", price: 0, description: "Contact for bulk pricing", features: ["Dust Removal", "Water Washing", "Soft Scrubbing", "Final Inspection"] }
    ],
    faqs: [
      { question: "Is hard water used?", answer: "No, we use treated or filtered water to prevent scaling on the panels." }
    ]
  }
};

export const popularServices = [
  "car-wash",
  "sofa-cleaning",
  "water-tank-cleaning",
  "home-cleaning"
];

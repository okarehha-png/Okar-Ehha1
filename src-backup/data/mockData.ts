import { Service, Driver, Review } from '../types';

import carWashImg from '../assets/images/car_wash_photo_1782142850661.jpg';
import sofaImg from '../assets/images/sofa_cleaning_photo_1782142873025.jpg';
import waterTankImg from '../assets/images/sintex_tank_cleaning_1782143109229.jpg';
import homeCleaningImg from '../assets/images/home_cleaning_photo_1782143077200.jpg';
import carpetCleaningImg from '../assets/images/carpet_cleaning_photo_1782143095125.jpg';

export const SERVICES: Service[] = [
  {
    id: 'Car Wash',
    name: 'Car Wash',
    basePrice: 500,
    description: 'Complete exterior and interior car washing service.',
    icon: 'Car',
    imageUrl: carWashImg,
    addons: [
      { id: 'interior_detailing', name: 'Interior Detailing', price: 800 },
      { id: 'car_waxing', name: 'Car Waxing', price: 400 },
      { id: 'tire_shining', name: 'Tire Shining', price: 150 },
      { id: 'premium_products', name: 'Premium Cleaning Products', price: 250 },
    ],
  },
  {
    id: 'Home Cleaning',
    name: 'Home Cleaning',
    basePrice: 1500,
    description: 'Deep cleaning for your entire home.',
    icon: 'Home',
    imageUrl: homeCleaningImg,
  },
  {
    id: 'Sofa Cleaning',
    name: 'Sofa Cleaning',
    basePrice: 600,
    description: 'Professional dry and wet cleaning for sofas.',
    icon: 'Sofa',
    imageUrl: sofaImg,
  },
  {
    id: 'Carpet Cleaning',
    name: 'Carpet Cleaning',
    basePrice: 400,
    description: 'Stain removal and deep cleaning of carpets.',
    icon: 'Rug',
    imageUrl: carpetCleaningImg,
  },
  {
    id: 'Water Tank Cleaning',
    name: 'Water Tank Cleaning',
    basePrice: 800,
    description: 'Hygienic mechanized cleaning of water tanks.',
    icon: 'Droplets',
    imageUrl: waterTankImg,
  },
];

export const MOCK_DRIVERS: Driver[] = [
  { id: 'd1', name: 'Ramesh Kumar', phone: '9876543210', status: 'Available', currentLat: 22.7196, currentLng: 75.8577 },
  { id: 'd2', name: 'Suresh Singh', phone: '9876543211', status: 'Available', currentLat: 22.7200, currentLng: 75.8500 },
];

export const INITIAL_REVIEWS: Review[] = [
  { id: 'r1', customerName: 'Amit Sharma', rating: 5, text: 'Excellent car wash service. The interior detailing was spot on!', date: new Date().toISOString() },
  { id: 'r2', customerName: 'Priya Patel', rating: 4, text: 'Very professional home cleaning. On time and polite staff.', date: new Date(Date.now() - 86400000).toISOString() },
];

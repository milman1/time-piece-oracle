
import { getWatchImage } from './imageService';

export interface Watch {
  id: number;
  brand: string;
  model: string;
  reference: string;
  price: number;
  originalPrice?: number;
  condition: string;
  seller: string;
  rating: number;
  reviews: number;
  marketplace: string;
  image: string;
  trusted: boolean;
  year: number;
  description?: string;
}

const mockWatches: Watch[] = [
  {
    id: 1,
    brand: 'Rolex',
    model: 'Submariner Date',
    reference: '126610LN',
    price: 12950,
    originalPrice: 13500,
    condition: 'Excellent',
    seller: 'Crown & Caliber',
    rating: 4.9,
    reviews: 2847,
    marketplace: 'WatchBox',
    image: getWatchImage('126610LN').url,
    trusted: true,
    year: 2022,
    description: 'Black dial and bezel, steel case and bracelet'
  },
  {
    id: 2,
    brand: 'Omega',
    model: 'Speedmaster Professional',
    reference: '310.30.42.50.01.001',
    price: 4250,
    originalPrice: 4850,
    condition: 'Very Good',
    seller: 'Hodinkee Shop',
    rating: 4.8,
    reviews: 1923,
    marketplace: 'Chrono24',
    image: getWatchImage('310.30.42.50.01.001').url,
    trusted: true,
    year: 2021,
    description: 'Moonwatch with hesalite crystal'
  },
  {
    id: 3,
    brand: 'Tudor',
    model: 'Black Bay 58',
    reference: '79030N',
    price: 2890,
    originalPrice: 3200,
    condition: 'New',
    seller: 'Tourneau',
    rating: 4.7,
    reviews: 756,
    marketplace: 'eBay',
    image: getWatchImage('79030N').url,
    trusted: true,
    year: 2023,
    description: 'Navy blue dial and bezel'
  },
  {
    id: 4,
    brand: 'Cartier',
    model: 'Santos Medium',
    reference: 'WSSA0029',
    price: 5650,
    originalPrice: 6100,
    condition: 'Excellent',
    seller: 'Bob\'s Watches',
    rating: 4.9,
    reviews: 3421,
    marketplace: 'WatchStation',
    image: getWatchImage('WSSA0029').url,
    trusted: true,
    year: 2022,
    description: 'Steel case with blue leather strap'
  },
  {
    id: 5,
    brand: 'Patek Philippe',
    model: 'Nautilus',
    reference: '5711/1A-010',
    price: 89500,
    originalPrice: 95000,
    condition: 'Excellent',
    seller: 'Antiquorum',
    rating: 4.9,
    reviews: 892,
    marketplace: 'Chrono24',
    image: getWatchImage('5711/1A-010').url,
    trusted: true,
    year: 2020,
    description: 'Blue dial, discontinued model'
  },
  {
    id: 6,
    brand: 'Audemars Piguet',
    model: 'Royal Oak',
    reference: '15400ST.OO.1220ST.01',
    price: 32500,
    originalPrice: 35000,
    condition: 'Very Good',
    seller: 'Wristcheck',
    rating: 4.8,
    reviews: 1247,
    marketplace: 'WatchBox',
    image: getWatchImage('15400ST.OO.1220ST.01').url,
    trusted: true,
    year: 2019,
    description: 'Black tapisserie dial, 41mm'
  },
  {
    id: 7,
    brand: 'Rolex',
    model: 'GMT Master II',
    reference: '126710BLNR',
    price: 14750,
    originalPrice: 15200,
    condition: 'New',
    seller: 'Crown & Caliber',
    rating: 4.9,
    reviews: 2847,
    marketplace: 'Chrono24',
    image: getWatchImage('126710BLNR').url,
    trusted: true,
    year: 2023,
    description: 'Batman bezel, Jubilee bracelet'
  },
  {
    id: 8,
    brand: 'Omega',
    model: 'Seamaster Planet Ocean',
    reference: '215.30.44.21.01.001',
    price: 3450,
    originalPrice: 3800,
    condition: 'Excellent',
    seller: 'Jomashop',
    rating: 4.6,
    reviews: 1523,
    marketplace: 'eBay',
    image: getWatchImage('215.30.44.21.01.001').url,
    trusted: true,
    year: 2021,
    description: 'Black dial and bezel, 43.5mm'
  }
];

export const searchWatches = (query: string): Watch[] => {
  if (!query.trim()) {
    return mockWatches;
  }

  const searchTerm = query.toLowerCase();
  return mockWatches.filter(watch => 
    watch.brand.toLowerCase().includes(searchTerm) ||
    watch.model.toLowerCase().includes(searchTerm) ||
    watch.reference.toLowerCase().includes(searchTerm) ||
    `${watch.brand} ${watch.model}`.toLowerCase().includes(searchTerm)
  );
};

export const getWatchById = (id: number): Watch | undefined => {
  return mockWatches.find(watch => watch.id === id);
};

export const getAllWatches = (): Watch[] => {
  return mockWatches;
};

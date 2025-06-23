
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
  image?: string;
  trusted: boolean;
  year?: number;
  description?: string;
  style?: string;
  movement?: string;
  strap?: string;
  avgPrice?: number; // Add avgPrice field
}

const mockWatches: Watch[] = [
  {
    id: 1,
    brand: 'Rolex',
    model: 'Submariner',
    reference: 'REF-116610LN',
    price: 8500,
    originalPrice: 9000,
    condition: 'Excellent',
    seller: 'Crown & Caliber',
    rating: 4.8,
    reviews: 156,
    marketplace: 'Crown & Caliber',
    image: '/placeholder.svg',
    trusted: true,
    year: 2018,
    description: 'Classic black dial Submariner in excellent condition',
    style: 'diver',
    movement: 'automatic',
    strap: 'metal',
    avgPrice: 9500
  },
  {
    id: 2,
    brand: 'Omega',
    model: 'Speedmaster Professional',
    reference: 'REF-311.30.42.30.01.005',
    price: 3200,
    condition: 'Very Good',
    seller: 'Hodinkee Shop',
    rating: 4.9,
    reviews: 89,
    marketplace: 'Hodinkee Shop',
    image: '/placeholder.svg',
    trusted: true,
    year: 2019,
    description: 'Moonwatch with hesalite crystal',
    style: 'chronograph',
    movement: 'manual',
    strap: 'metal',
    avgPrice: 3800
  },
  {
    id: 3,
    brand: 'Patek Philippe',
    model: 'Nautilus',
    reference: 'REF-5711/1A-010',
    price: 55000,
    condition: 'Unworn',
    seller: 'Tourneau',
    rating: 5.0,
    reviews: 23,
    marketplace: 'Tourneau',
    image: '/placeholder.svg',
    trusted: true,
    year: 2021,
    description: 'Blue dial steel Nautilus, discontinued model',
    style: 'sport',
    movement: 'automatic',
    strap: 'metal',
    avgPrice: 60000
  },
  {
    id: 4,
    brand: 'Audemars Piguet',
    model: 'Royal Oak',
    reference: 'REF-15400ST.OO.1220ST.03',
    price: 18500,
    originalPrice: 20000,
    condition: 'Excellent',
    seller: 'Bobs Watches',
    rating: 4.7,
    reviews: 67,
    marketplace: 'Bobs Watches',
    image: '/placeholder.svg',
    trusted: true,
    year: 2017,
    description: 'White dial Royal Oak 41mm',
    style: 'sport',
    movement: 'automatic',
    strap: 'metal',
    avgPrice: 22000
  },
  {
    id: 5,
    brand: 'Cartier',
    model: 'Santos',
    reference: 'REF-WSSA0009',
    price: 4800,
    condition: 'Very Good',
    seller: 'WatchStation',
    rating: 4.6,
    reviews: 34,
    marketplace: 'WatchStation',
    image: '/placeholder.svg',
    trusted: true,
    year: 2020,
    description: 'Medium steel Santos with leather strap',
    style: 'dress',
    movement: 'automatic',
    strap: 'leather',
    avgPrice: 5200
  },
  {
    id: 6,
    brand: 'Tag Heuer',
    model: 'Monaco',
    reference: 'REF-CAW2111.FC6183',
    price: 2100,
    originalPrice: 2400,
    condition: 'Good',
    seller: 'eBay',
    rating: 4.2,
    reviews: 12,
    marketplace: 'eBay',
    image: '/placeholder.svg',
    trusted: false,
    year: 2016,
    description: 'Blue dial Monaco chronograph',
    style: 'chronograph',
    movement: 'automatic',
    strap: 'leather',
    avgPrice: 2800
  },
  {
    id: 7,
    brand: 'Grand Seiko',
    model: 'Snowflake',
    reference: 'REF-SBGA211',
    price: 3800,
    condition: 'Excellent',
    seller: 'Seiko Authorized Dealer',
    rating: 4.9,
    reviews: 45,
    marketplace: 'Seiko',
    image: '/placeholder.svg',
    trusted: true,
    year: 2020,
    description: 'Spring Drive with power reserve indicator',
    style: 'dress',
    movement: 'automatic',
    strap: 'leather',
    avgPrice: 4200
  },
  {
    id: 8,
    brand: 'Breitling',
    model: 'Navitimer',
    reference: 'REF-A23322121B2X1',
    price: 3500,
    condition: 'Very Good',
    seller: 'Chrono24',
    rating: 4.5,
    reviews: 78,
    marketplace: 'Chrono24',
    image: '/placeholder.svg',
    trusted: true,
    year: 2018,
    description: 'Blue dial pilot chronograph',
    style: 'pilot',
    movement: 'automatic',
    strap: 'leather',
    avgPrice: 3900
  }
];

export const getAllWatches = (): Watch[] => {
  return mockWatches;
};

export const searchWatches = (query: string): Watch[] => {
  if (!query.trim()) {
    return getAllWatches();
  }
  
  const searchTerm = query.toLowerCase();
  return mockWatches.filter(watch => 
    watch.brand.toLowerCase().includes(searchTerm) ||
    watch.model.toLowerCase().includes(searchTerm) ||
    watch.reference.toLowerCase().includes(searchTerm) ||
    watch.style?.toLowerCase().includes(searchTerm) ||
    watch.movement?.toLowerCase().includes(searchTerm) ||
    watch.description?.toLowerCase().includes(searchTerm)
  );
};

export const getWatchByReference = (reference: string): Watch | undefined => {
  return mockWatches.find(watch => watch.reference === reference);
};

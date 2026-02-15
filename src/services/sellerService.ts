// src/services/sellerService.ts
// Vetted seller membership service — sellers pay to join our platform
// Their listings appear alongside aggregated platform results

export interface SellerTier {
    id: string;
    name: string;
    price: number; // monthly USD
    features: string[];
    highlight?: boolean;
}

export interface VettedSeller {
    id: string;
    name: string;
    website: string;
    tier: string;
    verified: boolean;
    logo?: string;
    location: string;
    memberSince: string;
    specialties: string[];
    rating: number;
    reviewCount: number;
    listingCount: number;
    bio: string;
    featured: boolean;
}

export interface SellerApplication {
    businessName: string;
    contactName: string;
    email: string;
    website: string;
    inventorySize: string;
    brandsCarried: string[];
    yearsInBusiness: number;
    tier: string;
    message?: string;
}

// ——— Membership Tiers ———

export const SELLER_TIERS: SellerTier[] = [
    {
        id: 'basic',
        name: 'Basic',
        price: 99,
        features: [
            'Up to 50 listings displayed',
            'Platform badge on listings',
            'Basic seller profile page',
            'Standard placement in search',
            'Monthly performance report',
        ],
    },
    {
        id: 'premium',
        name: 'Premium',
        price: 249,
        highlight: true,
        features: [
            'Up to 200 listings displayed',
            'Verified seller badge',
            'Enhanced profile with reviews',
            'Priority placement in results',
            'Weekly analytics dashboard',
            'Dedicated account support',
        ],
    },
    {
        id: 'featured',
        name: 'Featured',
        price: 499,
        features: [
            'Unlimited listings displayed',
            'Gold verified badge',
            'Homepage spotlight section',
            'Top placement in all searches',
            'Real-time analytics dashboard',
            'Priority support + onboarding',
            'Custom branding options',
            'API integration support',
        ],
    },
];

// ——— Mock Vetted Sellers ———

const mockSellers: VettedSeller[] = [
    {
        id: 'vs-001',
        name: 'Crown & Caliber',
        website: 'https://www.crownandcaliber.com',
        tier: 'featured',
        verified: true,
        location: 'Atlanta, GA',
        memberSince: '2024',
        specialties: ['Rolex', 'Omega', 'Tudor', 'Cartier'],
        rating: 4.8,
        reviewCount: 6700,
        listingCount: 340,
        bio: 'One of the largest online pre-owned luxury watch retailers in the US. Every watch comes with a 2-year warranty and has passed our rigorous authentication process.',
        featured: true,
    },
    {
        id: 'vs-002',
        name: 'SwissWatchExpo',
        website: 'https://www.swisswatchexpo.com',
        tier: 'featured',
        verified: true,
        location: 'Buckhead, GA',
        memberSince: '2024',
        specialties: ['Rolex', 'Cartier', 'Breitling', 'TAG Heuer'],
        rating: 4.9,
        reviewCount: 4250,
        listingCount: 520,
        bio: 'Georgia\'s largest buyer and seller of luxury watches with over 20 years of experience. Showroom available for in-person viewing.',
        featured: true,
    },
    {
        id: 'vs-003',
        name: 'Watchfinder & Co.',
        website: 'https://www.watchfinder.com',
        tier: 'premium',
        verified: true,
        location: 'London, UK',
        memberSince: '2024',
        specialties: ['Rolex', 'Omega', 'IWC', 'Patek Philippe'],
        rating: 4.7,
        reviewCount: 1680,
        listingCount: 890,
        bio: 'The UK\'s largest pre-owned watch specialist with locations in London, Hong Kong, and New York. Part of the Richemont Group.',
        featured: false,
    },
    {
        id: 'vs-004',
        name: 'DavidSW',
        website: 'https://davidsw.com',
        tier: 'premium',
        verified: true,
        location: 'New York, NY',
        memberSince: '2025',
        specialties: ['Rolex', 'Patek Philippe', 'Audemars Piguet'],
        rating: 4.9,
        reviewCount: 1856,
        listingCount: 180,
        bio: 'Trusted dealer specializing in modern Rolex, Patek Philippe, and AP. Known for competitive pricing and fast shipping.',
        featured: false,
    },
    {
        id: 'vs-005',
        name: 'HQ Milton',
        website: 'https://hqmilton.com',
        tier: 'basic',
        verified: true,
        location: 'Online',
        memberSince: '2025',
        specialties: ['Rolex', 'Omega', 'Tudor'],
        rating: 4.6,
        reviewCount: 980,
        listingCount: 95,
        bio: 'Curated selection of pre-owned Rolex, Omega, and Tudor watches. Every watch is authenticated and comes with a warranty.',
        featured: false,
    },
];

// ——— Public API ———

export async function getVettedSellers(): Promise<VettedSeller[]> {
    await delay(300);
    return [...mockSellers];
}

export async function getFeaturedSellers(): Promise<VettedSeller[]> {
    await delay(200);
    return mockSellers.filter(s => s.featured);
}

export async function getSellerById(id: string): Promise<VettedSeller | undefined> {
    await delay(200);
    return mockSellers.find(s => s.id === id);
}

export async function submitApplication(app: SellerApplication): Promise<{ success: boolean; message: string }> {
    await delay(800);
    console.log('Seller application submitted:', app);
    return {
        success: true,
        message: 'Thank you for your application! Our team will review it and get back to you within 2 business days.',
    };
}

export function getSellerTiers(): SellerTier[] {
    return SELLER_TIERS;
}

function delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// src/services/ebayService.ts
// eBay Browse API integration for luxury watch search
// Docs: https://developer.ebay.com/api-docs/buy/browse/overview.html
//
// To use the real API, set these env vars:
//   VITE_EBAY_APP_ID       – your eBay app ID / client ID
//   VITE_EBAY_AFFILIATE_ID – your eBay Partner Network campaign ID
//
// Until keys are configured, this service falls back to high-quality mock data.

import type { Watch } from './watchService';

const EBAY_APP_ID = import.meta.env.VITE_EBAY_APP_ID || '';
const EBAY_AFFILIATE_ID = import.meta.env.VITE_EBAY_AFFILIATE_ID || '';
const EBAY_API_BASE = 'https://api.ebay.com/buy/browse/v1';
const USE_REAL_API = !!EBAY_APP_ID;

// ——— eBay API Types ———

interface EbayItemSummary {
    itemId: string;
    title: string;
    price: { value: string; currency: string };
    condition: string;
    image?: { imageUrl: string };
    seller: { username: string; feedbackPercentage: string; feedbackScore: number };
    itemWebUrl: string;
    itemAffiliateWebUrl?: string;
    categories?: { categoryId: string; categoryName: string }[];
}

interface EbaySearchResponse {
    total: number;
    itemSummaries: EbayItemSummary[];
}

// ——— Mock Data (used when no API key) ———

const mockEbayListings: Watch[] = [
    {
        id: 10001,
        brand: 'Rolex',
        model: 'Submariner',
        reference: '126610LN',
        price: 12800,
        original_price: null,
        condition: 'Pre-owned',
        seller: 'LuxTimeNY',
        rating: 4.7,
        reviews: 2340,
        marketplace: 'eBay',
        image: null,
        trusted: true,
        year: 2022,
        description: 'Rolex Submariner Date 41mm Black Dial SS - Full Set Box Papers 2022',
        style: 'Sport',
        movement: 'Automatic',
        strap: 'Steel Bracelet',
        avg_price: 13500,
        seller_id: null,
        affiliate_url: 'https://www.ebay.com/itm/example-submariner',
        listing_url: 'https://www.ebay.com/itm/example-submariner',
    },
    {
        id: 10002,
        brand: 'Rolex',
        model: 'Daytona',
        reference: '116500LN',
        price: 29500,
        original_price: null,
        condition: 'Pre-owned',
        seller: 'DavidSW',
        rating: 4.9,
        reviews: 1856,
        marketplace: 'eBay',
        image: null,
        trusted: true,
        year: 2023,
        description: 'Rolex Daytona Ceramic White Dial 116500LN Complete Set 2023',
        style: 'Sport',
        movement: 'Automatic',
        strap: 'Steel Bracelet',
        avg_price: 32000,
        seller_id: null,
        affiliate_url: 'https://www.ebay.com/itm/example-daytona',
        listing_url: 'https://www.ebay.com/itm/example-daytona',
    },
    {
        id: 10003,
        brand: 'Omega',
        model: 'Speedmaster Professional',
        reference: '310.30.42.50.01.001',
        price: 5400,
        original_price: null,
        condition: 'Pre-owned',
        seller: 'AuthenticWatchStore',
        rating: 4.8,
        reviews: 3120,
        marketplace: 'eBay',
        image: null,
        trusted: true,
        year: 2021,
        description: 'Omega Speedmaster Professional Moonwatch Hesalite Manual Wind',
        style: 'Sport',
        movement: 'Manual',
        strap: 'Steel Bracelet',
        avg_price: 6200,
        seller_id: null,
        affiliate_url: 'https://www.ebay.com/itm/example-speedmaster',
        listing_url: 'https://www.ebay.com/itm/example-speedmaster',
    },
    {
        id: 10004,
        brand: 'Tudor',
        model: 'Black Bay 58',
        reference: '79030N',
        price: 3200,
        original_price: null,
        condition: 'Pre-owned',
        seller: 'HQMilton',
        rating: 4.6,
        reviews: 980,
        marketplace: 'eBay',
        image: null,
        trusted: true,
        year: 2023,
        description: 'Tudor Black Bay 58 Navy Blue 39mm Automatic Full Set',
        style: 'Sport',
        movement: 'Automatic',
        strap: 'Fabric Strap',
        avg_price: 3600,
        seller_id: null,
        affiliate_url: 'https://www.ebay.com/itm/example-blackbay',
        listing_url: 'https://www.ebay.com/itm/example-blackbay',
    },
    {
        id: 10005,
        brand: 'Patek Philippe',
        model: 'Nautilus',
        reference: '5711/1A-010',
        price: 125000,
        original_price: null,
        condition: 'Pre-owned',
        seller: 'WatchCentral',
        rating: 4.9,
        reviews: 560,
        marketplace: 'eBay',
        image: null,
        trusted: true,
        year: 2020,
        description: 'Patek Philippe Nautilus 5711 Blue Dial Full Set Discontinued',
        style: 'Dress',
        movement: 'Automatic',
        strap: 'Steel Bracelet',
        avg_price: 130000,
        seller_id: null,
        affiliate_url: 'https://www.ebay.com/itm/example-nautilus',
        listing_url: 'https://www.ebay.com/itm/example-nautilus',
    },
    {
        id: 10006,
        brand: 'Cartier',
        model: 'Santos de Cartier',
        reference: 'WSSA0018',
        price: 6900,
        original_price: null,
        condition: 'Pre-owned',
        seller: 'SwissWatchExpo',
        rating: 4.8,
        reviews: 4250,
        marketplace: 'eBay',
        image: null,
        trusted: true,
        year: 2022,
        description: 'Cartier Santos Medium Silver Dial Steel WSSA0018 2022',
        style: 'Dress',
        movement: 'Automatic',
        strap: 'Steel Bracelet',
        avg_price: 7500,
        seller_id: null,
        affiliate_url: 'https://www.ebay.com/itm/example-santos',
        listing_url: 'https://www.ebay.com/itm/example-santos',
    },
    {
        id: 10007,
        brand: 'IWC',
        model: 'Portugieser Chronograph',
        reference: 'IW371605',
        price: 7800,
        original_price: null,
        condition: 'New',
        seller: 'Watchfinder',
        rating: 4.7,
        reviews: 1680,
        marketplace: 'eBay',
        image: null,
        trusted: true,
        year: 2023,
        description: 'IWC Portugieser Chronograph Blue Dial Alligator Strap New',
        style: 'Dress',
        movement: 'Automatic',
        strap: 'Leather Strap',
        avg_price: 8500,
        seller_id: null,
        affiliate_url: 'https://www.ebay.com/itm/example-portugieser',
        listing_url: 'https://www.ebay.com/itm/example-portugieser',
    },
    {
        id: 10008,
        brand: 'Audemars Piguet',
        model: 'Royal Oak',
        reference: '15500ST.OO.1220ST.01',
        price: 49500,
        original_price: null,
        condition: 'Pre-owned',
        seller: 'BobsWatches_eBay',
        rating: 4.9,
        reviews: 890,
        marketplace: 'eBay',
        image: null,
        trusted: true,
        year: 2021,
        description: 'AP Royal Oak 41mm Blue Dial Stainless Steel 15500ST 2021',
        style: 'Sport',
        movement: 'Automatic',
        strap: 'Steel Bracelet',
        avg_price: 54000,
        seller_id: null,
        affiliate_url: 'https://www.ebay.com/itm/example-royaloak',
        listing_url: 'https://www.ebay.com/itm/example-royaloak',
    },
];

// ——— Public API ———

export async function searchEbay(
    query: string,
    options?: {
        minPrice?: number;
        maxPrice?: number;
        condition?: string;
        limit?: number;
    }
): Promise<Watch[]> {
    if (USE_REAL_API) {
        return searchEbayReal(query, options);
    }
    return searchEbayMock(query, options);
}

// ——— Real eBay API ———

async function searchEbayReal(
    query: string,
    options?: {
        minPrice?: number;
        maxPrice?: number;
        condition?: string;
        limit?: number;
    }
): Promise<Watch[]> {
    const limit = options?.limit || 20;
    const params = new URLSearchParams({
        q: `luxury watch ${query}`,
        category_ids: '31387', // Wristwatches category
        limit: String(limit),
        sort: 'price',
    });

    // Price filter
    if (options?.minPrice || options?.maxPrice) {
        const filters: string[] = [];
        if (options.minPrice) filters.push(`price:[${options.minPrice}..`);
        if (options.maxPrice) {
            if (filters.length) {
                filters[0] = `price:[${options.minPrice}..${options.maxPrice}]`;
            } else {
                filters.push(`price:[..${options.maxPrice}]`);
            }
        }
        params.set('filter', filters.join(','));
    }

    // Affiliate tracking
    if (EBAY_AFFILIATE_ID) {
        params.set('X-EBAY-C-ENRICH-PARAMS', `affiliate_campaign_id=${EBAY_AFFILIATE_ID}`);
    }

    try {
        const response = await fetch(`${EBAY_API_BASE}/item_summary/search?${params}`, {
            headers: {
                'Authorization': `Bearer ${EBAY_APP_ID}`,
                'X-EBAY-C-MARKETPLACE-ID': 'EBAY_US',
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            console.warn('eBay API error, falling back to mock:', response.status);
            return searchEbayMock(query, options);
        }

        const data: EbaySearchResponse = await response.json();
        return (data.itemSummaries || []).map(mapEbayItem);
    } catch (error) {
        console.warn('eBay API fetch failed, falling back to mock:', error);
        return searchEbayMock(query, options);
    }
}

function mapEbayItem(item: EbayItemSummary): Watch {
    // Try to parse brand and model from title
    const { brand, model, reference } = parseWatchTitle(item.title);

    return {
        id: parseInt(item.itemId.replace(/\D/g, '').slice(-8)) || Math.random() * 100000,
        brand,
        model,
        reference,
        price: parseFloat(item.price.value),
        original_price: null,
        condition: item.condition || 'Pre-owned',
        seller: item.seller.username,
        rating: parseFloat(item.seller.feedbackPercentage) / 20, // Convert % to 5-star
        reviews: item.seller.feedbackScore,
        marketplace: 'eBay',
        image: item.image?.imageUrl || null,
        trusted: parseFloat(item.seller.feedbackPercentage) >= 98,
        year: null,
        description: item.title,
        style: null,
        movement: null,
        strap: null,
        avg_price: null,
        seller_id: null,
        affiliate_url: item.itemAffiliateWebUrl || item.itemWebUrl,
        listing_url: item.itemWebUrl,
    };
}

function parseWatchTitle(title: string): { brand: string; model: string; reference: string } {
    const brands = ['Rolex', 'Omega', 'Patek Philippe', 'Audemars Piguet', 'Tudor', 'IWC', 'Cartier',
        'Breitling', 'Hublot', 'TAG Heuer', 'Panerai', 'Jaeger-LeCoultre', 'Vacheron Constantin',
        'A. Lange & Söhne', 'Grand Seiko', 'Zenith', 'Chopard'];

    let brand = 'Unknown';
    for (const b of brands) {
        if (title.toLowerCase().includes(b.toLowerCase())) {
            brand = b;
            break;
        }
    }

    // Try to extract reference number (e.g., 126610LN, 310.30.42.50.01.001)
    const refMatch = title.match(/\b([A-Z0-9]{3,}[.-]?[A-Z0-9]*(?:\.[A-Z0-9]+)*)\b/i);
    const reference = refMatch ? refMatch[1] : '';

    // Model is what's left after brand, cleaned up
    const model = title.replace(new RegExp(brand, 'i'), '').replace(reference, '').trim().split(',')[0]?.trim() || title;

    return { brand, model: model.substring(0, 50), reference };
}

// ——— Mock Fallback ———

async function searchEbayMock(
    query: string,
    options?: {
        minPrice?: number;
        maxPrice?: number;
        condition?: string;
        limit?: number;
    }
): Promise<Watch[]> {
    await delay(400);
    const term = query.toLowerCase().trim();
    let results = [...mockEbayListings];

    if (term) {
        results = results.filter(w =>
            w.brand.toLowerCase().includes(term) ||
            w.model.toLowerCase().includes(term) ||
            w.reference.toLowerCase().includes(term) ||
            (w.description || '').toLowerCase().includes(term)
        );
    }

    if (options?.minPrice) results = results.filter(w => w.price >= options.minPrice!);
    if (options?.maxPrice) results = results.filter(w => w.price <= options.maxPrice!);
    if (options?.condition) results = results.filter(w => w.condition === options.condition);

    return results.slice(0, options?.limit || 20);
}

function delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// src/services/platformMockService.ts
//
// INTEGRATION GUIDE
// -----------------
// Each platform is exposed via a simple async search(query) => Watch[] function.
// Currently all return mock data. To integrate a real API:
//
//   1. Create the real fetcher (e.g. fetchChrono24Real) that maps the API response
//      into the Watch type (see watchService.ts for the full type).
//   2. Add an env var check (like ebayService.ts does with VITE_EBAY_APP_ID).
//   3. In the corresponding search function below, call the real fetcher when
//      the env var is set, and fall back to the mock otherwise.
//
// This pattern is identical to how ebayService.ts already works.
// -----------------

import type { Watch } from './watchService';

// ——— Platform Adapter Interface ———
// Implement this interface when adding a real API integration.

export interface PlatformAdapter {
    name: string;
    search: (query: string, options?: { minPrice?: number; maxPrice?: number; condition?: string }) => Promise<Watch[]>;
}

// Registry of all platform adapters (used by watchService.searchAllPlatforms)
export function getAllAdapters(): PlatformAdapter[] {
    return [
        { name: 'Chrono24', search: searchChrono24 },
        { name: 'WatchBox', search: searchWatchBox },
        { name: "Bob's Watches", search: searchBobsWatches },
        { name: 'Hodinkee', search: searchHodinkee },
        { name: 'Crown & Caliber', search: searchCrownCaliber },
    ];
}

// ——— Chrono24 Mock ———

const chrono24Listings: Watch[] = [
    {
        id: 20001, brand: 'Rolex', model: 'Submariner', reference: '126610LN',
        price: 13200, original_price: null, condition: 'Excellent', seller: 'WatchMaster DE',
        rating: 4.9, reviews: 4521, marketplace: 'Chrono24', image: null, trusted: true,
        year: 2023, description: 'Rolex Submariner Date 41mm Black Dial Complete Set',
        style: 'Sport', movement: 'Automatic', strap: 'Steel Bracelet',
        avg_price: 13800, seller_id: null,
        affiliate_url: 'https://www.chrono24.com/rolex/submariner--id-example1.htm',
        listing_url: 'https://www.chrono24.com/rolex/submariner--id-example1.htm',
    },
    {
        id: 20002, brand: 'Rolex', model: 'Daytona', reference: '116500LN',
        price: 31200, original_price: null, condition: 'Very Good', seller: 'Uhren2000',
        rating: 4.8, reviews: 3200, marketplace: 'Chrono24', image: null, trusted: true,
        year: 2022, description: 'Rolex Daytona Ceramic White Panda Dial Steel',
        style: 'Sport', movement: 'Automatic', strap: 'Steel Bracelet',
        avg_price: 32000, seller_id: null,
        affiliate_url: 'https://www.chrono24.com/rolex/daytona--id-example2.htm',
        listing_url: 'https://www.chrono24.com/rolex/daytona--id-example2.htm',
    },
    {
        id: 20003, brand: 'Omega', model: 'Speedmaster Professional', reference: '310.30.42.50.01.001',
        price: 5900, original_price: null, condition: 'Excellent', seller: 'Watchdeal KG',
        rating: 4.9, reviews: 2100, marketplace: 'Chrono24', image: null, trusted: true,
        year: 2022, description: 'Omega Speedmaster Professional Moonwatch Hesalite',
        style: 'Sport', movement: 'Manual', strap: 'Steel Bracelet',
        avg_price: 6200, seller_id: null,
        affiliate_url: 'https://www.chrono24.com/omega/speedmaster--id-example3.htm',
        listing_url: 'https://www.chrono24.com/omega/speedmaster--id-example3.htm',
    },
    {
        id: 20004, brand: 'IWC', model: 'Portugieser Chronograph', reference: 'IW371605',
        price: 8200, original_price: null, condition: 'New', seller: 'Montredo GmbH',
        rating: 4.8, reviews: 1800, marketplace: 'Chrono24', image: null, trusted: true,
        year: 2024, description: 'IWC Portugieser Chronograph Blue Dial New Full Set',
        style: 'Dress', movement: 'Automatic', strap: 'Leather Strap',
        avg_price: 8800, seller_id: null,
        affiliate_url: 'https://www.chrono24.com/iwc/portugieser--id-example4.htm',
        listing_url: 'https://www.chrono24.com/iwc/portugieser--id-example4.htm',
    },
    {
        id: 20005, brand: 'Cartier', model: 'Santos de Cartier', reference: 'WSSA0018',
        price: 7200, original_price: null, condition: 'Excellent', seller: 'Prestige Time LLC',
        rating: 4.7, reviews: 1500, marketplace: 'Chrono24', image: null, trusted: true,
        year: 2023, description: 'Cartier Santos Medium White Dial SS',
        style: 'Dress', movement: 'Automatic', strap: 'Steel Bracelet',
        avg_price: 7500, seller_id: null,
        affiliate_url: 'https://www.chrono24.com/cartier/santos--id-example5.htm',
        listing_url: 'https://www.chrono24.com/cartier/santos--id-example5.htm',
    },
];

// ——— WatchBox Mock ———

const watchBoxListings: Watch[] = [
    {
        id: 30001, brand: 'Rolex', model: 'Submariner', reference: '126610LN',
        price: 13500, original_price: 14200, condition: 'Very Good', seller: 'WatchBox',
        rating: 4.8, reviews: 8900, marketplace: 'WatchBox', image: null, trusted: true,
        year: 2022, description: 'Rolex Submariner Date 41mm, WatchBox Certified Pre-Owned',
        style: 'Sport', movement: 'Automatic', strap: 'Steel Bracelet',
        avg_price: 13800, seller_id: null,
        affiliate_url: 'https://www.thewatchbox.com/watches/rolex-example1',
        listing_url: 'https://www.thewatchbox.com/watches/rolex-example1',
    },
    {
        id: 30002, brand: 'Omega', model: 'Seamaster 300M', reference: '210.30.42.20.03.001',
        price: 4600, original_price: 5200, condition: 'Excellent', seller: 'WatchBox',
        rating: 4.8, reviews: 8900, marketplace: 'WatchBox', image: null, trusted: true,
        year: 2022, description: 'Omega Seamaster Diver 300M Blue Dial Steel',
        style: 'Sport', movement: 'Automatic', strap: 'Steel Bracelet',
        avg_price: 5100, seller_id: null,
        affiliate_url: 'https://www.thewatchbox.com/watches/omega-example2',
        listing_url: 'https://www.thewatchbox.com/watches/omega-example2',
    },
    {
        id: 30003, brand: 'Tudor', model: 'Black Bay 58', reference: '79030N',
        price: 3450, original_price: 3800, condition: 'Excellent', seller: 'WatchBox',
        rating: 4.8, reviews: 8900, marketplace: 'WatchBox', image: null, trusted: true,
        year: 2023, description: 'Tudor Black Bay Fifty-Eight Navy Blue 39mm',
        style: 'Sport', movement: 'Automatic', strap: 'Fabric Strap',
        avg_price: 3600, seller_id: null,
        affiliate_url: 'https://www.thewatchbox.com/watches/tudor-example3',
        listing_url: 'https://www.thewatchbox.com/watches/tudor-example3',
    },
];

// ——— Bob's Watches Mock ———

const bobsListings: Watch[] = [
    {
        id: 40001, brand: 'Rolex', model: 'Submariner', reference: '126610LN',
        price: 13750, original_price: null, condition: 'Excellent', seller: "Bob's Watches",
        rating: 4.9, reviews: 12000, marketplace: "Bob's Watches", image: null, trusted: true,
        year: 2023, description: 'Rolex Submariner Date Black Dial Full Set 2023',
        style: 'Sport', movement: 'Automatic', strap: 'Steel Bracelet',
        avg_price: 13800, seller_id: null,
        affiliate_url: 'https://www.bobswatches.com/rolex/submariner-example1',
        listing_url: 'https://www.bobswatches.com/rolex/submariner-example1',
    },
    {
        id: 40002, brand: 'Rolex', model: 'GMT-Master II', reference: '126710BLRO',
        price: 17200, original_price: null, condition: 'Excellent', seller: "Bob's Watches",
        rating: 4.9, reviews: 12000, marketplace: "Bob's Watches", image: null, trusted: true,
        year: 2023, description: 'Rolex GMT-Master II Pepsi Jubilee 2023',
        style: 'Sport', movement: 'Automatic', strap: 'Jubilee Bracelet',
        avg_price: 18000, seller_id: null,
        affiliate_url: 'https://www.bobswatches.com/rolex/gmt-master-example2',
        listing_url: 'https://www.bobswatches.com/rolex/gmt-master-example2',
    },
];

// ——— Hodinkee Mock ———

const hodinkeeListings: Watch[] = [
    {
        id: 50001, brand: 'Omega', model: 'Speedmaster Professional', reference: '310.30.42.50.01.001',
        price: 6100, original_price: null, condition: 'Excellent', seller: 'Hodinkee Shop',
        rating: 4.9, reviews: 3400, marketplace: 'Hodinkee', image: null, trusted: true,
        year: 2022, description: 'Omega Speedmaster Professional Moonwatch — Hodinkee Certified',
        style: 'Sport', movement: 'Manual', strap: 'Steel Bracelet',
        avg_price: 6200, seller_id: null,
        affiliate_url: 'https://shop.hodinkee.com/products/omega-speedmaster-example1',
        listing_url: 'https://shop.hodinkee.com/products/omega-speedmaster-example1',
    },
    {
        id: 50002, brand: 'Cartier', model: 'Tank Must', reference: 'WSTA0065',
        price: 3200, original_price: null, condition: 'New', seller: 'Hodinkee Shop',
        rating: 4.9, reviews: 3400, marketplace: 'Hodinkee', image: null, trusted: true,
        year: 2024, description: 'Cartier Tank Must Large Silver Dial Leather — New',
        style: 'Dress', movement: 'Quartz', strap: 'Leather Strap',
        avg_price: 3400, seller_id: null,
        affiliate_url: 'https://shop.hodinkee.com/products/cartier-tank-example2',
        listing_url: 'https://shop.hodinkee.com/products/cartier-tank-example2',
    },
];

// ——— Crown & Caliber Mock ———

const crownCalibreListings: Watch[] = [
    {
        id: 60001, brand: 'Rolex', model: 'Datejust 41', reference: '126334',
        price: 11200, original_price: 12500, condition: 'Excellent', seller: 'Crown & Caliber',
        rating: 4.8, reviews: 6700, marketplace: 'Crown & Caliber', image: null, trusted: true,
        year: 2022, description: 'Rolex Datejust 41 Blue Dial Fluted Jubilee',
        style: 'Dress', movement: 'Automatic', strap: 'Jubilee Bracelet',
        avg_price: 12000, seller_id: null,
        affiliate_url: 'https://www.crownandcaliber.com/products/rolex-datejust-example1',
        listing_url: 'https://www.crownandcaliber.com/products/rolex-datejust-example1',
    },
    {
        id: 60002, brand: 'Omega', model: 'Seamaster 300M', reference: '210.30.42.20.03.001',
        price: 4800, original_price: 5500, condition: 'Very Good', seller: 'Crown & Caliber',
        rating: 4.8, reviews: 6700, marketplace: 'Crown & Caliber', image: null, trusted: true,
        year: 2021, description: 'Omega Seamaster Diver 300M Blue Dial',
        style: 'Sport', movement: 'Automatic', strap: 'Steel Bracelet',
        avg_price: 5100, seller_id: null,
        affiliate_url: 'https://www.crownandcaliber.com/products/omega-seamaster-example2',
        listing_url: 'https://www.crownandcaliber.com/products/omega-seamaster-example2',
    },
];

// ——— Public API ———

export async function searchChrono24(query: string): Promise<Watch[]> {
    await delay(350);
    return filterByQuery(chrono24Listings, query);
}

export async function searchWatchBox(query: string): Promise<Watch[]> {
    await delay(250);
    return filterByQuery(watchBoxListings, query);
}

export async function searchBobsWatches(query: string): Promise<Watch[]> {
    await delay(300);
    return filterByQuery(bobsListings, query);
}

export async function searchHodinkee(query: string): Promise<Watch[]> {
    await delay(200);
    return filterByQuery(hodinkeeListings, query);
}

export async function searchCrownCaliber(query: string): Promise<Watch[]> {
    await delay(280);
    return filterByQuery(crownCalibreListings, query);
}

export function getAllPlatformNames(): string[] {
    return ['eBay', 'Chrono24', 'WatchBox', "Bob's Watches", 'Hodinkee', 'Crown & Caliber'];
}

// ——— Helpers ———

function filterByQuery(listings: Watch[], query: string): Watch[] {
    if (!query.trim()) return [...listings];
    const term = query.toLowerCase().trim();
    return listings.filter(w =>
        w.brand.toLowerCase().includes(term) ||
        w.model.toLowerCase().includes(term) ||
        w.reference.toLowerCase().includes(term) ||
        (w.description || '').toLowerCase().includes(term)
    );
}

function delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

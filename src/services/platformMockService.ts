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
import { supabase } from '@/integrations/supabase/client';

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
        { name: 'StockX', search: searchStockX },
        { name: 'WatchBox', search: searchWatchBox },
        { name: "Bob's Watches", search: searchBobsWatches },
        { name: 'Bezel', search: searchBezel },
        { name: 'Hodinkee', search: searchHodinkee },
        { name: 'Crown & Caliber', search: searchCrownCaliber },
        { name: 'Vetted Dealers', search: searchVettedDealers },
    ];
}

// ——— Database Search (uses scraped data from Firecrawl) ———

async function searchFromDatabase(marketplace: string, query: string): Promise<Watch[] | null> {
    try {
        let dbQuery = supabase
            .from('watches')
            .select('*')
            .eq('marketplace', marketplace)
            .limit(50);

        if (query.trim()) {
            dbQuery = dbQuery.or(`brand.ilike.%${query}%,model.ilike.%${query}%,description.ilike.%${query}%`);
        }

        const { data, error } = await dbQuery;

        if (error || !data || data.length === 0) {
            return null; // No scraped data — will fall back to mock
        }

        return data as unknown as Watch[];
    } catch {
        return null;
    }
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

// ——— Vetted Dealers Mock ———

const vettedDealerListings: Watch[] = [
    {
        id: 70001, brand: 'Rolex', model: 'Submariner', reference: '126610LN',
        price: 12900, original_price: null, condition: 'Excellent', seller: 'Great Discount Watches',
        rating: 4.8, reviews: 850, marketplace: 'Vetted Dealers', image: null, trusted: true,
        year: 2023, description: 'Rolex Submariner Date 41mm Black Dial Full Set — Vetted Dealer',
        style: 'Sport', movement: 'Automatic', strap: 'Steel Bracelet',
        avg_price: 13500, seller_id: null,
        affiliate_url: null, listing_url: null,
    },
    {
        id: 70002, brand: 'Rolex', model: 'Daytona', reference: '116500LN',
        price: 28500, original_price: null, condition: 'Pre-owned', seller: 'Del Rey Luxx',
        rating: 4.9, reviews: 420, marketplace: 'Vetted Dealers', image: null, trusted: true,
        year: 2022, description: 'Rolex Daytona Ceramic White Panda Dial Complete Set 2022',
        style: 'Sport', movement: 'Automatic', strap: 'Steel Bracelet',
        avg_price: 32000, seller_id: null,
        affiliate_url: null, listing_url: null,
    },
    {
        id: 70003, brand: 'Omega', model: 'Speedmaster Professional', reference: '310.30.42.50.01.001',
        price: 5200, original_price: null, condition: 'Very Good', seller: 'Loucri Jewelers',
        rating: 4.7, reviews: 1200, marketplace: 'Vetted Dealers', image: null, trusted: true,
        year: 2021, description: 'Omega Speedmaster Professional Moonwatch Hesalite Crystal',
        style: 'Sport', movement: 'Manual', strap: 'Steel Bracelet',
        avg_price: 6200, seller_id: null,
        affiliate_url: null, listing_url: null,
    },
    {
        id: 70004, brand: 'Audemars Piguet', model: 'Royal Oak', reference: '15500ST.OO.1220ST.01',
        price: 47500, original_price: null, condition: 'Excellent', seller: 'Time Trade & Trust',
        rating: 4.8, reviews: 380, marketplace: 'Vetted Dealers', image: null, trusted: true,
        year: 2021, description: 'AP Royal Oak 41mm Blue Dial Stainless Steel Complete',
        style: 'Sport', movement: 'Automatic', strap: 'Steel Bracelet',
        avg_price: 52000, seller_id: null,
        affiliate_url: null, listing_url: null,
    },
    {
        id: 70005, brand: 'Patek Philippe', model: 'Nautilus', reference: '5711/1A-010',
        price: 118000, original_price: null, condition: 'Excellent', seller: 'AE Vanderbilt',
        rating: 4.9, reviews: 210, marketplace: 'Vetted Dealers', image: null, trusted: true,
        year: 2020, description: 'Patek Philippe Nautilus 5711 Blue Dial Discontinued Full Set',
        style: 'Dress', movement: 'Automatic', strap: 'Steel Bracelet',
        avg_price: 128000, seller_id: null,
        affiliate_url: null, listing_url: null,
    },
    {
        id: 70006, brand: 'Rolex', model: 'GMT-Master II', reference: '126710BLRO',
        price: 16800, original_price: null, condition: 'Excellent', seller: 'Watermark Watches',
        rating: 4.7, reviews: 560, marketplace: 'Vetted Dealers', image: null, trusted: true,
        year: 2023, description: 'Rolex GMT-Master II Pepsi Jubilee Bracelet 2023',
        style: 'Sport', movement: 'Automatic', strap: 'Jubilee Bracelet',
        avg_price: 17500, seller_id: null,
        affiliate_url: null, listing_url: null,
    },
    {
        id: 70007, brand: 'Cartier', model: 'Santos de Cartier', reference: 'WSSA0018',
        price: 6600, original_price: null, condition: 'Excellent', seller: 'thesecondhandclub',
        rating: 4.6, reviews: 340, marketplace: 'Vetted Dealers', image: null, trusted: true,
        year: 2023, description: 'Cartier Santos Medium White Dial SS QuickSwitch Full Set',
        style: 'Dress', movement: 'Automatic', strap: 'Steel Bracelet',
        avg_price: 7200, seller_id: null,
        affiliate_url: null, listing_url: null,
    },
    {
        id: 70008, brand: 'Tudor', model: 'Black Bay 58', reference: '79030N',
        price: 3100, original_price: null, condition: 'Very Good', seller: 'Luxury Watch Buyer',
        rating: 4.7, reviews: 680, marketplace: 'Vetted Dealers', image: null, trusted: true,
        year: 2022, description: 'Tudor Black Bay Fifty-Eight Navy Blue 39mm Automatic',
        style: 'Sport', movement: 'Automatic', strap: 'Fabric Strap',
        avg_price: 3500, seller_id: null,
        affiliate_url: null, listing_url: null,
    },
    {
        id: 70009, brand: 'IWC', model: 'Portugieser Chronograph', reference: 'IW371605',
        price: 7400, original_price: null, condition: 'Excellent', seller: 'The Sutor House',
        rating: 4.8, reviews: 290, marketplace: 'Vetted Dealers', image: null, trusted: true,
        year: 2023, description: 'IWC Portugieser Chronograph Blue Dial Alligator Strap',
        style: 'Dress', movement: 'Automatic', strap: 'Leather Strap',
        avg_price: 8200, seller_id: null,
        affiliate_url: null, listing_url: null,
    },
    {
        id: 70010, brand: 'Rolex', model: 'Datejust 41', reference: '126334',
        price: 10800, original_price: null, condition: 'Very Good', seller: 'Ademato Jewelry',
        rating: 4.6, reviews: 480, marketplace: 'Vetted Dealers', image: null, trusted: true,
        year: 2022, description: 'Rolex Datejust 41 Blue Dial Fluted Bezel Jubilee',
        style: 'Dress', movement: 'Automatic', strap: 'Jubilee Bracelet',
        avg_price: 11500, seller_id: null,
        affiliate_url: null, listing_url: null,
    },
    {
        id: 70011, brand: 'Omega', model: 'Seamaster 300M', reference: '210.30.42.20.03.001',
        price: 4350, original_price: null, condition: 'Excellent', seller: 'Watch Gang',
        rating: 4.5, reviews: 920, marketplace: 'Vetted Dealers', image: null, trusted: true,
        year: 2022, description: 'Omega Seamaster Diver 300M Blue Dial Steel Bracelet',
        style: 'Sport', movement: 'Automatic', strap: 'Steel Bracelet',
        avg_price: 4800, seller_id: null,
        affiliate_url: null, listing_url: null,
    },
    {
        id: 70012, brand: 'Rolex', model: 'Submariner', reference: '126610LN',
        price: 13100, original_price: null, condition: 'Pre-owned', seller: 'Second Time Trading',
        rating: 4.7, reviews: 350, marketplace: 'Vetted Dealers', image: null, trusted: true,
        year: 2021, description: 'Rolex Submariner Date 41mm Black Ceramic Bezel 2021',
        style: 'Sport', movement: 'Automatic', strap: 'Steel Bracelet',
        avg_price: 13500, seller_id: null,
        affiliate_url: null, listing_url: null,
    },
    {
        id: 70013, brand: 'Breitling', model: 'Navitimer', reference: 'AB0120',
        price: 6200, original_price: null, condition: 'Very Good', seller: 'Motion in Time',
        rating: 4.8, reviews: 1100, marketplace: 'Vetted Dealers', image: null, trusted: true,
        year: 2022, description: 'Breitling Navitimer B01 Chronograph 43mm Blue Dial',
        style: 'Sport', movement: 'Automatic', strap: 'Leather Strap',
        avg_price: 7000, seller_id: null,
        affiliate_url: null, listing_url: null,
    },
    {
        id: 70014, brand: 'Rolex', model: 'Day-Date 40', reference: '228238',
        price: 34000, original_price: null, condition: 'Excellent', seller: 'HauteCarat',
        rating: 4.9, reviews: 180, marketplace: 'Vetted Dealers', image: null, trusted: true,
        year: 2023, description: 'Rolex Day-Date 40 Yellow Gold Champagne Dial President',
        style: 'Dress', movement: 'Automatic', strap: 'President Bracelet',
        avg_price: 36000, seller_id: null,
        affiliate_url: null, listing_url: null,
    },
    {
        id: 70015, brand: 'Omega', model: 'Speedmaster Professional', reference: '310.30.42.50.01.001',
        price: 5500, original_price: null, condition: 'Excellent', seller: 'BDHD',
        rating: 4.6, reviews: 440, marketplace: 'Vetted Dealers', image: null, trusted: true,
        year: 2023, description: 'Omega Speedmaster Moonwatch Hesalite Full Set 2023',
        style: 'Sport', movement: 'Manual', strap: 'Steel Bracelet',
        avg_price: 6200, seller_id: null,
        affiliate_url: null, listing_url: null,
    },
    {
        id: 70016, brand: 'Rolex', model: 'Explorer II', reference: '226570',
        price: 9800, original_price: null, condition: 'Excellent', seller: 'G&C Watches',
        rating: 4.7, reviews: 520, marketplace: 'Vetted Dealers', image: null, trusted: true,
        year: 2022, description: 'Rolex Explorer II 42mm White Polar Dial Steel 2022',
        style: 'Sport', movement: 'Automatic', strap: 'Steel Bracelet',
        avg_price: 10500, seller_id: null,
        affiliate_url: null, listing_url: null,
    },
    {
        id: 70017, brand: 'Tudor', model: 'Pelagos', reference: '25600TN',
        price: 3800, original_price: null, condition: 'Very Good', seller: 'Belor Time Legacy',
        rating: 4.6, reviews: 290, marketplace: 'Vetted Dealers', image: null, trusted: true,
        year: 2022, description: 'Tudor Pelagos 42mm Titanium Blue Dial Automatic',
        style: 'Sport', movement: 'Automatic', strap: 'Titanium Bracelet',
        avg_price: 4200, seller_id: null,
        affiliate_url: null, listing_url: null,
    },
    {
        id: 70018, brand: 'Panerai', model: 'Luminor Marina', reference: 'PAM01312',
        price: 7100, original_price: null, condition: 'Excellent', seller: 'Icelinkwatch',
        rating: 4.5, reviews: 380, marketplace: 'Vetted Dealers', image: null, trusted: true,
        year: 2023, description: 'Panerai Luminor Marina 44mm Blue Dial Automatic',
        style: 'Sport', movement: 'Automatic', strap: 'Leather Strap',
        avg_price: 8000, seller_id: null,
        affiliate_url: null, listing_url: null,
    },
    {
        id: 70019, brand: 'Cartier', model: 'Tank Must', reference: 'WSTA0065',
        price: 2900, original_price: null, condition: 'Excellent', seller: 'Oliver and Clarke',
        rating: 4.7, reviews: 310, marketplace: 'Vetted Dealers', image: null, trusted: true,
        year: 2024, description: 'Cartier Tank Must Large Silver Dial Leather Strap',
        style: 'Dress', movement: 'Quartz', strap: 'Leather Strap',
        avg_price: 3300, seller_id: null,
        affiliate_url: null, listing_url: null,
    },
    {
        id: 70020, brand: 'Rolex', model: 'Submariner', reference: '126610LN',
        price: 12700, original_price: null, condition: 'Very Good', seller: 'We Sell You Save',
        rating: 4.6, reviews: 640, marketplace: 'Vetted Dealers', image: null, trusted: true,
        year: 2022, description: 'Rolex Submariner Date 41mm Black Dial — Great Value',
        style: 'Sport', movement: 'Automatic', strap: 'Steel Bracelet',
        avg_price: 13500, seller_id: null,
        affiliate_url: null, listing_url: null,
    },
    {
        id: 70021, brand: 'Rolex', model: 'Daytona', reference: '116500LN',
        price: 29800, original_price: null, condition: 'Excellent', seller: 'thestellariscollection.com',
        rating: 4.8, reviews: 190, marketplace: 'Vetted Dealers', image: null, trusted: true,
        year: 2023, description: 'Rolex Daytona Cosmograph White Dial 2023 Unworn',
        style: 'Sport', movement: 'Automatic', strap: 'Steel Bracelet',
        avg_price: 31000, seller_id: null,
        affiliate_url: null, listing_url: null,
    },
];

// ——— Public API ———

export async function searchChrono24(query: string): Promise<Watch[]> {
    const dbResults = await searchFromDatabase('Chrono24', query);
    if (dbResults) return dbResults;
    await delay(350);
    return filterByQuery(chrono24Listings, query);
}

export async function searchStockX(query: string): Promise<Watch[]> {
    const dbResults = await searchFromDatabase('StockX', query);
    if (dbResults) return dbResults;
    return []; // No mock data for StockX — will be populated by scraper
}

export async function searchWatchBox(query: string): Promise<Watch[]> {
    const dbResults = await searchFromDatabase('WatchBox', query);
    if (dbResults) return dbResults;
    await delay(250);
    return filterByQuery(watchBoxListings, query);
}

export async function searchBobsWatches(query: string): Promise<Watch[]> {
    const dbResults = await searchFromDatabase("Bob's Watches", query);
    if (dbResults) return dbResults;
    await delay(300);
    return filterByQuery(bobsListings, query);
}

export async function searchBezel(query: string): Promise<Watch[]> {
    const dbResults = await searchFromDatabase('Bezel', query);
    if (dbResults) return dbResults;
    return []; // No mock data for Bezel — will be populated by scraper
}

export async function searchHodinkee(query: string): Promise<Watch[]> {
    const dbResults = await searchFromDatabase('Hodinkee', query);
    if (dbResults) return dbResults;
    await delay(200);
    return filterByQuery(hodinkeeListings, query);
}

export async function searchCrownCaliber(query: string): Promise<Watch[]> {
    const dbResults = await searchFromDatabase('Crown & Caliber', query);
    if (dbResults) return dbResults;
    await delay(280);
    return filterByQuery(crownCalibreListings, query);
}

export async function searchVettedDealers(query: string): Promise<Watch[]> {
    const dbResults = await searchFromDatabase('Vetted Dealers', query);
    if (dbResults) return dbResults;
    await delay(200);
    return filterByQuery(vettedDealerListings, query);
}

export function getAllPlatformNames(): string[] {
    return ['eBay', 'Chrono24', 'StockX', 'WatchBox', "Bob's Watches", 'Bezel', 'Hodinkee', 'Crown & Caliber', 'Vetted Dealers'];
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

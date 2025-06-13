
export interface WatchImage {
  url: string;
  alt: string;
  width: number;
  height: number;
}

// High-quality watch images from Unsplash
const watchImageMap: Record<string, WatchImage> = {
  // Rolex Submariner
  '126610LN': {
    url: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=400&h=400&fit=crop&crop=center',
    alt: 'Rolex Submariner Date Black',
    width: 400,
    height: 400
  },
  // Omega Speedmaster
  '310.30.42.50.01.001': {
    url: 'https://images.unsplash.com/photo-1594576662848-c9f2e8a6d8ec?w=400&h=400&fit=crop&crop=center',
    alt: 'Omega Speedmaster Professional',
    width: 400,
    height: 400
  },
  // Tudor Black Bay
  '79030N': {
    url: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=400&h=400&fit=crop&crop=center',
    alt: 'Tudor Black Bay 58 Navy',
    width: 400,
    height: 400
  },
  // Cartier Santos
  'WSSA0029': {
    url: 'https://images.unsplash.com/photo-1608746980874-be3b47c3ffc6?w=400&h=400&fit=crop&crop=center',
    alt: 'Cartier Santos Medium',
    width: 400,
    height: 400
  },
  // Patek Philippe Nautilus
  '5711/1A-010': {
    url: 'https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=400&h=400&fit=crop&crop=center',
    alt: 'Patek Philippe Nautilus Blue',
    width: 400,
    height: 400
  },
  // AP Royal Oak
  '15400ST.OO.1220ST.01': {
    url: 'https://images.unsplash.com/photo-1609587312208-cea54be969d7?w=400&h=400&fit=crop&crop=center',
    alt: 'Audemars Piguet Royal Oak',
    width: 400,
    height: 400
  },
  // Rolex GMT Master II
  '126710BLNR': {
    url: 'https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?w=400&h=400&fit=crop&crop=center',
    alt: 'Rolex GMT Master II Batman',
    width: 400,
    height: 400
  },
  // Omega Seamaster
  '215.30.44.21.01.001': {
    url: 'https://images.unsplash.com/photo-1606765567035-0bd0a68b5be0?w=400&h=400&fit=crop&crop=center',
    alt: 'Omega Seamaster Planet Ocean',
    width: 400,
    height: 400
  }
};

export const getWatchImage = (reference: string): WatchImage => {
  return watchImageMap[reference] || {
    url: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=400&h=400&fit=crop&crop=center',
    alt: 'Luxury Watch',
    width: 400,
    height: 400
  };
};

export const preloadWatchImage = (reference: string): void => {
  const image = getWatchImage(reference);
  const img = new Image();
  img.src = image.url;
};

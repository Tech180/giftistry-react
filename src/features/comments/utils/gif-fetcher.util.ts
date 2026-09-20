import type { GifItem } from '../interfaces/gif-item.interface';

export async function fetchGifs(query: string): Promise<GifItem[]> {
  const apiKey = (import.meta.env?.VITE_GIPHY_API_KEY) || 'dc6zaTOxFJmzC';
  const cleanQuery = query.trim();

  const url = cleanQuery
    ? `https://api.giphy.com/v1/gifs/search?api_key=${apiKey}&q=${encodeURIComponent(cleanQuery)}&limit=12`
    : `https://api.giphy.com/v1/gifs/trending?api_key=${apiKey}&limit=12`;

  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(`GIPHY API responded with status: ${res.status}`);
  }

  const data = await res.json();

  if (!data?.data?.length) {
    return [];
  }

  return data.data.map(
    (item: {
      id: string;
      title: string;
      images: { fixed_height_small: { url: string }; 
      original: { url: string } 
    };
  }) => ({
    id: item.id,
    url: item.images.fixed_height_small.url,
    originalUrl: item.images.original.url,
    title: item.title,
  }));
}

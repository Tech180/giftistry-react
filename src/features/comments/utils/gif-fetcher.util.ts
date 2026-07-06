export interface GifItem {
  id: string;
  url: string;
  originalUrl: string;
  title: string;
}

const MOCK_GIFS: GifItem[] = [
  { id: '1', title: 'Celebrate Minions', url: 'https://media.giphy.com/media/26tOZ42cX5VIFGv6M/giphy.gif', originalUrl: 'https://media.giphy.com/media/26tOZ42cX5VIFGv6M/giphy.gif' },
  { id: '2', title: 'DiCaprio Clapping', url: 'https://media.giphy.com/media/13GKP7ACGjJOGQ/giphy.gif', originalUrl: 'https://media.giphy.com/media/13GKP7ACGjJOGQ/giphy.gif' },
  { id: '3', title: 'Thumbs Up', url: 'https://media.giphy.com/media/3o7abKhOpuahi9b1CI/giphy.gif', originalUrl: 'https://media.giphy.com/media/3o7abKhOpuahi9b1CI/giphy.gif' },
  { id: '4', title: 'Laughing Out Loud', url: 'https://media.giphy.com/media/26n6Gx9moCVPcQq9W/giphy.gif', originalUrl: 'https://media.giphy.com/media/26n6Gx9moCVPcQq9W/giphy.gif' },
  { id: '5', title: 'Wow Surprised', url: 'https://media.giphy.com/media/3o72F8t9TDi2xVnxOE/giphy.gif', originalUrl: 'https://media.giphy.com/media/3o72F8t9TDi2xVnxOE/giphy.gif' },
  { id: '6', title: 'Happy Dance', url: 'https://media.giphy.com/media/l3vRlT56y5xKLbbTa/giphy.gif', originalUrl: 'https://media.giphy.com/media/l3vRlT56y5xKLbbTa/giphy.gif' },
  { id: '7', title: 'Yes nodding', url: 'https://media.giphy.com/media/3oeSAD0Wx121Q5qZy8/giphy.gif', originalUrl: 'https://media.giphy.com/media/3oeSAD0Wx121Q5qZy8/giphy.gif' },
  { id: '8', title: 'No shaking head', url: 'https://media.giphy.com/media/3o7qDQ4kcSD1dMZy52/giphy.gif', originalUrl: 'https://media.giphy.com/media/3o7qDQ4kcSD1dMZy52/giphy.gif' },
  { id: '9', title: 'Thank You', url: 'https://media.giphy.com/media/3o6ZtpxSgADeESqLmg/giphy.gif', originalUrl: 'https://media.giphy.com/media/3o6ZtpxSgADeESqLmg/giphy.gif' },
  { id: '10', title: 'Mind Blown', url: 'https://media.giphy.com/media/26ufdipQqU2lhNA4g/giphy.gif', originalUrl: 'https://media.giphy.com/media/26ufdipQqU2lhNA4g/giphy.gif' }
];

export async function fetchGifs(query: string): Promise<GifItem[]> {
  const apiKey = (import.meta.env?.VITE_GIPHY_API_KEY) || 'dc6zaTOxFJmzC';
  const cleanQuery = query.trim();
  
  try {
    const url = cleanQuery
      ? `https://api.giphy.com/v1/gifs/search?api_key=${apiKey}&q=${encodeURIComponent(cleanQuery)}&limit=12`
      : `https://api.giphy.com/v1/gifs/trending?api_key=${apiKey}&limit=12`;
      
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`GIPHY API responded with status: ${res.status}`);
    }
    const data = await res.json();
    
    if (data && data.data && data.data.length > 0) {
      return data.data.map((item: any) => ({
        id: item.id,
        url: item.images.fixed_height_small.url,
        originalUrl: item.images.original.url,
        title: item.title,
      }));
    }
  } catch (err) {
    console.warn('GIPHY API failed or unauthorized, falling back to curated mock GIFs:', err);
  }

  // Fallback to local curated GIFs if API fails or returns no results
  if (cleanQuery) {
    const filtered = MOCK_GIFS.filter(gif => 
      gif.title.toLowerCase().includes(cleanQuery.toLowerCase())
    );
    return filtered.length > 0 ? filtered : MOCK_GIFS;
  }
  return MOCK_GIFS;
}

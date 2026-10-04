import { gifsApi } from '../api/gifs.api';
import type { GifItem } from '../interfaces/gif-item.interface';

export async function fetchGifs(query: string): Promise<GifItem[]> {
  return gifsApi.search(query);
}

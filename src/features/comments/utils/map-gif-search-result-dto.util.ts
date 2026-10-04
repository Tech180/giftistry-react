import type { GifSearchResultDto } from '../interfaces/gif-search-result-dto.interface';
import type { GifItem } from '../interfaces/gif-item.interface';

export function mapGifSearchResultDto(dto: GifSearchResultDto): GifItem {
  return {
    id: dto.Id,
    url: dto.Url,
    originalUrl: dto.OriginalUrl,
    title: dto.Title,
  };
}

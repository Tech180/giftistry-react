import { ItemLink } from '../../../../interfaces/item-link.interface';

export interface Props {
  links: ItemLink[];
  getSiteName: (url: string, retailerName?: string | null) => string;
}

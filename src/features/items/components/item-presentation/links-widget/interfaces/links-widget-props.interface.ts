import { ItemLink } from '../../../../interfaces/item-link.interface';

export interface LinksWidgetProps {
  links: ItemLink[];
  getSiteName: (url: string, retailerName?: string | null) => string;
}

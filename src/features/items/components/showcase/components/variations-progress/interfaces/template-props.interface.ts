import type { ShowcaseVariationProgress } from '../../../../../interfaces/showcase-variation-progress.interface';

export interface TemplateProps {
  variations: ShowcaseVariationProgress[];
  sectionTitle: string;
  sectionVariant: 'inline' | 'card';
  sectionClassName: string;
  labelClassName: string;
  listClassName: string;
  cardClassName: string;
  headerClassName: string;
  nameClassName: string;
  qtyClassName: string;
  barBgClassName: string;
  barFillClassName: string;
}

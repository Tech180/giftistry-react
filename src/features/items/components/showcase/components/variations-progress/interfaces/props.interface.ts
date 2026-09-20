import type { ShowcaseVariationProgress } from '../../../../../interfaces/showcase-variation-progress.interface';

export interface Props {
  variations: ShowcaseVariationProgress[];
  sectionTitle: string;
  sectionVariant: 'inline' | 'card';
}

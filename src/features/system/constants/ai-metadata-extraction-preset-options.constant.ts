import type { SelectMenuOption } from 'shared/ui';
import type { AiMetadataExtractionPreset } from '../interfaces/ai-metadata-extraction-preset.type';

export const AI_METADATA_EXTRACTION_PRESET_OPTIONS: ReadonlyArray<
  SelectMenuOption & { value: AiMetadataExtractionPreset }
> = [
  {
    value: 'full',
    label: 'Full — single large prompt',
    description: 'Full populate hub and uncapped page context. Best for strong cloud models.',
  },
  {
    value: 'fast',
    label: 'Fast — one compact prompt',
    description: 'Smallest context and output budget. Best for local 8B models and lowest latency.',
  },
  {
    value: 'balanced',
    label: 'Balanced — one compact prompt',
    description: 'Recommended for most setups: compact rules with moderate context limits.',
  },
  {
    value: 'thorough',
    label: 'Thorough — core + pack calls',
    description: 'Split core fields and metadata packs into separate AI calls (more accurate, slower).',
  },
];

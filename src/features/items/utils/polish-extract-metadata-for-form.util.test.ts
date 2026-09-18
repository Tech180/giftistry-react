import { describe, expect, test } from 'vitest';
import { polishExtractMetadataForForm } from './polish-extract-metadata-for-form.util';

describe('polishExtractMetadataForForm', () => {
  test('compacts verbose amazon titles and drops amazon.com descriptions', () => {
    const polished = polishExtractMetadataForForm({
      Title:
        'Fosi Audio C3 Gaming DAC Amp for PC, USB Headphone Amplifier with 7.1 Surround Sound, Desktop Volume Control, Footstep Enhancement, Compatible with PS5, Switch, Laptop, Headset for FPS',
      Price: 129.99,
      Description:
        'Amazon.com: Fosi Audio C3 Gaming DAC Amp for PC, USB Headphone Amplifier with 7.1 Surround Sound, Desktop Volume Control, Footstep Enhancement, Compatible with PS5, Switch, Laptop, Headset for FPS : Electronics',
      Category: 'tech',
      CategoryAlternatives: [],
      ImageUrl: null,
      WebsiteName: 'Amazon',
      ResolvedUrl: 'https://www.amazon.com/dp/B0GX9QTR2P/',
      CustomFields: { Predefined: {}, UserDefined: {} },
    });

    expect(polished.Title).toBe('Fosi Audio C3 Gaming DAC Amp for PC');
    expect(polished.Description).toBeNull();
  });
});

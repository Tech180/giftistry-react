/** Maps scrape/storage keys onto item_field_definitions.FieldKey (PascalCase). */
export const CANONICAL_TO_DEFINITION_KEY: Record<string, string> = {
  Color: 'PreferredColor',
  PreferredColor: 'PreferredColor',
  PantsSize: 'PantsSize',
  ShirtSize: 'ShirtSize',
  ShoesSize: 'ShoesSize',
  SocksSize: 'SocksSize',
  ModelNumber: 'ModelNumber',
  StorageCapacity: 'StorageCapacity',
};

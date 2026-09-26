# `features/experimental-features`

Per-user **experimental feature flags**. Registry-driven toggles live under Settings → Experimental; runtime gates (e.g. product tour) read `user.ExperimentalFeatures` via `isExperimentalFeatureEnabled`.

## Registry (add / remove)

Edit [`constants/experimental-features.constant.ts`](constants/experimental-features.constant.ts):

```ts
{
  id: 'productTutorial',       // client id
  apiKey: 'ProductTutorial',   // wire / DB key (PascalCase)
  title: 'Product tutorial',
  description: '…',
  defaultEnabled: false,
}
```

- **Add:** append one object; gate call sites with `isExperimentalFeatureEnabled('newId', map)`; sync backend allowlist.
- **Remove:** delete the object — Settings UI drops the row automatically.

## API contract (Giftistry Bun)

| Endpoint | Behavior |
|----------|----------|
| `GET /api/auth/me` | `User.ExperimentalFeatures` object, e.g. `{ "ProductTutorial": false }` |
| `PATCH /api/auth/experimental-features` | Body wrap `Giftistry.ExperimentalFeatures` with partial map. Response: `{ ExperimentalFeatures, User? }` |
| Storage | `users.experimental_features_json` JSONB |
| Validation | Unknown keys → `400` |

Client maps PascalCase ↔ camelCase ids in [`utils/map-experimental-features.util.ts`](utils/map-experimental-features.util.ts).

## Exports

| Export | Role |
|--------|------|
| `EXPERIMENTAL_FEATURES` | Registry |
| `isExperimentalFeatureEnabled` | Default vs stored merge |
| `mapExperimentalFeaturesFromApi` / `ToApi` | Wire mapping |
| `experimentalFeaturesApi.patchFeatures` | PATCH helper |
| `useExperimentalFeatures` | Settings toggle hook |

## Related

- [auth](../auth/README.md) — `ApiUser.ExperimentalFeatures`
- [tour](../tour/README.md) — gated by `productTutorial`
- [settings experimental](../../app/pages/settings/README.md)

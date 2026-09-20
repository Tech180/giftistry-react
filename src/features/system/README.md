# `features/system`

System status/settings, local AI config, and metadata pack catalog.

## Public surface (`features/system`)

- **API/hooks:** `systemApi`, `useSystemSettingsController`, `useMetadataPacksCatalog`
- **Utils/constants:** local-AI / pack helpers, custom pack id prefix
- **Types:** system status, model options, metadata pack views, AI connection types

## Notes

Settings **pages** under `app/pages/settings` compose these hooks; keep transport/domain logic here.

## Related

- [↑ features](../README.md)  
- [app/pages/settings](../../app/pages/settings/README.md)

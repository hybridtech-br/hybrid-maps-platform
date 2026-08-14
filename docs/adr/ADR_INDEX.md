# HYBRID Maps Platform — ADR Index

Document ID: ADR-INDEX
Status: V1.0 approved baseline
Date: 2026-08-14

| ADR | Decision | Status |
|---|---|---|
| ADR-001 | `GeometryFactory.point()` is a bug fix preserving the public contract | Accepted |
| ADR-002 | Centroid accumulator typing correction preserves runtime behavior | Accepted |
| ADR-003 | Planar HGK centroid semantics remain separate from Spatial Engine geographic-domain centroid behavior | Accepted |

## V1 architectural decisions consolidated outside individual ADR files

- HMP is provider-neutral; MapLibre is the required V1 renderer.
- HGK is Earth-agnostic, 2D and free of browser/provider/upward dependencies.
- Spatial Engine owns geographic semantics and adapts to HGK.
- Maps Core preserves compatibility facades for V1.0.
- HMP V1 owns no location-history datastore.
- Geocoding, routing and offline maps are post-V1.
- Production tile/style selection is deployment-specific and is not a source-release dependency.

Future architecture changes that alter dependency direction, public compatibility, geographic semantics, persistence, security boundaries or provider ownership require a new ADR.

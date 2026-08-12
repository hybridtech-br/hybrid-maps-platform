# HYBRID Maps Platform v1.0.0

Release date: 2026-08-12

## First stable source release

HYBRID Maps Platform v1.0.0 establishes the provider-neutral geospatial foundation for first-party HYBRID products.

### Architecture

- HYBRID Geometry Kernel (`@hybrid/hgk`) for generic immutable 2D mathematics, geometry, validation and planar algorithms.
- Spatial Engine for geographic coordinates/bounds, geographic-domain behavior and explicit adapters into HGK.
- Maps Core as the stable provider-facing compatibility layer.
- Runtime microkernel for lifecycle, services, events and capability discovery.
- Provider SDK for implementation-neutral map provider contracts.
- MapLibre provider as the first V1 rendering adapter.

### Compatibility

The HGK migration was completed without removing legacy public Maps Core APIs. Provider-neutral consumers continue to use Maps Core contracts while internal implementation can delegate through Spatial Engine/HGK.

### Reference experience

The included Playground demonstrates the V1 stack using Rio de Janeiro as the reference location. It follows the official HYBRID Maps Platform visual identity and lazy-loads the MapLibre provider to keep provider implementation code outside the initial application module.

### Quality and reproducibility

- Characterization tests protect pre-migration behavior.
- API compile fixtures protect public contracts.
- HGK boundary checks prevent upward/provider/browser dependencies.
- Full repository build/test gate validates in-repository consumers.
- `pnpm-lock.yaml` is committed and release gates install with `--frozen-lockfile`.
- Node.js 22 and pnpm 9.15.0 form the V1 build baseline.

### Security and privacy

HMP V1 does not create a platform-owned history datastore for precise user location. Provider credentials remain outside HGK and provider-neutral domain contracts. Deployment-specific security/provider requirements are documented separately.

### V1 scope

Included: MapLibre rendering, viewport/camera, layers, markers, popups, controls, provider capabilities, HGK, Spatial Engine, TypeScript APIs and reference Playground.

Post-V1: geocoding, routing/navigation, offline packs, additional production providers and an HMP-hosted geospatial backend.

### Deployment note

This GitHub release is the stable source/engineering release. It does not activate a paid tile service or deploy a public HYBRID-hosted Maps endpoint. The Playground development style uses `demotiles.maplibre.org`; each production consumer must select and validate its production style/tile/data source, attribution, licensing and operational controls.

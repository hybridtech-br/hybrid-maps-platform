# HYBRID Maps Platform — Project Status

Date: 2026-08-14
Status: **V1.0.0 RELEASED — SOURCE/ENGINEERING BASELINE COMPLETE**
Development: **POST-V1 CYCLE OPEN**

## V1.0.0 release record

HYBRID Maps Platform v1.0.0 is the first stable source/engineering release of the provider-neutral HYBRID Maps Platform SDK.

Verified release facts:

- PR #4 merged into `main` on 2026-08-14;
- merge commit: `dd59e28a366cfc71018e85082c129a230c707529`;
- `Validate Repository` passed on `main`;
- `HGK Foundation Gates` passed on `main`;
- `Full Repository Quality` passed on `main`;
- `Publish V1.0.0` completed successfully;
- GitHub Release `v1.0.0` is published, non-draft and non-prerelease.

## Product baseline

V1.0.0 is a provider-neutral SDK for first-party HYBRID products. MapLibre is the initial rendering provider. HMP V1 does not require a HYBRID-hosted geospatial backend and does not persist user/location history.

HYBRID Starlink Tracker remains the first intended first-party integration/reference consumer.

Geocoding, routing/navigation, offline maps and additional production providers remain post-V1 capabilities unless reprioritized explicitly.

## Completed roadmap

- Wave 0 — characterization/API safety net: **COMPLETE**.
- Wave 1 — HGK mathematical foundation: **COMPLETE**.
- Wave 2 — HGK geometry/planar algorithms: **COMPLETE**.
- Wave 3 — Spatial Engine bridge/geographic semantics: **COMPLETE**.
- Gate B: **PASSED**.
- Wave 4 — Maps Core compatibility migration: **COMPLETE**.
- Wave 5 — consumer verification/migration guide: **COMPLETE**.
- Gate C: compatibility retained; no legacy public API removal in V1.0.0.
- Release hardening: **COMPLETE**.
- V1.0 documentation consolidation: **COMPLETE**.
- V1.0.0 source release: **PUBLISHED**.

## Compatibility baseline

No Maps Core legacy public API was removed in V1.0.0. HGK remains isolated behind Spatial Engine/Maps Core boundaries, and provider-neutral contracts remain compatible with Provider SDK and MapLibre.

## Accepted V1 limitations

- simple `GeographicBounds` does not model antimeridian-crossing bounds;
- legacy Spatial Engine centroid behavior remains characterized and documented by ADR-003;
- geocoding, routing/navigation and offline maps are post-V1;
- Playground development style uses `demotiles.maplibre.org`; production tile/style selection is deployment-specific;
- Starlink Tracker rollout occurs in its separate repository/product lifecycle.

## Post-V1 priorities

The canonical post-V1 sequence is defined in `docs/product/POST_V1_ROADMAP.md`.

Initial order:

1. integrate HMP v1.0.0 into HYBRID Starlink Tracker as the first real first-party consumer;
2. validate provider/runtime behavior in that consumer and capture gaps;
3. establish production tile/style/data-source policy when an actual deployment target exists;
4. address V1 technical debt with compatibility-preserving changes;
5. evaluate geocoding, routing/navigation, offline support and additional providers only after first-consumer evidence.

## Release interpretation

V1.0.0 is a stable source/engineering release, not an automatic public hosted service. Any production deployment still requires target-specific decisions for hosting, style/tiles/data provider, licenses/attribution, CSP, observability, credentials/origin restrictions and rollback.

## Visual identity

The official HYBRID Maps Platform identity supplied by the project owner remains canonical. Palette: `#0D1117`, `#1B2128`, `#2E343B`, `#22C55E`, `#F5F7FA`; Exo 2 for titles/highlights and Inter for body/UI, with minimalist topographic/geospatial language.

## Current gate

The Maps Platform repository itself is no longer blocked by V1 engineering work. The next product gate is **First Consumer Integration**: verify HMP v1.0.0 inside HYBRID Starlink Tracker without changing Maps Platform public contracts unless evidence from the integration justifies a compatible post-V1 evolution.

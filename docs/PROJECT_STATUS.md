# HYBRID Maps Platform — Project Status

Date: 2026-08-14
Status: **V1.0.0 RELEASE CANDIDATE — DOCUMENTATION COMPLETE**
Development: **ROADMAP WAVES 0–5 COMPLETE; MERGE AUTHORIZED AFTER FINAL EXACT-HEAD CI**

## Product baseline

V1.0.0 is the first stable source/engineering release of the provider-neutral HYBRID Maps Platform SDK. MapLibre is the initial rendering provider. HMP V1 does not require a HYBRID-hosted geospatial backend and does not persist user/location history. HYBRID Starlink Tracker is the first intended first-party reference consumer. Geocoding, routing/navigation and offline maps remain post-V1.

## Roadmap state

- Waves 0–5: **COMPLETE**.
- Gate B: **PASSED**.
- Gate C: compatibility retained; no legacy public API removal in V1.0.0.
- Release hardening: **COMPLETE**.
- V1.0 documentation consolidation: **COMPLETE**.
- Final action: exact-head CI → merge PR #4 → verify `main` and automated `v1.0.0` release.

## V1.0 engineering hardening

- workspace and releasable packages at version `1.0.0`;
- `pnpm-lock.yaml` committed using pnpm 9.15.0;
- principal quality workflows use frozen lockfile installation;
- build/test/API compatibility/HGK-boundary/CodeQL workflows exist;
- Playground lazy-loads MapLibre provider code;
- official Maps Platform identity is applied to the Playground;
- changelog, release notes and automated V1 release workflow are committed.

## V1.0 documentation gate

Canonical documentation now includes the official Maps Platform Book, documentation index, PRD, functional and non-functional requirements, HGK architecture/migration/API inventory, data architecture, infrastructure/deployment architecture, API/integration architecture, provider/dependency matrices, threat model, security/privacy boundaries, LGPD specification, visual identity/UX specification, accessibility, operations/recovery, test/CI specifications, ADR index, risk register, product roadmap, installation/development guide, migration guide, readiness report, release checklist and release notes.

No documentation gap blocks the V1.0 source release.

## Compatibility

No Maps Core legacy public API is removed. HGK types remain behind Spatial Engine/Maps Core boundaries and the provider-facing API remains compatible with Provider SDK and MapLibre fixtures.

## Known limitations accepted for V1

- simple `GeographicBounds` does not model antimeridian-crossing bounds;
- legacy Spatial Engine centroid behavior remains characterized and documented by ADR-003;
- geocoding, routing/navigation and offline maps are post-V1;
- Playground development style uses `demotiles.maplibre.org`; production tile/style selection is deployment-specific;
- Starlink Tracker integration is a subsequent ecosystem rollout step in its separate repository.

## Release interpretation

V1.0 is a source/engineering release, not automatic production deployment. A real deployment still requires target-specific decisions for hosting, tiles/style, licenses/attribution, CSP, observability, credentials/origin restrictions and rollback.

## Visual identity

The official HYBRID Maps Platform identity supplied by the project owner is canonical. Palette: `#0D1117`, `#1B2128`, `#2E343B`, `#22C55E`, `#F5F7FA`; Exo 2 for titles/highlights and Inter for body/UI, with minimalist topographic/geospatial graphic language.

## Final action

Run all required checks on this exact documentation head. If green, merge PR #4 to `main` and verify the repository-created `v1.0.0` tag/GitHub Release.

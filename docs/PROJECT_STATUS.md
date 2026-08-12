# HYBRID Maps Platform — Project Status

Date: 2026-08-12
Status: **V1.0.0 RELEASE CANDIDATE**
Development: **ROADMAP WAVES 0–5 COMPLETE; FINAL RELEASE GATE ACTIVE**

## Product baseline

V1.0.0 is the first stable source/engineering release of the provider-neutral HYBRID Maps Platform SDK. MapLibre is the initial rendering provider. HMP V1 does not require a HYBRID-hosted geospatial backend and does not persist user/location history. HYBRID Starlink Tracker remains the first intended reference consumer. Geocoding, routing/navigation and offline maps remain post-V1.

## Roadmap state

- Wave 0: **COMPLETE — CI GREEN**.
- Wave 1: **COMPLETE — CI GREEN**.
- Wave 2: **COMPLETE — CI GREEN**.
- Wave 3: **COMPLETE — CI GREEN**.
- Gate B: **PASSED**.
- Wave 4: **COMPLETE — CI GREEN**.
- Wave 5: **COMPLETE — FULL REPOSITORY VERIFICATION ESTABLISHED**.
- Gate C: compatibility kept; no legacy public API removal in V1.0.0.
- Release hardening: **COMPLETE IN SOURCE**.
- Final gate: exact-head CI, merge of PR #4 and verification of `v1.0.0` release.

## V1.0 release hardening completed

- workspace and releasable packages promoted to version `1.0.0`;
- `pnpm-lock.yaml` generated and committed using pnpm 9.15.0;
- principal quality workflows use `pnpm install --frozen-lockfile`;
- root test command targets the packages that actually contain test suites;
- Playground dynamically loads the MapLibre provider to isolate provider JavaScript from the initial application module;
- official Maps Platform visual identity is applied to the Playground;
- `CHANGELOG.md` contains the 1.0.0 release record;
- README now documents V1 architecture, setup, scope, Playground and source-release semantics;
- release checklist distinguishes source release from production deployment/consumer rollout.

## Compatibility

No Maps Core legacy public API is removed in V1.0.0. HGK implementation types remain behind the Spatial Engine/Maps Core boundaries. The provider-facing API remains compatible with Provider SDK and MapLibre fixtures.

## Known limitations accepted for V1

- simple `GeographicBounds` does not model antimeridian-crossing bounds;
- Spatial Engine legacy centroid behavior remains characterized and documented by ADR-003;
- geocoding, routing/navigation and offline maps are post-V1;
- development Playground uses `demotiles.maplibre.org`; production tile/style selection is a deployment-specific operational decision;
- Starlink Tracker integration occurs in its separate repository and is an ecosystem rollout step, not a blocker for this repository's source release.

## Source release vs production deployment

The source release can be tagged and published without activating external paid services or deploying a public HYBRID-hosted Maps service. Production deployment requires a concrete target and then separate decisions for tile/style source, licensing/attribution, CSP, observability, secrets/origin restrictions and rollback.

## Visual identity

The official HYBRID Maps Platform identity supplied by the project owner is the canonical visual reference for first-party Maps Platform UI and documentation. The Playground follows the dark graphite/black, light neutral and HYBRID green design language.

## Final action

Run all release-candidate checks on the exact branch head. If all required checks are green, merge PR #4 into `main`, create/verify tag `v1.0.0`, publish the GitHub Release and then mark this document as **V1.0.0 RELEASED**.

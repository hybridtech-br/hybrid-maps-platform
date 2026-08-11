# HYBRID Maps Platform — Project Status

Date: 2026-08-11
Status: **AUTONOMOUS ROADMAP EXECUTION AUTHORIZED**
Development: **ROADMAP MIGRATION WAVES COMPLETE; RELEASE HARDENING NEXT**

## Governing rule

Autonomous execution remains authorized for reversible technical work. Stop only for an irreversible action, external cost, or genuine blocker.

## Product baseline

V1 is an internal provider-neutral SDK, MapLibre-first, without an HMP-hosted geospatial backend or HMP-owned location-history persistence. HYBRID Starlink Tracker is the first reference consumer. Geocoding, routing/navigation and offline maps remain post-V1.

## Roadmap state

- Wave 0: **COMPLETE — CI GREEN**.
- Wave 1: **COMPLETE — CI GREEN**.
- Wave 2: **COMPLETE — CI GREEN**.
- Wave 3: **COMPLETE — CI GREEN**.
- Gate B: **PASSED**.
- Wave 4: **COMPLETE — CI GREEN**.
- Wave 5 consumer verification: **COMPLETE — FULL REPOSITORY CI GREEN**.
- M5.4 migration guide: **COMPLETE**.
- Gate C deprecation: **PARTIALLY SATISFIED; REMOVALS HELD**.
- M5.5: no public API removal performed because a major-version/removal decision is intentionally deferred.
- Next: release hardening, documentation readiness, security/provider/license review and first external first-party consumer integration.

## Wave 5 completion record

- Provider SDK builds against migrated Maps Core.
- MapLibre provider builds against migrated Maps Core and Provider SDK.
- Playground production build succeeds with the Rio de Janeiro reference scenario.
- Pre-existing Runtime tests were aligned to the current Runtime contracts; no Runtime production API was changed.
- A full repository quality workflow now builds all packages/apps and executes the actual test-bearing packages.
- Full repository gate first passed on commit `1cbf4e6b71839211465ee0f3df704bfa99623bfa`, GitHub Actions run `31535778082`.
- `guides/HGK_MIGRATION_GUIDE.md` documents package boundaries, coordinate/bounds/geometry migration, altitude policy, centroid semantics, provider compatibility and rollback.

## CI-discovered hardening fixes

The new full gate exposed two unrelated pre-existing repository issues and they were fixed before Wave 5 completion:

1. Runtime tests targeted obsolete API shapes (`status`, old capability registration and `ModuleRegistry`). Tests were updated to the existing production contracts (`isRunning`, provider-scoped capabilities and kernel registration).
2. Playground used top-level `await`, incompatible with Vite's configured production targets. Initialization now runs inside an async bootstrap function; runtime behavior is unchanged.

Packages that declare a test script but contain no tests are not treated as passing test suites. The full gate explicitly runs the packages that actually contain tests while still building every workspace package/application.

## Gate C assessment

Satisfied:

- Wave 4 complete;
- in-repository consumers build green;
- full repository test-bearing packages green;
- migration guide published;
- compatibility facade remains available.

Held intentionally:

- removal or narrowing of legacy public APIs requires a major-version/product release decision and may affect consumers outside this repository. No such irreversible removal is necessary for V1 migration completion.

Decision: keep compatibility APIs in the current alpha line; do not remove them. Deprecation annotations may be introduced only when a concrete replacement is unambiguous and external-consumer impact has been inventoried.

## Known technical debt / release hardening

- repository still lacks a committed `pnpm-lock.yaml`;
- legacy Spatial Engine centroid behavior remains preserved per ADR-003;
- simple `GeographicBounds` does not represent antimeridian crossing;
- Playground production bundle warns that the main JavaScript chunk exceeds 500 kB; code splitting is a performance hardening item;
- first-party Starlink Tracker integration is outside this repository and must be verified before declaring ecosystem rollout complete;
- MapLibre style/data licensing, attribution and production tile-source policy require final release documentation.

## Visual identity rule

All first-party UI and visual documentation follow the approved HYBRID master identity: black/dark graphite, white/light gray, HYBRID green accent, corporate mark/wordmark language, minimalist technological line iconography and consistent HYBRID typography/design language.

## Next action

Proceed autonomously with release hardening that is reversible and cost-free: documentation readiness audit, security/privacy boundaries, MapLibre provider/license matrix, bundle/reproducibility hardening where repository tooling permits, and release checklist. Stop before any external paid provider activation, production deployment, irreversible API removal or cross-repository Starlink Tracker modification that cannot be performed with available authorized access.

# HYBRID Maps Platform — Project Status

Date: 2026-08-10
Status: **DOCUMENTATION FREEZE — RELEASED BY PROJECT OWNER**
Development: **AUTHORIZED SUBJECT TO ROADMAP GATES**

## Governing rule

On 2026-08-10 the project owner explicitly released the Documentation Freeze and authorized autonomous continuation of the HYBRID Maps Platform/HGK project.

Work must continue in roadmap order. No roadmap step may be skipped. Architecture, characterization, compatibility, security and CI gates remain mandatory.

## Current product baseline

Until superseded by an explicit owner decision, the V1 engineering baseline is:

- HYBRID Maps Platform is an internal provider-neutral platform/SDK for first-party HYBRID products;
- MapLibre is the initial production rendering provider;
- V1 does not require a HYBRID-hosted geospatial backend;
- V1 does not persist user/location history in HMP;
- HYBRID Starlink Tracker is the first integration/reference consumer;
- geocoding, routing/navigation and offline maps are post-V1 capabilities;
- provider-neutral contracts, capability discovery, normalized events and HGK/Spatial Engine boundaries remain mandatory.

## Roadmap state

1. D1 — Governance/source of truth: living documentation.
2. D2 — Product definition: V1 baseline approved for engineering.
3. D3 — Architecture completion: living documentation alongside gated implementation.
4. D4 — Experience and operations: required before production release.
5. D5 — Documentation readiness audit: production-release gate.
6. HGK Phase 0.5: approved planning baseline.
7. Wave 0 — safety net and characterization: **COMPLETE — CI GREEN**.
8. Wave 1 — HGK mathematical foundation: **COMPLETE — CI GREEN**.
9. Wave 2 — HGK geometry and planar algorithms: **COMPLETE — CI GREEN**.
10. Wave 3 — Spatial Engine bridge and geographic semantics: **AUTHORIZED / NEXT**.
11. Waves 4–5: gated by the acceptance criteria in `architecture/HGK_MIGRATION_PLAN.md`.

## Wave 0 completion record

Completed in roadmap order:

- M0.1 Maps Core characterization tests;
- M0.2 Spatial Engine characterization tests;
- M0.3 `GeometryFactory.point` defect classified by ADR-001, corrected without public signature change, regression test enabled;
- M0.4 compile-time API fixture package covering Maps Core, Spatial Engine, Provider SDK and MapLibre Provider;
- M0.5 GitHub Actions quality gate for the migration dependency path.

The first green Wave 0 CI run completed successfully on commit `d93073f1e375c102ede41efeb9796a5f2c9c9978` (GitHub Actions run 31433515546).

Additional strict-build fixes made while reaching the gate:

- Spatial Engine `tsconfig.json` added because the package declared a build script but lacked its config;
- Centroid reducer accumulator typing fixed without numerical behavior change (ADR-002);
- MapLibre raw GeoJSON boundary cast made explicit without runtime behavior change.

## Wave 1 completion record

Completed in roadmap order:

- M1.1 HGK package skeleton and strict TypeScript build;
- M1.2 `Precision` with the official `EPSILON = 1e-9`, finite-value enforcement and exact/approximate comparison semantics;
- M1.3 immutable `Vector2` with algebraic operations and tests;
- M1.4 immutable `Point2` with explicit `Vector2` conversion and tests;
- M1.5 immutable `Envelope2` with inclusive containment/intersection, union, center, width/height and degenerate-envelope coverage;
- M1.6 public API documentation in `docs/api/HGK_API.md`;
- independent `HGK Foundation Gates` workflow covering build, tests and forbidden-dependency checks.

The first green Wave 1 gate completed successfully on commit `6de2edf0ed6d38786b9f911ed2baf3f9cc11dc89` (GitHub Actions run 31434720149). The existing Wave 0 gate also remained green on the same commit (run 31434720751).

Wave 1 scope comparison from `afbb11047b7ea152c8b54be620543c3ccb0d823a` to `6de2edf0ed6d38786b9f911ed2baf3f9cc11dc89` confirms that no existing consumer package was modified: changes are restricted to `packages/hgk`, HGK documentation and the HGK-specific CI workflow.

One test-only correction was made while reaching the gate: the inclusive epsilon boundary assertion was changed from `1` versus `1 + EPSILON` to `0` versus `EPSILON`, because the former difference is not exactly representable as `1e-9` in IEEE-754. The production precision policy remained unchanged.

## Wave 2 completion record

Completed in roadmap order:

- M2.1 primitive geometry: `Segment2`, `LineString2`, `LinearRing2` and `Polygon2`;
- M2.2 aggregate geometry: `MultiPoint2`, `MultiLineString2`, `MultiPolygon2` and recursive `GeometryCollection2`;
- M2.3 structural `validateGeometry2` with stable validation codes, deterministic paths and explicit empty/nesting policies;
- M2.4 explicitly planar distance, length, area, centroid and bounding-envelope algorithms;
- M2.5 geometry/API review and Wave 2 documentation in `docs/api/HGK_API.md`.

The final Wave 2 HGK gate completed successfully on commit `02d0cb641af62d798a0b15f047bc1b2dbb2001a0` (GitHub Actions run 31435907865). The Wave 0 compatibility gate also remained green on the same commit (run 31435907888).

Wave 2 scope comparison from `850798a36d27dbbdfdfa4791c7b230fe0a01119f` to `02d0cb641af62d798a0b15f047bc1b2dbb2001a0` confirms that the wave modified only `packages/hgk` and `docs/api/HGK_API.md`; no Spatial Engine, Maps Core, provider or application consumer was migrated prematurely.

The Wave 2 centroid policy is explicitly planar. In particular, `GeometryCollection2` uses equal weighting of non-empty child centroids. Geographic/geodesic centroid semantics remain reserved for the Spatial Engine bridge.

A test-only reference correction was made during M2.4: the expected length-weighted centroid for `(0,0) -> (10,0) -> (10,2)` was corrected from `7.5` to `35/6`; the production algorithm was unchanged.

## Known technical debt intentionally outside the completed waves

- the pre-existing Runtime test source does not currently compile against its implementation;
- the repository still lacks a committed `pnpm-lock.yaml`; current migration CI installs without frozen lockfile until reproducibility hardening is completed.

## Current development authorization

Authorized now, in order:

- M3.1 add the geographic-coordinate wrapper in Spatial Engine;
- M3.2 add the geographic-bounds wrapper;
- M3.3 add coordinate and bounds adapters between Spatial Engine and HGK;
- M3.4 add geometry adapters;
- M3.5 separate and document planar versus geospatial centroid policies;
- Wave 3 adapter round-trip/build/test/dependency verification.

Not yet authorized by sequence:

- consumer migration before Gate B is green;
- deprecation before Gate C;
- breaking public API changes without explicit versioning approval.

## Visual identity rule

All HYBRID Maps Platform first-party UI and visual documentation must follow the approved HYBRID corporate identity: black/dark graphite base, white/light gray, HYBRID green accent, corporate HYBRID mark/wordmark language, minimalist technological line iconography and consistent HYBRID typography/design language. Maps-specific motifs may include geolocation, layers, routes, terrain/topographic lines and geospatial data, subordinate to the HYBRID master brand.

## Next action

Execute Wave 3 in roadmap order, beginning with M3.1 `GeographicCoordinate` in the Spatial Engine. HGK remains geography-free. Haversine distance, bearing, spherical area, CRS/projection and geographic validation remain Spatial Engine responsibilities. Stop only at a decision that genuinely requires project-owner judgment.

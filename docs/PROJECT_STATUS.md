# HYBRID Maps Platform — Project Status

Date: 2026-08-11
Status: **AUTONOMOUS ROADMAP EXECUTION AUTHORIZED**
Development: **AUTHORIZED SUBJECT TO ROADMAP GATES**

## Governing rule

The project owner authorized autonomous execution of the remaining HYBRID Maps Platform roadmap. Technical decisions resolved by established architecture are recorded and executed without pausing. Stop only for an irreversible action, external cost, or genuine blocker.

## Product baseline

V1 remains an internal provider-neutral SDK, MapLibre-first, without an HMP-hosted geospatial backend or HMP-owned location-history persistence. HYBRID Starlink Tracker is the first reference consumer. Geocoding, routing/navigation and offline maps remain post-V1.

## Roadmap state

- Wave 0: **COMPLETE — CI GREEN**.
- Wave 1: **COMPLETE — CI GREEN**.
- Wave 2: **COMPLETE — CI GREEN**.
- Wave 3: **COMPLETE — CI GREEN**.
- Gate B: **PASSED**.
- Wave 4 — Maps Core compatibility migration: **COMPLETE — CI GREEN**.
- Wave 5 — consumer verification and deprecation preparation: **AUTHORIZED / NEXT**.
- Gate C — deprecation: requires Wave 4 complete, all in-repository consumers green, migration guide and versioning decision.

## Wave 3 completion record

M3.1–M3.5 completed: geographic coordinate/bounds wrappers, HGK coordinate/bounds and geometry adapters, geographic validation and ADR-003 separating planar/geographic centroid semantics. Final compatibility gate: commit `939758a960c6e90d9b9a270d9020c8f886c30266`, run `31534931539`, green.

## Wave 4 completion record

Completed in roadmap order:

- M4.1 Maps Core `Coordinate` delegates canonical geographic validation to Spatial Engine while preserving constructor, properties, freezing, exact equality, tuple conversion and characterized error messages;
- M4.2 `BoundingBox` delegates canonical geographic bounds validation while preserving the existing public contract and validation messages;
- M4.3 public `Geometry` shapes remain unchanged; internal `SpatialGeometryBridge` converts valid Point/LineString/Polygon structures for Spatial Engine use without leaking implementation types;
- M4.4 `Viewport` required no implementation migration; characterization tests verify its public behavior;
- M4.5 compile-time API fixtures, Provider SDK build and MapLibre build remain green; review recorded in `api/MAPS_CORE_WAVE4_API_REVIEW.md`.

Wave 4 final gate: commit `4ef1efbbf2ecc5c96039e2b2d87a2a2a6637901b`, GitHub Actions run `31535283657`, green.

The gate caught a compatibility regression in the first delegation attempt: Spatial Engine validation messages leaked through Maps Core. The compatibility facade was corrected before Wave 4 completion.

## Known technical debt

- pre-existing Runtime test source does not compile against its implementation;
- repository still lacks a committed `pnpm-lock.yaml`;
- legacy Spatial Engine centroid behavior remains mixed and preserved per ADR-003;
- simple `GeographicBounds` does not represent antimeridian crossing.

## Current authorization

Proceed with Wave 5 in order:

- M5.1 verify Provider SDK;
- M5.2 verify MapLibre provider;
- M5.3 verify Playground using Rio de Janeiro as the reference scenario;
- M5.4 publish migration guide;
- evaluate Gate C and versioning;
- M5.5 annotate only approved deprecations; no API removal without a major-version decision.

## Visual identity rule

All first-party UI and visual documentation follow the approved HYBRID master identity: black/dark graphite, white/light gray, HYBRID green accent, corporate mark/wordmark language, minimalist technological line iconography and consistent HYBRID typography/design language.

## Next action

Begin M5.1 with repository consumer verification, then MapLibre and Playground. Resolve pre-existing consumer blockers if they are necessary to satisfy the Wave 5 gate and can be fixed without breaking public contracts.

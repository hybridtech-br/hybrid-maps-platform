# HYBRID Maps Platform — Project Status

Date: 2026-08-11
Status: **AUTONOMOUS ROADMAP EXECUTION AUTHORIZED**
Development: **AUTHORIZED SUBJECT TO ROADMAP GATES**

## Governing rule

The project owner authorized autonomous execution of the remaining HYBRID Maps Platform roadmap. Technical decisions that can be resolved from established architecture and premises are to be recorded and executed without pausing. Work stops only for an irreversible action, external cost, or a genuine blocker that cannot be resolved autonomously.

Roadmap order and acceptance gates remain mandatory.

## Current product baseline

- internal provider-neutral platform/SDK for first-party HYBRID products;
- MapLibre is the initial production rendering provider;
- no HYBRID-hosted geospatial backend required in V1;
- HMP V1 does not persist user/location history;
- HYBRID Starlink Tracker is the first integration/reference consumer;
- geocoding, routing/navigation and offline maps are post-V1;
- provider-neutral contracts, capability discovery, normalized events and HGK/Spatial Engine boundaries remain mandatory.

## Roadmap state

- Wave 0 — safety net and characterization: **COMPLETE — CI GREEN**.
- Wave 1 — HGK mathematical foundation: **COMPLETE — CI GREEN**.
- Wave 2 — HGK geometry and planar algorithms: **COMPLETE — CI GREEN**.
- Wave 3 — Spatial Engine bridge and geographic semantics: **COMPLETE — CI GREEN**.
- Gate B — begin Maps Core consumer migration: **OPEN**.
- Wave 4 — Maps Core compatibility migration: **AUTHORIZED / NEXT**.
- Wave 5 — consumers and deprecation: gated by Wave 4 and Gate C.

## Wave 3 completion record

Completed in roadmap order:

- M3.1 immutable `GeographicCoordinate` with finite/range validation and optional altitude;
- M3.2 immutable `GeographicBounds` with finite/range/order validation; simple bounds intentionally do not represent antimeridian crossing;
- M3.3 one-way Spatial Engine dependency on `@hybrid/hgk`, coordinate/bounds adapters and round-trip tests; altitude-bearing coordinates are rejected before 2D adaptation to prevent silent data loss;
- M3.4 point, line-string and polygon adapters into HGK geometry, preserving vertex/ring order and rejecting silent altitude loss;
- M3.5 ADR-003 separates HGK planar centroid semantics from existing Spatial Engine geographic-domain centroid behavior;
- additive `GeographicGeometryValidator` provides explicit longitude/latitude range validation without changing legacy constructor behavior.

Wave 3 final compatibility gate passed on commit `939758a960c6e90d9b9a270d9020c8f886c30266` (GitHub Actions run 31534931539).

A CI-discovered contract mismatch in the first polygon adapter implementation was corrected before the gate: `Polygon2` accepts a single ring array and exposes `outerRing()` / `holes()`, not constructor shell/hole parameters or properties. No HGK API was changed.

## Gate B evidence

- Waves 1–3 complete;
- characterization tests green;
- coordinate/bounds adapter round-trip tests green;
- geometry adapter tests green;
- HGK forbidden-dependency boundary remains enforced by the independent HGK workflow;
- Spatial Engine depends on HGK in one direction only;
- existing public Spatial Engine exports remain resolvable.

Gate B is therefore open and Wave 4 may begin.

## Known technical debt

- pre-existing Runtime test source does not compile against its implementation and remains outside the HGK migration critical path;
- repository still lacks a committed `pnpm-lock.yaml`; migration CI currently installs without frozen lockfile;
- existing Spatial Engine centroid implementation mixes geodesic segment weighting with planar longitude/latitude polygon formulas; ADR-003 preserves this characterized behavior during migration and reserves any geodesic redesign for a separately named future API;
- simple `GeographicBounds` does not represent antimeridian-crossing bounds.

## Current authorization

Authorized now, in order:

- M4.1 migrate Maps Core Coordinate internals;
- M4.2 migrate BoundingBox internals;
- M4.3 migrate geometry conversion internals;
- M4.4 verify Viewport;
- M4.5 run public API comparison.

Wave 4 must preserve Maps Core public signatures and provider-facing source shapes. HGK types must not leak into public provider contracts.

## Visual identity rule

All first-party HYBRID Maps Platform UI and visual documentation follow the approved HYBRID master identity: black/dark graphite base, white/light gray, HYBRID green accent, corporate HYBRID mark/wordmark language, minimalist technological line iconography and consistent HYBRID typography/design language.

## Next action

Execute Wave 4 in roadmap order, beginning with M4.1 Maps Core Coordinate internals while keeping characterization and API fixtures unchanged.

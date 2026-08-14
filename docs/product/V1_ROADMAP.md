# HYBRID Maps Platform — Product & Release Roadmap

Document ID: ROAD-01
Status: V1.0 approved baseline
Date: 2026-08-14

## V1.0 — completed source release scope

- provider-neutral Maps Core and Runtime;
- Provider SDK and MapLibre adapter;
- HGK mathematical/planar geometry foundation;
- Spatial Engine geographic bridge and validation;
- compatibility migration Waves 0–5;
- Rio de Janeiro reference Playground;
- official HYBRID Maps Platform visual identity;
- deterministic lockfile CI, security scanning and release automation;
- complete V1 documentation set.

## V1.x — stabilization

Priorities after release: consumer integration feedback, additional regression fixtures, performance profiling, accessibility refinements, provider error normalization and documentation corrections. Changes remain backward compatible.

## V2 candidates

Subject to separate approval and ADRs:

- geocoding/reverse geocoding;
- routing/navigation;
- explicit antimeridian-crossing geographic bounds model;
- additional production providers;
- offline data/map packs;
- improved geodesic centroid APIs with explicit semantics;
- optional hosted geospatial services only if product strategy requires them.

## Rollout order

1. Publish V1.0 source release.
2. Integrate HYBRID Starlink Tracker as first external first-party consumer.
3. Validate provider/data deployment policy in the consumer environment.
4. Expand to other HYBRID products without sharing their authentication/domain infrastructure.
5. Prioritize V1.x/V2 backlog from real consumer evidence.

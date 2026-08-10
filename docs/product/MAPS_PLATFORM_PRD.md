# HYBRID Maps Platform — Product Requirements Document

Document ID: PRD-01
Status: **V1 Baseline Approved for Engineering**
Date: 2026-08-10

## 1. Product definition

HYBRID Maps Platform (HMP) is the provider-neutral geospatial platform of HYBRID Tecnologia Inteligente. Its purpose is to provide reusable map, location and geospatial capabilities to HYBRID products without forcing consuming applications to depend directly on a concrete map provider.

## 2. Product goals

1. Provide a stable provider-neutral map API.
2. Allow providers to be replaced or added with controlled impact.
3. Centralize reusable geospatial contracts and capabilities.
4. Support the HYBRID product ecosystem with consistent map behavior and visual integration.
5. Separate generic geometry (HGK), geographic semantics (Spatial Engine), map contracts (Maps Core) and concrete providers.
6. Preserve security, privacy and licensing boundaries for location and provider data.
7. Provide an evolution path that does not couple consuming products to MapLibre, Google Maps, HERE or another concrete provider.

## 3. V1 engineering baseline

The V1 baseline adopted on 2026-08-10 is:

- HMP is an internal platform/SDK for first-party HYBRID products;
- MapLibre is the first production rendering provider;
- HMP V1 does not require a HYBRID-hosted geospatial backend;
- HMP V1 does not persist user or location history;
- HYBRID Starlink Tracker is the first integration/reference consumer;
- geocoding and reverse geocoding are post-V1;
- routing/navigation is post-V1;
- offline map/data support is post-V1.

The baseline can evolve through explicit product decisions and semantic versioning. It must not be used to justify breaking current public contracts during the HGK migration.

## 4. V1 functional scope

V1 includes:

- provider-neutral map creation and lifecycle;
- MapLibre provider;
- viewport and camera control;
- layers;
- markers;
- popups;
- map controls;
- normalized provider events;
- provider registry and capability discovery;
- stable coordinate, bounds and geometry contracts;
- public TypeScript API for first-party consumers;
- HGK generic mathematical/planar geometry foundation;
- Spatial Engine geographic semantics and adapters;
- HYBRID-branded playground/reference application;
- integration path and acceptance scenario for HYBRID Starlink Tracker.

## 5. V1 exclusions

Deferred beyond V1 unless explicitly reprioritized:

- Google Maps/HERE production adapters;
- routing/navigation;
- geocoding/reverse geocoding;
- offline map packs;
- terrain/3D;
- satellite imagery services as an HMP-owned provider service;
- persistent user-location history;
- HMP-owned persistent geospatial user datastore;
- standalone end-user Maps application;
- public third-party SaaS API.

## 6. Architecture baseline

- Maps Core: provider-neutral map-facing contracts and compatibility facades.
- Runtime: microkernel, lifecycle, capabilities and orchestration.
- Provider SDK: provider-neutral adapter contracts and registry.
- MapLibre Provider: concrete rendering/camera/layer/marker/popup/control integration.
- Spatial Engine: geographic algorithms, CRS/Earth semantics and HGK adapters.
- HGK: generic Earth-agnostic mathematical and geometry kernel.

Dependency direction and migration rules are governed by `../architecture/HGK_DEPENDENCY_MAP.md` and `../architecture/HGK_MIGRATION_PLAN.md`.

## 7. Intended consumers

Primary V1 consumer/reference integration:

- HYBRID Starlink Tracker.

Additional intended first-party consumers:

- HYBRID Monitor;
- HYBRID Home Assistant;
- Micael Security;
- future HYBRID products.

A consumer relationship does not imply shared authentication, databases or infrastructure. Product security boundaries remain independent where defined by the respective product architecture.

## 8. Product principles

### Provider neutrality

Consumers use HMP contracts rather than concrete provider objects whenever a provider-neutral abstraction exists.

### Capability discovery

Optional provider features are discoverable capabilities rather than globally assumed functionality.

### Layered geospatial semantics

- HGK: generic planar/mathematical geometry.
- Spatial Engine: geographic/CRS/Earth semantics.
- Maps Core: public map contracts and compatibility facades.
- Provider layer: concrete provider translation/rendering.

### Progressive compatibility

Public contracts evolve through semantic versioning, explicit deprecation and migration guidance.

### Privacy by minimization

V1 does not create an HMP-owned location-history datastore. Consumer applications remain responsible for their own domain persistence when applicable.

### HYBRID visual identity

All first-party HMP UI/documentation follows the approved HYBRID master identity. Maps-specific visual motifs remain subordinate to the corporate brand.

## 9. V1 non-functional baseline

Detailed measurable thresholds remain governed by NFR documentation and CI policy. V1 must at minimum provide:

- deterministic builds and tests;
- supported TypeScript/runtime matrix documented before release;
- numerical validation according to HGK numerical policy;
- public API compatibility checks;
- provider boundary checks;
- no forbidden HGK imports;
- observability for first-party reference/runtime failures where applicable;
- accessible first-party reference UI;
- licensing and attribution compliance for MapLibre and map-data sources.

## 10. Security and privacy baseline

- provider credentials must not be committed to source;
- secrets remain outside HGK and provider-neutral domain contracts;
- precise location is processed only when a consumer feature requires it;
- HMP V1 itself does not retain user-location history;
- telemetry follows data minimization;
- provider licensing/caching rules must be documented before production integration;
- threat model and trust boundaries remain mandatory release documentation.

## 11. Provider requirements

Every provider integration documents:

- supported and unsupported capabilities;
- license and attribution requirements;
- quota/rate-limit behavior;
- caching restrictions;
- credential model;
- fallback/degradation behavior;
- version compatibility;
- data residency/privacy implications when applicable.

MapLibre is the only required production provider for V1.

## 12. Compatibility requirements

- Concrete provider objects must not leak through provider-neutral APIs without an explicitly provider-specific escape hatch.
- Existing Maps Core public contracts are compatibility-sensitive during HGK migration.
- External-consumer status must be verified before removing or narrowing published exports.
- Breaking changes require a major-version decision.

## 13. Documentation and release requirements

Before V1 production release, documentation must include:

- quick-start architecture overview;
- API/integration architecture;
- MapLibre provider matrix;
- security/data/privacy boundaries;
- deployment/runtime support matrix;
- ADR index;
- product roadmap and risk register;
- visual/UX rules for first-party interfaces;
- migration and rollback guidance.

## 14. Product decision record

Resolved baseline decisions:

- PD-01 V1 scope: resolved by sections 3–5.
- PD-02 first production/reference consumer: HYBRID Starlink Tracker.
- PD-03 provider scope: MapLibre only for V1 production requirement.
- PD-04 hosted services: no HMP-hosted geospatial backend required in V1.
- PD-05 persistent data ownership: HMP V1 remains stateless with respect to user/location history.
- PD-06 geocoding/routing: post-V1.
- PD-07 offline support: post-V1.

## 15. Gate status

PRD status: **V1 baseline approved for engineering**.

Documentation is a living engineering artifact and must continue to mature alongside implementation. The former Documentation Freeze has been released. HGK implementation remains governed by the Wave 0–5 gates in the migration plan.

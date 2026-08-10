# HYBRID Maps Platform — Product Requirements Document

Document ID: PRD-01
Status: Draft — Documentation Freeze
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

## 3. Existing baseline

The repository already identifies these architectural/package responsibilities:

- Maps Core: provider-neutral map-facing contracts and value objects;
- Runtime: microkernel, lifecycle, capabilities and orchestration;
- Provider SDK: provider-neutral adapter contracts and registry;
- MapLibre Provider: concrete rendering/camera/layer/marker/popup/control integration;
- Spatial Engine: geographic algorithms and semantics;
- HGK: generic Earth-agnostic mathematical/geometry kernel.

## 4. Intended consumers

Current repository baseline identifies:

- HYBRID Starlink Tracker;
- HYBRID Monitor;
- HYBRID Home Assistant;
- Micael Security;
- future HYBRID products.

Product integration must respect each consuming product's own architecture and security boundaries. A consumer relationship does not imply shared authentication, database or infrastructure.

## 5. Product principles

### Provider neutrality

Consumers should use HMP contracts rather than concrete provider objects whenever a provider-neutral abstraction exists.

### Capability discovery

Optional provider features should be represented as discoverable capabilities rather than assumed globally.

### Layered geospatial semantics

- HGK: generic planar/mathematical geometry.
- Spatial Engine: geographic/CRS/Earth semantics.
- Maps Core: public map contracts and compatibility facades.
- Provider layer: concrete provider translation/rendering.

### Progressive compatibility

Public contracts must evolve through semantic versioning, explicit deprecation and migration guidance.

### HYBRID visual identity

All first-party HMP UI/documentation follows the approved HYBRID master identity. Maps-specific visual motifs are subordinate to the corporate brand.

## 6. Candidate capability domains

The following domains are supported by existing architecture or historical roadmap evidence, but their V1 inclusion remains subject to scope approval:

- map rendering;
- camera/viewport control;
- layers;
- markers;
- popups;
- controls;
- provider registry/resolution;
- normalized provider events;
- coordinates, bounds, CRS and projections;
- geometry and geospatial algorithms;
- React integration;
- provider-independent public `HybridMaps` facade;
- Starlink Tracker integration.

Potential future domains requiring explicit scope decisions:

- geocoding/reverse geocoding;
- routing/navigation;
- offline maps;
- terrain/elevation;
- satellite imagery;
- geofencing;
- spatial search;
- persistent feature storage;
- real-time location streams.

## 7. V1 scope — not yet approved

The repository does not contain sufficient product evidence to declare a final V1 scope. The following conservative candidate is documented for decision, not implementation authorization:

### Candidate V1 core

- provider-neutral map creation and lifecycle;
- MapLibre as the first concrete rendering provider;
- viewport/camera;
- layers;
- markers;
- popups;
- controls;
- normalized events;
- provider registry and capability discovery;
- stable coordinate/bounds/geometry contracts;
- public TypeScript API;
- integration path for one first-party HYBRID consumer;
- HYBRID-branded playground/reference application for validation/documentation only.

### Candidate V1 exclusions

Unless explicitly approved, defer:

- Google Maps/HERE production adapters;
- routing/navigation;
- geocoding;
- offline map packs;
- terrain/3D;
- satellite imagery services;
- persistent user-location history;
- standalone end-user Maps application;
- public third-party SaaS API.

## 8. User/stakeholder groups

### Primary

- HYBRID product developers and architects;
- first-party HYBRID applications consuming maps/geospatial capabilities.

### Secondary/future

- operations teams;
- partner integrations;
- external developers, only if a public SDK/API is later approved.

## 9. Success criteria — requires target values

The product will require measurable targets for:

- map startup latency;
- interaction/rendering performance;
- provider-switch compatibility;
- API stability;
- supported browser/runtime matrix;
- bundle/package size where relevant;
- geospatial numerical accuracy;
- availability/SLO for any hosted services;
- error/telemetry observability;
- accessibility for first-party UI.

Target values belong to NFR-01 and remain pending.

## 10. Security and privacy requirements — high level

Before development release, HMP must define:

- whether it processes precise user location;
- authentication/authorization ownership;
- provider credential handling;
- secret storage boundaries;
- telemetry/data minimization;
- retention policy;
- provider data licensing/caching constraints;
- threat model and trust boundaries.

Detailed specification belongs to SEC-01 and PRIV-01.

## 11. Provider requirements — high level

Each provider integration must document:

- supported capabilities;
- unsupported capabilities;
- license and attribution requirements;
- quota/rate-limit behavior;
- caching restrictions;
- credential model;
- fallback/degradation behavior;
- version compatibility;
- data residency/privacy implications when applicable.

Detailed matrix belongs to DEP-01.

## 12. Compatibility requirements

- Concrete provider objects must not leak through provider-neutral APIs without an explicitly provider-specific escape hatch.
- Existing Maps Core public contracts are compatibility-sensitive during HGK migration.
- External-consumer status must be verified before removing or narrowing published exports.
- Breaking changes require a major-version decision.

## 13. Documentation and support requirements

Before development readiness can be approved, documentation must include:

- quick-start architecture overview;
- API/integration architecture;
- provider matrix;
- security/data/privacy boundaries;
- deployment/runtime support matrix;
- ADR index;
- product roadmap and risk register;
- visual/UX rules for first-party interfaces.

## 14. Open product decisions requiring owner approval

These decisions materially change scope, cost or architecture and are not inferable safely from current repository evidence:

### PD-01 — V1 product scope

Approve or change the Candidate V1 core/exclusions in section 7.

### PD-02 — First production consumer

Select which HYBRID product is the first production integration target. Historical repository text points to Starlink Tracker, but this must be reconfirmed against current portfolio priorities.

### PD-03 — Provider scope for V1

Decide whether V1 ships only MapLibre or also includes production adapters for Google Maps, HERE or others.

### PD-04 — Hosted services

Decide whether V1 is only an embeddable/client-side platform/SDK or also includes HYBRID-hosted geospatial backend services.

### PD-05 — Persistent data ownership

Decide whether HMP itself stores geospatial/user/location data in V1 or remains stateless/provider-facing.

### PD-06 — Geocoding and routing

Decide whether geocoding/reverse geocoding and routing/navigation are V1 requirements or post-V1 capabilities.

### PD-07 — Offline support

Decide whether offline maps/data are required in V1.

## 15. Gate status

PRD status: **Draft / Blocked on PD-01 through PD-07**.

Development authorization: **No**.

Documentation may continue in domains that do not depend on these decisions, but final functional/NFR scope and several architecture documents cannot be approved until the owner resolves the product decisions above.

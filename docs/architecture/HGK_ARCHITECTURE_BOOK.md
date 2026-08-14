# HGK Architecture Book

Status: Draft v0.1  
Project: HYBRID Geometry Kernel (HGK)  
Repository: HYBRID Maps Platform  
Branch: `feat/hgk-foundation`

## 1. Purpose

The HYBRID Geometry Kernel is the reusable mathematical and geometric foundation for HYBRID products. Its purpose is to concentrate deterministic, provider-independent and presentation-independent computation in one package.

The HGK is not a map SDK, a renderer, a provider adapter or a geospatial application framework.

## 2. Architectural position

Approved dependency direction:

```text
Applications
    -> HYBRID Maps Platform public APIs
        -> Spatial and maps domain packages
            -> @hybrid/hgk
```

The inverse direction is forbidden. The HGK must never depend on applications, map providers, rendering engines or Maps Platform runtime services.

## 3. Scope

### 3.1 Responsibilities that may belong to the HGK

A capability may enter the HGK when it is general-purpose, deterministic and reusable outside map rendering.

Candidate responsibility groups:

- scalar mathematics and numeric helpers;
- tolerances, rounding and precision policies;
- units and explicit conversions required by geometric computation;
- vectors, matrices and transformations;
- coordinates without provider or UI semantics;
- generic two-dimensional and three-dimensional geometry primitives;
- bounding volumes and envelopes;
- measurements derived from geometry;
- generic geometric predicates;
- generic geometric transformations;
- reusable geometry algorithms;
- generic spatial data structures when they do not encode map-provider behavior;
- geometry validation that does not require external formats or providers.

### 3.2 Responsibilities explicitly outside the HGK

The following responsibilities do not belong to the HGK:

- MapLibre, Google Maps, HERE, OpenStreetMap or other provider APIs;
- DOM, React, Vue, Angular, Svelte or framework components;
- Canvas, SVG, WebGL or rendering state;
- map layers, styles, markers, popups, controls or hit testing;
- map viewport behavior, camera animation or user interaction;
- tiles, tile URLs, provider credentials or provider-specific projections;
- GeoJSON, WKT, WKB, KML, GPX and CSV parsers or serializers in the kernel core;
- application events, runtime modules, dependency injection or plugin lifecycle;
- network access, persistence, logging or configuration services;
- business rules from Starlink Tracker, Monitor, Condo, Hercules or other products.

Format support may live in dedicated packages that depend on the HGK, but the HGK must not depend on those formats.

## 4. Boundary with existing packages

### 4.1 `@hybrid/maps-runtime`

Owns lifecycle, modules, services, events and capability discovery. It must not be moved into the HGK.

### 4.2 `@hybrid/maps-provider-sdk` and provider packages

Own provider contracts and adapters. They may consume Maps Platform domain types but must not be dependencies of the HGK.

### 4.3 `@hybrid/maps-core`

`maps-core` currently contains mixed responsibilities and must be inventoried before any migration.

After the inventory, each item will receive one of four decisions:

1. remain in `maps-core`;
2. migrate to `@hybrid/hgk`;
3. be split into a kernel primitive plus a maps-domain wrapper;
4. be deprecated and replaced through a compatibility layer.

The HGK will not automatically replace `maps-core`.

### 4.4 Spatial Engine

The Spatial Engine will orchestrate geospatial operations, topology policies, indexes, projections and format integrations. It may depend on the HGK. The HGK must not depend on the Spatial Engine.

## 5. Admission criteria

A class, function or module may be proposed for the HGK only when every mandatory criterion is satisfied:

- it has no UI dependency;
- it has no provider dependency;
- it has no framework dependency;
- it has no network or persistence dependency;
- it represents mathematics, generic geometry or reusable geometric algorithms;
- it can be tested deterministically;
- it is reusable by at least two plausible HYBRID product domains;
- its public contract can be expressed without map-provider terminology;
- its precision and error behavior can be documented.

If any mandatory criterion fails, the component remains outside the HGK or is split.

## 6. Dependency rules

1. `@hybrid/hgk` may depend only on language/runtime standard capabilities and explicitly approved low-level dependencies.
2. Kernel modules may depend only on lower-level kernel modules defined by the internal dependency map.
3. Circular dependencies are forbidden.
4. Public entry points must not expose internal implementation paths.
5. Provider, rendering and application packages may depend on the HGK; the HGK may not depend on them.
6. Compatibility re-exports must be temporary, documented and covered by tests.
7. A new external dependency requires an architecture decision record before adoption.

## 7. Initial internal layers

This is a provisional structure. It is not authorization to create every folder immediately.

```text
src/
  core/
  math/
  precision/
  algebra/
  geometry/
  algorithms/
  validation/
  collections/
  types/
  index.ts
```

Creation order must follow the dependency map produced after the inventory.

## 8. Design principles

- deterministic behavior;
- immutable value objects by default;
- explicit units and coordinate semantics;
- no hidden global state;
- no provider-specific vocabulary in public contracts;
- precision policies must be explicit;
- invalid states should be prevented or reported through stable errors;
- algorithms must define complexity and edge-case behavior;
- public APIs require tests and documentation before release;
- backwards compatibility must be intentional, not accidental.

## 9. Migration policy

Migration is incremental and reversible.

For each component:

1. identify current source and consumers;
2. classify responsibility and dependencies;
3. record the destination decision;
4. define the target public contract;
5. add or preserve characterization tests;
6. implement or move the component;
7. provide compatibility exports when required;
8. update consumers in small batches;
9. remove compatibility only in an explicitly planned breaking release.

No bulk file movement is permitted before the inventory and dependency map are approved.

## 10. Quality gates

A migrated public component is not complete until it has:

- documented purpose and invariants;
- unit tests for normal, boundary and invalid cases;
- explicit precision behavior where applicable;
- stable public export;
- no forbidden dependencies;
- migration notes and compatibility status;
- build and test validation in the repository CI.

Coverage percentage alone is not an acceptance criterion.

## 11. Phase 0 acceptance gates

### Gate 0.1 - Architecture

- [x] Purpose defined.
- [x] In-scope responsibilities defined.
- [x] Out-of-scope responsibilities defined.
- [x] Package boundaries defined.
- [x] Dependency direction defined.
- [x] Admission criteria defined.
- [x] Migration policy defined.
- [x] Quality gates defined.

### Gate 0.2 - Conventions

- [ ] Naming conventions defined.
- [ ] Public API and export conventions defined.
- [ ] Error model defined.
- [ ] Immutability policy defined.
- [ ] Units and precision conventions defined.
- [ ] Testing conventions defined.
- [ ] Versioning and deprecation conventions defined.

### Gate 0.3 - Inventory

- [ ] Existing packages and source files catalogued.
- [ ] Current public exports catalogued.
- [ ] Current consumers identified.
- [ ] Each candidate classified as remain, migrate, split or deprecate.

### Gate 0.4 - Dependency map

- [ ] Internal dependency graph documented.
- [ ] Circular dependencies identified.
- [ ] Migration order derived from dependencies.

### Gate 0.5 - Migration plan

- [ ] First migration slice selected.
- [ ] Characterization tests identified.
- [ ] Compatibility approach approved.
- [ ] Rollback procedure documented.

Only after Gates 0.1 through 0.5 are complete may the first production class be migrated.

## 12. Immediate next step

The next authorized activity is Gate 0.2: define coding, API, error, precision, testing, versioning and deprecation conventions.

Inventory and code migration must not begin before Gate 0.2 is complete.

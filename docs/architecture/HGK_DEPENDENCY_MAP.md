# HGK Dependency Map

Status: Phase 0.4 - Initial complete map  
Scope: HGK, Maps Core, Spatial Engine, Provider SDK, MapLibre Provider, Playground, Runtime and Feature Store  
Rule: this document defines dependency direction and migration sequencing. It does not authorize code movement by itself.

## 1. Objective

Transform the Phase 0.3 inventory into an explicit dependency model that answers:

1. which components depend on which abstractions;
2. which dependencies are architectural and which are compatibility-only;
3. what can be introduced without breaking current consumers;
4. what order must be followed during migration;
5. which temporary adapters are required;
6. where circular dependencies must be prohibited.

## 2. Architectural dependency law

All dependency arrows must point upward from lower-level mathematical foundations toward higher-level product concerns.

```text
Applications
    ↓
Maps Platform APIs and Providers
    ↓
Spatial Engine
    ↓
HGK
    ↓
Foundation
```

Allowed direction:

```text
Foundation <- HGK <- Spatial Engine <- Maps Platform <- Applications
```

Prohibited direction:

```text
HGK -> Spatial Engine
HGK -> Maps Platform
HGK -> Provider SDK
HGK -> MapLibre
HGK -> DOM
HGK -> GeoJSON
```

## 3. Current package dependency graph

Confirmed current repository-level graph:

```text
@hybrid/maps-playground
    ├──> @hybrid/maps-core
    ├──> @hybrid/maps-provider-sdk
    └──> @hybrid/maps-provider-maplibre

@hybrid/maps-provider-maplibre
    ├──> @hybrid/maps-core
    ├──> @hybrid/maps-provider-sdk
    └──> maplibre-gl

@hybrid/maps-provider-sdk
    └──> @hybrid/maps-core

@hybrid/maps-runtime
    └──> no geometry dependency

@hybrid/maps-feature-store
    └──> @hybrid/maps-events

@hybrid/maps-spatial-engine
    └──> no confirmed workspace consumers

@hybrid/hgk
    └──> intended foundation only
```

## 4. Current symbol dependency graph

### 4.1 Maps Core

```text
CoordinateInput
    ↓
Coordinate
    ↓
BoundingBox

Coordinate + BoundingBox
    ↓
ViewportOptions
    ↓
Viewport

CrsCode + Coordinate
    ↓
Projection

Coordinate
    ↓
Geometry union
```

### 4.2 Spatial Engine geometry

```text
Coordinate
    ↓
BoundingBox

Coordinate + BoundingBox
    ↓
Point
    ↓
Geometry union

Coordinate + BoundingBox
    ↓
LineString
    ↓
Geometry union

Coordinate + BoundingBox
    ↓
Polygon
    ↓
Geometry union

Coordinate + BoundingBox
    ↓
MultiPoint
    ↓
Geometry union

Coordinate + BoundingBox
    ↓
MultiLineString
    ↓
Geometry union

Coordinate + BoundingBox
    ↓
MultiPolygon
    ↓
Geometry union

Geometry union
    ↓
GeometryCollection

All geometry factories
    ↓
GeometryFactory
```

### 4.3 Spatial Engine measurements

```text
Coordinate
    ↓
Distance

Distance + LineString
    ↓
Length

Coordinate
    ↓
Bearing

Distance constant + Polygon
    ↓
Area

Distance + all geometries
    ↓
Centroid
```

### 4.4 Validation

```text
Coordinate
    ↓
Geometry family
    ↓
GeometryValidator
```

## 5. Target package dependency graph

The intended target must be:

```text
@hybrid/foundation
    ↓
@hybrid/hgk
    ↓
@hybrid/maps-spatial-engine
    ↓
@hybrid/maps-core
    ↓
@hybrid/maps-provider-sdk
    ↓
@hybrid/maps-provider-maplibre
    ↓
@hybrid/maps-playground
```

Parallel packages that remain independent:

```text
@hybrid/maps-runtime
@hybrid/maps-events
@hybrid/maps-feature-store
```

They may be consumed by the Maps Platform, but HGK must never depend on them.

## 6. Target responsibility boundaries

### 6.1 Foundation

May contain:

- generic error contracts;
- result types;
- low-level assertions;
- shared language-level utilities that are not mathematical or product-specific.

Must not contain:

- geometry;
- map concepts;
- CRS;
- providers;
- application logic.

### 6.2 HGK

May contain:

- scalar precision policy;
- vectors;
- matrices;
- generic points;
- segments;
- envelopes;
- planar geometry types;
- structural validation;
- generic planar algorithms.

Must not contain:

- longitude/latitude semantics;
- EPSG or CRS;
- Earth radius;
- Haversine;
- MapLibre;
- GeoJSON;
- DOM or UI.

### 6.3 Spatial Engine

May contain:

- geographic coordinate types;
- CRS and projections;
- spherical or ellipsoidal distance;
- geographic bearing;
- geographic area;
- geospatial validation;
- conversion between geographic objects and HGK primitives.

Must not contain:

- provider APIs;
- rendering;
- DOM;
- MapLibre-specific code.

### 6.4 Maps Core

May contain:

- public map-facing value objects;
- viewport and camera state;
- compatibility facades;
- provider-neutral map geometry contracts;
- adapters that preserve existing public APIs during migration.

Must not become the mathematical kernel.

### 6.5 Provider SDK

May depend on Maps Core public contracts.

Must not depend directly on HGK while compatibility contracts remain in Maps Core. Direct HGK exposure through provider contracts requires a separate approved versioning decision.

## 7. Dependency classification

Every edge receives one of four classifications.

### Stable

A dependency that should remain in the final architecture.

Examples:

- Spatial Engine -> HGK;
- Maps Core -> Spatial Engine;
- Provider SDK -> Maps Core.

### Transitional

A dependency that exists only to preserve compatibility during migration.

Examples:

- Maps Core `Coordinate` facade -> Spatial Engine geographic coordinate;
- Spatial Engine legacy geometry -> HGK geometry adapter.

### Legacy

A dependency or contract that should be deprecated and removed after consumers migrate.

Examples:

- duplicate Spatial Engine coordinate factory after canonical geographic coordinate is established;
- duplicate geometry union in Maps Core if superseded by a stable provider-neutral contract.

### Prohibited

An architectural violation.

Examples:

- HGK importing CRS;
- HGK importing GeoJSON;
- Spatial Engine importing MapLibre;
- Foundation importing HGK.

## 8. Required compatibility adapters

### 8.1 Coordinate adapter

Purpose:

- preserve `new Coordinate(longitude, latitude, altitude?)`;
- preserve `.longitude`, `.latitude`, `.altitude`;
- preserve `Coordinate.from`;
- preserve exact current validation behavior initially.

Target internal direction:

```text
maps-core Coordinate facade
    ↓
Spatial Engine GeographicCoordinate
    ↓
HGK Point/Vector primitive
```

The public constructor must not disappear during the first migration wave.

### 8.2 BoundingBox adapter

Purpose:

- preserve `west`, `south`, `east`, `north`;
- preserve `contains`, `intersects`, `union`, `center`;
- convert internally to an HGK axis-aligned envelope.

Target direction:

```text
maps-core BoundingBox facade
    ↓
Spatial Engine GeographicBounds
    ↓
HGK Envelope2
```

### 8.3 Geometry adapter

Purpose:

- preserve current Provider SDK layer source contracts;
- preserve `Point`, `LineString` and `Polygon` shapes currently consumed by MapLibre;
- convert to canonical HGK geometry internally;
- avoid exposing GeoJSON from HGK.

Target direction:

```text
Maps Core Geometry contract
    ↓
Spatial Engine conversion
    ↓
HGK geometry
```

MapLibre conversion remains provider-side:

```text
Maps Core Geometry
    ↓
MapLibre adapter
    ↓
GeoJSON
```

### 8.4 Viewport adapter

Viewport remains in Maps Core.

It may continue using the public `Coordinate` and `BoundingBox` facades while those facades migrate internally.

No HGK viewport type should be created.

## 9. Topological migration order

The safe migration order is:

### Step 1 - Foundation contracts

Introduce only the low-level contracts HGK requires.

No existing package changes.

### Step 2 - Precision

Create canonical precision policy in HGK:

- epsilon configuration;
- finite-number assertions;
- approximate equality;
- explicit exact equality when required.

No public Maps API changes.

### Step 3 - Algebra primitives

Introduce:

- `Vector2`;
- optionally `Vector3` only if current altitude use cases justify it;
- scalar and vector operations.

No geographic semantics.

### Step 4 - Generic point and envelope

Introduce:

- `Point2` or equivalent canonical point primitive;
- `Envelope2` or equivalent axis-aligned bounds type.

These become dependencies for later geometry types.

### Step 5 - Generic geometry family

Introduce, in dependency order:

1. point geometry;
2. segment and line string;
3. linear ring;
4. polygon;
5. multi-point;
6. multi-line string;
7. multi-polygon;
8. geometry collection.

### Step 6 - Structural validation

Introduce validation that does not know longitude, latitude or Earth ranges:

- finite coordinate checks;
- minimum point counts;
- closed rings;
- duplicate consecutive points;
- empty geometry rules;
- optional topology checks in later increments.

### Step 7 - Generic planar algorithms

Introduce only algorithms with unambiguous planar semantics:

- Euclidean distance;
- planar length;
- planar area;
- planar centroid;
- bounding envelope.

### Step 8 - Spatial Engine adapters

Introduce geospatial wrappers and conversion functions:

- GeographicCoordinate <-> HGK Point2;
- GeographicBounds <-> HGK Envelope2;
- geographic geometry <-> HGK geometry.

Preserve current Spatial Engine APIs temporarily.

### Step 9 - Maps Core internal migration

Refactor Maps Core implementations to delegate to Spatial Engine/HGK while preserving the existing public surface.

Priority order:

1. `Coordinate`;
2. `BoundingBox`;
3. `Geometry` conversion;
4. `Viewport` internals if necessary.

### Step 10 - Provider SDK verification

No contract change should be required in the first migration.

Verify:

- public `.d.ts` compatibility;
- provider interfaces compile unchanged;
- no HGK types leak unintentionally.

### Step 11 - MapLibre provider verification

Verify:

- coordinate conversion;
- viewport conversion;
- fit bounds;
- geometry-to-GeoJSON conversion;
- marker and popup behavior;
- `getCenter()` compatibility.

### Step 12 - Playground acceptance

Verify the Rio de Janeiro reference scenario:

- map creation;
- marker;
- popup;
- camera movement;
- provider disposal.

### Step 13 - Legacy API deprecation

Only after successful compatibility verification:

- mark duplicate Spatial Engine APIs deprecated;
- publish migration guidance;
- schedule removal for a major version.

## 10. Migration waves

### Wave 0 - Test safety net

Before moving production code:

- create characterization tests for current Maps Core behavior;
- create tests for current Spatial Engine factories and algorithms;
- create compile-time API tests;
- confirm or reject the `GeometryFactory.point` defect candidate.

Exit gate:

- all current intended behavior is represented by tests;
- known defects are documented separately from compatibility behavior.

### Wave 1 - HGK mathematical base

Deliver:

- precision;
- Vector2;
- Point2;
- Envelope2;
- tests and documentation.

No consumer migration.

### Wave 2 - HGK geometry base

Deliver:

- geometry family;
- structural validation;
- planar algorithms;
- complete deterministic tests.

No public Maps API changes.

### Wave 3 - Spatial Engine bridge

Deliver:

- geographic wrappers;
- conversion adapters;
- preserved existing exports;
- geodesic algorithms remaining outside HGK.

### Wave 4 - Maps Core compatibility migration

Deliver:

- delegation from existing public classes to new internals;
- unchanged Provider SDK source contracts;
- unchanged Playground behavior.

### Wave 5 - Consumer migration and deprecation

Deliver:

- provider and application migration where beneficial;
- deprecation notices;
- API documentation;
- removal plan for a future major version.

## 11. Critical path

The critical path is:

```text
Precision
    ↓
Vector2 / Point2
    ↓
Envelope2
    ↓
Geometry family
    ↓
Structural validation
    ↓
Spatial Engine adapters
    ↓
Maps Core facades
    ↓
Provider SDK
    ↓
MapLibre Provider
    ↓
Playground
```

Any delay or ambiguity in canonical point and envelope contracts blocks every later wave.

## 12. Parallelizable work

The following work can proceed in parallel after contracts are approved:

- Vector2 and precision tests;
- API snapshot tooling;
- characterization tests for Maps Core;
- characterization tests for geodesic Spatial Engine algorithms;
- external-consumer investigation;
- documentation of deprecation policy.

The following work must not proceed in parallel without a shared approved contract:

- multiple competing coordinate implementations;
- multiple competing envelope implementations;
- geometry migration before canonical point semantics;
- Maps Core migration before Spatial Engine adapters.

## 13. Circular dependency prevention

Mandatory rules:

1. HGK imports only Foundation and language/runtime primitives.
2. Spatial Engine may import HGK; HGK may never import Spatial Engine.
3. Maps Core may import Spatial Engine and HGK indirectly; Spatial Engine may never import Maps Core.
4. Provider SDK may import Maps Core; Maps Core may never import Provider SDK.
5. Providers may import Provider SDK and Maps Core; those packages may never import concrete providers.
6. Applications may import public packages; public packages may never import applications.

## 14. Risk register

| Risk | Impact | Mitigation |
|---|---|---|
| Core contracts are exposed through Provider SDK | High | Preserve facades and run compile-time API tests. |
| Spatial Engine may have unknown external consumers | High | Treat published exports as compatibility-sensitive until verified. |
| No confirmed characterization tests | High | Wave 0 is mandatory before production migration. |
| Coordinate semantics mix generic and geographic concerns | High | Separate HGK point from Spatial Engine geographic coordinate. |
| Centroid mixes planar and spherical assumptions | High | Replace with explicitly named planar and geospatial policies. |
| Factory and validator policies conflict | Medium | Approve construction-validity policy before migration. |
| GeoJSON conversion could leak downward | Medium | Keep conversion inside provider or dedicated serialization layer. |
| Duplicate APIs may persist indefinitely | Medium | Define deprecation dates and ownership. |

## 15. Phase 0.4 decisions

Approved architectural decisions represented by this map:

1. HGK is Earth-agnostic.
2. Spatial Engine is the geospatial layer above HGK.
3. Maps Core remains the compatibility and public map-contract layer.
4. Provider SDK continues consuming Maps Core during the first migration cycle.
5. Runtime and Feature Store remain outside the HGK critical path.
6. Migration begins with tests, not with moving code.
7. The first canonical contracts to implement are precision, Point2/Vector2 and Envelope2.
8. No existing public API is removed in the first migration cycle.

## 16. Exit criteria for Phase 0.4

Phase 0.4 is complete when:

- package-level graph is documented;
- symbol-level dependency graph is documented;
- target dependency direction is explicit;
- prohibited dependencies are explicit;
- migration order is topologically defined;
- compatibility adapters are identified;
- critical path and parallel work are identified;
- migration risks and gates are recorded.

All criteria above are satisfied by this document, subject to architectural review.

## 17. Next phase

Phase 0.5 - Migration Plan must convert this dependency map into executable work items with:

- package and file targets;
- acceptance criteria;
- test requirements;
- compatibility guarantees;
- commit boundaries;
- rollback strategy;
- versioning and deprecation milestones.

No production source migration is authorized until Phase 0.5 is approved.

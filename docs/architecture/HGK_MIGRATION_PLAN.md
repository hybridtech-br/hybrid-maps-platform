# HGK Migration Plan

Status: Phase 0.5 - Approved planning baseline  
Repository: `hybridtech-br/hybrid-maps-platform`  
Branch: `feat/hgk-foundation`

## 1. Objective

Convert the HGK dependency map into executable engineering work while preserving current public contracts and preventing accidental coupling between HGK, Spatial Engine, Maps Core and providers.

No production migration may begin before Wave 0 exit criteria are satisfied.

## 2. Global migration rules

1. No public API removal in the first migration cycle.
2. HGK remains independent from CRS, EPSG, longitude, latitude, Earth models, providers and rendering.
3. Existing defects must be characterized before they are corrected.
4. Every production change must be paired with tests.
5. Each PR must be independently reversible.
6. Maps Core remains the compatibility facade during transition.
7. Spatial Engine owns geographic semantics.
8. MapLibre and GeoJSON conversions remain outside HGK.

## 3. Commit and PR policy

Each PR must:

- target one migration objective;
- contain no unrelated refactoring;
- include tests and documentation for the changed behavior;
- preserve build and type-check status;
- identify rollback steps;
- state whether the change is internal, additive, deprecated or breaking.

Recommended commit boundaries:

1. tests or tooling;
2. implementation;
3. integration adapters;
4. documentation.

Avoid mixing all four in one large commit when they can be reviewed independently.

## 4. Wave 0 - Safety net and characterization

### Goal

Create reliable evidence of current behavior before changing production implementations.

### 4.1 Maps Core characterization tests

Target files:

```text
packages/core/src/__tests__/Coordinate.test.ts
packages/core/src/__tests__/BoundingBox.test.ts
packages/core/src/__tests__/Viewport.test.ts
packages/core/src/__tests__/Geometry.test.ts
```

Required coverage:

- constructor validation boundaries;
- finite number validation;
- exact equality;
- altitude handling;
- object freezing;
- longitude and latitude limits;
- bounding box ordering;
- `contains`, `intersects`, `union` and `center`;
- viewport zoom, bearing normalization and pitch limits;
- current geometry object shapes.

### 4.2 Spatial Engine characterization tests

Target files:

```text
packages/spatial-engine/src/__tests__/Coordinate.test.ts
packages/spatial-engine/src/__tests__/BoundingBox.test.ts
packages/spatial-engine/src/__tests__/GeometryFactory.test.ts
packages/spatial-engine/src/__tests__/Distance.test.ts
packages/spatial-engine/src/__tests__/Length.test.ts
packages/spatial-engine/src/__tests__/Bearing.test.ts
packages/spatial-engine/src/__tests__/Area.test.ts
packages/spatial-engine/src/__tests__/Centroid.test.ts
packages/spatial-engine/src/__tests__/GeometryValidator.test.ts
```

Required coverage:

- current factory behavior;
- immutable outputs;
- minimum coordinate counts;
- current missing validation behavior;
- Haversine distance reference cases;
- line and multiline length;
- initial and final bearing;
- spherical area behavior;
- current centroid behavior;
- structural and geographic validation outcomes.

### 4.3 GeometryFactory defect decision

Investigate and test:

```text
GeometryFactory.point(coordinate)
```

Decision record must classify it as one of:

- confirmed defect to fix before migration;
- compatibility behavior to preserve temporarily;
- dead or unreachable API.

No silent correction is allowed.

### 4.4 Compile-time API tests

Add API contract tests for:

- `@hybrid/maps-core` exports;
- `@hybrid/maps-spatial-engine` exports;
- Provider SDK use of Maps Core types;
- MapLibre provider compilation against those contracts.

Suggested mechanisms:

- `tsc --noEmit` fixture packages;
- type assertion tests;
- generated declaration comparison when practical.

### Wave 0 acceptance criteria

- all targeted current behaviors are represented by tests;
- all tests pass before production migration;
- the GeometryFactory issue has a written decision;
- API compile fixtures pass;
- CI executes the new test suites.

### Wave 0 rollback

Remove only the new test and fixture files. No production code should require rollback because Wave 0 changes no runtime implementation.

## 5. Wave 1 - HGK mathematical foundation

### Goal

Create the first independent HGK primitives without migrating consumers.

### Target package

```text
packages/hgk/
```

### Initial files

```text
packages/hgk/package.json
packages/hgk/tsconfig.json
packages/hgk/src/index.ts
packages/hgk/src/precision/Precision.ts
packages/hgk/src/algebra/Vector2.ts
packages/hgk/src/geometry/Point2.ts
packages/hgk/src/geometry/Envelope2.ts
```

Corresponding tests:

```text
packages/hgk/src/precision/__tests__/Precision.test.ts
packages/hgk/src/algebra/__tests__/Vector2.test.ts
packages/hgk/src/geometry/__tests__/Point2.test.ts
packages/hgk/src/geometry/__tests__/Envelope2.test.ts
```

### 5.1 Precision contract

Required capabilities:

- finite-number assertion;
- configurable epsilon comparison;
- exact equality helper;
- approximate equality helper;
- deterministic behavior for NaN and infinity.

Acceptance criteria:

- no geographic naming;
- 100% branch coverage for public precision functions;
- exact and approximate semantics clearly documented.

### 5.2 Vector2

Required capabilities:

- immutable `x` and `y`;
- add, subtract and scale;
- dot product;
- squared magnitude and magnitude;
- exact and approximate equality;
- finite component validation.

Acceptance criteria:

- no map or geographic semantics;
- deterministic immutable results;
- comprehensive algebraic tests.

### 5.3 Point2

Required capabilities:

- immutable `x` and `y`;
- conversion to and from `Vector2` where useful;
- exact and approximate equality;
- finite coordinate validation.

Acceptance criteria:

- no longitude or latitude terminology;
- no CRS dependency;
- no provider dependency.

### 5.4 Envelope2

Required capabilities:

- `minX`, `minY`, `maxX`, `maxY`;
- ordering validation;
- contains point;
- intersects envelope;
- union;
- center;
- width and height.

Acceptance criteria:

- handles boundary inclusion explicitly;
- immutable behavior;
- complete degenerate-envelope tests.

### Wave 1 acceptance criteria

- HGK package builds independently;
- HGK imports no Maps packages;
- public exports are documented;
- all HGK tests pass;
- no existing consumer is modified.

### Wave 1 rollback

Delete the additive HGK files and workspace reference. No existing package behavior changes.

## 6. Wave 2 - HGK geometry and planar algorithms

### Goal

Add generic geometry types and structural validation.

### Planned implementation order

```text
Segment2
LineString2
LinearRing2
Polygon2
MultiPoint2
MultiLineString2
MultiPolygon2
GeometryCollection2
```

### Structural validation

Must include:

- finite coordinates;
- minimum coordinate counts;
- closed linear rings;
- duplicate consecutive point detection;
- empty geometry policy;
- nested collection policy;
- deterministic validation issue codes.

### Planar algorithms

Implement explicitly planar versions of:

- Euclidean distance;
- length;
- area;
- centroid;
- bounding envelope.

Names and documentation must make planar semantics unambiguous.

### Wave 2 acceptance criteria

- every geometry has construction and validation tests;
- algorithms have reference-value and edge-case tests;
- no Earth model or CRS appears in HGK;
- geometry collection recursion policy is explicit;
- exported API is additive and reviewed.

### Wave 2 rollback

Revert the Wave 2 PR as a unit. Wave 1 remains intact.

## 7. Wave 3 - Spatial Engine bridge

### Goal

Introduce explicit geographic wrappers and conversion adapters while preserving current Spatial Engine exports.

### Planned files

```text
packages/spatial-engine/src/coordinates/GeographicCoordinate.ts
packages/spatial-engine/src/bounds/GeographicBounds.ts
packages/spatial-engine/src/adapters/HgkCoordinateAdapter.ts
packages/spatial-engine/src/adapters/HgkGeometryAdapter.ts
packages/spatial-engine/src/validation/GeographicGeometryValidator.ts
```

### Responsibilities

- validate longitude and latitude ranges;
- convert GeographicCoordinate to and from HGK Point2;
- convert GeographicBounds to and from HGK Envelope2;
- convert geographic geometry structures to HGK geometry;
- preserve Haversine, bearing and spherical area in Spatial Engine;
- separate planar centroid from geospatial centroid behavior.

### Compatibility guarantees

- current exports remain resolvable;
- current function signatures remain available;
- adapters are internal or additive;
- no provider-specific type is introduced.

### Wave 3 acceptance criteria

- adapter round-trip tests pass;
- current characterization tests still pass;
- geodesic tests remain unchanged or intentionally versioned;
- HGK contains no geographic imports;
- Spatial Engine depends on HGK in one direction only.

### Wave 3 rollback

Revert bridge and adapter commits. Existing implementations remain available until a later wave replaces them.

## 8. Wave 4 - Maps Core compatibility migration

### Goal

Delegate Maps Core internals to Spatial Engine and HGK without changing the public API consumed by Provider SDK and MapLibre.

### Migration order

1. `Coordinate`;
2. `BoundingBox`;
3. `Geometry` conversions;
4. `Viewport` only where internal changes are required.

### Coordinate guarantees

Preserve:

- constructor signature;
- public properties;
- `Coordinate.from`;
- exact equality;
- validation messages where practical;
- frozen instances.

### BoundingBox guarantees

Preserve:

- constructor signature;
- `west`, `south`, `east`, `north`;
- `contains`, `intersects`, `union`, `center`;
- frozen instances.

### Geometry guarantees

Preserve Provider SDK and MapLibre source shapes during this wave.

No HGK-specific type may leak into public provider contracts without a separate versioning proposal.

### Wave 4 acceptance criteria

- all Maps Core characterization tests pass unchanged;
- API compile fixtures pass;
- Provider SDK builds unchanged;
- MapLibre provider builds unchanged;
- declaration diff shows no unintended breaking change.

### Wave 4 rollback

Restore prior Maps Core implementations while keeping additive HGK and Spatial Engine packages. Because public contracts remain unchanged, rollback must not require consumer changes.

## 9. Wave 5 - Consumer verification and deprecation

### Goal

Verify all in-repository consumers and prepare the controlled retirement of duplicate APIs.

### Provider SDK verification

Validate:

- map creation options;
- layer definitions;
- marker and popup contracts;
- camera adapter;
- map adapter;
- provider registry.

### MapLibre verification

Validate:

- coordinate conversion;
- viewport conversion;
- bounds conversion;
- fit bounds;
- geometry to GeoJSON;
- center retrieval;
- marker and popup operations.

### Playground acceptance scenario

Use Rio de Janeiro as the standard demonstration location.

Validate:

- map startup;
- initial center and zoom;
- marker creation;
- popup display;
- camera movement;
- geometry layer rendering;
- provider disposal.

### Deprecation candidates

Only after successful consumer verification:

- duplicate Spatial Engine coordinate factory;
- duplicate bounding box representation;
- legacy geometry constructors superseded by canonical adapters;
- ambiguous centroid APIs;
- non-exported modules intentionally promoted or retained as internal.

### Wave 5 acceptance criteria

- all repository consumers build and test successfully;
- playground smoke test passes;
- deprecations include replacement guidance;
- no removal occurs before a major-version decision;
- external consumer uncertainty is documented.

## 10. Versioning strategy

### Patch release

Allowed only for:

- internal implementation replacement with identical public behavior;
- tests and documentation;
- confirmed bug fixes that do not alter documented contracts.

### Minor release

Required for:

- additive HGK exports;
- additive Spatial Engine adapters;
- deprecation annotations;
- new non-breaking geometry functionality.

### Major release

Required for:

- public property or signature changes;
- removal of legacy exports;
- equality semantic changes;
- validation behavior changes that reject previously accepted public inputs;
- replacement of Maps Core contracts with HGK types.

## 11. Deprecation policy

Every deprecated API must include:

- deprecation annotation;
- replacement API;
- migration example;
- first deprecated version;
- earliest removal major version;
- known behavior differences.

No deprecated API may be removed in the same release in which it is first deprecated.

## 12. Rollback strategy

General rollback order:

1. revert consumer migration;
2. revert Maps Core delegation;
3. revert Spatial Engine adapters;
4. retain or revert additive HGK packages depending on fault isolation.

Because the migration is additive-first, HGK may remain present even when higher-layer integration is rolled back.

Rollback triggers:

- public declaration incompatibility;
- failing characterization tests;
- provider compilation failure;
- playground regression;
- dependency cycle;
- geographic semantics appearing in HGK;
- numerical regression outside approved tolerance.

## 13. Required CI gates

Before merge, each applicable PR must pass:

- formatting;
- lint;
- TypeScript build;
- unit tests;
- characterization tests;
- API compile fixtures;
- package dependency boundary checks;
- provider build;
- playground build.

Recommended additional gate:

- automated forbidden-import check for HGK.

Forbidden HGK imports include patterns related to:

```text
maps-core
spatial-engine
provider
maplibre
geojson
crs
epsg
```

## 14. Work item sequence

### Milestone M0 - Safety

- M0.1 create Maps Core characterization tests;
- M0.2 create Spatial Engine characterization tests;
- M0.3 decide GeometryFactory defect;
- M0.4 create API compile fixtures;
- M0.5 integrate test suites into CI.

### Milestone M1 - Foundation

- M1.1 establish HGK package skeleton;
- M1.2 implement Precision;
- M1.3 implement Vector2;
- M1.4 implement Point2;
- M1.5 implement Envelope2;
- M1.6 publish HGK API documentation.

### Milestone M2 - Geometry

- M2.1 implement primitive geometry;
- M2.2 implement aggregate geometry;
- M2.3 implement structural validation;
- M2.4 implement planar algorithms;
- M2.5 complete geometry API review.

### Milestone M3 - Geospatial bridge

- M3.1 implement geographic coordinate wrapper;
- M3.2 implement geographic bounds wrapper;
- M3.3 implement coordinate and bounds adapters;
- M3.4 implement geometry adapters;
- M3.5 separate planar and geospatial centroid policies.

### Milestone M4 - Compatibility migration

- M4.1 migrate Maps Core Coordinate internals;
- M4.2 migrate BoundingBox internals;
- M4.3 migrate geometry conversion internals;
- M4.4 verify Viewport;
- M4.5 run public API comparison.

### Milestone M5 - Consumers and deprecation

- M5.1 verify Provider SDK;
- M5.2 verify MapLibre provider;
- M5.3 verify Playground;
- M5.4 publish migration guide;
- M5.5 annotate approved deprecations.

## 15. Authorization gates

### Gate A - Begin implementation

Requires:

- Phase 0.5 approved;
- Wave 0 backlog accepted;
- no unresolved architecture contradiction.

### Gate B - Begin consumer migration

Requires:

- Waves 1 to 3 complete;
- characterization tests green;
- adapter round-trip tests green;
- dependency boundary checks green.

### Gate C - Begin deprecation

Requires:

- Wave 4 complete;
- all in-repository consumers green;
- migration guide available;
- versioning decision recorded.

## 16. Phase 0.5 completion criteria

Phase 0.5 is complete when:

- work is divided into Waves 0 through 5;
- package and file targets are named;
- acceptance criteria exist for every wave;
- rollback exists for every wave;
- test and CI requirements are explicit;
- versioning and deprecation rules are explicit;
- implementation authorization gates are explicit.

All criteria are satisfied by this document.

## 17. Next authorized action

The next action is Wave 0, beginning with characterization tests only.

Production implementation of Precision, Vector2, Point2 and Envelope2 starts only after Wave 0 exits successfully.

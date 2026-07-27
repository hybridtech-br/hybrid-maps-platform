# HGK Component Inventory

Status: In progress - Phase 0.3  
Scope: `packages/core` and `packages/spatial-engine`  
Rule: this document records evidence and provisional classification only. It does not authorize code migration.

## 1. Inventory method

For every public component, record:

- current package and file;
- exported public contract;
- direct internal dependencies;
- known consumers when evidenced;
- responsibility;
- classification: `Migrate`, `Remain`, `Split`, `Deprecate`, or `Pending`;
- rationale and risks.

A classification is final only after the complete public API inventory and dependency map are reviewed.

## 2. Package-level findings

### 2.1 `@hybrid/maps-core`

Current source entry point: `packages/core/src/index.ts`.

The package currently defines, in a single source file:

- `CoordinateInput`;
- `Coordinate` class;
- `BoundingBox` class;
- `ViewportOptions`;
- `Viewport` class;
- `CrsCode`;
- `Projection` interface;
- `Geometry` union type.

Observed architectural condition: the package mixes generic value objects (`Coordinate`, `BoundingBox`) with maps-domain concepts (`Viewport`, CRS and projection contracts).

### 2.2 `@hybrid/maps-spatial-engine`

Current source entry point: `packages/spatial-engine/src/index.ts`.

Public exports currently include:

- `Coordinate`;
- `BoundingBox`;
- `Point`;
- `LineString`;
- `Polygon`;
- `MultiPoint`;
- `MultiLineString`;
- `MultiPolygon`;
- `GeometryCollection`;
- `GeometryFactory`;
- `Distance`;
- `Length`;
- `Bearing`.

Files also exist for `Area`, `Centroid` and `GeometryValidator`, but they are not exported by the current package entry point. Their status must be verified before classification.

The package currently declares no runtime dependencies in `package.json`; only TypeScript and Vitest are declared as development dependencies.

## 3. Confirmed duplication

### 3.1 Coordinate

Two distinct public contracts exist.

#### Core implementation

- class-based immutable value object;
- validates longitude, latitude and altitude;
- supports tuple input through `CoordinateInput` and `Coordinate.from`;
- uses exact floating-point equality;
- uses geographic longitude/latitude semantics.

#### Spatial Engine implementation

- interface plus factory function;
- does not validate longitude, latitude or altitude;
- uses exact floating-point equality;
- uses the same geographic property names.

Provisional classification: `Split/Migrate candidate`.

Reason: a canonical coordinate primitive is a strong HGK candidate, but geographic range validation and CRS semantics must be separated from a generic mathematical coordinate contract before a final decision.

Risk: replacing either implementation directly would break constructor/factory contracts and validation behavior.

### 3.2 BoundingBox

Two distinct public contracts exist.

#### Core implementation

- class with `west`, `south`, `east`, `north`;
- validates values indirectly through `Coordinate`;
- validates minimum/maximum ordering;
- supports `contains`, `intersects`, `union` and `center`.

#### Spatial Engine implementation

- interface plus factory function;
- uses `minLongitude`, `minLatitude`, `maxLongitude`, `maxLatitude`;
- does not validate values or ordering;
- supports only `containsCoordinate`.

Provisional classification: `Split/Migrate candidate`.

Risk: naming, validation, construction and available operations are incompatible.

## 4. Initial component table

| Component | Current location | Responsibility | Direct dependencies | Provisional classification | Notes |
|---|---|---|---|---|---|
| `CoordinateInput` | `core/src/index.ts` | Tuple input for geographic coordinates | none | Pending | Public input contract; compatibility-sensitive. |
| `Coordinate` class | `core/src/index.ts` | Validated immutable geographic coordinate | standard runtime | Split/Migrate candidate | Mixes primitive storage with EPSG:4326-like range rules. |
| `BoundingBox` class | `core/src/index.ts` | Geographic bounds and operations | core `Coordinate` | Split/Migrate candidate | Generic envelope operations are HGK candidates; geographic naming may remain in maps domain. |
| `ViewportOptions` | `core/src/index.ts` | Map camera configuration input | core types | Remain | Maps/UI domain concept. |
| `Viewport` | `core/src/index.ts` | Immutable map camera state | `Coordinate`, `BoundingBox` | Remain | Explicit zoom, bearing and pitch semantics. |
| `CrsCode` | `core/src/index.ts` | CRS identifier contract | none | Remain or dedicated geospatial package | Not generic geometry. |
| `Projection` | `core/src/index.ts` | CRS transformation contract | `CrsCode`, core `Coordinate` | Remain or Spatial Engine | Requires geospatial semantics. |
| `Geometry` union | `core/src/index.ts` | Minimal maps-domain geometry representation | core `Coordinate` | Pending | Duplicates Spatial Engine geometry family. |
| `Coordinate` interface/factory | `spatial-engine/geometry` | Immutable coordinate record | none | Split/Migrate candidate | Duplicates core contract without validation. |
| `BoundingBox` interface/factory | `spatial-engine/geometry` | Bounds record and containment | spatial `Coordinate` | Split/Migrate candidate | Duplicates core contract. |
| `Point` | `spatial-engine/geometry` | Point geometry and point bounds | `Coordinate`, `BoundingBox` | Migrate candidate | Final decision depends on canonical coordinate model. |
| `LineString` | `spatial-engine/geometry` | Linear geometry | Coordinate model | Pending | File confirmed; contract inspection pending. |
| `Polygon` | `spatial-engine/geometry` | Polygon geometry | Coordinate model | Pending | File confirmed; contract inspection pending. |
| `MultiPoint` | `spatial-engine/geometry` | Multi-point geometry | Point/Coordinate model | Pending | Contract inspection pending. |
| `MultiLineString` | `spatial-engine/geometry` | Multi-line geometry | LineString/Coordinate model | Pending | Contract inspection pending. |
| `MultiPolygon` | `spatial-engine/geometry` | Multi-polygon geometry | Polygon/Coordinate model | Pending | Contract inspection pending. |
| `GeometryCollection` | `spatial-engine/geometry` | Heterogeneous geometry collection | geometry family | Pending | Contract inspection pending. |
| `GeometryFactory` | `spatial-engine/geometry` | Convenience construction facade | all geometry factories | Split candidate | Generic construction may enter HGK; compatibility facade may remain. |
| `Distance` | `spatial-engine/measurement` | Distance calculations | geometry/coordinate model | Pending | Algorithm and Earth-model assumptions must be inspected. |
| `Length` | `spatial-engine/measurement` | Geometry length calculations | geometry and distance | Pending | Contract inspection pending. |
| `Bearing` | `spatial-engine/measurement` | Bearing calculation | coordinate model | Pending | Geographic bearing is not generic Euclidean geometry. |
| `Area` | `spatial-engine/measurement` | Area calculation | geometry model | Pending, non-public | File exists but current index does not export it. |
| `Centroid` | `spatial-engine/measurement` | Centroid calculation | geometry model | Pending, non-public | File exists but current index does not export it. |
| `GeometryValidator` | `spatial-engine/validation` | Geometry validation | geometry model | Pending, non-public | File exists but current index does not export it. |

## 5. Confirmed defect candidate - no correction authorized yet

`GeometryFactory.point(coordinate)` currently forwards a `Coordinate` object to `createPoint`, while the inspected `createPoint` contract accepts numeric longitude, latitude and optional altitude arguments.

This is recorded as a build/type defect candidate. It must be validated by build or test evidence before correction. Phase 0.3 does not authorize fixing it.

## 6. Current conclusions

1. The repository already has duplicated coordinate and bounds abstractions.
2. The duplicate contracts are not drop-in compatible.
3. `maps-core` is not purely a low-level core; it combines kernel candidates with maps-domain state.
4. The Spatial Engine public surface is smaller than its file set because Area, Centroid and GeometryValidator are not currently re-exported.
5. No migration order can be approved until every geometry and measurement contract is inspected.

## 7. Remaining work for Phase 0.3

- inspect all geometry source contracts;
- inspect all measurement and validation contracts;
- inspect package consumers and imports;
- catalogue all public symbols, not only files;
- identify tests and current behavioral expectations;
- convert provisional classifications into reviewed classifications;
- identify dead, unreachable or non-exported components;
- record build/type defects separately from migration decisions.

Phase 0.3 remains open.

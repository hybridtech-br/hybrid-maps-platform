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
- functional category;
- architectural classification: `Migrate`, `Remain`, `Split`, `Deprecate`, or `Pending`;
- rationale and risks.

A classification is final only after the complete public API inventory and dependency map are reviewed.

## 2. Architectural principle discovered during inventory

The HGK must remain a mathematical and geometric kernel without knowledge of Earth-specific models.

Therefore:

- generic coordinates, vectors, envelopes, planar geometries and generic algorithms may belong to HGK;
- longitude, latitude, CRS, EPSG, spherical Earth radius, Haversine distance and geographic bearings belong to a geospatial layer above HGK;
- existing components that combine both concerns must be split rather than moved unchanged.

## 3. Package-level findings

### 3.1 `@hybrid/maps-core`

Current source entry point: `packages/core/src/index.ts`.

The package currently defines:

- `CoordinateInput`;
- `Coordinate` class;
- `BoundingBox` class;
- `ViewportOptions`;
- `Viewport` class;
- `CrsCode`;
- `Projection` interface;
- `Geometry` union type.

Observed condition: this package mixes low-level value objects with maps-domain and geospatial concepts.

### 3.2 `@hybrid/maps-spatial-engine`

Current source entry point: `packages/spatial-engine/src/index.ts`.

Public exports currently include the geometry family, `GeometryFactory`, `Distance`, `Length` and `Bearing`.

`Area`, `Centroid` and `GeometryValidator` exist in source but are not re-exported by the package entry point.

The package declares no runtime dependencies.

## 4. Confirmed duplication

### 4.1 Coordinate

Two incompatible public contracts exist.

- Core: validated immutable class, tuple input, exact equality and geographic ranges.
- Spatial Engine: interface plus factory, no validation and exact equality.

Classification: `Split`.

Target direction:

- generic numeric coordinate or point primitive in HGK;
- geographic longitude/latitude contract and range validation in Spatial Engine or another geospatial package;
- compatibility adapters for existing public APIs.

### 4.2 BoundingBox

Two incompatible public contracts exist.

- Core: class with geographic names and operations for containment, intersection, union and center.
- Spatial Engine: interface with min/max longitude and latitude, no validation and only containment.

Classification: `Split`.

Target direction:

- generic axis-aligned envelope in HGK;
- geographic bounds facade or adapter above HGK.

## 5. Geometry inventory

| Component | Functional category | Direct dependencies | Classification | Evidence-based assessment |
|---|---|---|---|---|
| `Point` | Geometry | geographic `Coordinate`, `BoundingBox` | Split | Geometry concept is generic, but current contract is longitude/latitude-specific. |
| `LineString` | Geometry | geographic `Coordinate`, `BoundingBox` | Split | Enforces at least two coordinates and clones coordinates, but uses geographic field names. |
| `Polygon` | Geometry | geographic `Coordinate`, `BoundingBox` | Split | Requires at least one ring but does not enforce ring closure or minimum ring length during construction. |
| `MultiPoint` | Geometry | geographic `Coordinate`, `BoundingBox` | Split | Requires at least one coordinate; shallowly freezes supplied coordinate objects. |
| `MultiLineString` | Geometry | geographic `Coordinate`, `BoundingBox` | Split | Enforces non-empty collection and two coordinates per line. |
| `MultiPolygon` | Geometry | geographic `Coordinate`, `BoundingBox` | Split | Enforces non-empty polygons and rings but not closed rings or valid ring lengths. |
| `GeometryCollection` | Collection | entire geometry family | Migrate candidate after split | Generic heterogeneous collection; currently excludes nested collections. |
| `GeometryFactory` | Factory/facade | all geometry factories | Split | Generic construction can exist in HGK, while compatibility facade may remain above it. |

### Geometry consistency findings

1. Validation is inconsistent between constructors/factories.
2. `LineString` copies coordinates through `createCoordinate`, while most multi-geometries only freeze arrays and retain coordinate object references.
3. Polygon construction accepts structurally invalid rings that the validator later rejects.
4. `GeometryCollection` permits an empty collection during construction, while the validator rejects it.
5. The geometry family is modeled with geographic coordinate names even where algorithms are planar.

## 6. Measurement and algorithm inventory

| Component | Actual algorithm/model | Classification | Rationale |
|---|---|---|---|
| `distanceMeters` | Haversine distance on a sphere with configurable radius | Remain in Spatial Engine | Explicit Earth/spherical geodesy; not generic kernel geometry. |
| `EARTH_MEAN_RADIUS_METERS` | Mean Earth radius constant | Remain in Spatial Engine | Earth-specific constant. |
| `lineStringLength` | Sum of Haversine segment distances | Remain in Spatial Engine | Depends directly on geodesic distance. |
| `multiLineStringLength` | Sum of Haversine lengths | Remain in Spatial Engine | Depends directly on geodesic distance. |
| `initialBearing` | Initial great-circle bearing | Remain in Spatial Engine | Geographic/spherical algorithm. |
| `finalBearing` | Reverse great-circle bearing normalization | Remain in Spatial Engine | Geographic/spherical algorithm. |
| `polygonArea` | Spherical polygon area using Earth radius | Remain in Spatial Engine | Earth-specific despite using generic-looking geometry names. |
| `multiPolygonArea` | Sum of spherical polygon areas | Remain in Spatial Engine | Earth-specific. |
| centroid functions | Mixed planar and geodesic weighting | Split and redesign | Line centroids use Haversine segment weights; polygon centroids use planar longitude/latitude cross products. The model is internally mixed. |

### Centroid risk

The centroid module combines two incompatible geometric assumptions:

- line and multi-line weighting uses spherical Haversine distances;
- polygon and multi-polygon centroid formulas treat longitude and latitude as planar Cartesian coordinates.

This is not automatically incorrect for every use case, but the semantic model is undocumented and unsuitable for direct migration. It requires explicit separation into planar HGK centroid algorithms and geospatial centroid policies.

## 7. Validation inventory

`GeometryValidator` defines structured issue codes and validates:

- finite longitude, latitude and altitude;
- geographic longitude and latitude ranges;
- minimum coordinate counts;
- empty geometries;
- ring closure;
- consecutive duplicate coordinates.

Classification: `Split`.

Target direction:

- generic structural geometry validation in HGK;
- geographic range validation in Spatial Engine;
- common stable issue/result model if it remains provider-independent.

Current inconsistency: factories allow some objects that the validator later marks invalid. A future architecture must decide whether invalid construction is prohibited or whether validation remains an explicit separate operation.

## 8. Updated component classification

| Component | Current location | Functional category | Classification |
|---|---|---|---|
| `CoordinateInput` | core | Geographic API input | Split/compatibility |
| `Coordinate` class | core | Geographic value object | Split |
| `BoundingBox` class | core | Geographic envelope | Split |
| `ViewportOptions` | core | Map camera state | Remain |
| `Viewport` | core | Map camera state | Remain |
| `CrsCode` | core | Geospatial reference system | Remain above HGK |
| `Projection` | core | Geospatial transformation contract | Remain above HGK |
| `Geometry` union | core | Minimal maps geometry contract | Deprecate or compatibility candidate |
| `Coordinate` interface/factory | spatial-engine | Geographic value object | Split |
| `BoundingBox` interface/factory | spatial-engine | Geographic envelope | Split |
| `Point` | spatial-engine | Geometry | Split |
| `LineString` | spatial-engine | Geometry | Split |
| `Polygon` | spatial-engine | Geometry | Split |
| `MultiPoint` | spatial-engine | Geometry | Split |
| `MultiLineString` | spatial-engine | Geometry | Split |
| `MultiPolygon` | spatial-engine | Geometry | Split |
| `GeometryCollection` | spatial-engine | Geometry collection | Migrate candidate after split |
| `GeometryFactory` | spatial-engine | Factory/facade | Split |
| `Distance` | spatial-engine | Spherical geodesy | Remain |
| `Length` | spatial-engine | Spherical geodesy | Remain |
| `Bearing` | spatial-engine | Spherical geodesy | Remain |
| `Area` | spatial-engine, non-exported | Spherical geodesy | Remain; public status pending |
| `Centroid` | spatial-engine, non-exported | Mixed planar/geodesic algorithm | Split and redesign |
| `GeometryValidator` | spatial-engine, non-exported | Structural and geographic validation | Split |

## 9. Consumer inventory

### 9.1 Direct package dependencies

| Consumer | Direct dependency on `maps-core` | Direct dependency on `maps-spatial-engine` | Assessment |
|---|---:|---:|---|
| `@hybrid/maps-provider-sdk` | Yes | No | Core contracts are part of the public provider API. |
| `@hybrid/maps-provider-maplibre` | Yes | No | Uses core directly and also indirectly through Provider SDK. |
| `@hybrid/maps-playground` | Yes | No | Constructs `Coordinate` and `Viewport` directly. |
| `@hybrid/maps-runtime` | No | No | Runtime remains independent from geometry packages. |
| `@hybrid/maps-feature-store` | No | No | Depends only on `@hybrid/maps-events` at package level. |

No current package manifest inspected declares `@hybrid/maps-spatial-engine` as a dependency. This means its public API appears isolated inside the repository at this stage, subject to test/source verification.

### 9.2 Symbol-level consumers of `maps-core`

#### Provider SDK

The Provider SDK imports these core symbols as public contract dependencies:

- `BoundingBox`;
- `Coordinate`;
- `Geometry`;
- `Viewport`.

They appear in exported interfaces such as:

- `CreateMapOptions`;
- `LayerDefinition`;
- `MarkerDefinition`;
- `PopupDefinition`;
- `ICameraAdapter`;
- `IMapAdapter`.

Impact: changing these core contracts is not an internal refactor. It changes the provider contract surface and affects every provider implementation and application consumer.

#### MapLibre provider

The MapLibre adapter consumes:

- `Coordinate` for center, markers and popups;
- `Viewport` for camera conversion;
- `BoundingBox` for `fitBounds`;
- `Geometry` for conversion to GeoJSON.

The provider also constructs a new core `Coordinate` when returning the current center.

Impact: compatibility adapters must preserve property names and construction behavior until the provider is migrated.

#### Playground

The Playground directly constructs:

- `Coordinate` for the Rio de Janeiro reference point;
- `Viewport` for initial and animated camera states.

Impact: it is a visible acceptance consumer and should remain operational throughout migration.

### 9.3 Dependency chain

Current confirmed chain:

```text
Playground
  -> maps-core
  -> provider-sdk
  -> provider-maplibre

provider-maplibre
  -> maps-core
  -> provider-sdk
  -> maplibre-gl

provider-sdk
  -> maps-core

runtime
  -> no geometry dependency

feature-store
  -> events
```

More precisely, the provider path is:

```text
Playground
  -> Provider SDK contracts
  -> MapLibre provider implementation
  -> maps-core value objects and geometry union
```

### 9.4 Migration sensitivity

Highest compatibility sensitivity:

1. `Coordinate`;
2. `Viewport`;
3. `BoundingBox`;
4. core `Geometry` union.

Reason: these symbols cross package boundaries through public interfaces.

Lower current repository sensitivity:

- Spatial Engine geometry and measurement exports.

Reason: no inspected package manifest currently consumes `@hybrid/maps-spatial-engine`.

This does not mean they are safe to break externally; the package is public and may have consumers outside this repository. External consumer verification remains required before a major API change.

## 10. Confirmed defect candidate - no correction authorized yet

`GeometryFactory.point(coordinate)` forwards a `Coordinate` object to `createPoint`, while the inspected `createPoint` contract accepts numeric longitude, latitude and optional altitude arguments.

This remains a build/type defect candidate. It must be confirmed by build or test evidence before correction.

## 11. Current conclusions

1. The existing geometry layer is reusable in intent but geographic in representation.
2. Most geometry types should be split into generic HGK primitives plus geospatial compatibility contracts.
3. Distance, length, bearing and area are currently geodesic and should not move to HGK unchanged.
4. Centroid behavior must be redesigned because it mixes spherical weighting and planar formulas.
5. Validation must be separated into structural geometry rules and Earth-coordinate rules.
6. Construction and validation policies are currently inconsistent.
7. `maps-core` is compatibility-critical because Provider SDK exposes its types publicly.
8. Spatial Engine appears internally isolated in the inspected workspace, but external consumers remain unknown.
9. Runtime and Feature Store are currently outside the geometry migration path.
10. No migration is authorized yet.

## 12. Remaining work for Phase 0.3

- inspect tests and characterize current expected behavior;
- catalogue every public symbol exported by both packages;
- confirm non-exported code reachability;
- validate the recorded defect candidate through build/test evidence;
- verify whether Spatial Engine has external consumers or documented compatibility commitments;
- finalize compatibility-sensitive API classifications.

Phase 0.3 remains open.

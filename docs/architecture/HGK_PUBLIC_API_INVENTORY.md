# HGK Public API Inventory

Status: Phase 0.3 baseline  
Scope: `@hybrid/maps-core` and `@hybrid/maps-spatial-engine`  
Purpose: preserve an evidence-based snapshot of the current exported API before any migration.

## 1. Rules

- This inventory describes the API currently exported by package entry points.
- Source files that are not re-exported are recorded separately as non-public implementation candidates.
- This document does not approve migration or breaking changes.
- Any future HGK migration must compare its compatibility layer against this baseline.

## 2. `@hybrid/maps-core`

Entry point: `packages/core/src/index.ts`.

### 2.1 Exported types

#### `CoordinateInput`

```ts
type CoordinateInput = readonly [
  longitude: number,
  latitude: number,
  altitude?: number,
];
```

Compatibility sensitivity: high.

#### `CrsCode`

```ts
type CrsCode = "EPSG:4326" | "EPSG:3857" | (string & {});
```

Compatibility sensitivity: medium.

#### `Geometry`

```ts
type Geometry =
  | { readonly type: "Point"; readonly coordinates: Coordinate }
  | { readonly type: "LineString"; readonly coordinates: readonly Coordinate[] }
  | {
      readonly type: "Polygon";
      readonly coordinates: readonly (readonly Coordinate[])[];
    };
```

Compatibility sensitivity: high. It is exposed through Provider SDK layer contracts.

### 2.2 Exported interfaces

#### `ViewportOptions`

Properties:

- `center: Coordinate | CoordinateInput`;
- `zoom: number`;
- optional `bearing: number`;
- optional `pitch: number`;
- optional `bounds: BoundingBox`.

#### `Projection`

Properties and methods:

- `source: CrsCode`;
- `target: CrsCode`;
- `project(coordinate: Coordinate): Coordinate`;
- `unproject(coordinate: Coordinate): Coordinate`.

### 2.3 Exported classes

#### `Coordinate`

Constructor:

```ts
new Coordinate(longitude: number, latitude: number, altitude?: number)
```

Public properties:

- `longitude`;
- `latitude`;
- optional `altitude`.

Public methods:

- `static from(input: Coordinate | CoordinateInput): Coordinate`;
- `equals(other: Coordinate): boolean`;
- `toArray(): CoordinateInput`.

Behavioral contract:

- longitude must be finite and between -180 and 180;
- latitude must be finite and between -90 and 90;
- altitude, when supplied, must be finite;
- instance is frozen;
- equality is exact.

#### `BoundingBox`

Constructor:

```ts
new BoundingBox(west: number, south: number, east: number, north: number)
```

Public properties:

- `west`;
- `south`;
- `east`;
- `north`.

Public methods:

- `contains(value: Coordinate | CoordinateInput): boolean`;
- `intersects(other: BoundingBox): boolean`;
- `union(other: BoundingBox): BoundingBox`;
- `center(): Coordinate`.

Behavioral contract:

- values are validated through `Coordinate`;
- minimum values may not exceed maximum values;
- instance is frozen.

#### `Viewport`

Constructor:

```ts
new Viewport(options: ViewportOptions)
```

Public properties:

- `center: Coordinate`;
- `zoom: number`;
- `bearing: number`;
- `pitch: number`;
- optional `bounds: BoundingBox`.

Behavioral contract:

- zoom must be non-negative and finite;
- bearing must be finite and is normalized to [0, 360);
- pitch must be finite and between 0 and 85;
- instance is frozen.

## 3. `@hybrid/maps-spatial-engine`

Entry point: `packages/spatial-engine/src/index.ts`.

The entry point uses wildcard re-exports. The effective API contains all exported symbols from the listed modules.

### 3.1 Coordinate API

Exports:

- interface `Coordinate`;
- function `createCoordinate(longitude, latitude, altitude?)`;
- function `equalsCoordinate(a, b)`.

Behavior:

- returns a frozen object;
- performs no numeric or geographic validation;
- equality is exact.

### 3.2 Bounding box API

Exports:

- interface `BoundingBox`;
- function `createBoundingBox(minLongitude, minLatitude, maxLongitude, maxLatitude)`;
- function `containsCoordinate(bbox, coordinate)`.

Behavior:

- returns a frozen object;
- performs no range or ordering validation.

### 3.3 Point API

Exports:

- interface `Point`;
- function `createPoint(longitude, latitude, altitude?)`;
- function `equalsPoint(a, b)`;
- function `pointBoundingBox(point)`.

### 3.4 LineString API

Exports:

- interface `LineString`;
- function `createLineString(coordinates)`;
- function `lineStringBoundingBox(lineString)`.

Behavior:

- requires at least two coordinates;
- reconstructs supplied coordinates through `createCoordinate`;
- freezes the coordinate array and object.

### 3.5 Polygon API

Exports:

- interface `Polygon`;
- function `createPolygon(rings)`;
- function `polygonBoundingBox(polygon)`.

Behavior:

- requires at least one ring;
- does not require a closed ring during construction;
- does not enforce minimum ring length during construction.

### 3.6 MultiPoint API

Exports:

- interface `MultiPoint`;
- function `createMultiPoint(coordinates)`;
- function `multiPointBoundingBox(multiPoint)`.

Behavior:

- requires at least one coordinate;
- freezes arrays but does not reconstruct coordinates.

### 3.7 MultiLineString API

Exports:

- interface `MultiLineString`;
- function `createMultiLineString(coordinates)`;
- function `multiLineStringBoundingBox(multiLineString)`.

Behavior:

- requires at least one line;
- each line requires at least two coordinates.

### 3.8 MultiPolygon API

Exports:

- interface `MultiPolygon`;
- function `createMultiPolygon(coordinates)`;
- function `multiPolygonBoundingBox(multiPolygon)`.

Behavior:

- requires at least one polygon;
- each polygon requires at least one ring;
- ring closure and minimum ring length are not enforced during construction.

### 3.9 Geometry collection API

Exports:

- type `Geometry`;
- interface `GeometryCollection`;
- function `createGeometryCollection(geometries)`.

Current `Geometry` union includes:

- `Point`;
- `LineString`;
- `Polygon`;
- `MultiPoint`;
- `MultiLineString`;
- `MultiPolygon`.

Nested `GeometryCollection` is not included in the union.

### 3.10 Factory API

Exports:

- constant object `GeometryFactory`;
- re-exported type `Geometry`.

Factory methods:

- `coordinate(longitude, latitude, altitude?)`;
- `point(coordinate)`;
- `lineString(coordinates)`;
- `polygon(rings)`;
- `multiPoint(coordinates)`;
- `multiLineString(coordinates)`;
- `multiPolygon(coordinates)`;
- `geometryCollection(geometries)`.

Known defect candidate:

- `GeometryFactory.point(coordinate)` does not match the inspected numeric signature of `createPoint`.

### 3.11 Distance API

Exports:

- constant `EARTH_MEAN_RADIUS_METERS`;
- interface `DistanceOptions` with optional `radius`;
- function `distanceMeters(start, end, options?)`.

Semantic contract:

- Haversine distance on a sphere;
- result in meters when radius is expressed in meters.

### 3.12 Length API

Exports:

- function `lineStringLength(lineString, options?)`;
- function `multiLineStringLength(multiLineString, options?)`.

Semantic contract:

- sum of Haversine segment distances.

### 3.13 Bearing API

Exports:

- function `initialBearing(origin, destination)`;
- function `finalBearing(origin, destination)`.

Semantic contract:

- spherical geographic bearing normalized to [0, 360).

## 4. Existing source modules not exported by the package entry point

### `Area.ts`

Source exports:

- `polygonArea`;
- `multiPolygonArea`.

Current status: implementation exists but is not part of the package root API.

### `Centroid.ts`

Source exports:

- `pointCentroid`;
- `lineStringCentroid`;
- `polygonCentroid`;
- `multiPointCentroid`;
- `multiLineStringCentroid`;
- `multiPolygonCentroid`;
- `geometryCollectionCentroid`.

Current status: implementation exists but is not part of the package root API.

### `GeometryValidator.ts`

Source exports:

- type `GeometryValidationCode`;
- interface `GeometryValidationIssue`;
- interface `GeometryValidationResult`;
- function `validateGeometry`;
- function `validateGeometryCollection`.

Current status: implementation exists but is not part of the package root API.

## 5. API collision and incompatibility summary

| Concept | `maps-core` | `maps-spatial-engine` | Compatible? |
|---|---|---|---:|
| Coordinate construction | class constructor | factory function | No |
| Coordinate validation | geographic ranges | none | No |
| Bounding box names | west/south/east/north | min/max longitude/latitude | No |
| Bounding box operations | contains/intersects/union/center | containment only | No |
| Point shape | `coordinates` in union | `coordinate` in interface | No |
| Polygon shape | `coordinates` | `rings` | No |
| Geometry coverage | Point/LineString/Polygon | full multi-geometry family | No |

## 6. Compatibility baseline requirements

Before any migration is approved, automated API checks should verify at minimum:

1. all currently exported names remain resolvable or are intentionally deprecated;
2. constructor and factory signatures remain available through compatibility adapters;
3. property names used by Provider SDK and MapLibre remain stable;
4. validation behavior is preserved where compatibility is promised;
5. exact equality behavior is either preserved or versioned as a breaking change;
6. non-exported modules are not accidentally promoted to public API without an explicit decision.

## 7. Phase status

The public API inventory is complete for the inspected package entry points.

Remaining uncertainty:

- external consumers outside this repository;
- runtime behavior not protected by tests;
- whether non-exported source modules were intended for a future release.

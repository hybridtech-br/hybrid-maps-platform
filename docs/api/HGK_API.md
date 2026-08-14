# HYBRID Geometry Kernel (HGK) API

Status: Wave 2 public API baseline  
Package: `@hybrid/hgk`  
Version baseline: `0.1.0-alpha.0`

## Purpose

`@hybrid/hgk` provides deterministic, immutable and provider-independent mathematics, planar geometry, structural validation and planar algorithms for HYBRID products.

HGK deliberately has no map-provider, CRS, EPSG, longitude, latitude, Earth-model, rendering, DOM, persistence or network semantics. Geographic meaning belongs to the Spatial Engine and higher layers.

## Design rules

- public value objects are immutable and frozen;
- constructor coordinates and public numeric results must be finite;
- exact equality and approximate equality are distinct operations;
- geometry construction is intentionally separate from structural validation;
- geometry algorithms in HGK are explicitly planar;
- no public HGK operation assumes meters, degrees, longitude/latitude or a coordinate reference system;
- empty or structurally incomplete geometry objects may be constructed when needed for data pipelines, but `validateGeometry2` reports whether they satisfy the canonical structural contract.

## Precision API

### `EPSILON`

```ts
const EPSILON = 1e-9;
```

Official default tolerance for approximate scalar and component-wise comparisons.

### `Precision`

Static numeric helpers:

- `Precision.isFinite(value)` — checks whether a number is finite;
- `Precision.assertFinite(value, name?)` — returns the value or throws `RangeError` for `NaN`, `Infinity` or `-Infinity`;
- `Precision.exactEquals(a, b)` — exact finite-number equality; `0` and `-0` compare equal;
- `Precision.equals(a, b, epsilon?)` — approximate finite-number equality using `Math.abs(a - b) <= epsilon`.

`epsilon` must be finite and non-negative.

## Algebra API

### `Vector2`

Immutable two-dimensional vector with finite `x` and `y` components.

Public operations:

- `add(other)`;
- `subtract(other)`;
- `scale(factor)`;
- `dot(other)`;
- `magnitudeSquared()`;
- `magnitude()`;
- `equals(other)`;
- `approximatelyEquals(other, epsilon?)`;
- `clone()`;
- `toJSON()`;
- `toString()`.

Arithmetic overflow to a non-finite public result fails explicitly with `RangeError`.

## Foundation geometry API

### `Point2`

Immutable generic planar point with finite `x` and `y` coordinates.

Public operations:

- `Point2.fromVector(vector)`;
- `toVector()`;
- `translate(offset)`;
- `vectorTo(other)`;
- `equals(other)`;
- `approximatelyEquals(other, epsilon?)`;
- `toJSON()`;
- `toString()`.

`Point2` has no implicit geographic semantics or CRS.

### `Envelope2`

Immutable axis-aligned planar envelope with `minX`, `minY`, `maxX` and `maxY`.

Public operations:

- `contains(point)` — boundary-inclusive containment;
- `intersects(other)` — touching boundaries count as intersection;
- `union(other)`;
- `center()`;
- `width()`;
- `height()`;
- `equals(other)`;
- `approximatelyEquals(other, epsilon?)`;
- `toJSON()`;
- `toString()`.

Minimum values must not exceed maximum values. Zero-width, zero-height and point envelopes are valid.

## Primitive geometry API

### `Segment2`

Immutable directed segment with `start` and `end` points. Degenerate segments where start equals end are constructible and valid as values.

Public operations:

- `isDegenerate()`;
- `equals(other)`;
- `approximatelyEquals(other, epsilon?)`;
- `reversed()`;
- `toJSON()`.

### `LineString2`

Immutable ordered point sequence. Construction permits empty and underspecified sequences; canonical structural validity is determined by `validateGeometry2`.

Public operations:

- `isEmpty()`;
- `segmentCount()`;
- `equals(other)`;
- `approximatelyEquals(other, epsilon?)`;
- `reversed()`;
- `toJSON()`.

A structurally valid line string requires at least two points and no consecutive duplicate points.

### `LinearRing2`

Immutable ordered point sequence intended to represent a closed ring. Construction permits empty, underspecified or open rings so validation can report stable issues rather than forcing all parsing pipelines to throw during construction.

Public operations:

- `isEmpty()`;
- `isClosed()` — exact first/last point equality;
- `equals(other)`;
- `approximatelyEquals(other, epsilon?)`;
- `reversed()`;
- `toJSON()`.

A structurally valid linear ring requires at least four points, exact closure and no consecutive duplicate points. The required closing point is not treated as a consecutive duplicate merely because it equals the first point.

### `Polygon2`

Immutable collection of rings. Ring zero is the outer ring; subsequent rings are holes.

Public operations:

- `isEmpty()`;
- `outerRing()`;
- `holes()`;
- `equals(other)`;
- `approximatelyEquals(other, epsilon?)`;
- `toJSON()`.

A structurally valid polygon requires at least one structurally valid ring.

## Aggregate geometry API

### `MultiPoint2`

Immutable point collection. Canonical validation requires at least one point.

### `MultiLineString2`

Immutable line-string collection. Canonical validation requires at least one line and each line must satisfy the `LineString2` structural rules.

### `MultiPolygon2`

Immutable polygon collection. Canonical validation requires at least one polygon and each polygon must satisfy the `Polygon2` structural rules.

### `GeometryCollection2`

Immutable heterogeneous geometry collection. It accepts all HGK geometry kinds, including nested `GeometryCollection2` instances.

Nested collections are supported and are validated recursively. Canonical validation requires each collection level to contain at least one geometry.

The exported unions `Geometry2` and `Geometry2Json` describe the geometry family used by generic algorithms and validation.

## Structural validation API

### `validateGeometry2(geometry)`

Returns an immutable `GeometryValidationResult2`:

```ts
interface GeometryValidationResult2 {
  readonly valid: boolean;
  readonly issues: readonly GeometryValidationIssue2[];
}
```

Issues contain a stable code, path and human-readable message.

Current stable codes:

- `NON_FINITE_COORDINATE`;
- `INSUFFICIENT_COORDINATES`;
- `EMPTY_GEOMETRY`;
- `RING_NOT_CLOSED`;
- `CONSECUTIVE_DUPLICATE_POINTS`.

Validation paths are deterministic and nested collections are traversed recursively. Public constructors already reject ordinary non-finite coordinates; the validator also checks them defensively for objects received through unsafe casts or external reconstruction boundaries.

## Planar algorithms

All functions in this section operate in the raw Cartesian coordinate units supplied by the caller. They are not geodesic functions and must not be used as Haversine, spherical, ellipsoidal or CRS-aware calculations.

### Distance

- `planarDistance2(a, b)` — Euclidean distance between two points;
- `planarDistanceSquared2(a, b)` — squared Euclidean distance.

Both functions reject arithmetic results that become non-finite.

### Length

- `planarSegmentLength2(segment)`;
- `planarLineStringLength2(line)`;
- `planarMultiLineStringLength2(multiLine)`.

Lengths are sums of Euclidean segment lengths. Empty and single-point line strings yield zero. Non-finite accumulated results fail explicitly.

### Area

- `planarLinearRingArea2(ring)`;
- `planarPolygonArea2(polygon)`;
- `planarMultiPolygonArea2(multiPolygon)`.

Ring area uses the planar shoelace formula and is exposed unsigned. Polygon area is outer-ring area minus hole areas and never exposes a negative result. Empty or degenerate geometry yields zero where applicable. Arithmetic overflow fails explicitly.

### Centroid

- `planarCentroid2(geometry)`.

Policies by geometry family:

- point — the point itself;
- segment — midpoint;
- line string — segment-length-weighted midpoint centroid, with deterministic average fallback for zero total length;
- linear ring — planar shoelace centroid, with average fallback for degenerate rings;
- polygon — area-weighted outer ring minus holes, with deterministic fallback for degenerate geometry;
- multi-point — arithmetic mean of points;
- multi-line string — line-length-weighted child centroids;
- multi-polygon — polygon-area-weighted child centroids;
- geometry collection — equal weighting of each non-empty child geometry centroid;
- geometry with no points — `undefined`.

The geometry-collection equal-child policy is intentional. A later geographic centroid policy belongs to the Spatial Engine and must not silently replace this planar contract.

### Bounding envelope

- `planarBoundingEnvelope2(geometry)` — returns the minimum axis-aligned `Envelope2` covering all contained points;
- returns `undefined` when the geometry tree contains no points;
- recursively traverses aggregate and nested geometry collections.

## Immutability

Public value objects are frozen at construction. Input arrays are copied before storage. Operations return new values rather than mutate existing instances. Public collection arrays and JSON representations are frozen.

## Numerical behavior

HGK uses JavaScript/TypeScript IEEE-754 double precision. Public constructors reject non-finite scalar values. Public algorithms explicitly reject non-finite deltas, products, sums or derived results at their supported numerical boundaries.

Exact equality is separate from tolerance-based approximate equality. Callers must select the intended semantic explicitly.

## Dependency boundary

`@hybrid/hgk` must not import from:

- `@hybrid/maps-core`;
- `@hybrid/maps-spatial-engine`;
- provider packages;
- MapLibre;
- GeoJSON libraries;
- CRS or EPSG packages.

The `HGK Foundation Gates` workflow builds the package independently, executes its unit tests and rejects forbidden import patterns.

## Compatibility status

Waves 1 and 2 are additive. Existing Maps Core, Spatial Engine, Provider SDK and provider public contracts are not replaced by these exports. Consumer migration occurs only in later roadmap waves after explicit adapter and compatibility gates.

## Versioning

New HGK exports follow the migration plan's additive/minor-release policy once promoted from the alpha baseline. Any change to public signatures, equality semantics, structural validation semantics or removal of exports requires the corresponding versioning review. Deprecated APIs may not be removed in the same release in which deprecation is introduced.

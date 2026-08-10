# HYBRID Geometry Kernel (HGK) API

Status: Wave 1 public API baseline  
Package: `@hybrid/hgk`  
Version baseline: `0.1.0-alpha.0`

## Purpose

`@hybrid/hgk` provides deterministic, immutable and provider-independent mathematical and planar geometry primitives for HYBRID products.

HGK deliberately has no map-provider, CRS, EPSG, longitude, latitude, Earth-model, rendering, DOM, persistence or network semantics.

## Public exports

### `EPSILON`

```ts
const EPSILON = 1e-9;
```

Official default tolerance for approximate scalar and component-wise comparisons.

### `Precision`

Static numeric helpers:

- `Precision.isFinite(value)` — checks whether a number is finite.
- `Precision.assertFinite(value, name?)` — returns the value or throws `RangeError` for `NaN`, `Infinity` or `-Infinity`.
- `Precision.exactEquals(a, b)` — exact finite-number equality. `0` and `-0` compare equal.
- `Precision.equals(a, b, epsilon?)` — approximate finite-number equality using `Math.abs(a - b) <= epsilon`.

`epsilon` must be finite and non-negative.

### `Vector2`

Immutable two-dimensional vector.

```ts
const vector = new Vector2(3, 4);
vector.magnitude(); // 5
```

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

All constructor components, scale factors and public numeric results must remain finite. Non-finite values fail explicitly with `RangeError`.

### `Point2`

Immutable planar point with `x` and `y` coordinates.

```ts
const point = new Point2(10, 20);
const moved = point.translate(new Vector2(5, -2));
```

Public operations:

- `Point2.fromVector(vector)`;
- `toVector()`;
- `translate(offset)`;
- `vectorTo(other)`;
- `equals(other)`;
- `approximatelyEquals(other, epsilon?)`;
- `toJSON()`;
- `toString()`.

`Point2` is generic planar geometry. Its axes are not implicitly longitude/latitude and have no CRS.

### `Envelope2`

Immutable axis-aligned planar envelope.

```ts
const envelope = new Envelope2(0, 0, 100, 50);
envelope.contains(new Point2(100, 50)); // true: boundaries are inclusive
```

Public properties:

- `minX`;
- `minY`;
- `maxX`;
- `maxY`.

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

Minimum values must not exceed maximum values. Zero-width and zero-height envelopes are valid. A point envelope where both dimensions are zero is valid.

## Immutability

Wave 1 public value objects are frozen at construction. Operations return new values rather than mutate existing instances. JSON representations returned by public helpers are also frozen.

## Numerical behavior

HGK uses JavaScript/TypeScript IEEE-754 double precision. Public constructors reject non-finite values. Public operations that overflow to a non-finite numeric result fail explicitly instead of returning an invalid geometry result.

Exact equality is separate from tolerance-based approximate equality. Callers must choose the intended semantic explicitly.

## Dependency boundary

`@hybrid/hgk` must not import from:

- `@hybrid/maps-core`;
- `@hybrid/maps-spatial-engine`;
- provider packages;
- MapLibre;
- GeoJSON libraries;
- CRS or EPSG packages.

Geographic semantics remain the responsibility of the Spatial Engine and higher layers.

## Wave 1 compatibility status

Wave 1 is additive. No existing consumer is migrated and no existing Maps Platform public API is removed or replaced in this wave.

## Versioning

The initial HGK exports are additive and therefore follow the migration plan's minor-release policy once promoted from the current alpha baseline. Any later change to signatures, equality semantics, validation semantics or removal of exports requires the corresponding versioning review.

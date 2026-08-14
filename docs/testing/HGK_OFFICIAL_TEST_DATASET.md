# HGK Official Test Dataset

Status: Wave 0.4 baseline

## Objective

Define a single, deterministic and versioned dataset for HGK unit, integration, regression, compatibility and performance tests.

## Principles

The official dataset must be:

- deterministic;
- reproducible;
- platform independent;
- locale independent;
- timezone independent;
- reusable across packages;
- versioned independently from implementation code.

## Suggested organization

```text
datasets/
  points/
  vectors/
  segments/
  envelopes/
  polygons/
  multigeometries/
  numeric/
  geographic/
  invalid/
  performance/
```

## Points

Mandatory cases:

- origin `(0, 0)`;
- one point in each Cartesian quadrant;
- coincident points;
- distinct points;
- positive and negative coordinates;
- very small finite coordinates;
- very large finite coordinates.

## Vectors

Mandatory cases:

- zero vector;
- X and Y unit vectors;
- diagonal vector;
- parallel vectors;
- antiparallel vectors;
- perpendicular vectors;
- deterministic pseudo-random vectors.

## Segments

Mandatory cases:

- horizontal;
- vertical;
- diagonal;
- zero length;
- coincident;
- overlapping;
- crossing;
- touching at one endpoint;
- disjoint.

## Envelopes

Mandatory cases:

- valid envelope;
- point envelope;
- zero-width envelope;
- zero-height envelope;
- unit envelope;
- disjoint envelopes;
- touching envelopes;
- overlapping envelopes;
- contained envelope;
- containing envelope.

## Polygons

### Convex

- triangle;
- square;
- rectangle;
- regular-like hexagon.

### Concave

- arrow;
- L shape;
- simple star.

### Degenerate or invalid

- zero area;
- repeated consecutive vertex;
- coincident edges;
- self-intersection;
- insufficient vertices.

## Multi-geometries

The catalog must include representative cases for:

- MultiPoint;
- MultiLineString;
- MultiPolygon;
- GeometryCollection.

## Numeric boundary values

The dataset must include:

```text
0
-0
1
-1
EPSILON
EPSILON / 2
1e-12
1e-6
1e6
1e12
Number.MIN_VALUE
Number.MAX_VALUE
Number.MAX_SAFE_INTEGER
NaN
Infinity
-Infinity
```

Non-finite values belong only to invalid-input fixtures unless a test explicitly verifies rejection behavior.

## Geographic integration catalog

Geographic fixtures are cataloged for Spatial Engine integration tests and must not define HGK's pure geometry behavior.

Required locations and cases:

- Equator;
- Greenwich meridian;
- North Pole;
- South Pole;
- antimeridian;
- antimeridian crossing;
- Rio de Janeiro;
- Sao Paulo;
- Lisbon;
- New York;
- Tokyo.

## Invalid inputs

Mandatory cases:

- missing coordinates;
- empty arrays;
- incomplete objects;
- incorrect primitive types;
- non-finite numbers;
- partially valid nested structures;
- malformed rings and collections.

## Performance datasets

Deterministic datasets must exist for:

- 10 elements;
- 100 elements;
- 1,000 elements;
- 10,000 elements;
- 100,000 elements.

Generation must use a documented seed and algorithm.

## Dataset identifiers

Every fixture requires:

- stable identifier;
- category;
- description;
- input data;
- expected classification;
- expected result or expected failure when applicable.

## Versioning

The dataset follows semantic versioning independently.

- Patch: corrected metadata or expectation that does not change fixture identity.
- Minor: additive fixtures.
- Major: removed fixtures, changed fixture meaning or incompatible schema change.

## Acceptance criteria

Wave 0.4 is complete when:

- all planned primitive geometry categories are represented;
- numeric edge cases are cataloged;
- invalid cases are explicit;
- geographic integration fixtures are separated from pure HGK behavior;
- performance datasets are deterministic;
- fixture IDs and versioning rules are defined.

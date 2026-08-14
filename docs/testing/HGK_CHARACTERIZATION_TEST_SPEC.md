# HGK Characterization Test Specification

Status: Wave 0.1 baseline

## Objective

Capture the current observable behavior of Maps Core and Spatial Engine before any production migration. These tests describe what the code does today, not what the architecture wants it to do later.

## General rules

- Characterization tests must run against the current implementation before migration.
- Existing defects are recorded, not silently corrected.
- Assertions must distinguish exact behavior from approximate numerical behavior.
- Public errors, validation boundaries and object shapes must be preserved where observable.
- Every test must identify whether it protects public API, internal behavior or a known defect.

## Maps Core coverage

### Coordinate

Required cases:

- valid longitude and latitude boundaries;
- invalid longitude and latitude values;
- finite-number validation;
- altitude omitted, zero, positive and negative;
- exact equality;
- inequality by longitude, latitude and altitude;
- `Coordinate.from` behavior;
- immutable or frozen instance behavior;
- current error types and messages where stable.

### BoundingBox

Required cases:

- valid construction;
- invalid west/east and south/north ordering;
- boundary-inclusive `contains`;
- interior and exterior points;
- touching and overlapping intersection;
- disjoint intersection;
- union;
- center;
- frozen instance behavior.

### Viewport

Required cases:

- default options;
- center preservation;
- minimum and maximum zoom;
- invalid zoom;
- bearing normalization;
- pitch limits;
- immutable behavior;
- serialization or plain-object conversion if currently exposed.

### Geometry contract

Required cases:

- every exported geometry discriminator;
- required coordinate nesting;
- empty structures currently accepted or rejected;
- compatibility with Provider SDK inputs;
- compatibility with MapLibre conversion inputs.

## Spatial Engine coverage

### Coordinate and BoundingBox

Repeat the observable cases above, documenting every behavioral difference from Maps Core.

### Geometry classes

For Point, LineString, Polygon, MultiPoint, MultiLineString, MultiPolygon and GeometryCollection:

- valid construction;
- minimum coordinate counts;
- current ring-closure behavior;
- empty input behavior;
- nested geometry behavior;
- immutable output behavior;
- current public properties and methods.

### GeometryFactory

Required cases:

- every factory method;
- object-input overloads;
- numeric-input overloads;
- `point(coordinate)` forwarding behavior;
- consistency between factory output and direct constructor output.

The `point(coordinate)` case must remain an explicit named regression test until an architecture decision authorizes a change.

### Distance

Required cases:

- same point;
- short known distance;
- long known distance;
- antimeridian-adjacent coordinates;
- northern and southern hemisphere cases;
- invalid coordinates;
- current Earth-radius constant behavior.

### Length

Required cases:

- empty or minimum-length line behavior;
- one segment;
- multiple segments;
- multiline aggregation;
- repeated points.

### Bearing

Required cases:

- cardinal directions;
- diagonal direction;
- same-point behavior;
- antimeridian-adjacent case;
- initial and final bearing if both are exposed.

### Area

Required cases:

- zero-area polygon;
- simple reference polygon;
- reversed ring orientation;
- polygon with holes if supported;
- multipolygon aggregation;
- antimeridian behavior if currently handled.

### Centroid

Required cases:

- point;
- line;
- simple polygon;
- concave polygon;
- polygon with holes if supported;
- multi-geometries;
- geometry collection;
- current mixed planar/geographic behavior.

### GeometryValidator

Required cases:

- structurally valid geometries;
- insufficient coordinate counts;
- open rings;
- out-of-range longitude and latitude;
- non-finite values;
- nested collection errors;
- stable issue ordering and codes if exposed.

## Acceptance criteria

Wave 0.1 is complete when:

- all public classes and algorithms above have executable tests;
- tests pass against the pre-migration implementation;
- known defects are named explicitly;
- behavioral differences between Maps Core and Spatial Engine are documented;
- no production code is changed solely to make characterization tests pass.

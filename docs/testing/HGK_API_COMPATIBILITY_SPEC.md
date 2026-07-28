# HGK API Compatibility Specification

Status: Wave 0.2 baseline

## Objective

Protect public contracts during the HGK migration and provide objective criteria for detecting incompatible changes.

## Scope

This specification covers public exports, TypeScript signatures, observable behavior and deprecation policy. Private implementation details and internal file organization are outside scope.

## Monitored packages

### Maps Core

- Coordinate
- BoundingBox
- Geometry
- Projection
- Viewport

### Spatial Engine

- Coordinate
- BoundingBox
- Point
- LineString
- Polygon
- MultiPoint
- MultiLineString
- MultiPolygon
- GeometryCollection
- GeometryFactory
- Distance
- Length
- Bearing
- Area
- Centroid
- GeometryValidator

### HGK initial surface

- Precision
- Vector2
- Point2
- Envelope2

## Compatibility requirements

Each public export must preserve, unless an approved breaking change exists:

- export name;
- declaration kind;
- parameter order and optionality;
- return type;
- readonly modifiers;
- required and optional properties;
- observable error behavior;
- documented invariants.

## TypeScript validation

Every release candidate must:

- compile public consumer fixtures;
- generate declaration files;
- compare the public declaration surface against the accepted baseline;
- fail on unapproved removed or narrowed types;
- record approved additions.

## Semantic compatibility

Internal implementation may change when the public contract and characterized behavior remain compatible.

## Versioning policy

### Patch

Allowed:

- internal optimizations;
- tests and documentation;
- compatible bug fixes authorized by a regression decision;
- implementation changes with no public contract change.

### Minor

Allowed:

- additive exports;
- additive optional properties;
- new overloads that do not make existing calls ambiguous;
- new adapters.

Existing public APIs must not be removed in a minor release.

### Major

Required for:

- export removal or rename;
- incompatible signature change;
- return-type narrowing;
- required-property addition;
- incompatible observable behavior;
- removal of a deprecated API.

## Deprecation policy

Every deprecated API must include:

- a deprecation annotation;
- recommended replacement;
- version where deprecation began;
- earliest planned removal version.

An API must not be deprecated and removed in the same release.

## Required tests

Every public API requires:

- export-presence test;
- consumer compilation test;
- declaration snapshot or API report;
- functional characterization test;
- regression test for every approved defect correction.

## Layer compatibility

Adapters must preserve public Maps Core contracts while translating through Spatial Engine into HGK. HGK types must not leak directly into consumers unless explicitly added as a new public API.

## Acceptance criteria

Wave 0.2 is complete when:

- monitored public contracts are cataloged;
- breaking-change criteria are objective;
- declaration comparison is planned for CI;
- deprecation and semantic-versioning rules are explicit;
- migration adapters have a compatibility responsibility defined.

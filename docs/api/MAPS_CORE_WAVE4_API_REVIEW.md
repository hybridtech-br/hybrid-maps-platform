# Maps Core Wave 4 API Compatibility Review

Date: 2026-08-11
Status: Passed

## Scope

Wave 4 migrated Maps Core internals while preserving the public provider-facing API.

## M4.1 Coordinate

`Coordinate` keeps its constructor, readonly longitude/latitude/altitude properties, `Coordinate.from`, exact `equals`, `toArray`, freezing and characterized validation messages. Canonical geographic validation is delegated to Spatial Engine through `GeographicCoordinate`; the compatibility facade translates validation errors back to the established Maps Core messages.

## M4.2 BoundingBox

`BoundingBox` keeps constructor and west/south/east/north properties plus `contains`, `intersects`, `union` and `center`. It delegates canonical bounds validation to `GeographicBounds` after preserving the existing Maps Core ordering/range error contract.

## M4.3 Geometry

The public `Geometry` union and source shapes are unchanged. An internal `SpatialGeometryBridge` converts valid Maps Core Point/LineString/Polygon structures to Spatial Engine equivalents. The bridge is intentionally not exported, so HGK/Spatial Engine implementation types do not leak into provider contracts.

The characterized legacy fact that empty LineString/Polygon structures are type-valid at the Maps Core public boundary is unchanged. Conversion of invalid/empty structures may fail when an internal consumer explicitly requests a Spatial Engine geometry.

## M4.4 Viewport

No implementation change was required. Existing characterization covers tuple/Coordinate centers, bounds identity, zoom validation, bearing normalization, pitch limits and freezing.

## M4.5 API comparison

Compile-time API fixtures for Maps Core, Spatial Engine, Provider SDK and MapLibre remain green. Provider SDK and MapLibre build against the migrated Core. No public export was removed or renamed in Wave 4.

## CI evidence

Wave 4 final gate: commit `4ef1efbbf2ecc5c96039e2b2d87a2a2a6637901b`, GitHub Actions run `31535283657` — build/typecheck, characterization/package tests and API fixtures all passed.

## Compatibility incident caught by the gate

The first delegation attempt exposed Spatial Engine error messages directly, breaking characterized Maps Core messages. The facade was corrected to preserve legacy messages while retaining delegated canonical validation. This is evidence that the characterization gate is functioning as intended.

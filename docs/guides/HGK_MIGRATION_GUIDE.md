# HYBRID Maps Platform — HGK Migration Guide

Date: 2026-08-11
Status: V1 migration baseline

## Purpose

This guide explains how first-party consumers should use the architecture after the HGK migration.

## Package responsibilities

- `@hybrid/hgk`: generic 2D mathematical/planar geometry only. No Earth, CRS, provider or browser semantics.
- `@hybrid/maps-spatial-engine`: geographic coordinates, Earth-domain algorithms, geographic validation and HGK adapters.
- `@hybrid/maps-core`: stable provider-facing map contracts and compatibility facades.
- `@hybrid/maps-provider-sdk`: provider contracts/capabilities.
- `@hybrid/maps-provider-maplibre`: concrete MapLibre adapter.

## Consumer rule

Application and provider code should continue to consume Maps Core contracts unless it explicitly needs Spatial Engine or HGK domain functionality. Do not import HGK merely to manipulate map-facing longitude/latitude values.

## Coordinate migration

Existing Maps Core usage remains source-compatible:

```ts
const rio = new Coordinate(-43.1729, -22.9068);
```

Maps Core now delegates canonical geographic validation internally. Existing validation messages and tuple behavior are preserved.

For geographic-domain work, use `GeographicCoordinate` from Spatial Engine. For pure planar work, use `Point2` from HGK.

## Bounds migration

Maps Core `BoundingBox` remains compatible. Spatial Engine `GeographicBounds` is available for explicit geographic-domain code. Simple geographic bounds currently require `west <= east`; antimeridian-crossing envelopes need a future explicit representation.

## Geometry migration

Maps Core public Point/LineString/Polygon shapes remain unchanged. Internal consumers can translate them to Spatial Engine and then to HGK where planar algorithms are appropriate. Do not expose HGK geometry through provider-neutral APIs without an explicit new contract.

## Altitude

HGK is 2D. Spatial Engine adapters reject altitude-bearing coordinates before conversion to HGK rather than silently dropping altitude. A consumer must explicitly choose a 2D projection/flattening policy before adapting altitude-bearing data.

## Centroids

HGK centroid functions are planar. Existing Spatial Engine centroid functions preserve their characterized geographic-domain behavior. Do not substitute one for the other solely because the signatures appear similar. See ADR-003.

## Provider migration

Provider SDK and MapLibre require no source migration for the current Maps Core facade. Compile-time API fixtures and full repository CI verify this compatibility.

## Playground/reference scenario

The reference application uses Rio de Janeiro (`-43.1729, -22.9068`) with the MapLibre provider. It is the baseline smoke scenario for V1 map creation, viewport, marker, popup and camera operations.

## Rollback

The migration is layered and reversible by package boundary:

1. Maps Core public contracts remain stable.
2. Internal Core delegation can be reverted without changing provider APIs.
3. Spatial Engine adapters are additive.
4. HGK remains isolated and has no upward dependencies.

No consumer should depend on internal bridge files.

## Deprecation policy

No existing Maps Core public API is removed in the current alpha line. Deprecation requires Gate C, explicit replacement guidance and semantic-versioning review. Removal requires a major-version decision.

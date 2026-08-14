# HYBRID Maps Platform — Data Architecture

Document ID: DAT-01
Status: V1.0 approved baseline
Date: 2026-08-14

## Data ownership

HMP V1 is primarily an SDK/runtime and does not own a persistent user/location database. Consuming HYBRID products remain owners of their domain persistence and access-control policies.

## Data classes

- Cartesian HGK values: points, vectors, envelopes, segments and planar geometries.
- Geographic domain values: longitude, latitude, optional altitude, geographic bounds and geometry collections.
- Map state: viewport/camera, layers, markers, popups, controls and provider capabilities.
- Provider configuration: style/tile URLs, optional credentials and provider-specific options.
- Operational telemetry: non-sensitive runtime/build/error metadata; precise coordinates excluded by default.

## Flow

Consumer → Maps Core/Runtime → Spatial Engine where geographic semantics are required → HGK for pure planar operations. Rendering requests flow through Provider SDK → MapLibre → configured third-party map data service.

## Persistence

No HMP-owned location-history persistence exists in V1. Runtime state is in-memory unless a consumer explicitly stores data in its own domain. Provider-side caching is governed by the selected provider/data-source terms.

## Serialization and compatibility

Public provider-neutral source shapes remain stable. GeoJSON translation belongs at integration/provider boundaries and must not redefine HGK internal contracts.

## Retention

HMP itself defines no persistent retention period because it owns no user location datastore. Consumers that persist coordinates must define purpose, lawful basis, retention, access, deletion and audit rules.

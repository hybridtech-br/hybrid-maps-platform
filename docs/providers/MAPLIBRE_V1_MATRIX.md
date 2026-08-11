# MapLibre Provider — V1 Matrix

Date: 2026-08-11
Status: V1 baseline

## Role

MapLibre GL JS is the only required production rendering provider for HMP V1. It remains behind `@hybrid/maps-provider-sdk`; consumers should not depend on raw MapLibre objects unless using an explicitly provider-specific escape hatch.

## V1 capability baseline

- map lifecycle: required;
- camera/viewport: required;
- layers/sources: required;
- markers: required;
- popups: required;
- controls: required;
- normalized map events: required where exposed by Provider SDK;
- geocoding: not owned by MapLibre adapter in V1;
- routing: out of V1;
- offline packs: out of V1;
- terrain/3D: out of V1 baseline.

## Credentials

The MapLibre library itself does not require an HMP-owned API credential. Tile, style, glyph, sprite or other data services may have independent credential and licensing requirements. Those belong to deployment/provider configuration, never HGK.

## Current reference source

The Playground currently uses `https://demotiles.maplibre.org/style.json` for development/reference demonstration. This is not automatically approved as the HYBRID production tile/style service.

## Production release gate

A production deployment must document:

- chosen style/tile/data source;
- license and attribution text;
- quota/rate limits if any;
- caching restrictions;
- credential/origin restrictions if any;
- availability/fallback behavior;
- privacy/data-transfer implications.

Selecting a paid external provider or accepting a commercial plan is outside autonomous engineering authority and requires owner authorization.

## Failure behavior

Provider/network failure must not corrupt HGK/Spatial Engine state. The UI should expose a recoverable map/provider error and preserve application-level functionality that does not require rendered map data.

## Compatibility

Provider SDK and MapLibre are part of the compile-time API fixture path and the full repository build gate. Maps Core implementation types must not leak through their provider-neutral interfaces.

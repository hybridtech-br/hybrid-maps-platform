# ADR-002 — Centroid accumulator typing under strict TypeScript

Status: Accepted  
Date: 2026-08-10  
Roadmap gate: M0.5

## Context

Wave 0 CI compiles `@hybrid/maps-spatial-engine` with strict TypeScript settings. The `averageCoordinates` reducer in `measurement/Centroid.ts` uses an accumulator containing `longitude`, `latitude`, `altitude` and `altitudeCount`.

Without an explicit accumulator type, TypeScript selects a reducer overload based on the array element type `Coordinate`. This makes `altitude` appear optional and removes `altitudeCount` from the inferred accumulator, causing build errors even though the runtime accumulator object contains both fields.

## Decision

Add an internal accumulator type and provide it explicitly to `Array.reduce`.

This is a compile-time typing correction only. The reducer arithmetic, altitude averaging policy and returned centroid values remain unchanged.

## Compatibility

Classification: internal build/type fix.

No public export, function signature, numerical formula or runtime behavior is intentionally changed.

## Known semantic risk retained

This ADR does not resolve the previously documented semantic concern that the Centroid module mixes spherical line weighting and planar polygon formulas. That architectural redesign remains scheduled for the later HGK/Spatial Engine separation wave.

## Verification

- Spatial Engine must compile under `strict: true`.
- Existing centroid characterization tests must pass unchanged.
- No public API declaration should change as a result of this fix.

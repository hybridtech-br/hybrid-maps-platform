# ADR-001 — GeometryFactory.point argument mismatch

Status: Accepted  
Date: 2026-08-10  
Roadmap gate: M0.3

## Context

`GeometryFactory.point(coordinate)` accepts a `Coordinate` object but forwards that object directly to `createPoint`.

The current `createPoint` signature is:

```ts
createPoint(longitude: number, latitude: number, altitude?: number): Point
```

Therefore the factory call is incompatible with the declared function signature. If executed as JavaScript, the coordinate object becomes the `longitude` value and `latitude` becomes `undefined`, producing a malformed nested coordinate.

## Decision

Classify the behavior as a **confirmed defect to fix before HGK migration**.

It is not a compatibility behavior to preserve because:

1. it violates the TypeScript contract;
2. it does not produce the Point represented by the factory signature;
3. no repository consumer has been identified that can rely on the malformed output as a valid contract;
4. preserving it would prevent a green typecheck gate.

## Correction

`GeometryFactory.point` must delegate as:

```ts
return createPoint(
  coordinate.longitude,
  coordinate.latitude,
  coordinate.altitude,
);
```

The public `GeometryFactory.point(coordinate)` signature remains unchanged, so the correction is source-compatible for callers.

## Compatibility

Classification: Patch-level bug fix.

No public export, parameter or return type changes.

## Verification

The previously blocked characterization test for `GeometryFactory.point` must be enabled and verify that the returned point contains a coordinate equal in value to the supplied coordinate.

## Rollback

If an external consumer is later proven to depend intentionally on malformed output, revert the implementation change and handle the behavior under an explicit major-version compatibility decision. No such consumer is currently evidenced.

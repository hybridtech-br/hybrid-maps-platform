# HGK Numerical Validation

Status: Wave 0.3 baseline

## Objective

Define the official numerical behavior of HGK and prevent divergent precision policies across modules.

## Numeric model

HGK uses JavaScript/TypeScript IEEE-754 double-precision numbers. Algorithms must never assume infinite precision.

## Official epsilon

Initial baseline:

```ts
export const EPSILON = 1e-9;
```

The constant must be centralized in the precision module. No package may introduce a competing default epsilon without an approved architecture decision.

## Comparison policy

Exact equality is reserved for integers, indices, enums, state markers and values that have not passed through floating-point calculations.

Approximate scalar equality:

```ts
Math.abs(a - b) <= EPSILON
```

Vector, point and envelope equality requires every corresponding component to satisfy the same tolerance.

## Finite values

Public geometry constructors and operations must reject:

- `NaN`;
- `Infinity`;
- `-Infinity`.

Any operation that produces a non-finite public result must fail explicitly.

## Signed zero

`0` and `-0` are geometrically equivalent unless an API explicitly documents preservation of the IEEE-754 sign bit.

## Underflow and overflow

Finite subnormal values remain valid. Overflow to infinity is invalid and must be reported.

## Zero magnitude

A zero-length vector cannot be normalized. The failure mode must be explicit and stable.

## Distances and magnitude

Public distance and magnitude results must be finite and greater than or equal to zero.

## Area

Internal signed area may be used for orientation. Public unsigned area APIs must return a finite value greater than or equal to zero.

## Angles

HGK internal rotation and orientation operations use radians.

Default normalized public angular interval:

```text
0 <= angle < 2π
```

Signed orientation APIs may return values in:

```text
-π < angle <= π
```

Degree conversion belongs in explicit conversion functions or upper layers; units must never be implicit.

## Degenerate geometry

Degenerate points and zero-width or zero-height envelopes may be valid when the receiving type documents them. Algorithms must test these cases explicitly.

## Accumulated error

Repeated operations must include drift tests, especially normalization, rotation, centroid accumulation, area summation and envelope aggregation.

## Mandatory boundary values

Tests must cover:

- `0` and `-0`;
- `EPSILON` and `EPSILON / 2`;
- `1` and `-1`;
- `1e-12` and `1e12`;
- `Number.MIN_VALUE`;
- `Number.MAX_VALUE`;
- `Number.MAX_SAFE_INTEGER`;
- non-finite values.

## Mandatory operation coverage

The numerical policy must be validated for:

- addition and subtraction;
- multiplication and division;
- dot and cross products;
- magnitude and normalization;
- distance;
- area;
- centroid;
- intersection predicates;
- envelope containment and overlap.

## Acceptance criteria

Wave 0.3 is complete when:

- one official default epsilon exists;
- finite-value handling is explicit;
- angle units and normalization intervals are defined;
- degenerate and accumulated-error behavior is documented;
- required boundary values and operations are included in the test plan.

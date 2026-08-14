# HYBRID Maps Platform — API & Integration Architecture

Document ID: API-01
Status: V1.0 approved baseline
Date: 2026-08-14

## Integration layers

1. Maps Core: stable provider-neutral map contracts.
2. Runtime: lifecycle, services, events and capability orchestration.
3. Provider SDK: provider registration, metadata and adapter contracts.
4. MapLibre Provider: concrete rendering implementation.
5. Spatial Engine: geographic semantics and adapters.
6. HGK: pure planar/mathematical geometry.

## Public API policy

Consumers prefer `@hybrid/maps-core` and `@hybrid/maps-provider-sdk`. Direct Spatial Engine/HGK use is allowed only when the consumer explicitly requires those domains. Concrete MapLibre objects must not leak through neutral interfaces.

## Compatibility

V1.0 preserves existing Maps Core public signatures. Breaking removal or narrowing requires a major version, migration guidance and external-consumer inventory. Compile fixtures are part of CI.

## Provider integration

Providers declare capabilities and translate neutral requests into provider-native operations. Optional features are capability-discovered rather than universally assumed.

## First-party integration pattern

Consumer application initializes its own auth/domain stack independently, imports HMP SDK packages, registers the provider, resolves it through Provider SDK, creates a map with a neutral `Viewport`, then manages layers/markers/popups through neutral interfaces.

## External services

Style/tile/network endpoints are provider configuration, not domain APIs. Credentials, quotas and licensing remain deployment concerns.

## Error policy

Input/domain validation fails explicitly. Provider/network errors must be propagated in a recoverable form without corrupting HGK/Spatial Engine state.

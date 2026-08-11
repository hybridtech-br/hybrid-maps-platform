# HYBRID Maps Platform — Security & Privacy Boundaries

Date: 2026-08-11
Status: V1 baseline

## Trust boundaries

- HGK is pure computation and must not receive credentials, network clients, browser globals or persisted user data.
- Spatial Engine processes geographic values but owns no authentication or location-history datastore.
- Maps Core exposes provider-neutral contracts and must not embed provider credentials.
- Provider adapters are the boundary where third-party SDK/network behavior enters the platform.
- Consuming HYBRID products retain their own authentication, authorization and domain-data responsibilities.

## Location data

Precise location is potentially sensitive. HMP V1 processes it in memory when required for map operations but does not create an HMP-owned history datastore. Consumers decide whether domain persistence is required and must apply their own retention/access policy.

## Credentials

Provider secrets/tokens must never be committed to source, HGK fixtures, client logs or public documentation. Public browser tokens, when a provider requires them, must be restricted by provider-supported origin/scope controls.

## Telemetry

Telemetry should record operational failures and performance without collecting precise coordinates by default. Any coordinate logging must be explicitly justified, minimized and documented by the consuming product.

## Browser boundary

MapLibre executes in the browser in the reference application. DOM elements and MapLibre objects remain provider-layer concerns and must not enter HGK or Spatial Engine domain models.

## Supply chain

Production releases require a committed dependency lockfile, CI build/test gates and review of provider/data-source licenses. Dependency upgrades must not bypass compatibility tests.

## Threats considered

- credential leakage;
- malicious/untrusted GeoJSON or malformed geometry;
- non-finite/extreme numeric input;
- silent altitude loss during 2D conversion;
- provider object leakage through neutral contracts;
- sensitive coordinate logging;
- dependency/supply-chain drift;
- third-party tile/style service outage.

## Current mitigations

- finite/range validation at geographic wrappers;
- structural HGK validation;
- altitude-bearing HGK adaptation fails closed;
- package dependency boundaries enforced in CI;
- public API compile fixtures;
- no HMP-owned location-history persistence;
- MapLibre isolated behind Provider SDK.

## Release requirements

Before production release:

1. commit and enforce a dependency lockfile;
2. document MapLibre and tile/style attribution/licensing;
3. choose production tile/style source and fallback policy;
4. confirm no secrets in repository/history/configuration;
5. document CSP/origin restrictions for the deployed reference/consumer environment;
6. complete first-party consumer privacy review for any persisted location data.

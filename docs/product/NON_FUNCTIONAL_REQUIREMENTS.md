# HYBRID Maps Platform — Non-Functional Requirements

Document ID: NFR-01
Status: V1.0 approved baseline
Date: 2026-08-14

## Quality

- NFR-001: Node.js 22 and pnpm 9.15.0 are the reference toolchain.
- NFR-002: dependency installation in release CI uses the committed lockfile with `--frozen-lockfile`.
- NFR-003: TypeScript builds must complete without errors.
- NFR-004: HGK, Spatial Engine, Maps Core and Runtime test suites must pass.
- NFR-005: public API compile fixtures must pass before release.
- NFR-006: HGK must remain free of upward dependencies, DOM, browser APIs, provider SDKs and geographic semantics.
- NFR-007: floating-point behavior follows the official HGK numerical policy.
- NFR-008: provider-neutral APIs must not leak concrete MapLibre objects.

## Security and privacy

- NFR-009: secrets and provider credentials must not be committed to source.
- NFR-010: HMP V1 must not persist user/location history.
- NFR-011: telemetry must minimize precise coordinates and sensitive location data.
- NFR-012: third-party provider/data terms must be reviewed for production deployments.

## UX and accessibility

- NFR-013: first-party visual interfaces follow the official HYBRID Maps Platform identity.
- NFR-014: interactive reference controls must be keyboard operable and receive accessible names.
- NFR-015: color must not be the only carrier of critical state.

## Performance and resilience

- NFR-016: core geometry operations must be deterministic and free of hidden network dependency.
- NFR-017: provider failures must not corrupt HGK/Spatial Engine state.
- NFR-018: the Playground must build for the defined production target; provider code should be lazy-loaded when practical.
- NFR-019: release pipelines must fail closed on build, test, compatibility or dependency-boundary failures.

## Maintainability

- NFR-020: public breaking changes require semantic-versioning review and a major-version decision.
- NFR-021: architectural decisions are recorded as ADRs.
- NFR-022: documentation, migration guidance, release notes and risk register are maintained with each stable release.

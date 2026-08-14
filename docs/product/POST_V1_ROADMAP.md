# HYBRID Maps Platform — Post-V1 Roadmap

Date: 2026-08-14
Status: Approved execution baseline

## Purpose

Define the sequence after the published HYBRID Maps Platform v1.0.0 source/engineering release. This roadmap intentionally starts with real first-party adoption before expanding scope.

## Guiding rule

Do not add new platform capabilities merely because they are desirable. First collect evidence from an actual HYBRID consumer, preserve V1 public compatibility, and prioritize reusable gaps that appear in more than one product or are architecturally fundamental.

## Phase P1 — First Consumer Integration

Primary consumer: **HYBRID Starlink Tracker**.

Objectives:

- consume the stable HMP v1.0.0 contracts;
- replace provider-specific map coupling where HMP already has an equivalent abstraction;
- validate viewport/camera, markers, popups, layers, controls and provider lifecycle;
- validate Rio de Janeiro reference flows where applicable;
- record missing capabilities instead of implementing ad-hoc shortcuts in HMP;
- keep Starlink Tracker domain persistence, GNSS logic and application-specific state outside HMP.

Exit criteria:

- consumer builds/tests green;
- no raw MapLibre dependency remains where a provider-neutral HMP contract exists;
- integration gaps are cataloged and classified as consumer-specific or platform-generic;
- no V1 API break is required.

## Phase P2 — Adoption Feedback & Compatibility Hardening

Objectives:

- create regression fixtures from first-consumer discoveries;
- improve API ergonomics without breaking V1;
- resolve documentation gaps discovered by the integration;
- establish an explicit external first-party consumer inventory;
- define compatibility support policy for the 1.x line.

Potential technical-debt candidates:

- antimeridian-capable geographic bounds representation;
- explicit geodesic centroid API while preserving legacy behavior;
- stronger package-level performance budgets;
- provider/runtime diagnostics and typed error taxonomy.

Exit criteria:

- consumer evidence is reflected in tests/docs;
- all accepted fixes are backward-compatible within 1.x;
- unresolved breaking changes are deferred to a future major-version proposal.

## Phase P3 — Production Provider/Data Policy

Triggered only when a concrete deployment/consumer requires production map data.

Objectives:

- select style/tile/data source;
- document license and attribution;
- document quotas, rate limits and caching restrictions;
- define credential/origin controls where applicable;
- define outage/fallback behavior;
- document privacy/data-transfer implications;
- validate CSP and browser security policy for the actual deployment target.

Gate:

A paid external service, commercial contract or material recurring cost requires project-owner authorization.

## Phase P4 — Capability Expansion

Evaluate only after P1/P2 evidence.

Candidate order:

1. geocoding/reverse geocoding abstraction;
2. routing/navigation abstraction;
3. offline map/data strategy;
4. additional providers;
5. advanced terrain/3D only when justified by a product requirement.

Every new capability requires:

- provider-neutral contract;
- capability discovery semantics;
- at least one production-quality provider implementation;
- tests and compatibility fixtures;
- security/privacy/provider documentation;
- explicit fallback/degradation behavior.

## Phase P5 — Ecosystem Rollout

After the Starlink Tracker reference integration is stable, evaluate adoption by other first-party HYBRID products individually. A consumer relationship does not imply shared authentication, databases, sessions or infrastructure between products.

## Versioning

- `1.x`: additive and backward-compatible evolution only;
- deprecation: replacement and migration guidance required;
- removal/narrowing of existing public contracts: future major version only;
- provider-specific escape hatches must remain explicit and must not become the default integration path.

## Evidence log

For each consumer integration, record:

- consumer/product;
- HMP version;
- capabilities exercised;
- provider used;
- issues/gaps discovered;
- compatibility impact;
- accepted platform changes;
- rejected consumer-specific changes;
- CI/release evidence.

## Next action

Start P1 with HYBRID Starlink Tracker. Before modifying that separate repository, resolve its current repository/access context and inventory how it presently integrates maps, GNSS and provider-specific APIs.

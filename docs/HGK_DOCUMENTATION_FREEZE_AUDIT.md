# HYBRID Maps Platform / HGK — Documentation Freeze Audit

Status: Documentation Freeze gate review
Date: 2026-08-10
Branch reviewed: `feat/hgk-foundation`

## Executive decision

Development is **NOT AUTHORIZED**.

The existing documentation is strong for the HGK migration architecture and test strategy, but it is not yet sufficient to release the complete HYBRID Maps Platform into development. The repository documentation currently concentrates on HGK architecture, dependency mapping, migration planning, API inventory and test policy. Product-level requirements and several operational architecture domains are not represented by official documents in the reviewed `docs/` tree.

## 1. Is the documentation complete?

No.

### Existing documented areas

- HGK Architecture Book;
- component inventory;
- dependency map;
- migration plan;
- public API inventory;
- characterization-test specification;
- API compatibility specification;
- numerical validation policy;
- official test dataset specification;
- CI test matrix.

### Missing or insufficient official documentation

Priority P0 — blocks development release:

1. Product Requirements Document for HYBRID Maps Platform.
2. Explicit MVP/V1 scope and out-of-scope definition.
3. Functional requirements catalog with acceptance criteria and traceable IDs.
4. Non-functional requirements catalog: performance, availability, scalability, accessibility, observability and compatibility targets.
5. Security architecture and threat model.
6. Authentication/authorization and data-access policy, including whether these concerns belong to the platform or consuming products.
7. Data architecture: persistence boundaries, data ownership, retention, caching and geospatial data lifecycle.
8. API/integration architecture: public/internal API boundaries, provider contracts, versioning, error model, rate limits and integration ownership.
9. Deployment/infrastructure architecture and supported environments.
10. ADR index with the key architectural decisions and their status.
11. Product roadmap with documentation gates and release milestones, distinct from the HGK migration sequence.
12. Risk register for the full Maps Platform, not only HGK migration risks.

Priority P1 — required before UX/product implementation or production readiness:

13. UX/UI specification and design-system application for the official HYBRID visual identity.
14. Accessibility requirements.
15. Observability and operational support specification.
16. Backup, recovery and disaster-recovery policy where persistent platform data exists.
17. Privacy/LGPD data classification and handling policy where user/location data exists.
18. External dependency/provider inventory including licensing, quotas, SLAs and fallback strategy.
19. Release/versioning policy for the complete platform packages.
20. Documentation ownership, review cadence and source-of-truth index.

## 2. Are there inconsistencies?

Yes.

### I-01 — Wave numbering conflict

The migration plan defines **Wave 0** as the executable safety-net phase that creates characterization tests, API compile fixtures and CI integration. Separate documents created later label documentation specifications themselves as `Wave 0.1` through `Wave 0.5`. This creates two meanings for Wave 0.

Required correction: reserve migration Wave 0 for executable safety-net work and classify the documentation specifications as Phase 0 documentation artifacts or a Documentation Gate series.

### I-02 — Migration plan says the next authorized action is executable tests

`HGK_MIGRATION_PLAN.md` ends by authorizing Wave 0 characterization tests. The later project-level Documentation Freeze supersedes that authorization.

Required correction: add a freeze notice or status document making explicit that implementation/test execution is suspended until owner authorization.

### I-03 — CI specification versus Documentation Freeze

The CI Test Matrix describes production-oriented automated checks and merge blocking policy. The specification itself is valid documentation, but implementation of those pipelines is currently prohibited by the freeze.

Required correction: label the matrix as planned/future and explicitly separate specification from implementation authorization.

### I-04 — Scope ambiguity: HGK versus Maps Platform

Most official documentation is HGK-centric, while the project gate applies to the complete Maps Platform. HGK migration readiness therefore cannot be used as evidence that the entire product is development-ready.

Required correction: create a product-level documentation hierarchy above HGK.

## 3. Pending architectural decisions

### AD-01 — Product boundary

Define precisely what HYBRID Maps Platform owns versus what belongs to applications that consume it.

### AD-02 — Persistence model

Decide whether the platform is stateless, owns persistent geospatial data, or supports both modes.

### AD-03 — Authentication and authorization boundary

Decide whether authentication is a Maps Platform responsibility, delegated to host products, or split by deployment profile.

### AD-04 — Public API strategy

Define supported API surfaces: TypeScript SDK, HTTP/REST, WebSocket/event stream, internal-only interfaces, or combinations.

### AD-05 — Geospatial provider strategy

Define supported map/tile/geocoding/routing providers, fallback rules, licensing constraints and abstraction guarantees.

### AD-06 — Deployment topology

Define browser, server, edge, desktop/mobile embedding and cloud/self-hosted support boundaries.

### AD-07 — Offline capability

Decide whether offline maps/data are in V1 scope and define storage/licensing implications.

### AD-08 — Location/privacy policy

Define treatment of precise location, telemetry and potentially personal geospatial data.

### AD-09 — Numerical/geodesic model beyond current baseline

HGK planar semantics are documented, but Spatial Engine production requirements still need explicit accuracy targets and supported Earth/CRS models.

### AD-10 — External consumer compatibility

Determine whether published packages already have external consumers and what compatibility commitment applies.

## 4. Untreated technical risks

### R-01 — Unknown external consumers — High

Impact: an apparently internal API change may break external users.

Treatment: inventory package publication and consumers before any compatibility migration.

### R-02 — Provider licensing and service dependency — High

Impact: map tiles, geocoding, routing or imagery may be technically usable but commercially or operationally unsuitable.

Treatment: provider/license matrix with quotas, attribution, caching and fallback rules.

### R-03 — Location privacy/LGPD — High if precise user location is processed

Impact: compliance and privacy exposure.

Treatment: data classification, minimization, retention and consent/legitimate-basis design before implementation.

### R-04 — Undefined production SLOs — High

Impact: architecture cannot be validated against measurable performance or availability targets.

Treatment: approve NFR/SLO document.

### R-05 — Undefined persistence/caching strategy — High

Impact: later architectural rework and provider-policy conflicts.

Treatment: approve data architecture before backend/storage work.

### R-06 — HGK/Spatial numerical semantics — Medium/High

Impact: subtle accuracy regressions in geographic operations.

Treatment: define geodesic accuracy targets and reference datasets before algorithm migration.

### R-07 — Incomplete product-level threat model — High

Impact: security controls may be added late or inconsistently.

Treatment: STRIDE-style or equivalent threat model before development release.

### R-08 — Documentation hierarchy/source-of-truth ambiguity — Medium

Impact: conflicting plans and wave labels can drive incorrect implementation order.

Treatment: create documentation index and status metadata.

## 5. Pending external dependencies

Not enough documentation exists to close this item.

At minimum, the following must be inventoried and approved:

- MapLibre GL and its supported/version policy;
- tile/map data providers;
- geocoding provider(s);
- routing/navigation provider(s), if in scope;
- elevation/terrain/satellite data providers, if in scope;
- CRS/projection libraries, if used;
- external package registry/publication targets;
- browser/runtime compatibility;
- provider licensing, attribution, quotas and caching restrictions.

Current status: **OPEN**.

## 6. Is there enough documentation to begin development?

**No.**

The HGK technical foundation is substantially documented, but the complete Maps Platform lacks the product, security, data, infrastructure, integration and operational contracts required to make implementation decisions without significant assumption and rework risk.

## 7. Is the project ready to enter development?

**No.**

### Blocking items, impact, priority and estimated documentation effort

| Priority | Blocking item | Impact | Estimated focused effort |
|---|---|---|---|
| P0 | Product Requirements + V1 scope | Prevents objective feature and acceptance decisions | 1–2 days |
| P0 | Functional/NFR catalog | Prevents measurable architecture and testing targets | 1–2 days |
| P0 | Security architecture + threat model | Security controls cannot be validated | 1–2 days |
| P0 | Data architecture | Persistence/cache/location lifecycle remains ambiguous | 1 day |
| P0 | API/integration architecture | Contracts and ownership remain ambiguous | 1–2 days |
| P0 | Infrastructure/deployment architecture | Runtime topology and operational constraints undefined | 1 day |
| P0 | ADR set/index | Key decisions are not formally traceable | 0.5–1 day |
| P0 | Product roadmap + full risk register | No product-level gated execution baseline | 0.5–1 day |
| P1 | UX/UI + accessibility specification | Product UI cannot be implemented consistently | 1–2 days |
| P1 | External dependency/provider matrix | Licensing/quota/fallback risk remains open | 0.5–1 day |
| P1 | Observability/operations/recovery | Production readiness cannot be evaluated | 1 day |
| P1 | LGPD/privacy specification | Required if precise user/location data is processed | 0.5–1 day |

Estimates are documentation effort for one focused owner/architect workflow and are not calendar commitments.

## Documentation remediation roadmap

The freeze remains active. The permitted next sequence is:

### D1 — Governance and source of truth

1. Correct Wave 0 terminology conflict.
2. Add Documentation Freeze status to migration/CI documentation.
3. Create official documentation index and status matrix.

### D2 — Product definition

4. Create Product Requirements Document.
5. Define V1/MVP scope and explicit exclusions.
6. Create functional and non-functional requirements catalogs.

### D3 — Architecture completion

7. Security architecture and threat model.
8. Data architecture.
9. API and integration architecture.
10. Infrastructure/deployment architecture.
11. External dependency/provider matrix.
12. ADR index and individual ADRs for unresolved decisions.

### D4 — Experience and operations

13. UX/UI specification using the approved HYBRID visual identity.
14. Accessibility specification.
15. Observability/operations/recovery specification.
16. Privacy/LGPD specification where applicable.

### D5 — Final gate

17. Consolidate product roadmap and risk register.
18. Run a second full Documentation Freeze audit.
19. Issue a Development Readiness Report.
20. Await explicit owner authorization before any implementation.

## Current gate

Documentation Freeze: **ACTIVE**

Development authorization: **BLOCKED**

Next permitted activity: D1 — Governance and source-of-truth consolidation.

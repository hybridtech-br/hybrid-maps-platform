# HYBRID Maps Platform — Documentation Index

Status: **V1.0.0 RELEASED — OFFICIAL SOURCE OF TRUTH**
Date: 2026-08-14

## Governance

V1.0 engineering Waves 0–5, release hardening, merge to `main` and publication of `v1.0.0` are complete. This index is the canonical map of the V1.0.0 documentation baseline and the entrypoint for post-V1 evolution.

## Authority order

1. explicit owner decision;
2. `docs/PROJECT_STATUS.md`;
3. this index;
4. approved ADRs;
5. product requirements/NFRs;
6. architecture/API/security/provider/operations specifications;
7. migration/testing specifications;
8. historical audit/conversation material.

## Master documentation

| ID | Document | Status |
|---|---|---|
| BOOK-01 | `docs/MAPS_PLATFORM_BOOK.md` | Approved V1.0 |
| GOV-01 | `docs/DOCUMENTATION_INDEX.md` | Approved V1.0.0 |
| GOV-02 | `docs/PROJECT_STATUS.md` | V1.0.0 released / post-V1 open |
| GOV-HIST | `docs/HGK_DOCUMENTATION_FREEZE_AUDIT.md` | Historical audit |

## Product

| ID | Document | Status |
|---|---|---|
| PRD-01 | `docs/product/MAPS_PLATFORM_PRD.md` | Approved V1 baseline |
| REQ-01 | `docs/product/FUNCTIONAL_REQUIREMENTS.md` | Approved V1.0 |
| NFR-01 | `docs/product/NON_FUNCTIONAL_REQUIREMENTS.md` | Approved V1.0 |
| RISK-01 | `docs/product/RISK_REGISTER.md` | Approved V1.0 |
| ROAD-01 | `docs/product/V1_ROADMAP.md` | Executed V1 roadmap |
| ROAD-02 | `docs/product/POST_V1_ROADMAP.md` | Active post-V1 roadmap |

## Architecture

| ID | Document | Status |
|---|---|---|
| ARC-01 | `docs/architecture/HGK_ARCHITECTURE_BOOK.md` | Approved |
| ARC-02 | `docs/architecture/HGK_COMPONENT_INVENTORY.md` | Approved |
| ARC-03 | `docs/architecture/HGK_PUBLIC_API_INVENTORY.md` | Approved |
| ARC-04 | `docs/architecture/HGK_DEPENDENCY_MAP.md` | Approved |
| ARC-05 | `docs/architecture/HGK_MIGRATION_PLAN.md` | Executed Waves 0–5 |
| DAT-01 | `docs/architecture/DATA_ARCHITECTURE.md` | Approved V1.0 |
| INF-01 | `docs/architecture/INFRASTRUCTURE_DEPLOYMENT_ARCHITECTURE.md` | Approved source/deployment baseline |

## API & integration

| ID | Document | Status |
|---|---|---|
| API-01 | `docs/api/API_INTEGRATION_ARCHITECTURE.md` | Approved V1.0 |
| API-HGK | `docs/api/HGK_API.md` | Approved |
| API-COMP | `docs/api/MAPS_CORE_WAVE4_API_REVIEW.md` | Passed |
| GUIDE-MIG | `docs/guides/HGK_MIGRATION_GUIDE.md` | Approved |
| GUIDE-INSTALL | `docs/guides/INSTALLATION_DEVELOPMENT.md` | Approved V1.0 |

## Security, privacy & quality

| ID | Document | Status |
|---|---|---|
| SEC-BASE | `docs/security/SECURITY_PRIVACY_BOUNDARIES.md` | Approved |
| SEC-01 | `docs/security/THREAT_MODEL.md` | Approved V1.0 |
| PRIV-01 | `docs/security/PRIVACY_LGPD.md` | Approved V1.0 |
| DTS-01 | `docs/testing/HGK_CHARACTERIZATION_TEST_SPEC.md` | Implemented/validated |
| DTS-02 | `docs/testing/HGK_API_COMPATIBILITY_SPEC.md` | Implemented/validated |
| DTS-03 | `docs/testing/HGK_NUMERICAL_VALIDATION.md` | Implemented/validated |
| DTS-04 | `docs/testing/HGK_OFFICIAL_TEST_DATASET.md` | Approved baseline |
| DTS-05 | `docs/testing/HGK_CI_TEST_MATRIX.md` | Implemented by repository workflows |

## Provider, UX & operations

| ID | Document | Status |
|---|---|---|
| DEP-01 | `docs/providers/EXTERNAL_DEPENDENCY_MATRIX.md` | Approved V1.0 |
| MAPLIBRE-01 | `docs/providers/MAPLIBRE_V1_MATRIX.md` | Approved V1.0 |
| UX-01 | `docs/ux/VISUAL_IDENTITY_UX_UI.md` | Official identity baseline |
| A11Y-01 | `docs/ux/ACCESSIBILITY.md` | Approved V1.0 |
| OPS-01 | `docs/operations/OBSERVABILITY_OPERATIONS_RECOVERY.md` | Approved V1.0 |

## Architecture decisions

| ID | Document | Status |
|---|---|---|
| ADR-INDEX | `docs/adr/ADR_INDEX.md` | Approved V1.0 |
| ADR-001 | `docs/architecture/ADR-001-GEOMETRY_FACTORY_POINT.md` | Accepted |
| ADR-002 | `docs/architecture/ADR-002-CENTROID-ACCUMULATOR-TYPING.md` | Accepted |
| ADR-003 | `docs/adr/ADR-003-centroid-semantics.md` | Accepted |

## Release

| ID | Document | Status |
|---|---|---|
| READY-01 | `docs/release/V1_DEVELOPMENT_READINESS.md` | Historical readiness gate passed |
| REL-CHK | `docs/release/V1_RELEASE_CHECKLIST.md` | V1 source release completed |
| REL-NOTES | `docs/release/V1_0_0_RELEASE_NOTES.md` | Published baseline |
| CHANGELOG | `CHANGELOG.md` | V1.0.0 recorded |
| GITHUB-REL | GitHub Release `v1.0.0` | Published 2026-08-14 |

## V1.0.0 completion gate

The V1.0.0 source/engineering release is complete and published. No V1 documentation or engineering task remains open in this repository.

## Post-V1 gate

Post-V1 work begins with the first real first-party consumer integration in HYBRID Starlink Tracker. Production hosting, commercial tile/style selection, additional providers and new capabilities are handled by `docs/product/POST_V1_ROADMAP.md` and require their own gates.

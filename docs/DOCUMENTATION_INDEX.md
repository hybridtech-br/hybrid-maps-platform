# HYBRID Maps Platform — Documentation Index

Status: Official documentation source-of-truth index
Date: 2026-08-10

## Governance

The project is under **Documentation Freeze**. Documentation work is authorized; software implementation, automated software test creation, production CI/CD implementation, homologation and deployment are blocked until explicit owner authorization.

## Status vocabulary

- `Approved baseline`: accepted as the current technical baseline, subject to later documented supersession.
- `Draft`: incomplete and not sufficient to authorize implementation.
- `Planned`: required document not yet produced.
- `Superseded`: retained for history but no longer authoritative.
- `Blocked`: cannot be finalized without an owner/product decision.

## Terminology correction

The term **Migration Wave 0** is reserved for the executable safety-net phase defined in `HGK_MIGRATION_PLAN.md` (characterization tests, API fixtures and CI integration).

The five documents under `docs/testing/` that were previously described conversationally as Wave 0.1–0.5 are **documentation specifications**, not executable migration waves. Their canonical classification is now **Documentation Test Specifications DTS-01 through DTS-05**.

No executable Migration Wave 0 work is authorized while Documentation Freeze is active.

## Official documents

### Governance

| ID | Document | Status |
|---|---|---|
| GOV-01 | `docs/DOCUMENTATION_INDEX.md` | Approved baseline |
| GOV-02 | `docs/HGK_DOCUMENTATION_FREEZE_AUDIT.md` | Approved baseline |
| GOV-03 | `docs/PROJECT_STATUS.md` | Approved baseline |

### HGK architecture

| ID | Document | Status |
|---|---|---|
| ARC-01 | `docs/architecture/HGK_ARCHITECTURE_BOOK.md` | Approved baseline |
| ARC-02 | `docs/architecture/HGK_COMPONENT_INVENTORY.md` | Approved baseline |
| ARC-03 | `docs/architecture/HGK_PUBLIC_API_INVENTORY.md` | Approved baseline |
| ARC-04 | `docs/architecture/HGK_DEPENDENCY_MAP.md` | Approved baseline |
| ARC-05 | `docs/architecture/HGK_MIGRATION_PLAN.md` | Approved baseline; execution suspended by Documentation Freeze |

### Test and quality specifications

| ID | Document | Canonical classification | Status |
|---|---|---|---|
| DTS-01 | `docs/testing/HGK_CHARACTERIZATION_TEST_SPEC.md` | Documentation specification | Approved baseline; implementation blocked |
| DTS-02 | `docs/testing/HGK_API_COMPATIBILITY_SPEC.md` | Documentation specification | Approved baseline; implementation blocked |
| DTS-03 | `docs/testing/HGK_NUMERICAL_VALIDATION.md` | Documentation specification | Approved baseline |
| DTS-04 | `docs/testing/HGK_OFFICIAL_TEST_DATASET.md` | Documentation specification | Approved baseline; dataset implementation blocked |
| DTS-05 | `docs/testing/HGK_CI_TEST_MATRIX.md` | Future CI specification | Approved baseline; pipeline implementation blocked |

## Required product-level documents

| ID | Document | Status |
|---|---|---|
| PRD-01 | Maps Platform Product Requirements Document | Planned |
| REQ-01 | Functional Requirements Catalog | Planned |
| NFR-01 | Non-Functional Requirements Catalog | Planned |
| SEC-01 | Security Architecture and Threat Model | Planned |
| DAT-01 | Data Architecture | Planned |
| API-01 | API and Integration Architecture | Planned |
| INF-01 | Infrastructure and Deployment Architecture | Planned |
| DEP-01 | External Dependency and Provider Matrix | Planned |
| UX-01 | UX/UI and Visual Identity Specification | Planned |
| A11Y-01 | Accessibility Specification | Planned |
| OPS-01 | Observability, Operations and Recovery Specification | Planned |
| PRIV-01 | Privacy/LGPD Specification | Planned/conditional on data scope |
| ADR-INDEX | Architecture Decision Record Index | Planned |
| RISK-01 | Product Risk Register | Planned |
| ROAD-01 | Product Documentation/Release Roadmap | Planned |
| READY-01 | Development Readiness Report | Planned; final freeze gate |

## Authority order

When documents conflict, use this precedence until explicitly changed:

1. explicit owner decision;
2. Documentation Freeze gate and `PROJECT_STATUS.md`;
3. this documentation index;
4. approved ADRs;
5. product requirements and NFRs;
6. architecture books and dependency maps;
7. migration/test specifications;
8. historical conversation notes.

## Change control during freeze

Documentation changes are allowed when they:

- resolve contradictions;
- add missing requirements or architecture;
- improve traceability;
- update risks or decisions;
- consolidate approved visual identity;
- clarify roadmap/gates.

They must not be used as a pretext to introduce product implementation.

# HYBRID Maps Platform — Project Status

Date: 2026-08-10
Status: **DOCUMENTATION FREEZE — RELEASED BY PROJECT OWNER**
Development: **AUTHORIZED SUBJECT TO ROADMAP GATES**

## Governing rule

On 2026-08-10 the project owner explicitly released the Documentation Freeze and authorized autonomous continuation of the HYBRID Maps Platform/HGK project.

Work must continue in roadmap order. No roadmap step may be skipped. Architecture, characterization, compatibility, security and CI gates remain mandatory.

## Current product baseline

Until superseded by an explicit owner decision, the V1 engineering baseline is:

- HYBRID Maps Platform is an internal provider-neutral platform/SDK for first-party HYBRID products;
- MapLibre is the initial production rendering provider;
- V1 does not require a HYBRID-hosted geospatial backend;
- V1 does not persist user/location history in HMP;
- HYBRID Starlink Tracker is the first integration/reference consumer;
- geocoding, routing/navigation and offline maps are post-V1 capabilities;
- provider-neutral contracts, capability discovery, normalized events and HGK/Spatial Engine boundaries remain mandatory.

## Roadmap state

1. D1 — Governance/source of truth: living documentation.
2. D2 — Product definition: V1 baseline approved for engineering.
3. D3 — Architecture completion: living documentation alongside gated implementation.
4. D4 — Experience and operations: required before production release.
5. D5 — Documentation readiness audit: production-release gate.
6. HGK Phase 0.5: approved planning baseline.
7. Wave 0 — safety net and characterization: **COMPLETE — CI GREEN**.
8. Wave 1 — HGK mathematical foundation: **AUTHORIZED / IN PROGRESS**.
9. Waves 2–5: gated by the acceptance criteria in `architecture/HGK_MIGRATION_PLAN.md`.

## Wave 0 completion record

Completed in roadmap order:

- M0.1 Maps Core characterization tests;
- M0.2 Spatial Engine characterization tests;
- M0.3 `GeometryFactory.point` defect classified by ADR-001, corrected without public signature change, regression test enabled;
- M0.4 compile-time API fixture package covering Maps Core, Spatial Engine, Provider SDK and MapLibre Provider;
- M0.5 GitHub Actions quality gate for the migration dependency path.

The first green Wave 0 CI run completed successfully on commit `d93073f1e375c102ede41efeb9796a5f2c9c9978` (GitHub Actions run 31433515546).

Additional strict-build fixes made while reaching the gate:

- Spatial Engine `tsconfig.json` added because the package declared a build script but lacked its config;
- Centroid reducer accumulator typing fixed without numerical behavior change (ADR-002);
- MapLibre raw GeoJSON boundary cast made explicit without runtime behavior change.

Known unrelated technical debt discovered but not pulled into this wave:

- the pre-existing Runtime test source does not currently compile against its implementation;
- the pre-existing HGK package was only a manifest placeholder before Wave 1;
- the repository still lacks a committed `pnpm-lock.yaml`; current migration CI installs without frozen lockfile until reproducibility hardening is completed.

## Current development authorization

Authorized now, in order:

- M1.1 establish the HGK package skeleton;
- M1.2 implement Precision;
- M1.3 implement Vector2;
- M1.4 implement Point2;
- M1.5 implement Envelope2;
- M1.6 publish HGK API documentation;
- Wave 1 build/test/forbidden-dependency verification.

Not yet authorized by sequence:

- Wave 2 geometry family before Wave 1 exit criteria are green;
- consumer migration before Gate B;
- deprecation before Gate C;
- breaking public API changes without explicit versioning approval.

## Visual identity rule

All HYBRID Maps Platform first-party UI and visual documentation must follow the approved HYBRID corporate identity: black/dark graphite base, white/light gray, HYBRID green accent, corporate HYBRID mark/wordmark language, minimalist technological line iconography and consistent HYBRID typography/design language. Maps-specific motifs may include geolocation, layers, routes, terrain/topographic lines and geospatial data, subordinate to the HYBRID master brand.

## Next action

Execute Wave 1 M1.1–M1.6 in order and require a green Wave 1 gate before entering Wave 2. Stop only at a decision that genuinely requires project-owner judgment.

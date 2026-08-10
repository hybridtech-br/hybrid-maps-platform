# HYBRID Maps Platform — Project Status

Date: 2026-08-10
Status: **DOCUMENTATION FREEZE — RELEASED BY PROJECT OWNER**
Development: **AUTHORIZED SUBJECT TO ROADMAP GATES**

## Governing rule

On 2026-08-10 the project owner explicitly released the Documentation Freeze and authorized autonomous continuation of the HYBRID Maps Platform/HGK project.

Work must continue in roadmap order. No roadmap step may be skipped. Architecture, characterization, compatibility, security and CI gates remain mandatory even though the documentation freeze is no longer active.

## Current product baseline

Until superseded by an explicit owner decision, the conservative V1 baseline is adopted as the engineering baseline:

- HYBRID Maps Platform is an internal provider-neutral platform/SDK for first-party HYBRID products;
- MapLibre is the initial production rendering provider;
- V1 does not require a HYBRID-hosted geospatial backend;
- V1 does not persist user/location history in HMP;
- HYBRID Starlink Tracker is the first integration/reference consumer;
- geocoding, routing/navigation and offline maps are post-V1 capabilities;
- provider-neutral contracts, capability discovery, normalized events and HGK/Spatial Engine boundaries remain mandatory.

This baseline is reversible by an explicit owner decision and does not authorize breaking existing public contracts.

## Roadmap state

1. D1 — Governance/source of truth: complete enough to proceed; continue maintenance as living documentation.
2. D2 — Product definition: baseline established; PRD consolidation authorized.
3. D3 — Architecture completion: continue in parallel where it does not violate migration sequencing.
4. D4 — Experience and operations: continue before production release.
5. D5 — Documentation readiness audit: remains a release gate, not a development freeze.
6. HGK Phase 0.5: approved planning baseline.
7. Wave 0 — safety net and characterization: **AUTHORIZED NEXT IMPLEMENTATION WAVE**.
8. Waves 1–5: gated by the acceptance criteria in `architecture/HGK_MIGRATION_PLAN.md`.

## Development authorization

Authorized now:

- Wave 0 characterization tests;
- API compile fixtures;
- GeometryFactory defect investigation/decision record;
- CI integration needed to execute Wave 0 gates;
- documentation updates required by the roadmap.

Not yet authorized by sequence:

- Wave 1 HGK production primitives before Wave 0 exit criteria are green;
- consumer migration before Gate B;
- deprecation before Gate C;
- breaking public API changes without explicit versioning approval.

## Visual identity rule

All HYBRID Maps Platform first-party UI and visual documentation must follow the approved HYBRID corporate identity: black/dark graphite base, white/light gray, HYBRID green accent, corporate HYBRID mark/wordmark language, minimalist technological line iconography and consistent HYBRID typography/design language. Maps-specific motifs may include geolocation, layers, routes, terrain/topographic lines and geospatial data, subordinate to the HYBRID master brand.

## Next action

Execute Wave 0 in roadmap order: M0.1 Maps Core characterization, M0.2 Spatial Engine characterization, M0.3 GeometryFactory decision, M0.4 API compile fixtures, M0.5 CI integration. Stop only at a gate that genuinely requires project-owner judgment.

# HYBRID Maps Platform Book

Status: Official V1.0 documentation book
Date: 2026-08-14

## Executive definition

HYBRID Maps Platform (HMP) is the provider-neutral geospatial SDK/runtime of HYBRID Tecnologia Inteligente. V1.0 establishes a reusable stack for first-party HYBRID products while isolating generic geometry, geographic semantics, map contracts and concrete rendering providers.

## V1 architecture

```text
Consumer HYBRID Product
        |
    Maps Core
        |
 Runtime / Provider SDK -------- MapLibre Provider ---- style/tile service
        |
 Spatial Engine
        |
       HGK
```

HGK is pure 2D math/geometry. Spatial Engine owns geographic semantics. Maps Core owns stable provider-neutral map contracts. Provider SDK owns capabilities/adapter contracts. MapLibre is the V1 concrete renderer.

## V1 capabilities

Map lifecycle, viewport/camera, layers/sources, markers, popups, controls, provider capability discovery, geographic validation, planar geometry/algorithms, public TypeScript contracts, compatibility gates and a HYBRID-branded reference Playground centered on Rio de Janeiro.

## V1 boundaries

No HMP-owned backend or persistent location-history datastore is required. Geocoding, routing/navigation, offline maps and additional production providers are post-V1. Production tile/style service selection belongs to the consuming deployment.

## Security/privacy

Secrets do not enter HGK or neutral domain contracts. Precise coordinates are not logged/persisted by default. HMP V1 owns no user location history. Production consumers must assess third-party map-data privacy/licensing, CSP, credentials and their own domain retention.

## Visual identity

The official Maps Platform identity extends the HYBRID master brand. Palette: `#0D1117`, `#1B2128`, `#2E343B`, `#22C55E`, `#F5F7FA`. Titles/highlights use Exo 2; body/interface text uses Inter. Graphic language uses minimal topographic lines, layers, geolocation and connected-data motifs.

## Quality

V1 uses Node.js 22, pnpm 9.15.0, committed `pnpm-lock.yaml`, frozen installs, TypeScript builds, Vitest suites, API compile fixtures, HGK dependency-boundary checks, repository validation, CodeQL and automated V1 release workflow.

## Documentation map

- Product: `product/MAPS_PLATFORM_PRD.md`, `product/FUNCTIONAL_REQUIREMENTS.md`, `product/NON_FUNCTIONAL_REQUIREMENTS.md`, `product/RISK_REGISTER.md`, `product/V1_ROADMAP.md`.
- Architecture: `architecture/HGK_*`, `architecture/DATA_ARCHITECTURE.md`, `architecture/INFRASTRUCTURE_DEPLOYMENT_ARCHITECTURE.md`.
- API: `api/HGK_API.md`, `api/API_INTEGRATION_ARCHITECTURE.md`, `api/MAPS_CORE_WAVE4_API_REVIEW.md`.
- Security/privacy: `security/SECURITY_PRIVACY_BOUNDARIES.md`, `security/THREAT_MODEL.md`, `security/PRIVACY_LGPD.md`.
- Provider: `providers/MAPLIBRE_V1_MATRIX.md`, `providers/EXTERNAL_DEPENDENCY_MATRIX.md`.
- UX: `ux/VISUAL_IDENTITY_UX_UI.md`, `ux/ACCESSIBILITY.md`.
- Operations: `operations/OBSERVABILITY_OPERATIONS_RECOVERY.md`.
- Testing: all `testing/HGK_*` specifications.
- Guides: `guides/HGK_MIGRATION_GUIDE.md`, `guides/INSTALLATION_DEVELOPMENT.md`.
- Governance/release: `DOCUMENTATION_INDEX.md`, `PROJECT_STATUS.md`, `adr/ADR_INDEX.md`, `release/V1_RELEASE_CHECKLIST.md`, `release/V1_DEVELOPMENT_READINESS.md`, `release/V1_0_0_RELEASE_NOTES.md`.

## Release interpretation

V1.0 is a stable source/engineering release of the HMP SDK and reference Playground. It can be published without purchasing a commercial map-data provider or deploying a public HYBRID-hosted service. Consumer rollout and production infrastructure remain subsequent operational steps.

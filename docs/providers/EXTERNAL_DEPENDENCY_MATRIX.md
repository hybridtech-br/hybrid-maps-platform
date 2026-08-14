# HYBRID Maps Platform — External Dependency & Provider Matrix

Document ID: DEP-01
Status: V1.0 approved baseline
Date: 2026-08-14

| Dependency | Role | V1 requirement | Credential | Production decision |
|---|---|---|---|---|
| MapLibre GL JS | Rendering provider library | Required | None by library itself | Approved |
| Style/tile service | Map imagery/vector/style data | Deployment-specific | Provider-dependent | Must be selected per deployment |
| `demotiles.maplibre.org` | Playground demonstration style | Development/reference only | None | Not production policy |
| npm registry/pnpm ecosystem | Build dependencies | Required for install/build | CI/network policy | Lockfile/frozen install mitigates drift |
| GitHub Actions | CI/release automation | Required for repository release process | GitHub token managed by platform | Approved |

## Provider onboarding requirements

Any future provider must document capabilities, SDK/license, attribution, credential model, quotas/rate limits, caching restrictions, privacy/data transfer, fallback behavior and supported versions.

## V1 policy

No paid provider activation is required to publish the V1.0 source release. Google Maps, HERE, routing, geocoding and offline-service dependencies remain post-V1 unless separately approved.

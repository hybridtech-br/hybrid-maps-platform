# HYBRID Maps Platform — Security Architecture & Threat Model

Document ID: SEC-01
Status: V1.0 approved baseline
Date: 2026-08-14

## Assets

Provider credentials, precise coordinates supplied by consumers, provider configuration, source code, package integrity, public API contracts and map/data licensing metadata.

## Trust boundaries

1. Consumer application ↔ Maps Core/Runtime.
2. Maps Platform ↔ concrete provider adapter.
3. Provider adapter ↔ third-party style/tile/network services.
4. Spatial Engine ↔ HGK, which is pure computation and cannot receive credentials/network clients.
5. Repository/CI ↔ package registries and GitHub Actions dependencies.

## Primary threats and mitigations

- Credential leakage: secrets prohibited from source/domain contracts; deployment credentials use environment/provider configuration.
- Malformed/untrusted geometry: structural and numeric validation; non-finite values rejected at defined boundaries.
- Silent coordinate/altitude loss: 2D adapter rejects altitude-bearing data unless an explicit flattening policy is chosen.
- Provider object leakage: concrete provider types stay behind Provider SDK boundaries.
- Precise-location overcollection: HMP V1 has no location-history datastore; telemetry minimizes coordinates.
- Supply-chain drift: committed lockfile, frozen CI install, CodeQL and build/test gates.
- Provider outage: failure contained to provider/rendering path; domain geometry state remains independent.
- License/attribution violation: production tile/style source requires explicit deployment review.
- XSS/unsafe provider content: consumer/deployment must apply CSP and sanitize application-generated HTML; neutral contracts should prefer DOM elements/text controlled by first-party code.

## Residual V1 risks

Third-party tile availability, deployment-specific CSP, consumer-specific authorization and consumer data retention are outside the source SDK and must be addressed by each production deployment.

# HYBRID Maps Platform — Infrastructure & Deployment Architecture

Document ID: INF-01
Status: V1.0 source-release baseline
Date: 2026-08-14

## Source architecture

HMP V1 is a TypeScript/pnpm monorepo. The stable deliverable is source/packages plus the reference Playground; it does not require an HMP-owned backend service.

## Toolchain

- Node.js 22
- pnpm 9.15.0
- TypeScript
- Vitest
- Vite for Playground
- GitHub Actions for repository gates

## Build

Install with `pnpm install --frozen-lockfile`, then `pnpm build` and `pnpm test`. Release workflows must operate from the committed lockfile.

## Deployment model

SDK packages are integrated into first-party applications. The Playground can be deployed as static web assets. A production consumer chooses its own hosting, CDN, CSP, secrets/origin restrictions, tile/style source and observability destination.

## Environments

Recommended: development → CI → staging/consumer homologation → production. Source release is independent of consumer deployment.

## Availability

HGK/Spatial Engine are local computation. Rendering availability depends on the consumer browser/runtime plus provider/tile services. Provider outages must degrade map rendering without corrupting consumer domain state.

## Rollback

Consumers pin HMP/package versions and retain the previous known-good build. Rollback is package/deployment-specific and must not require database migration in V1 because HMP owns no persistent datastore.

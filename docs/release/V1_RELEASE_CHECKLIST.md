# HYBRID Maps Platform — V1.0 Release Checklist

Date: 2026-08-12
Status: **SOURCE RELEASE READY — CI GREEN**

## Release definition

V1.0.0 is the first stable **source/engineering release** of the HYBRID Maps Platform SDK and reference Playground. It does not imply deployment of a HYBRID-hosted public Maps service, purchase of a commercial tile provider, or completion of rollout into every external first-party repository.

## Engineering gates

- [x] Wave 0 characterization and API fixtures green.
- [x] HGK Wave 1 foundation green.
- [x] HGK Wave 2 geometry/planar algorithms green.
- [x] Spatial Engine Wave 3 bridge green.
- [x] Maps Core Wave 4 compatibility migration green.
- [x] Wave 5 in-repository consumer verification green.
- [x] Provider SDK and MapLibre build green.
- [x] Playground production build green.
- [x] Full repository build/test gate green.
- [x] Migration guide published.
- [x] Security/privacy boundaries documented.
- [x] MapLibre V1 provider matrix documented.
- [x] Dependency lockfile committed.
- [x] Primary CI gates switched to frozen lockfile installation.
- [x] Playground MapLibre provider changed to lazy dynamic loading to split provider JavaScript from the initial application module.
- [x] Package/workspace versions promoted to `1.0.0`.
- [x] Changelog prepared for `1.0.0`.
- [x] Final release-candidate checks green on head `b6261be9112d51dc0aa93f19ec22c6d7dc44ab1c`.
- [ ] PR #4 merged to `main`.
- [ ] `v1.0.0` tag/GitHub Release verified.

## Product/reference validation

- [x] Rio de Janeiro reference scenario encoded in Playground.
- [x] Playground has keyboard-addressable native controls and explicit map/marker ARIA labels in the reference implementation.
- [x] Official HYBRID Maps Platform visual identity applied to the reference Playground.
- [x] Starlink Tracker is documented as the first intended first-party integration consumer.

The following are **rollout validation**, not source-release blockers:

- manual browser smoke tests in each eventual deployment environment;
- integration commit in the separate HYBRID Starlink Tracker repository;
- product-specific privacy/accessibility acceptance in each consuming application.

## Provider/data boundary

The V1 source release requires MapLibre adapter compatibility but does not select or purchase a production tile service.

- [x] MapLibre is the V1 rendering provider.
- [x] Development/reference style source is explicitly documented as non-production policy.
- [x] Licensing, attribution, quotas, caching, credentials and fallback are mandatory deployment-time provider checks.
- [x] Paid/commercial provider activation is kept outside autonomous source-release scope.

## Governance

- [x] No legacy Maps Core public API removed during migration.
- [x] Gate C assessment recorded.
- [x] Incompatible cleanup deferred until external-consumer inventory and a future explicit major-version decision.
- [x] Source release and production deployment are treated as separate gates.

## Security/reproducibility

- [x] `pnpm-lock.yaml` committed.
- [x] Node.js 22 / pnpm 9.15.0 toolchain documented.
- [x] Frozen-lockfile CI enabled in principal quality workflows.
- [x] HGK forbidden-dependency check remains active.
- [x] Precise location history is not persisted by HMP V1.
- [x] Provider credentials remain outside HGK/provider-neutral contracts.

## Deployment gate — separate from V1 source release

Not executed as part of V1.0.0 source release:

- production hosting target;
- commercial tile/style contract;
- deployment CSP/security headers;
- production observability destination;
- consumer-specific rollback exercise.

These require a concrete deployment/consumer context and may create external cost. They are intentionally not represented as incomplete source-code work.

## Release decision

The V1.0.0 codebase passed the final exact-head CI gate and is approved for merge of PR #4. After merge, the repository release workflow must create and verify `v1.0.0`. Production rollout remains a subsequent, independent operational gate.

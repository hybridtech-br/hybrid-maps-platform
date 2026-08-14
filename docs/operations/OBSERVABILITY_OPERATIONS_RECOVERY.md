# HYBRID Maps Platform — Observability, Operations & Recovery

Document ID: OPS-01
Status: V1.0 source-release baseline
Date: 2026-08-14

## Operating model

HMP V1 is an SDK/runtime, not a centrally hosted service. Operational telemetry and alerting are therefore split between repository CI and each consuming deployment.

## Repository observability

GitHub Actions is the authoritative source for build, test, API compatibility, HGK dependency-boundary, validation and release workflow status. Failed gates block release.

## Runtime observability

Consumers should capture provider initialization failure, map creation failure, provider/network error, capability mismatch and unexpected runtime exceptions. Precise coordinates must not be logged by default.

## Suggested signals

- provider startup success/failure;
- map creation latency and failure count;
- provider request/network errors where exposed;
- capability fallback events;
- application error rate;
- release/version identifier.

## Recovery

1. Contain provider failure without mutating domain geometry state.
2. Show a recoverable textual map/provider error in the consumer UI.
3. Retry only idempotent provider initialization/network operations with bounded policy defined by the consumer.
4. Roll back the consuming deployment/package version to the last known-good HMP version when a release regression is suspected.

## Disaster recovery

HMP V1 owns no database; there is no HMP data restore procedure. Consumer applications remain responsible for their own persistent data backups and recovery.

## Release rollback

Git tags and lockfile provide reproducible source points. A bad consumer rollout should revert/pin to the previous stable package/source tag and rerun build/test gates before redeployment.

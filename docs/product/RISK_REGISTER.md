# HYBRID Maps Platform — Product Risk Register

Document ID: RISK-01
Status: V1.0 approved baseline
Date: 2026-08-14

| Risk | Probability | Impact | Mitigation / status |
|---|---|---|---|
| Provider/tile outage | Medium | High for rendered maps | Provider isolation, recoverable errors, deployment fallback policy |
| Provider lock-in | Low/Medium | High | Provider-neutral Maps Core/SDK and capability discovery |
| Public API regression | Low | High | Characterization tests, API compile fixtures, semantic versioning |
| HGK semantic contamination | Low | High | CI forbidden-dependency gate and package boundaries |
| Floating-point edge cases | Medium | Medium/High | Central Precision policy and numerical tests |
| Silent altitude loss | Low | High | Adapters fail closed for altitude-bearing data |
| Precise location leakage | Low/Medium | High | No HMP history datastore, telemetry minimization, consumer privacy controls |
| Supply-chain drift | Low | High | `pnpm-lock.yaml`, frozen installs, CodeQL/build/test gates |
| Antimeridian bounds limitation | Medium for global use | Medium | Explicit V1 limitation; future dedicated representation |
| Legacy centroid semantics | Medium | Medium | Characterized behavior preserved and ADR-003 documented |
| Production tile licensing/attribution error | Medium | High | Deployment-time provider matrix and explicit approval |
| External consumer breakage during future deprecation | Medium | High | Inventory consumers before removal; major-version gate |

## V1 release assessment

No open risk blocks the V1.0 source release. Production deployment risks involving provider contracts, CSP, observability and consumer-specific location persistence remain deployment gates rather than source-release defects.

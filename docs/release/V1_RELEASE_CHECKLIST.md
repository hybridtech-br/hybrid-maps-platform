# HYBRID Maps Platform — V1 Release Checklist

Date: 2026-08-11
Status: In progress

## Engineering gates

- [x] Wave 0 characterization and API fixtures green.
- [x] HGK Wave 1 foundation green.
- [x] HGK Wave 2 geometry/planar algorithms green.
- [x] Spatial Engine Wave 3 bridge green.
- [x] Maps Core Wave 4 compatibility migration green.
- [x] Provider SDK and MapLibre build green.
- [x] Playground production build green.
- [x] Full repository build/test gate green.
- [x] Migration guide published.
- [x] Security/privacy boundaries documented.
- [x] MapLibre V1 provider matrix documented.
- [ ] Dependency lockfile committed and CI switched to frozen install.
- [ ] Bundle-size hardening/decision recorded for >500 kB Playground chunk.

## Product/reference validation

- [x] Rio de Janeiro reference scenario encoded in Playground.
- [ ] Manual browser smoke test on supported desktop browser matrix.
- [ ] HYBRID Starlink Tracker integration verified in its own repository/environment.
- [ ] Accessibility review of first-party Playground/reference UI.

## Provider/data release gate

- [ ] Production style/tile source selected.
- [ ] License and attribution approved/documented.
- [ ] Quota/rate-limit/caching policy documented.
- [ ] Credential/origin policy documented if required.
- [ ] Provider outage/fallback UX validated.

## Governance

- [x] No legacy public API removed during migration.
- [x] Gate C assessment recorded.
- [ ] Major-version/removal decision made before any future incompatible cleanup.
- [ ] External first-party consumer inventory confirmed before deprecation/removal.

## Deployment

- [ ] Production target/environment explicitly authorized.
- [ ] CSP/security headers defined for deployed web consumer/reference app.
- [ ] Observability/error reporting defined for production consumer.
- [ ] Rollback procedure tested for the selected deployment target.

## Release decision

Engineering migration is complete, but V1 production release is **not yet authorized**. Remaining items include external consumer verification and production provider/deployment choices, some of which can incur external cost or affect production and therefore require owner authorization at the appropriate gate.

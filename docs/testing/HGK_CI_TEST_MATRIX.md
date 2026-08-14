# HGK CI Test Matrix

Status: Wave 0.5 baseline

## Objective

Define the mandatory automated validation policy for HGK and related migration layers. No change may be merged into the protected branch unless all required checks pass or an explicit, documented exception is approved.

## Principles

The CI pipeline must be:

- deterministic;
- reproducible;
- platform aware;
- parallelizable where safe;
- auditable;
- fast on pull requests;
- complete on releases and scheduled runs.

## Trigger matrix

### Pull request

Required:

- lint;
- TypeScript typecheck;
- build;
- unit tests;
- characterization tests;
- API compatibility checks;
- dataset validation;
- numerical validation;
- forbidden-import checks;
- dependency-cycle checks;
- coverage validation.

### Push to feature branches

Required fast path:

- lint;
- typecheck;
- impacted-package build;
- impacted unit tests.

### Push to protected branches

Required full path:

- all pull-request checks;
- package integration tests;
- artifact generation;
- audit report publication.

### Release

Required:

- full test suite;
- public API report;
- package integrity validation;
- cross-platform matrix;
- benchmark comparison;
- release artifact verification.

### Scheduled nightly run

Required:

- full regression suite;
- large official datasets;
- benchmark history;
- dependency audit;
- flaky-test detection;
- compatibility comparison against the latest accepted release.

## Validation stages

### 1. Repository integrity

Validate:

- expected workspace files;
- lockfile consistency;
- package manifests;
- no uncommitted generated artifacts in CI.

Blocking: yes.

### 2. Lint

Criterion:

- zero lint errors.

Warnings may be tolerated only when the repository policy explicitly allows them.

Blocking: yes.

### 3. TypeScript typecheck

Criterion:

- zero TypeScript errors in all affected packages and consumer fixtures.

Blocking: yes.

### 4. Build

Validate:

- package compilation;
- declaration generation;
- package export resolution;
- ESM/CJS targets when both are supported.

Blocking: yes.

### 5. Unit tests

Initial HGK targets:

- Precision;
- Vector2;
- Point2;
- Envelope2;
- geometry primitives;
- algorithms.

Blocking: yes.

### 6. Characterization tests

Purpose:

Protect the current observable behavior of Maps Core and Spatial Engine during migration.

Any intentional behavior change must include:

- an approved decision record;
- updated expectation;
- migration note;
- regression coverage.

Blocking: yes.

### 7. API compatibility

Validate:

- public exports;
- TypeScript declaration surface;
- consumer compilation fixtures;
- removed, renamed or narrowed types;
- deprecation metadata.

Blocking: yes, except for explicitly approved major-version changes.

### 8. Official dataset validation

Validate:

- fixture schema;
- unique stable identifiers;
- deterministic generation;
- expected valid and invalid classifications;
- dataset version metadata.

Blocking: yes.

### 9. Numerical validation

Validate:

- official epsilon behavior;
- finite-value rejection;
- signed-zero equivalence;
- overflow and underflow cases;
- accumulated numerical drift;
- angle normalization;
- degenerate geometry behavior.

Blocking: yes.

### 10. Forbidden imports

HGK must not import:

- Maps Core;
- Spatial Engine;
- provider SDKs;
- GeoJSON adapters;
- MapLibre;
- React;
- DOM APIs;
- browser-only APIs;
- rendering modules.

Blocking: yes.

### 11. Dependency graph

Validate:

- no dependency cycles;
- layer direction follows the approved architecture;
- no reverse dependency from HGK to upper layers.

Blocking: yes.

### 12. Coverage

Initial minimum target:

```text
95% statements
95% branches
95% functions
95% lines
```

A temporary lower threshold requires a documented exception with expiration criteria.

Blocking: yes.

### 13. Performance benchmarks

Benchmark at minimum:

- vector operations;
- point distance;
- segment intersection;
- envelope containment and intersection;
- polygon predicates;
- aggregation over official performance datasets.

Pull requests may run a reduced sample. Nightly and release runs use the complete benchmark set.

Blocking policy:

- pull request: advisory unless a severe regression threshold is exceeded;
- release: blocking when regression exceeds the accepted threshold without approval.

### 14. Cross-platform matrix

Supported validation environments:

- Linux;
- Windows;
- macOS.

The primary pull-request job may run on Linux, but protected-branch, release or scheduled workflows must validate all supported platforms according to repository policy.

### 15. Mutation testing

Planned for a later phase.

Purpose:

Measure test-suite effectiveness beyond line coverage.

Blocking: no, until formally activated.

## Merge blocking conditions

Merge must be blocked when any of the following occurs:

- mandatory stage failure;
- unapproved API incompatibility;
- characterization regression;
- coverage below threshold;
- forbidden import;
- dependency cycle;
- non-deterministic official fixture;
- package build failure;
- unresolved severe performance regression.

## Required artifacts

Each full CI run should publish, when applicable:

- test report;
- coverage report;
- API compatibility report;
- public declaration report;
- benchmark report;
- dependency graph report;
- official dataset validation report;
- build artifacts for audit.

## Flaky test policy

A flaky test must not be silently retried until green.

Required action:

- record the first failure;
- identify the test as unstable;
- open a corrective task;
- quarantine only with explicit approval and expiration criteria.

## Acceptance criteria

Wave 0.5 is complete when:

- triggers and required checks are defined;
- blocking criteria are explicit;
- API, numerical, dataset and architecture checks are represented;
- coverage and performance policies are documented;
- cross-platform expectations are defined;
- required CI artifacts are listed.

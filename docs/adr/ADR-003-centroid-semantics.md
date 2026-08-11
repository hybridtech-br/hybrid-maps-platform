# ADR-003 — Separate planar and geographic centroid semantics

Status: Accepted
Date: 2026-08-11

## Context

HGK now owns explicit planar centroid algorithms. Spatial Engine already exposes centroid functions over longitude/latitude geometries. The legacy Spatial Engine implementation mixes geodesic segment weighting (via haversine distance) with planar longitude/latitude polygon formulas.

## Decision

1. HGK centroid APIs remain explicitly planar and Earth-agnostic.
2. Spatial Engine centroid APIs remain geographic-domain APIs and are not re-exported from HGK.
3. Existing Spatial Engine centroid function names and behavior remain unchanged during Wave 3 to preserve characterized compatibility.
4. Spatial Engine must not silently replace the legacy centroid implementation with HGK planar centroid algorithms.
5. A future geodesic-centroid redesign, if required, must be introduced as an explicitly named API and evaluated separately; it is not part of the HGK migration.

## Consequences

- No semantic regression is introduced during the bridge wave.
- Callers can distinguish planar HGK calculations from geographic-domain calculations by package/API boundary.
- The known mixed legacy centroid model is documented technical debt rather than hidden behavior.

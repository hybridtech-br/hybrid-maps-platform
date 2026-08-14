# HYBRID Maps Platform — Functional Requirements

Document ID: REQ-01
Status: V1.0 approved baseline
Date: 2026-08-14

## Purpose

Define the functional requirements of the HYBRID Maps Platform V1.0 source/engineering release.

## Core requirements

- FR-001: expose provider-neutral map lifecycle contracts.
- FR-002: create maps through the Provider SDK without exposing concrete provider objects in neutral APIs.
- FR-003: support MapLibre as the required V1 rendering provider.
- FR-004: support viewport center, zoom, bearing, pitch and bounds through Maps Core.
- FR-005: support camera movement operations provided by the selected provider.
- FR-006: support sources/layers through provider-neutral contracts where implemented by the provider.
- FR-007: support markers, popups and controls.
- FR-008: expose provider metadata and capability discovery.
- FR-009: normalize supported provider events at the SDK boundary.
- FR-010: provide stable `Coordinate`, `BoundingBox`, `Viewport`, projection and geometry contracts.
- FR-011: provide HGK 2D primitives, structural validation and planar algorithms.
- FR-012: provide Spatial Engine geographic coordinate/bounds validation and HGK adapters.
- FR-013: reject silent altitude loss when adapting geographic data to 2D HGK.
- FR-014: preserve the characterized Maps Core public compatibility contract in V1.0.
- FR-015: provide a reference Playground using Rio de Janeiro and official HYBRID Maps Platform visual identity.
- FR-016: allow first-party HYBRID consumers to integrate without sharing authentication, databases or domain infrastructure.

## V1 exclusions

Not required for V1.0: routing/navigation, geocoding, reverse geocoding, offline map packs, production Google/HERE adapters, HMP-hosted geospatial backend, HMP-owned location-history persistence, public third-party SaaS API and a standalone end-user Maps application.

## Acceptance

Requirements are satisfied when repository build/tests/API fixtures are green, MapLibre and Playground build successfully, migration documentation is published and no V1 public compatibility regression is introduced.

# HYBRID Maps Platform — Privacy & LGPD Specification

Document ID: PRIV-01
Status: V1.0 approved baseline
Date: 2026-08-14

## Principle

HMP follows privacy by minimization. V1 processes location values when required for map/geospatial functions but does not create or own a persistent history of user location.

## Personal data boundary

Coordinates can constitute personal data when linked or linkable to an individual/device. HMP itself does not determine the lawful basis or purpose of a consuming product; the consumer/controller must document purpose, lawful basis, retention and data-subject handling.

## V1 requirements

- do not persist user/location history inside HMP;
- do not log precise coordinates by default;
- keep provider credentials and consumer identity outside HGK and neutral geometry contracts;
- document third-party provider data transfers before production use;
- minimize telemetry to technical metadata necessary for operation;
- consumers must implement access, correction, deletion and retention controls for any domain persistence they add;
- location permissions/consent UX belongs to the consuming application/platform where applicable.

## Third parties

MapLibre is a client library; the selected tile/style/geocoding provider may independently process network metadata or requests. Production deployments must evaluate provider privacy terms, hosting jurisdiction and data-transfer implications.

## Data retention

HMP V1 retention for user location: none. CI logs must not intentionally contain precise location data or secrets.

## Incident handling

Suspected leakage of credentials or sensitive coordinates must trigger credential revocation where applicable, log/artefact containment and the incident process of the consuming HYBRID product/company.

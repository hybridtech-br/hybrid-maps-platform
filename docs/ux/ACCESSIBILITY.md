# HYBRID Maps Platform — Accessibility Specification

Document ID: A11Y-01
Status: V1.0 approved baseline
Date: 2026-08-14

## Scope

Applies to first-party HMP reference UI and guidance supplied to consuming HYBRID applications.

## Requirements

- All actionable controls are keyboard operable.
- Native semantic elements are preferred over custom interactive divs.
- Map container, markers and meaningful controls receive accessible names.
- Focus state remains visible against the dark HYBRID interface.
- Critical meaning is not conveyed by color alone.
- Text and controls maintain readable contrast against `#0D1117`, `#1B2128`, map imagery and overlays.
- Motion-heavy camera actions should not be required to understand application state; consuming apps should respect reduced-motion preferences when adding animation-heavy UX.
- Popup content is concise, readable and dismissible.
- Error/status communication must be exposed in text, not solely through map changes.
- Responsive layouts preserve reachable controls at narrow widths.

## Map-specific guidance

Interactive maps are inherently visual. Consumers must offer equivalent textual status/information for business-critical location data where map-only presentation would exclude users.

## V1 acceptance

The Playground uses keyboard-addressable controls and explicit map/marker ARIA labeling. Full WCAG certification belongs to each deployed consuming product because content, hosting and workflows vary by consumer.

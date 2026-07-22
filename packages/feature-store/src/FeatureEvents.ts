import type { FeatureId } from "./GeoJSON.js";

export interface FeatureCreatedEvent {
  readonly featureId: FeatureId;
}

export interface FeatureUpdatedEvent {
  readonly featureId: FeatureId;
}

export interface FeatureRemovedEvent {
  readonly featureId: FeatureId;
}

export interface FeatureIndexedEvent {
  readonly featureId: FeatureId;
}

export interface SelectionChangedEvent
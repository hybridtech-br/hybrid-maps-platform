import type { EventMap } from "./EventBus.js";

export interface Coordinate {
  readonly longitude: number;
  readonly latitude: number;
}

export interface CameraState extends Coordinate {
  readonly zoom: number;
  readonly bearing: number;
  readonly pitch: number;
}

export interface HmpEventMap extends EventMap {
  "provider.initializing": { readonly providerId: string };
  "provider.ready": { readonly providerId: string };
  "provider.disposed": { readonly providerId: string };
  "provider.changed": {
    readonly previousProviderId?: string;
    readonly providerId: string;
  };
  "provider.error": { readonly providerId: string; readonly error: unknown };
  "map.created": { readonly mapId: string };
  "map.loaded": { readonly mapId: string };
  "map.rendered": { readonly mapId: string };
  "map.idle": { readonly mapId: string };
  "map.destroyed": { readonly mapId: string };
  "map.clicked": { readonly mapId: string; readonly coordinate: Coordinate };
  "camera.changed": { readonly mapId: string; readonly camera: CameraState };
  "camera.zoom": { readonly mapId: string; readonly zoom: number };
  "camera.idle": { readonly mapId: string; readonly camera: CameraState };
  "theme.loading": { readonly themeId: string };
  "theme.loaded": { readonly themeId: string };
  "theme.changed": {
    readonly previousThemeId?: string;
    readonly themeId: string;
  };
  "theme.error": { readonly themeId: string; readonly error: unknown };
}

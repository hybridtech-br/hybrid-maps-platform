import {
  createLineString,
  createPoint,
  createPolygon,
  type LineString as SpatialLineString,
  type Point as SpatialPoint,
  type Polygon as SpatialPolygon,
} from '@hybrid/maps-spatial-engine';

import type { Geometry } from '../index.js';

export type SpatialGeometry = SpatialPoint | SpatialLineString | SpatialPolygon;

export function toSpatialGeometry(geometry: Geometry): SpatialGeometry {
  switch (geometry.type) {
    case 'Point':
      return createPoint(
        geometry.coordinates.longitude,
        geometry.coordinates.latitude,
        geometry.coordinates.altitude,
      );
    case 'LineString':
      return createLineString(geometry.coordinates);
    case 'Polygon':
      return createPolygon(geometry.coordinates);
  }
}

import { createCoordinate } from '../geometry/Coordinate.js';
import type { Coordinate } from '../geometry/Coordinate.js';
import type { Geometry, GeometryCollection } from '../geometry/GeometryCollection.js';
import type { LineString } from '../geometry/LineString.js';
import type { MultiLineString } from '../geometry/MultiLineString.js';
import type { MultiPoint } from '../geometry/MultiPoint.js';
import type { MultiPolygon } from '../geometry/MultiPolygon.js';
import type { Point } from '../geometry/Point.js';
import type { Polygon } from '../geometry/Polygon.js';

function averageCoordinates(coordinates: readonly Coordinate[]): Coordinate {
  if (coordinates.length === 0) {
    throw new Error('Centroid requires at least one coordinate.');
  }

  const totals = coordinates.reduce(
    (result, coordinate) => ({
      longitude: result.longitude + coordinate.longitude,
      latitude: result.latitude + coordinate.latitude,
      altitude:
        result.altitude +
        (coordinate.altitude === undefined ? 0 : coordinate.altitude),
      altitudeCount:
        result.altitudeCount + (coordinate.altitude === undefined ? 0 : 1),
    }),
    { longitude: 0, latitude: 0, altitude: 0, altitudeCount: 0 },
  );

  const altitude =
    totals.altitudeCount === 0
      ? undefined
      : totals.altitude / totals.altitudeCount;

  return createCoordinate(
    totals.longitude / coordinates.length,
    totals.latitude / coordinates.length,
    altitude,
  );
}

function geometryCoordinates(geometry: Geometry): readonly Coordinate[] {
  switch (geometry.type) {
    case 'Point':
      return [geometry.coordinate];
    case 'LineString':
      return geometry.coordinates;
    case 'Polygon':
      return geometry.rings.flat();
    case 'MultiPoint':
      return geometry.coordinates;
    case 'MultiLineString':
      return geometry.coordinates.flat();
    case 'MultiPolygon':
      return geometry.coordinates.flat(2);
  }
}

export function pointCentroid(point: Point): Coordinate {
  return createCoordinate(
    point.coordinate.longitude,
    point.coordinate.latitude,
    point.coordinate.altitude,
  );
}

export function lineStringCentroid(lineString: LineString): Coordinate {
  return averageCoordinates(lineString.coordinates);
}

export function polygonCentroid(polygon: Polygon): Coordinate {
  return averageCoordinates(polygon.rings.flat());
}

export function multiPointCentroid(multiPoint: MultiPoint): Coordinate {
  return averageCoordinates(multiPoint.coordinates);
}

export function multiLineStringCentroid(
  multiLineString: MultiLineString,
): Coordinate {
  return averageCoordinates(multiLineString.coordinates.flat());
}

export function multiPolygonCentroid(
  multiPolygon: MultiPolygon,
): Coordinate {
  return averageCoordinates(multiPolygon.coordinates.flat(2));
}

export function geometryCollectionCentroid(
  collection: GeometryCollection,
): Coordinate {
  return averageCoordinates(collection.geometries.flatMap(geometryCoordinates));
}

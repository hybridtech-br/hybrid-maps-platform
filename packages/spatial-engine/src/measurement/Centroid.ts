import { createCoordinate } from '../geometry/Coordinate.js';
import type { Coordinate } from '../geometry/Coordinate.js';
import type { Geometry, GeometryCollection } from '../geometry/GeometryCollection.js';
import type { LineString } from '../geometry/LineString.js';
import type { MultiLineString } from '../geometry/MultiLineString.js';
import type { MultiPoint } from '../geometry/MultiPoint.js';
import type { MultiPolygon } from '../geometry/MultiPolygon.js';
import type { Point } from '../geometry/Point.js';
import type { Polygon } from '../geometry/Polygon.js';
import { distanceMeters } from './Distance.js';

interface WeightedCentroid {
  readonly longitude: number;
  readonly latitude: number;
  readonly weight: number;
}

interface CoordinateTotals {
  readonly longitude: number;
  readonly latitude: number;
  readonly altitude: number;
  readonly altitudeCount: number;
}

function averageCoordinates(coordinates: readonly Coordinate[]): Coordinate {
  if (coordinates.length === 0) {
    throw new Error('Centroid requires at least one coordinate.');
  }

  const totals = coordinates.reduce<CoordinateTotals>(
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

function lineWeightedCentroid(
  coordinates: readonly Coordinate[],
): WeightedCentroid {
  if (coordinates.length === 0) {
    throw new Error('Centroid requires at least one coordinate.');
  }

  if (coordinates.length === 1) {
    return {
      longitude: coordinates[0].longitude,
      latitude: coordinates[0].latitude,
      weight: 1,
    };
  }

  let longitude = 0;
  let latitude = 0;
  let weight = 0;

  for (let index = 1; index < coordinates.length; index += 1) {
    const start = coordinates[index - 1];
    const end = coordinates[index];
    const segmentLength = distanceMeters(start, end);

    if (segmentLength === 0) continue;

    longitude += ((start.longitude + end.longitude) / 2) * segmentLength;
    latitude += ((start.latitude + end.latitude) / 2) * segmentLength;
    weight += segmentLength;
  }

  if (weight === 0) {
    const fallback = averageCoordinates(coordinates);
    return {
      longitude: fallback.longitude,
      latitude: fallback.latitude,
      weight: 1,
    };
  }

  return {
    longitude: longitude / weight,
    latitude: latitude / weight,
    weight,
  };
}

function ringWeightedCentroid(
  ring: readonly Coordinate[],
): WeightedCentroid {
  if (ring.length < 3) {
    const fallback = averageCoordinates(ring);
    return {
      longitude: fallback.longitude,
      latitude: fallback.latitude,
      weight: 0,
    };
  }

  let crossSum = 0;
  let longitudeSum = 0;
  let latitudeSum = 0;

  for (let index = 0; index < ring.length; index += 1) {
    const current = ring[index];
    const next = ring[(index + 1) % ring.length];
    const cross =
      current.longitude * next.latitude -
      next.longitude * current.latitude;

    crossSum += cross;
    longitudeSum += (current.longitude + next.longitude) * cross;
    latitudeSum += (current.latitude + next.latitude) * cross;
  }

  const signedArea = crossSum / 2;

  if (signedArea === 0) {
    const fallback = averageCoordinates(ring);
    return {
      longitude: fallback.longitude,
      latitude: fallback.latitude,
      weight: 0,
    };
  }

  return {
    longitude: longitudeSum / (6 * signedArea),
    latitude: latitudeSum / (6 * signedArea),
    weight: Math.abs(signedArea),
  };
}

function polygonWeightedCentroid(
  rings: readonly (readonly Coordinate[])[],
): WeightedCentroid {
  if (rings.length === 0) {
    throw new Error('Polygon centroid requires at least one ring.');
  }

  const outer = ringWeightedCentroid(rings[0]);
  let longitude = outer.longitude * outer.weight;
  let latitude = outer.latitude * outer.weight;
  let weight = outer.weight;

  for (const hole of rings.slice(1)) {
    const centroid = ringWeightedCentroid(hole);
    longitude -= centroid.longitude * centroid.weight;
    latitude -= centroid.latitude * centroid.weight;
    weight -= centroid.weight;
  }

  if (weight <= 0) {
    const fallback = averageCoordinates(rings.flat());
    return {
      longitude: fallback.longitude,
      latitude: fallback.latitude,
      weight: 1,
    };
  }

  return {
    longitude: longitude / weight,
    latitude: latitude / weight,
    weight,
  };
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
  const centroid = lineWeightedCentroid(lineString.coordinates);
  return createCoordinate(centroid.longitude, centroid.latitude);
}

export function polygonCentroid(polygon: Polygon): Coordinate {
  const centroid = polygonWeightedCentroid(polygon.rings);
  return createCoordinate(centroid.longitude, centroid.latitude);
}

export function multiPointCentroid(multiPoint: MultiPoint): Coordinate {
  return averageCoordinates(multiPoint.coordinates);
}

export function multiLineStringCentroid(
  multiLineString: MultiLineString,
): Coordinate {
  const centroids = multiLineString.coordinates.map(lineWeightedCentroid);
  const totalWeight = centroids.reduce(
    (total, centroid) => total + centroid.weight,
    0,
  );

  if (totalWeight === 0) {
    return averageCoordinates(multiLineString.coordinates.flat());
  }

  return createCoordinate(
    centroids.reduce(
      (total, centroid) => total + centroid.longitude * centroid.weight,
      0,
    ) / totalWeight,
    centroids.reduce(
      (total, centroid) => total + centroid.latitude * centroid.weight,
      0,
    ) / totalWeight,
  );
}

export function multiPolygonCentroid(
  multiPolygon: MultiPolygon,
): Coordinate {
  const centroids = multiPolygon.coordinates.map(polygonWeightedCentroid);
  const totalWeight = centroids.reduce(
    (total, centroid) => total + centroid.weight,
    0,
  );

  if (totalWeight === 0) {
    return averageCoordinates(multiPolygon.coordinates.flat(2));
  }

  return createCoordinate(
    centroids.reduce(
      (total, centroid) => total + centroid.longitude * centroid.weight,
      0,
    ) / totalWeight,
    centroids.reduce(
      (total, centroid) => total + centroid.latitude * centroid.weight,
      0,
    ) / totalWeight,
  );
}

export function geometryCollectionCentroid(
  collection: GeometryCollection,
): Coordinate {
  return averageCoordinates(collection.geometries.flatMap(geometryCoordinates));
}

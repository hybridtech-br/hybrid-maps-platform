import type { Geometry, GeometryCollection } from '../geometry/GeometryCollection.js';
import type { Coordinate } from '../geometry/Coordinate.js';

export interface GeographicValidationIssue {
  readonly code: 'NON_FINITE_COORDINATE' | 'LONGITUDE_OUT_OF_RANGE' | 'LATITUDE_OUT_OF_RANGE';
  readonly path: string;
}

function validateCoordinate(coordinate: Coordinate, path: string): GeographicValidationIssue[] {
  const issues: GeographicValidationIssue[] = [];
  if (!Number.isFinite(coordinate.longitude) || !Number.isFinite(coordinate.latitude)) {
    issues.push({ code: 'NON_FINITE_COORDINATE', path });
    return issues;
  }
  if (coordinate.longitude < -180 || coordinate.longitude > 180) {
    issues.push({ code: 'LONGITUDE_OUT_OF_RANGE', path: `${path}.longitude` });
  }
  if (coordinate.latitude < -90 || coordinate.latitude > 90) {
    issues.push({ code: 'LATITUDE_OUT_OF_RANGE', path: `${path}.latitude` });
  }
  return issues;
}

function coordinatesOf(geometry: Geometry): readonly Coordinate[] {
  switch (geometry.type) {
    case 'Point': return [geometry.coordinate];
    case 'LineString': return geometry.coordinates;
    case 'Polygon': return geometry.rings.flat();
    case 'MultiPoint': return geometry.coordinates;
    case 'MultiLineString': return geometry.coordinates.flat();
    case 'MultiPolygon': return geometry.coordinates.flat(2);
  }
}

export function validateGeographicGeometry(geometry: Geometry): readonly GeographicValidationIssue[] {
  return Object.freeze(coordinatesOf(geometry).flatMap((coordinate, index) => validateCoordinate(coordinate, `coordinates[${index}]`)));
}

export function validateGeographicGeometryCollection(collection: GeometryCollection): readonly GeographicValidationIssue[] {
  return Object.freeze(collection.geometries.flatMap((geometry, index) =>
    validateGeographicGeometry(geometry).map((issue) => ({ ...issue, path: `geometries[${index}].${issue.path}` })),
  ));
}

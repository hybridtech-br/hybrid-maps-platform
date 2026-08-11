import { describe, expect, it } from 'vitest';

import { Coordinate, type Geometry } from '../index.js';
import { toSpatialGeometry } from '../internal/SpatialGeometryBridge.js';

describe('SpatialGeometryBridge', () => {
  it('converts Maps Core point shape without changing the public object', () => {
    const geometry: Geometry = { type: 'Point', coordinates: new Coordinate(-43.1729, -22.9068) };
    const spatial = toSpatialGeometry(geometry);
    expect(spatial.type).toBe('Point');
    expect(geometry.coordinates).toBeInstanceOf(Coordinate);
  });

  it('converts valid line and polygon shapes for internal Spatial Engine use', () => {
    const line: Geometry = { type: 'LineString', coordinates: [new Coordinate(0, 0), new Coordinate(1, 1)] };
    const polygon: Geometry = { type: 'Polygon', coordinates: [[new Coordinate(0, 0), new Coordinate(1, 0), new Coordinate(0, 0)]] };
    expect(toSpatialGeometry(line).type).toBe('LineString');
    expect(toSpatialGeometry(polygon).type).toBe('Polygon');
  });
});

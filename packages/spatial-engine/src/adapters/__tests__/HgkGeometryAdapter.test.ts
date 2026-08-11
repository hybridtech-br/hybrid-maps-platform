import { describe, expect, it } from 'vitest';

import { geographicLineStringToHgkLineString2, geographicPointToHgkPoint2, geographicPolygonToHgkPolygon2 } from '../HgkGeometryAdapter.js';
import { createLineString } from '../../geometry/LineString.js';
import { createPoint } from '../../geometry/Point.js';
import { createPolygon } from '../../geometry/Polygon.js';

const c = (longitude: number, latitude: number) => ({ longitude, latitude });

describe('HgkGeometryAdapter', () => {
  it('adapts a geographic point to Point2', () => {
    const point = geographicPointToHgkPoint2(createPoint(-43.1729, -22.9068));
    expect([point.x, point.y]).toEqual([-43.1729, -22.9068]);
  });

  it('adapts a line string preserving vertex order', () => {
    const line = geographicLineStringToHgkLineString2(createLineString([c(0, 0), c(1, 1), c(2, 1)]));
    expect(line.points.map((point) => [point.x, point.y])).toEqual([[0, 0], [1, 1], [2, 1]]);
  });

  it('adapts polygon shell and holes', () => {
    const polygon = geographicPolygonToHgkPolygon2(createPolygon([
      [c(0, 0), c(4, 0), c(4, 4), c(0, 4), c(0, 0)],
      [c(1, 1), c(2, 1), c(2, 2), c(1, 2), c(1, 1)],
    ]));
    expect(polygon.shell.points).toHaveLength(5);
    expect(polygon.holes).toHaveLength(1);
  });

  it('rejects altitude-bearing geometry instead of silently losing altitude', () => {
    expect(() => geographicPointToHgkPoint2(createPoint(1, 2, 3))).toThrow(RangeError);
  });
});

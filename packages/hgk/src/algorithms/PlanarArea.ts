import { LinearRing2 } from '../geometry/LinearRing2.js';
import { MultiPolygon2 } from '../geometry/MultiPolygon2.js';
import { Polygon2 } from '../geometry/Polygon2.js';
import { Precision } from '../precision/Precision.js';

function signedRingArea(ring: LinearRing2): number {
  if (ring.points.length < 3) return 0;

  let twiceArea = 0;
  for (let index = 0; index < ring.points.length; index += 1) {
    const current = ring.points[index];
    const next = ring.points[(index + 1) % ring.points.length];
    const cross = current.x * next.y - next.x * current.y;
    Precision.assertFinite(cross, 'Planar ring cross product');
    twiceArea += cross;
    Precision.assertFinite(twiceArea, 'Planar ring accumulated area');
  }

  return Precision.assertFinite(twiceArea / 2, 'Planar signed ring area');
}

export function planarLinearRingArea2(ring: LinearRing2): number {
  return Precision.assertFinite(Math.abs(signedRingArea(ring)), 'Planar ring area');
}

export function planarPolygonArea2(polygon: Polygon2): number {
  if (polygon.rings.length === 0) return 0;

  let area = planarLinearRingArea2(polygon.rings[0]);
  for (const hole of polygon.rings.slice(1)) {
    area -= planarLinearRingArea2(hole);
    Precision.assertFinite(area, 'Planar polygon area');
  }

  return Math.max(0, area);
}

export function planarMultiPolygonArea2(multiPolygon: MultiPolygon2): number {
  let area = 0;
  for (const polygon of multiPolygon.polygons) {
    area += planarPolygonArea2(polygon);
    Precision.assertFinite(area, 'Planar multi-polygon area');
  }
  return area;
}

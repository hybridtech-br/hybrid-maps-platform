import { Point2 } from '../geometry/Point2.js';
import { Precision } from '../precision/Precision.js';

export function planarDistanceSquared2(a: Point2, b: Point2): number {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  Precision.assertFinite(dx, 'Planar distance x delta');
  Precision.assertFinite(dy, 'Planar distance y delta');
  return Precision.assertFinite(dx * dx + dy * dy, 'Planar squared distance');
}

export function planarDistance2(a: Point2, b: Point2): number {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  Precision.assertFinite(dx, 'Planar distance x delta');
  Precision.assertFinite(dy, 'Planar distance y delta');
  return Precision.assertFinite(Math.hypot(dx, dy), 'Planar distance');
}

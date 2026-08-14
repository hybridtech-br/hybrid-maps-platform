import { LineString2 } from '../geometry/LineString2.js';
import { MultiLineString2 } from '../geometry/MultiLineString2.js';
import { Segment2 } from '../geometry/Segment2.js';
import { Precision } from '../precision/Precision.js';
import { planarDistance2 } from './PlanarDistance.js';

function sequenceLength(points: LineString2['points']): number {
  let total = 0;
  for (let index = 1; index < points.length; index += 1) {
    total += planarDistance2(points[index - 1], points[index]);
    Precision.assertFinite(total, 'Planar length');
  }
  return total;
}

export function planarSegmentLength2(segment: Segment2): number {
  return planarDistance2(segment.start, segment.end);
}

export function planarLineStringLength2(line: LineString2): number {
  return sequenceLength(line.points);
}

export function planarMultiLineStringLength2(multiLine: MultiLineString2): number {
  let total = 0;
  for (const line of multiLine.lines) {
    total += sequenceLength(line.points);
    Precision.assertFinite(total, 'Planar multi-line length');
  }
  return total;
}

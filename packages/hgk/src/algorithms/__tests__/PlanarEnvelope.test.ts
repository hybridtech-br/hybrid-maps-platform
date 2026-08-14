import { describe, expect, it } from 'vitest';

import { GeometryCollection2 } from '../../geometry/GeometryCollection2.js';
import { LineString2 } from '../../geometry/LineString2.js';
import { MultiPoint2 } from '../../geometry/MultiPoint2.js';
import { Point2 } from '../../geometry/Point2.js';
import { Segment2 } from '../../geometry/Segment2.js';
import { planarBoundingEnvelope2 } from '../PlanarEnvelope.js';

describe('planar bounding envelope', () => {
  it('returns a point envelope for Point2', () => {
    expect(planarBoundingEnvelope2(new Point2(3, 4))).toEqual({
      minX: 3,
      minY: 4,
      maxX: 3,
      maxY: 4,
    });
  });

  it('covers segment and line extrema', () => {
    const collection = new GeometryCollection2([
      new Segment2(new Point2(-3, 2), new Point2(5, -1)),
      new LineString2([new Point2(1, 8), new Point2(4, 3)]),
    ]);
    expect(planarBoundingEnvelope2(collection)).toEqual({
      minX: -3,
      minY: -1,
      maxX: 5,
      maxY: 8,
    });
  });

  it('recurses through aggregate and nested collections', () => {
    const geometry = new GeometryCollection2([
      new GeometryCollection2([
        new MultiPoint2([new Point2(-1, -2), new Point2(7, 9)]),
      ]),
    ]);
    expect(planarBoundingEnvelope2(geometry)).toEqual({
      minX: -1,
      minY: -2,
      maxX: 7,
      maxY: 9,
    });
  });

  it('returns undefined when a geometry contains no points', () => {
    expect(planarBoundingEnvelope2(new GeometryCollection2([]))).toBeUndefined();
    expect(planarBoundingEnvelope2(new MultiPoint2([]))).toBeUndefined();
  });
});

import { EPSILON } from '../precision/Precision.js';
import { LinearRing2, type LinearRing2Json } from './LinearRing2.js';

export interface Polygon2Json {
  readonly type: 'Polygon2';
  readonly rings: readonly LinearRing2Json[];
}

export class Polygon2 {
  public readonly type = 'Polygon2' as const;
  public readonly rings: readonly LinearRing2[];

  public constructor(rings: readonly LinearRing2[]) {
    this.rings = Object.freeze([...rings]);
    Object.freeze(this);
  }

  public isEmpty(): boolean {
    return this.rings.length === 0;
  }

  public outerRing(): LinearRing2 | undefined {
    return this.rings[0];
  }

  public holes(): readonly LinearRing2[] {
    return Object.freeze(this.rings.slice(1));
  }

  public equals(other: Polygon2): boolean {
    return this.rings.length === other.rings.length
      && this.rings.every((ring, index) => ring.equals(other.rings[index]));
  }

  public approximatelyEquals(other: Polygon2, epsilon = EPSILON): boolean {
    return this.rings.length === other.rings.length
      && this.rings.every((ring, index) => ring.approximatelyEquals(other.rings[index], epsilon));
  }

  public toJSON(): Polygon2Json {
    return Object.freeze({
      type: this.type,
      rings: Object.freeze(this.rings.map((ring) => ring.toJSON())),
    });
  }
}

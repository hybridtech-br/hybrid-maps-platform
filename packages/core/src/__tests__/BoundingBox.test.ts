import { describe, expect, it } from "vitest";

import { BoundingBox, Coordinate } from "../index.js";

describe("BoundingBox characterization", () => {
  it("constructs and freezes a valid bounding box", () => {
    const bounds = new BoundingBox(-44, -23, -42, -22);
    expect(bounds).toMatchObject({ west: -44, south: -23, east: -42, north: -22 });
    expect(Object.isFrozen(bounds)).toBe(true);
  });

  it("rejects invalid ordering", () => {
    expect(() => new BoundingBox(10, 0, -10, 1)).toThrowError(
      new RangeError("Bounding box minimum values must not exceed maximum values."),
    );
    expect(() => new BoundingBox(0, 10, 1, -10)).toThrowError(
      new RangeError("Bounding box minimum values must not exceed maximum values."),
    );
  });

  it("inherits geographic range validation from Coordinate", () => {
    expect(() => new BoundingBox(-181, 0, 0, 1)).toThrowError(
      new RangeError("Longitude must be between -180 and 180 degrees."),
    );
    expect(() => new BoundingBox(0, -91, 1, 1)).toThrowError(
      new RangeError("Latitude must be between -90 and 90 degrees."),
    );
  });

  it("contains points inclusively on every boundary", () => {
    const bounds = new BoundingBox(-10, -5, 10, 5);
    expect(bounds.contains(new Coordinate(-10, -5))).toBe(true);
    expect(bounds.contains([10, 5])).toBe(true);
    expect(bounds.contains([0, 0])).toBe(true);
    expect(bounds.contains([10.000001, 0])).toBe(false);
    expect(bounds.contains([0, 5.000001])).toBe(false);
  });

  it("treats touching bounds as intersecting", () => {
    const a = new BoundingBox(0, 0, 10, 10);
    expect(a.intersects(new BoundingBox(10, 10, 20, 20))).toBe(true);
    expect(a.intersects(new BoundingBox(11, 0, 20, 10))).toBe(false);
  });

  it("returns the minimal union", () => {
    const union = new BoundingBox(-10, -5, 0, 5).union(new BoundingBox(-2, -10, 8, 2));
    expect(union).toMatchObject({ west: -10, south: -10, east: 8, north: 5 });
    expect(union).toBeInstanceOf(BoundingBox);
  });

  it("returns the arithmetic midpoint as center", () => {
    const center = new BoundingBox(-44, -24, -42, -22).center();
    expect(center).toBeInstanceOf(Coordinate);
    expect(center.toArray()).toEqual([-43, -23]);
  });

  it("supports degenerate point bounds", () => {
    const bounds = new BoundingBox(1, 2, 1, 2);
    expect(bounds.contains([1, 2])).toBe(true);
    expect(bounds.center().toArray()).toEqual([1, 2]);
  });
});

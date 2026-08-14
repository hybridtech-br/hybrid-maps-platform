import { describe, expect, it } from "vitest";

import { Coordinate } from "../index.js";

describe("Coordinate characterization", () => {
  it("accepts documented geographic boundaries and altitude", () => {
    expect(new Coordinate(-180, -90).toArray()).toEqual([-180, -90]);
    expect(new Coordinate(180, 90, 123.5).toArray()).toEqual([180, 90, 123.5]);
  });

  it.each([
    [-180.000001, 0, "Longitude must be between -180 and 180 degrees."],
    [180.000001, 0, "Longitude must be between -180 and 180 degrees."],
    [Number.NaN, 0, "Longitude must be between -180 and 180 degrees."],
    [Number.POSITIVE_INFINITY, 0, "Longitude must be between -180 and 180 degrees."],
    [0, -90.000001, "Latitude must be between -90 and 90 degrees."],
    [0, 90.000001, "Latitude must be between -90 and 90 degrees."],
    [0, Number.NaN, "Latitude must be between -90 and 90 degrees."],
    [0, Number.NEGATIVE_INFINITY, "Latitude must be between -90 and 90 degrees."],
  ])("rejects invalid longitude/latitude (%s, %s)", (longitude, latitude, message) => {
    expect(() => new Coordinate(longitude as number, latitude as number)).toThrowError(new RangeError(message as string));
  });

  it.each([Number.NaN, Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY])(
    "rejects non-finite altitude %s",
    (altitude) => {
      expect(() => new Coordinate(0, 0, altitude)).toThrowError(
        new RangeError("Altitude must be finite when provided."),
      );
    },
  );

  it("preserves zero altitude and omits absent altitude in tuple output", () => {
    expect(new Coordinate(1, 2, 0).toArray()).toEqual([1, 2, 0]);
    expect(new Coordinate(1, 2).toArray()).toEqual([1, 2]);
  });

  it("returns the same instance from Coordinate.from when given a Coordinate", () => {
    const coordinate = new Coordinate(-43.1729, -22.9068);
    expect(Coordinate.from(coordinate)).toBe(coordinate);
  });

  it("creates a new Coordinate from tuple input", () => {
    const coordinate = Coordinate.from([-43.1729, -22.9068, 5]);
    expect(coordinate).toBeInstanceOf(Coordinate);
    expect(coordinate.toArray()).toEqual([-43.1729, -22.9068, 5]);
  });

  it("uses exact component equality", () => {
    const base = new Coordinate(1, 2, 3);
    expect(base.equals(new Coordinate(1, 2, 3))).toBe(true);
    expect(base.equals(new Coordinate(1 + Number.EPSILON, 2, 3))).toBe(false);
    expect(base.equals(new Coordinate(1, 2, 4))).toBe(false);
    expect(new Coordinate(1, 2).equals(new Coordinate(1, 2, 0))).toBe(false);
  });

  it("freezes instances", () => {
    expect(Object.isFrozen(new Coordinate(1, 2))).toBe(true);
  });
});

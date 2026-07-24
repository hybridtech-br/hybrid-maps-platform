import { describe, expect, it } from "vitest";
import { FeatureIndex } from "../src/FeatureIndex.js";

const feature = (id: string, coordinates: [number, number]) => ({
  type: "Feature" as const,
  id,
  geometry: {
    type: "Point" as const,
    coordinates,
  },
  properties: {},
});

describe("FeatureIndex", () => {
  it("indexes features and searches by bbox", () => {
    const index = new FeatureIndex();

    index.insert(feature("a", [10, 20]));
    index.insert(feature("b", [50, 60]));

    expect(index.search([0, 0, 20, 30])).toEqual(["a"]);
  });

  it("removes indexed features", () => {
    const index = new FeatureIndex();

    index.insert(feature("a", [10, 20]));
    expect(index.remove("a")).toBe(true);
    expect(index.count()).toBe(0);
  });

  it("calculates bounding boxes automatically", () => {
    const index = new FeatureIndex();

    index.insert(feature("a", [10, 20]));

    expect(index.getBoundingBox("a")).toEqual([10, 20, 10, 20]);
  });
});

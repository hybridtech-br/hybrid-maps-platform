import { describe, expect, it, vi } from "vitest";
import { FeatureStore } from "../src/FeatureStore.js";

const point = (id: string) => ({
  type: "Feature" as const,
  id,
  geometry: {
    type: "Point" as const,
    coordinates: [10, 20] as [number, number],
  },
  properties: {},
});

describe("FeatureStore", () => {
  it("creates and retrieves features", () => {
    const store = new FeatureStore();
    store.createFeature(point("pet-1"));

    expect(store.count()).toBe(1);
    expect(store.getFeature("pet-1")?.id).toBe("pet-1");
  });

  it("updates the spatial index", () => {
    const store = new FeatureStore();
    store.createFeature(point("pet-1"));

    expect(store.index.has("pet-1")).toBe(true);
  });

  it("emits domain events", () => {
    const store = new FeatureStore();
    const listener = vi.fn();

    store.events.on("feature.created", listener);
    store.createFeature(point("pet-1"));

    expect(listener).toHaveBeenCalledWith({ featureId: "pet-1" });
  });

  it("rolls back transactions", () => {
    const store = new FeatureStore();

    store.beginTransaction();
    store.createFeature(point("pet-1"));
    store.rollback();

    expect(store.count()).toBe(0);
  });
});

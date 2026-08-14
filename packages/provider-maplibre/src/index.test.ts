import { Viewport } from "@hybrid/maps-core";
import { describe, expect, it } from "vitest";
import { MapLibreProvider, createMapLibreProvider } from "./index.js";

describe("MapLibreProvider", () => {
  it("declares the normalized provider metadata", () => {
    const provider = createMapLibreProvider();

    expect(provider.metadata.id).toBe("maplibre");
    expect(provider.metadata.capabilities.rendering).toBe(true);
    expect(provider.metadata.capabilities.markers).toBe(true);
    expect(provider.metadata.capabilities.popups).toBe(true);
    expect(provider.metadata.capabilities.vectorTiles).toBe(true);
    expect(provider.metadata.capabilities.rasterTiles).toBe(true);
    expect(provider.metadata.capabilities.routing).toBe(false);
  });

  it("requires initialization before map creation", async () => {
    const provider = new MapLibreProvider();

    await expect(provider.createMap({
      container: "map",
      viewport: new Viewport({ center: [-43.1729, -22.9068], zoom: 12 }),
    })).rejects.toThrow("must be initialized");
  });

  it("can be initialized and disposed repeatedly", async () => {
    const provider = new MapLibreProvider();

    await provider.initialize();
    await provider.dispose();
    await provider.initialize();
    await provider.dispose();
  });
});

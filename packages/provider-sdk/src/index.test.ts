import { describe, expect, it, vi } from "vitest";
import {
  ProviderContractError,
  ProviderRegistry,
  createProviderCapabilities,
  validateProviderMetadata,
  type IMapProvider,
} from "./index.js";

function createProvider(id = "maplibre"): IMapProvider {
  return {
    metadata: {
      id,
      name: "MapLibre",
      version: "1.0.0",
      capabilities: createProviderCapabilities({
        rendering: true,
        markers: true,
        popups: true,
        vectorTiles: true,
      }),
    },
    initialize: vi.fn(async () => undefined),
    createMap: vi.fn(async () => {
      throw new Error("Not required by this contract test.");
    }),
    dispose: vi.fn(async () => undefined),
  };
}

describe("provider contracts", () => {
  it("normalizes every known capability", () => {
    const capabilities = createProviderCapabilities({ rendering: true, terrain: true });

    expect(capabilities.rendering).toBe(true);
    expect(capabilities.terrain).toBe(true);
    expect(capabilities.routing).toBe(false);
    expect(Object.isFrozen(capabilities)).toBe(true);
  });

  it("rejects providers without rendering", () => {
    expect(() => validateProviderMetadata({
      id: "invalid-provider",
      name: "Invalid",
      version: "1.0.0",
      capabilities: createProviderCapabilities(),
    })).toThrow(ProviderContractError);
  });

  it("rejects invalid provider identifiers", () => {
    expect(() => validateProviderMetadata({
      id: "Google Maps",
      name: "Google Maps",
      version: "1.0.0",
      capabilities: createProviderCapabilities({ rendering: true }),
    })).toThrow("lowercase kebab-case");
  });
});

describe("ProviderRegistry", () => {
  it("resolves and initializes a provider only once", async () => {
    const provider = createProvider();
    const factory = vi.fn(() => provider);
    const registry = new ProviderRegistry();
    registry.register("maplibre", factory);

    const [first, second] = await Promise.all([
      registry.resolve("maplibre"),
      registry.resolve("maplibre"),
    ]);

    expect(first).toBe(provider);
    expect(second).toBe(provider);
    expect(factory).toHaveBeenCalledTimes(1);
    expect(provider.initialize).toHaveBeenCalledTimes(1);
  });

  it("rejects duplicate registrations", () => {
    const registry = new ProviderRegistry();
    registry.register("maplibre", () => createProvider());

    expect(() => registry.register("maplibre", () => createProvider())).toThrow("already registered");
  });

  it("rejects metadata that does not match the registered id", async () => {
    const registry = new ProviderRegistry();
    registry.register("maplibre", () => createProvider("other-provider"));

    await expect(registry.resolve("maplibre")).rejects.toThrow("does not match metadata id");
  });

  it("disposes initialized providers", async () => {
    const provider = createProvider();
    const registry = new ProviderRegistry();
    registry.register("maplibre", () => provider);

    await registry.resolve("maplibre");
    await registry.dispose("maplibre");

    expect(provider.dispose).toHaveBeenCalledTimes(1);
  });
});

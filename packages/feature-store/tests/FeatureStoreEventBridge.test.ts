import { describe, expect, it, vi } from "vitest";
import { EventBus } from "@hybrid/maps-events";
import { FeatureEventEmitter } from "../src/FeatureEventEmitter.js";
import { FeatureStoreEventBridge } from "../src/FeatureStoreEventBridge.js";

describe("FeatureStoreEventBridge", () => {
  it("forwards feature events to the platform event bus", async () => {
    const emitter = new FeatureEventEmitter();
    const bus = new EventBus();
    const listener = vi.fn();

    bus.subscribe("feature.created", listener);

    const bridge = new FeatureStoreEventBridge(emitter, bus);

    emitter.emit("feature.created", { featureId: "feature-1" });

    await Promise.resolve();

    expect(listener).toHaveBeenCalledWith({ featureId: "feature-1" });

    bridge.dispose();
  });

  it("removes subscriptions on dispose", () => {
    const emitter = new FeatureEventEmitter();
    const bus = new EventBus();
    const listener = vi.fn();

    bus.subscribe("feature.created", listener);

    const bridge = new FeatureStoreEventBridge(emitter, bus);
    bridge.dispose();

    emitter.emit("feature.created", { featureId: "feature-1" });

    expect(listener).not.toHaveBeenCalled();
  });
});

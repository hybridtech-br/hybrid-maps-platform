import { describe, expect, it, vi } from "vitest";
import { FeatureEventEmitter } from "../src/FeatureEventEmitter.js";

describe("FeatureEventEmitter", () => {
  it("emits feature events", () => {
    const emitter = new FeatureEventEmitter();
    const listener = vi.fn();

    emitter.on("feature.created", listener);
    emitter.emit("feature.created", { featureId: "feature-1" });

    expect(listener).toHaveBeenCalledWith({ featureId: "feature-1" });
  });

  it("supports unsubscribe", () => {
    const emitter = new FeatureEventEmitter();
    const listener = vi.fn();

    const unsubscribe = emitter.on("feature.updated", listener);
    unsubscribe();

    emitter.emit("feature.updated", { featureId: "feature-1" });

    expect(listener).not.toHaveBeenCalled();
  });

  it("clears listeners", () => {
    const emitter = new FeatureEventEmitter();
    const listener = vi.fn();

    emitter.on("feature.removed", listener);
    emitter.clear();
    emitter.emit("feature.removed", { featureId: "feature-1" });

    expect(listener).not.toHaveBeenCalled();
  });
});

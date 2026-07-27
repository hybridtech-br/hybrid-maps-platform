import { describe, expect, it, vi } from "vitest";
import { EventBus } from "../src/EventBus.js";

interface TestEvents {
  message: { value: string };
}

describe("EventBus", () => {
  it("publishes payloads", async () => {
    const bus = new EventBus<TestEvents>();
    const listener = vi.fn();
    bus.subscribe("message", listener);
    const result = await bus.publish("message", { value: "hello" });
    expect(listener).toHaveBeenCalledWith({ value: "hello" });
    expect(result.delivered).toBe(1);
    expect(result.errors).toEqual([]);
  });

  it("supports once subscriptions", async () => {
    const bus = new EventBus<TestEvents>();
    const listener = vi.fn();
    bus.once("message", listener);
    await bus.publish("message", { value: "first" });
    await bus.publish("message", { value: "second" });
    expect(listener).toHaveBeenCalledOnce();
  });

  it("honors priority", async () => {
    const bus = new EventBus<TestEvents>();
    const calls: string[] = [];
    bus.subscribe("message", () => calls.push("normal"));
    bus.subscribe("message", () => calls.push("high"), { priority: 10 });
    await bus.publish("message", { value: "ordered" });
    expect(calls).toEqual(["high", "normal"]);
  });

  it("isolates listener errors", async () => {
    const bus = new EventBus<TestEvents>();
    const error = new Error("failure");
    const listener = vi.fn();
    bus.subscribe("message", () => { throw error; });
    bus.subscribe("message", listener);
    const result = await bus.publish("message", { value: "safe" });
    expect(listener).toHaveBeenCalledOnce();
    expect(result.delivered).toBe(1);
    expect(result.errors).toEqual([error]);
  });
});

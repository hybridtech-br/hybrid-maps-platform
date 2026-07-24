import { describe, expect, it } from "vitest";
import { CapabilityRegistry, EventBus, HmpKernel, ModuleRegistry, ServiceContainer } from "./index.js";

describe("HmpKernel", () => {
  it("starts and stops modules in deterministic order", async () => {
    const calls: string[] = [];
    const kernel = new HmpKernel();

    kernel.register({
      id: "example",
      version: "1.0.0",
      configure: async () => { calls.push("configure"); },
      initialize: async () => { calls.push("initialize"); },
      start: async () => { calls.push("start"); },
      stop: async () => { calls.push("stop"); },
      dispose: async () => { calls.push("dispose"); },
    });

    await kernel.start();
    expect(kernel.status).toBe("running");
    expect(calls).toEqual(["configure", "initialize", "start"]);

    await kernel.stop();
    expect(kernel.status).toBe("disposed");
    expect(calls).toEqual(["configure", "initialize", "start", "stop", "dispose"]);
  });
});

describe("runtime primitives", () => {
  it("publishes typed events and unsubscribes", () => {
    const bus = new EventBus<{ ready: { id: string } }>();
    const received: string[] = [];
    const unsubscribe = bus.on("ready", ({ id }) => received.push(id));
    bus.emit("ready", { id: "hmp" });
    unsubscribe();
    bus.emit("ready", { id: "ignored" });
    expect(received).toEqual(["hmp"]);
  });

  it("registers services, capabilities, and modules", () => {
    const services = new ServiceContainer();
    services.register("config", { locale: "pt-BR" });
    expect(services.resolve<{ locale: string }>("config").locale).toBe("pt-BR");

    const capabilities = new CapabilityRegistry();
    capabilities.register("rendering");
    expect(capabilities.has("rendering")).toBe(true);

    const modules = new ModuleRegistry();
    modules.register({ id: "module", version: "1.0.0", initialize: async () => undefined });
    expect(modules.get("module")?.id).toBe("module");
  });
});

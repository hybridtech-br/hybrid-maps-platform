import { DefaultCapabilityRegistry, DefaultServiceContainer, TypedEventBus } from "./infrastructure.js";
import type { KernelConfiguration, KernelContext, KernelModule, ModuleState } from "./types.js";

export type KernelState = "created" | "starting" | "ready" | "stopping" | "stopped" | "failed";

export class HmpKernel {
  private readonly modules = new Map<string, KernelModule>();
  private readonly moduleStates = new Map<string, ModuleState>();
  private readonly events = new TypedEventBus();
  private readonly capabilities = new DefaultCapabilityRegistry(this.events);
  private readonly services = new DefaultServiceContainer();
  private readonly context: KernelContext;
  private currentState: KernelState = "created";

  public constructor(configuration: KernelConfiguration = {}) {
    this.context = Object.freeze({
      configuration: Object.freeze({ ...configuration }),
      services: this.services,
      capabilities: this.capabilities,
      events: this.events,
    });
    this.services.register("events", this.events);
    this.services.register("capabilities", this.capabilities);
  }

  public get state(): KernelState { return this.currentState; }
  public get eventBus(): TypedEventBus { return this.events; }
  public hasCapability(capability: string): boolean { return this.capabilities.has(capability); }

  public register(module: KernelModule): this {
    if (this.currentState !== "created") throw new Error("Modules can only be registered before the kernel starts.");
    if (this.modules.has(module.id)) throw new Error(`Module already registered: ${module.id}`);
    this.modules.set(module.id, module);
    this.setModuleState(module.id, "registered");
    return this;
  }

  public async start(): Promise<void> {
    if (this.currentState !== "created" && this.currentState !== "stopped") throw new Error(`Cannot start kernel from ${this.currentState}.`);
    this.setState("starting");
    try {
      for (const module of this.modules.values()) {
        await module.configure?.(this.context); this.setModuleState(module.id, "configured");
        await module.initialize?.(this.context); this.setModuleState(module.id, "initialized");
        await module.start?.(this.context); this.setModuleState(module.id, "started");
      }
      this.setState("ready");
    } catch (error) {
      this.setState("failed");
      throw error;
    }
  }

  public async stop(): Promise<void> {
    if (this.currentState !== "ready" && this.currentState !== "failed") return;
    this.setState("stopping");
    for (const module of [...this.modules.values()].reverse()) {
      try { await module.stop?.(this.context); this.setModuleState(module.id, "stopped"); }
      finally { await module.dispose?.(this.context); this.setModuleState(module.id, "disposed"); }
    }
    this.setState("stopped");
  }

  private setState(state: KernelState): void {
    this.currentState = state;
    this.events.emit("kernel.state.changed", { state });
  }
  private setModuleState(moduleId: string, state: ModuleState): void {
    this.moduleStates.set(moduleId, state);
    this.events.emit("module.state.changed", { moduleId, state });
  }
}

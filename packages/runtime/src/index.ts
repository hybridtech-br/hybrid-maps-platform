export type ModuleState =
  | "registered"
  | "configured"
  | "initialized"
  | "started"
  | "stopped"
  | "disposed"
  | "failed";

export interface KernelModule {
  readonly id: string;
  readonly version: string;
  configure?(context: KernelContext): Promise<void> | void;
  initialize?(context: KernelContext): Promise<void> | void;
  start?(context: KernelContext): Promise<void> | void;
  stop?(context: KernelContext): Promise<void> | void;
  dispose?(context: KernelContext): Promise<void> | void;
}

export type EventMap = Record<string, unknown>;
export type EventHandler<T> = (payload: T) => void | Promise<void>;

export class EventBus<TEvents extends EventMap = EventMap> {
  private readonly handlers = new Map<keyof TEvents, Set<EventHandler<unknown>>>();

  public on<TKey extends keyof TEvents>(event: TKey, handler: EventHandler<TEvents[TKey]>): () => void {
    const listeners = this.handlers.get(event) ?? new Set<EventHandler<unknown>>();
    listeners.add(handler as EventHandler<unknown>);
    this.handlers.set(event, listeners);
    return () => this.off(event, handler);
  }

  public off<TKey extends keyof TEvents>(event: TKey, handler: EventHandler<TEvents[TKey]>): void {
    const listeners = this.handlers.get(event);
    listeners?.delete(handler as EventHandler<unknown>);
    if (listeners?.size === 0) this.handlers.delete(event);
  }

  public async emit<TKey extends keyof TEvents>(event: TKey, payload: TEvents[TKey]): Promise<void> {
    const listeners = [...(this.handlers.get(event) ?? [])];
    for (const listener of listeners) await listener(payload);
  }

  public clear(): void {
    this.handlers.clear();
  }
}

export class ServiceContainer {
  private readonly services = new Map<string | symbol, unknown>();

  public register<T>(token: string | symbol, service: T): void {
    if (this.services.has(token)) throw new Error(`Service already registered: ${String(token)}`);
    this.services.set(token, service);
  }

  public replace<T>(token: string | symbol, service: T): void {
    this.services.set(token, service);
  }

  public resolve<T>(token: string | symbol): T {
    if (!this.services.has(token)) throw new Error(`Service not registered: ${String(token)}`);
    return this.services.get(token) as T;
  }

  public has(token: string | symbol): boolean {
    return this.services.has(token);
  }
}

export class CapabilityRegistry {
  private readonly providers = new Map<string, Set<string>>();

  public register(providerId: string, capabilities: Iterable<string>): void {
    this.providers.set(providerId, new Set(capabilities));
  }

  public unregister(providerId: string): void {
    this.providers.delete(providerId);
  }

  public has(capability: string): boolean {
    return [...this.providers.values()].some((items) => items.has(capability));
  }

  public providersFor(capability: string): readonly string[] {
    return [...this.providers.entries()]
      .filter(([, items]) => items.has(capability))
      .map(([providerId]) => providerId);
  }
}

export interface KernelEvents extends EventMap {
  "kernel.started": { moduleCount: number };
  "kernel.stopped": undefined;
  "kernel.failed": { moduleId: string; error: unknown };
  "module.state.changed": { moduleId: string; state: ModuleState };
}

export interface KernelContext {
  readonly services: ServiceContainer;
  readonly capabilities: CapabilityRegistry;
  readonly events: EventBus<KernelEvents>;
  readonly configuration: Readonly<Record<string, unknown>>;
}

export class HmpKernel {
  private readonly modules = new Map<string, KernelModule>();
  private readonly states = new Map<string, ModuleState>();
  private readonly contextValue: KernelContext;
  private running = false;

  public constructor(configuration: Readonly<Record<string, unknown>> = {}) {
    const services = new ServiceContainer();
    const capabilities = new CapabilityRegistry();
    const events = new EventBus<KernelEvents>();
    this.contextValue = { services, capabilities, events, configuration };
    services.register("events", events);
    services.register("capabilities", capabilities);
    services.register("configuration", configuration);
  }

  public get context(): KernelContext {
    return this.contextValue;
  }

  public get isRunning(): boolean {
    return this.running;
  }

  public register(module: KernelModule): this {
    if (this.modules.has(module.id)) throw new Error(`Module already registered: ${module.id}`);
    this.modules.set(module.id, module);
    this.states.set(module.id, "registered");
    return this;
  }

  public stateOf(moduleId: string): ModuleState | undefined {
    return this.states.get(moduleId);
  }

  public hasCapability(capability: string): boolean {
    return this.contextValue.capabilities.has(capability);
  }

  public async start(): Promise<void> {
    if (this.running) return;
    const initialized: KernelModule[] = [];
    try {
      for (const module of this.modules.values()) {
        await module.configure?.(this.contextValue);
        await this.setState(module.id, "configured");
        await module.initialize?.(this.contextValue);
        initialized.push(module);
        await this.setState(module.id, "initialized");
        await module.start?.(this.contextValue);
        await this.setState(module.id, "started");
      }
      this.running = true;
      await this.contextValue.events.emit("kernel.started", { moduleCount: this.modules.size });
    } catch (error) {
      const failed = [...this.modules.values()].find((module) => this.states.get(module.id) !== "started");
      if (failed) {
        await this.setState(failed.id, "failed");
        await this.contextValue.events.emit("kernel.failed", { moduleId: failed.id, error });
      }
      for (const module of initialized.reverse()) await module.dispose?.(this.contextValue);
      throw error;
    }
  }

  public async stop(): Promise<void> {
    for (const module of [...this.modules.values()].reverse()) {
      if (this.states.get(module.id) === "started") {
        await module.stop?.(this.contextValue);
        await this.setState(module.id, "stopped");
      }
      await module.dispose?.(this.contextValue);
      await this.setState(module.id, "disposed");
    }
    this.running = false;
    await this.contextValue.events.emit("kernel.stopped", undefined);
  }

  private async setState(moduleId: string, state: ModuleState): Promise<void> {
    this.states.set(moduleId, state);
    await this.contextValue.events.emit("module.state.changed", { moduleId, state });
  }
}

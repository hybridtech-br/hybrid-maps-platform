import type { CapabilityRegistry, EventBus, EventMap, ServiceContainer } from "./types.js";

export class TypedEventBus implements EventBus {
  private readonly listeners = new Map<keyof EventMap, Set<(payload: never) => void>>();
  on<K extends keyof EventMap>(event: K, listener: (payload: EventMap[K]) => void): () => void {
    const group = this.listeners.get(event) ?? new Set();
    group.add(listener as (payload: never) => void);
    this.listeners.set(event, group);
    return () => group.delete(listener as (payload: never) => void);
  }
  emit<K extends keyof EventMap>(event: K, payload: EventMap[K]): void {
    for (const listener of this.listeners.get(event) ?? []) listener(payload as never);
  }
}

export class DefaultServiceContainer implements ServiceContainer {
  private readonly services = new Map<string, unknown>();
  register<T>(token: string, service: T): void {
    if (this.services.has(token)) throw new Error(`Service already registered: ${token}`);
    this.services.set(token, service);
  }
  resolve<T>(token: string): T {
    if (!this.services.has(token)) throw new Error(`Service not registered: ${token}`);
    return this.services.get(token) as T;
  }
  has(token: string): boolean { return this.services.has(token); }
}

export class DefaultCapabilityRegistry implements CapabilityRegistry {
  private readonly entries = new Map<string, Set<string>>();
  public constructor(private readonly events?: EventBus) {}
  register(capability: string, moduleId: string): void {
    const providers = this.entries.get(capability) ?? new Set<string>();
    providers.add(moduleId);
    this.entries.set(capability, providers);
    this.events?.emit("capability.registered", { capability, moduleId });
  }
  has(capability: string): boolean { return (this.entries.get(capability)?.size ?? 0) > 0; }
  providers(capability: string): readonly string[] { return [...(this.entries.get(capability) ?? [])]; }
}

export type ModuleState = "registered" | "configured" | "initialized" | "started" | "stopped" | "disposed" | "failed";

export interface KernelConfiguration {
  readonly provider?: string;
  readonly locale?: string;
  readonly [key: string]: unknown;
}

export interface KernelContext {
  readonly configuration: Readonly<KernelConfiguration>;
  readonly services: ServiceContainer;
  readonly capabilities: CapabilityRegistry;
  readonly events: EventBus;
}

export interface KernelModule {
  readonly id: string;
  readonly version: string;
  configure?(context: KernelContext): void | Promise<void>;
  initialize?(context: KernelContext): void | Promise<void>;
  start?(context: KernelContext): void | Promise<void>;
  stop?(context: KernelContext): void | Promise<void>;
  dispose?(context: KernelContext): void | Promise<void>;
}

export interface EventMap {
  "kernel.state.changed": { readonly state: string };
  "module.state.changed": { readonly moduleId: string; readonly state: ModuleState };
  "capability.registered": { readonly capability: string; readonly moduleId: string };
}

export interface EventBus {
  on<K extends keyof EventMap>(event: K, listener: (payload: EventMap[K]) => void): () => void;
  emit<K extends keyof EventMap>(event: K, payload: EventMap[K]): void;
}

export interface ServiceContainer {
  register<T>(token: string, service: T): void;
  resolve<T>(token: string): T;
  has(token: string): boolean;
}

export interface CapabilityRegistry {
  register(capability: string, moduleId: string): void;
  has(capability: string): boolean;
  providers(capability: string): readonly string[];
}

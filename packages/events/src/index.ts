export type EventMap = Record<string, unknown>;

export type EventListener<TPayload> = (
  payload: TPayload,
) => void | Promise<void>;

export interface Subscription {
  readonly active: boolean;
  unsubscribe(): void;
}

export interface SubscribeOptions {
  readonly once?: boolean;
  readonly priority?: number;
}

export interface PublishResult {
  readonly delivered: number;
  readonly errors: readonly unknown[];
}

interface ListenerRecord<TPayload> {
  readonly listener: EventListener<TPayload>;
  readonly priority: number;
  readonly once: boolean;
  active: boolean;
}

export class EventBus<TEvents extends EventMap> {
  readonly #listeners = new Map<keyof TEvents, Set<ListenerRecord<unknown>>>();

  public subscribe<TKey extends keyof TEvents>(
    event: TKey,
    listener: EventListener<TEvents[TKey]>,
    options: SubscribeOptions = {},
  ): Subscription {
    const record: ListenerRecord<TEvents[TKey]> = {
      listener,
      priority: options.priority ?? 0,
      once: options.once ?? false,
      active: true,
    };

    const records = this.#listeners.get(event) ?? new Set<ListenerRecord<unknown>>();
    records.add(record as ListenerRecord<unknown>);
    this.#listeners.set(event, records);

    return {
      get active() {
        return record.active;
      },
      unsubscribe: () => {
        if (!record.active) return;
        record.active = false;
        records.delete(record as ListenerRecord<unknown>);
        if (records.size === 0) this.#listeners.delete(event);
      },
    };
  }

  public once<TKey extends keyof TEvents>(
    event: TKey,
    listener: EventListener<TEvents[TKey]>,
    options: Omit<SubscribeOptions, "once"> = {},
  ): Subscription {
    return this.subscribe(event, listener, { ...options, once: true });
  }

  public async publish<TKey extends keyof TEvents>(
    event: TKey,
    payload: TEvents[TKey],
  ): Promise<PublishResult> {
    const records = [...(this.#listeners.get(event) ?? [])]
      .filter((record) => record.active)
      .sort((left, right) => right.priority - left.priority);

    const errors: unknown[] = [];
    let delivered = 0;

    for (const record of records) {
      if (!record.active) continue;

      try {
        await (record.listener as EventListener<TEvents[TKey]>)(payload);
        delivered += 1;
      } catch (error) {
        errors.push(error);
      } finally {
        if (record.once) {
          record.active = false;
          this.#listeners.get(event)?.delete(record);
        }
      }
    }

    if (this.#listeners.get(event)?.size === 0) this.#listeners.delete(event);

    return Object.freeze({ delivered, errors: Object.freeze(errors) });
  }

  public listenerCount<TKey extends keyof TEvents>(event: TKey): number {
    return this.#listeners.get(event)?.size ?? 0;
  }

  public clear<TKey extends keyof TEvents>(event?: TKey): void {
    if (event !== undefined) {
      for (const record of this.#listeners.get(event) ?? []) record.active = false;
      this.#listeners.delete(event);
      return;
    }

    for (const records of this.#listeners.values()) {
      for (const record of records) record.active = false;
    }
    this.#listeners.clear();
  }
}

export interface Coordinate {
  readonly longitude: number;
  readonly latitude: number;
}

export interface CameraState extends Coordinate {
  readonly zoom: number;
  readonly bearing: number;
  readonly pitch: number;
}

export interface HmpEventMap extends EventMap {
  "provider.initializing": { readonly providerId: string };
  "provider.ready": { readonly providerId: string };
  "provider.disposed": { readonly providerId: string };
  "provider.changed": { readonly previousProviderId?: string; readonly providerId: string };
  "provider.error": { readonly providerId: string; readonly error: unknown };
  "map.created": { readonly mapId: string };
  "map.loaded": { readonly mapId: string };
  "map.rendered": { readonly mapId: string };
  "map.idle": { readonly mapId: string };
  "map.destroyed": { readonly mapId: string };
  "map.clicked": { readonly mapId: string; readonly coordinate: Coordinate };
  "camera.changed": { readonly mapId: string; readonly camera: CameraState };
  "camera.zoom": { readonly mapId: string; readonly zoom: number };
  "camera.idle": { readonly mapId: string; readonly camera: CameraState };
  "theme.loading": { readonly themeId: string };
  "theme.loaded": { readonly themeId: string };
  "theme.changed": { readonly previousThemeId?: string; readonly themeId: string };
  "theme.error": { readonly themeId: string; readonly error: unknown };
}

export type NativeEventMapper<TNativePayload, TEvents extends EventMap, TKey extends keyof TEvents> = (
  payload: TNativePayload,
) => TEvents[TKey];

export class ProviderEventAdapter<TEvents extends EventMap> {
  public constructor(private readonly bus: EventBus<TEvents>) {}

  public bind<TNativePayload, TKey extends keyof TEvents>(
    event: TKey,
    mapper: NativeEventMapper<TNativePayload, TEvents, TKey>,
  ): (payload: TNativePayload) => Promise<PublishResult> {
    return async (payload) => this.bus.publish(event, mapper(payload));
  }
}

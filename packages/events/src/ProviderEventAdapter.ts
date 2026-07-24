import type { EventMap, PublishResult } from "./EventBus.js";
import { EventBus } from "./EventBus.js";

export type NativeEventMapper<
  TNativePayload,
  TEvents extends EventMap,
  TKey extends keyof TEvents,
> = (payload: TNativePayload) => TEvents[TKey];

export class ProviderEventAdapter<TEvents extends EventMap> {
  public constructor(private readonly bus: EventBus<TEvents>) {}

  public bind<TNativePayload, TKey extends keyof TEvents>(
    event: TKey,
    mapper: NativeEventMapper<TNativePayload, TEvents, TKey>,
  ): (payload: TNativePayload) => Promise<PublishResult> {
    return async (payload) => this.bus.publish(event, mapper(payload));
  }
}

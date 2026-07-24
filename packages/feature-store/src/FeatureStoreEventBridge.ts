import type { EventBus, HmpEventMap } from "@hybrid/maps-events";
import type { FeatureEventEmitter, FeatureEventName } from "./FeatureEventEmitter.js";

const FEATURE_EVENTS: FeatureEventName[] = [
  "feature.created",
  "feature.updated",
  "feature.removed",
  "feature.indexed",
];

/**
 * Bridges Feature Store domain events to the platform event bus.
 *
 * The store remains independent from the runtime event implementation.
 */
export class FeatureStoreEventBridge {
  private readonly unsubscribe: Array<() => void> = [];

  constructor(
    emitter: FeatureEventEmitter,
    private readonly eventBus: EventBus<HmpEventMap>,
  ) {
    for (const event of FEATURE_EVENTS) {
      this.unsubscribe.push(
        emitter.on(event, (payload) => {
          void this.eventBus.publish(event as keyof HmpEventMap, payload);
        }),
      );
    }
  }

  dispose(): void {
    for (const unsubscribe of this.unsubscribe) {
      unsubscribe();
    }

    this.unsubscribe.length = 0;
  }
}

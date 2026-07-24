export type FeatureEventName =
  | "feature.created"
  | "feature.updated"
  | "feature.removed"
  | "feature.indexed";

export type FeatureEventPayload = {
  readonly featureId: string | number;
};

export type FeatureEventListener = (
  payload: FeatureEventPayload,
) => void;

export class FeatureEventEmitter {
  private readonly listeners = new Map<FeatureEventName, Set<FeatureEventListener>>();

  on(event: FeatureEventName, listener: FeatureEventListener): () => void {
    const eventListeners = this.listeners.get(event) ?? new Set();
    eventListeners.add(listener);
    this.listeners.set(event, eventListeners);

    return () => {
      eventListeners.delete(listener);
    };
  }

  emit(event: FeatureEventName, payload: FeatureEventPayload): void {
    for (const listener of this.listeners.get(event) ?? []) {
      listener(payload);
    }
  }

  clear(): void {
    this.listeners.clear();
  }
}

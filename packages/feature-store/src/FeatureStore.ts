import type {
  Feature,
  FeatureCollection,
  FeatureId,
  FeatureProperties,
  Geometry,
} from "./GeoJSON.js";
import { TransactionManager } from "./Transactions.js";

export type FeatureStoreSnapshot<
  G extends Geometry | null = Geometry,
  P extends FeatureProperties = FeatureProperties,
> = Array<Feature<G, P>>;

export class FeatureStore<
  G extends Geometry | null = Geometry,
  P extends FeatureProperties = FeatureProperties,
> {
  private features = new Map<FeatureId, Feature<G, P>>();
  private readonly transactions: TransactionManager<FeatureStoreSnapshot<G, P>>;

  constructor(initialFeatures: Array<Feature<G, P>> = []) {
    this.transactions = new TransactionManager(
      () => this.snapshot(),
      (state) => this.restore(state),
    );

    for (const feature of initialFeatures) {
      this.createFeature(feature);
    }
  }

  createFeature(feature: Feature<G, P>): Feature<G, P> {
    if (this.features.has(feature.id)) {
      throw new Error(`Feature with id "${String(feature.id)}" already exists.`);
    }

    const stored = this.cloneFeature(feature);
    this.features.set(stored.id, stored);
    return this.cloneFeature(stored);
  }

  updateFeature(
    id: FeatureId,
    changes: Partial<Omit<Feature<G, P>, "type" | "id">>,
  ): Feature<G, P> {
    const current = this.features.get(id);

    if (!current) {
      throw new Error(`Feature with id "${String(id)}" was not found.`);
    }

    const updated: Feature<G, P> = {
      ...current,
      ...changes,
      type: "Feature",
      id,
    };

    const stored = this.cloneFeature(updated);
    this.features.set(id, stored);
    return this.cloneFeature(stored);
  }

  removeFeature(id: FeatureId): boolean {
    return this.features.delete(id);
  }

  getFeature(id: FeatureId): Feature<G, P> | undefined {
    const feature = this.features.get(id);
    return feature ? this.cloneFeature(feature) : undefined;
  }

  hasFeature(id: FeatureId): boolean {
    return this.features.has(id);
  }

  getFeatures(): Array<Feature<G, P>> {
    return Array.from(this.features.values(), (feature) => this.cloneFeature(feature));
  }

  toFeatureCollection(): FeatureCollection<G, P> {
    return {
      type: "FeatureCollection",
      features: this.getFeatures(),
    };
  }

  clear(): void {
    this.features.clear();
  }

  count(): number {
    return this.features.size;
  }

  snapshot(): FeatureStoreSnapshot<G, P> {
    return this.getFeatures();
  }

  restore(snapshot: FeatureStoreSnapshot<G, P>): void {
    const restored = new Map<FeatureId, Feature<G, P>>();

    for (const feature of snapshot) {
      if (restored.has(feature.id)) {
        throw new Error(`Snapshot contains duplicate feature id "${String(feature.id)}".`);
      }

      restored.set(feature.id, this.cloneFeature(feature));
    }

    this.features = restored;
  }

  beginTransaction(): void {
    this.transactions.beginTransaction();
  }

  commit(): void {
    this.transactions.commit();
  }

  rollback(): void {
    this.transactions.rollback();
  }

  isInTransaction(): boolean {
    return this.transactions.isInTransaction();
  }

  private cloneFeature(feature: Feature<G, P>): Feature<G, P> {
    return structuredClone(feature);
  }
}

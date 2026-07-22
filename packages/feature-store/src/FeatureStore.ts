import type {
  Feature,
  FeatureCollection,
  FeatureId,
  FeatureProperties,
  Geometry,
} from "./GeoJSON.js";
import { FeatureIndex } from "./FeatureIndex.js";
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
  readonly index: FeatureIndex;

  constructor(initialFeatures: Array<Feature<G, P>> = []) {
    this.index = new FeatureIndex();

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
    this.index.insert(stored);
    return this.cloneFeature(stored);
  }

  updateFeature(id: FeatureId, changes: Partial<Omit<Feature<G, P>, "type" | "id">>): Feature<G, P> {
    const current = this.features.get(id);
    if (!current) throw new Error(`Feature with id "${String(id)}" was not found.`);

    const updated: Feature<G, P> = { ...current, ...changes, type: "Feature", id };
    const stored = this.cloneFeature(updated);
    this.features.set(id, stored);
    this.index.update(stored);
    return this.cloneFeature(stored);
  }

  removeFeature(id: FeatureId): boolean {
    this.index.remove(id);
    return this.features.delete(id);
  }

  getFeature(id: FeatureId): Feature<G, P> | undefined {
    const feature = this.features.get(id);
    return feature ? this.cloneFeature(feature) : undefined;
  }

  getFeatures(): Array<Feature<G, P>> {
    return Array.from(this.features.values(), (feature) => this.cloneFeature(feature));
  }

  toFeatureCollection(): FeatureCollection<G, P> {
    return { type: "FeatureCollection", features: this.getFeatures() };
  }

  clear(): void {
    this.features.clear();
    this.index.clear();
  }

  count(): number {
    return this.features.size;
  }

  snapshot(): FeatureStoreSnapshot<G, P> {
    return this.getFeatures();
  }

  restore(snapshot: FeatureStoreSnapshot<G, P>): void {
    this.features = new Map();
    this.index.clear();

    for (const feature of snapshot) {
      this.features.set(feature.id, this.cloneFeature(feature));
      this.index.insert(feature);
    }
  }

  beginTransaction(): void { this.transactions.beginTransaction(); }
  commit(): void { this.transactions.commit(); }
  rollback(): void { this.transactions.rollback(); }
  isInTransaction(): boolean { return this.transactions.isInTransaction(); }

  private cloneFeature(feature: Feature<G, P>): Feature<G, P> {
    return structuredClone(feature);
  }
}

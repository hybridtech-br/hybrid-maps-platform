import type { FeatureId } from "./GeoJSON.js";

export type SourceId = string;

export interface FeatureSource {
  id: SourceId;
  featureIds: FeatureId[];
  metadata?: Record<string, unknown>;
}

export class SourceStore {
  private readonly sources = new Map<SourceId, FeatureSource>();

  createSource(source: FeatureSource): FeatureSource {
    if (this.sources.has(source.id)) {
      throw new Error(`Source with id "${source.id}" already exists.`);
    }

    const stored = this.cloneSource(source);
    this.sources.set(stored.id, stored);
    return this.cloneSource(stored);
  }

  updateSource(
    id: SourceId,
    changes: Partial<Omit<FeatureSource, "id">>,
  ): FeatureSource {
    const current = this.sources.get(id);

    if (!current) {
      throw new Error(`Source with id "${id}" was not found.`);
    }

    const stored = this.cloneSource({ ...current, ...changes, id });
    this.sources.set(id, stored);
    return this.cloneSource(stored);
  }

  removeSource(id: SourceId): boolean {
    return this.sources.delete(id);
  }

  getSource(id: SourceId): FeatureSource | undefined {
    const source = this.sources.get(id);
    return source ? this.cloneSource(source) : undefined;
  }

  getSources(): FeatureSource[] {
    return Array.from(this.sources.values(), (source) => this.cloneSource(source));
  }

  addFeature(sourceId: SourceId, featureId: FeatureId): FeatureSource {
    const source = this.requireSource(sourceId);

    if (!source.featureIds.includes(featureId)) {
      source.featureIds.push(featureId);
    }

    return this.updateSource(sourceId, { featureIds: source.featureIds });
  }

  removeFeature(sourceId: SourceId, featureId: FeatureId): FeatureSource {
    const source = this.requireSource(sourceId);
    return this.updateSource(sourceId, {
      featureIds: source.featureIds.filter((id) => id !== featureId),
    });
  }

  clear(): void {
    this.sources.clear();
  }

  count(): number {
    return this.sources.size;
  }

  private requireSource(id: SourceId): FeatureSource {
    const source = this.getSource(id);

    if (!source) {
      throw new Error(`Source with id "${id}" was not found.`);
    }

    return source;
  }

  private cloneSource(source: FeatureSource): FeatureSource {
    return structuredClone(source);
  }
}

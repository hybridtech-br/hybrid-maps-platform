import type { SourceId } from "./SourceStore.js";

export type LayerId = string;

export interface FeatureLayer {
  id: LayerId;
  sourceId: SourceId;
  name?: string;
  visible?: boolean;
  minZoom?: number;
  maxZoom?: number;
  metadata?: Record<string, unknown>;
}

export class LayerStore {
  private readonly layers = new Map<LayerId, FeatureLayer>();

  createLayer(layer: FeatureLayer): FeatureLayer {
    if (this.layers.has(layer.id)) {
      throw new Error(`Layer with id "${layer.id}" already exists.`);
    }

    const stored = this.normalizeLayer(layer);
    this.layers.set(stored.id, stored);
    return this.cloneLayer(stored);
  }

  updateLayer(
    id: LayerId,
    changes: Partial<Omit<FeatureLayer, "id">>,
  ): FeatureLayer {
    const current = this.layers.get(id);

    if (!current) {
      throw new Error(`Layer with id "${id}" was not found.`);
    }

    const stored = this.normalizeLayer({ ...current, ...changes, id });
    this.layers.set(id, stored);
    return this.cloneLayer(stored);
  }

  removeLayer(id: LayerId): boolean {
    return this.layers.delete(id);
  }

  getLayer(id: LayerId): FeatureLayer | undefined {
    const layer = this.layers.get(id);
    return layer ? this.cloneLayer(layer) : undefined;
  }

  getLayers(): FeatureLayer[] {
    return Array.from(this.layers.values(), (layer) => this.cloneLayer(layer));
  }

  getLayersBySource(sourceId: SourceId): FeatureLayer[] {
    return this.getLayers().filter((layer) => layer.sourceId === sourceId);
  }

  setVisibility(id: LayerId, visible: boolean): FeatureLayer {
    return this.updateLayer(id, { visible });
  }

  clear(): void {
    this.layers.clear();
  }

  count(): number {
    return this.layers.size;
  }

  private normalizeLayer(layer: FeatureLayer): FeatureLayer {
    if (
      layer.minZoom !== undefined &&
      layer.maxZoom !== undefined &&
      layer.minZoom > layer.maxZoom
    ) {
      throw new Error("Layer minZoom cannot be greater than maxZoom.");
    }

    return this.cloneLayer({
      ...layer,
      visible: layer.visible ?? true,
    });
  }

  private cloneLayer(layer: FeatureLayer): FeatureLayer {
    return structuredClone(layer);
  }
}

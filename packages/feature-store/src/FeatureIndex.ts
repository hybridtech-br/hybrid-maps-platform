import type {
  BoundingBox,
  Feature,
  FeatureId,
  Geometry,
  Position,
} from "./GeoJSON.js";

export interface IndexedFeature {
  id: FeatureId;
  bbox: BoundingBox;
}

export interface FeatureIndexAdapter {
  insert(feature: Feature): void;
  update(feature: Feature): void;
  remove(featureId: FeatureId): boolean;
  search(bbox: BoundingBox): FeatureId[];
  clear(): void;
  count(): number;
}

/**
 * Dependency-free spatial index for the first Feature Store version.
 *
 * Searches are currently linear. The public adapter contract allows this
 * implementation to be replaced later by RBush, Flatbush or another index
 * without changing FeatureStore consumers.
 */
export class FeatureIndex implements FeatureIndexAdapter {
  private readonly entries = new Map<FeatureId, IndexedFeature>();

  insert(feature: Feature): void {
    if (this.entries.has(feature.id)) {
      throw new Error(`Feature with id "${feature.id}" is already indexed.`);
    }

    this.entries.set(feature.id, this.createEntry(feature));
  }

  update(feature: Feature): void {
    this.entries.set(feature.id, this.createEntry(feature));
  }

  remove(featureId: FeatureId): boolean {
    return this.entries.delete(featureId);
  }

  search(bbox: BoundingBox): FeatureId[] {
    this.validateBoundingBox(bbox);

    return Array.from(this.entries.values())
      .filter((entry) => this.intersects(entry.bbox, bbox))
      .map((entry) => entry.id);
  }

  getBoundingBox(featureId: FeatureId): BoundingBox | undefined {
    const bbox = this.entries.get(featureId)?.bbox;
    return bbox ? [...bbox] as BoundingBox : undefined;
  }

  has(featureId: FeatureId): boolean {
    return this.entries.has(featureId);
  }

  clear(): void {
    this.entries.clear();
  }

  count(): number {
    return this.entries.size;
  }

  private createEntry(feature: Feature): IndexedFeature {
    const bbox = feature.bbox ?? this.computeGeometryBoundingBox(feature.geometry);

    if (!bbox) {
      throw new Error(`Feature with id "${feature.id}" has no indexable geometry.`);
    }

    this.validateBoundingBox(bbox);
    return { id: feature.id, bbox: [...bbox] as BoundingBox };
  }

  private computeGeometryBoundingBox(geometry: Geometry | null): BoundingBox | undefined {
    if (!geometry) {
      return undefined;
    }

    const positions = this.collectPositions(geometry);

    if (positions.length === 0) {
      return undefined;
    }

    let west = Number.POSITIVE_INFINITY;
    let south = Number.POSITIVE_INFINITY;
    let east = Number.NEGATIVE_INFINITY;
    let north = Number.NEGATIVE_INFINITY;

    for (const position of positions) {
      const [longitude, latitude] = position;
      west = Math.min(west, longitude);
      south = Math.min(south, latitude);
      east = Math.max(east, longitude);
      north = Math.max(north, latitude);
    }

    return [west, south, east, north];
  }

  private collectPositions(geometry: Geometry): Position[] {
    switch (geometry.type) {
      case "Point":
        return [geometry.coordinates];
      case "MultiPoint":
      case "LineString":
        return geometry.coordinates;
      case "MultiLineString":
      case "Polygon":
        return geometry.coordinates.flat();
      case "MultiPolygon":
        return geometry.coordinates.flat(2);
      case "GeometryCollection":
        return geometry.geometries.flatMap((item) => this.collectPositions(item));
    }
  }

  private intersects(a: BoundingBox, b: BoundingBox): boolean {
    return a[0] <= b[2] && a[2] >= b[0] && a[1] <= b[3] && a[3] >= b[1];
  }

  private validateBoundingBox(bbox: BoundingBox): void {
    const [west, south, east, north] = bbox;

    if (![west, south, east, north].every(Number.isFinite)) {
      throw new Error("Bounding box values must be finite numbers.");
    }

    if (west > east || south > north) {
      throw new Error("Bounding box minimum values cannot exceed maximum values.");
    }
  }
}

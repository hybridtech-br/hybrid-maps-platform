import type { FeatureId } from "./GeoJSON.js";

export class SelectionStore {
  private readonly selected = new Set<FeatureId>();

  select(featureId: FeatureId): boolean {
    const previousSize = this.selected.size;
    this.selected.add(featureId);
    return this.selected.size !== previousSize;
  }

  selectMany(featureIds: Iterable<FeatureId>): number {
    let added = 0;

    for (const featureId of featureIds) {
      if (this.select(featureId)) {
        added += 1;
      }
    }

    return added;
  }

  deselect(featureId: FeatureId): boolean {
    return this.selected.delete(featureId);
  }

  deselectMany(featureIds: Iterable<FeatureId>): number {
    let removed = 0;

    for (const featureId of featureIds) {
      if (this.deselect(featureId)) {
        removed += 1;
      }
    }

    return removed;
  }

  toggle(featureId: FeatureId): boolean {
    if (this.selected.has(featureId)) {
      this.selected.delete(featureId);
      return false;
    }

    this.selected.add(featureId);
    return true;
  }

  replace(featureIds: Iterable<FeatureId>): void {
    this.selected.clear();
    this.selectMany(featureIds);
  }

  isSelected(featureId: FeatureId): boolean {
    return this.selected.has(featureId);
  }

  getSelected(): FeatureId[] {
    return Array.from(this.selected);
  }

  clear(): void {
    this.selected.clear();
  }

  count(): number {
    return this.selected.size;
  }
}

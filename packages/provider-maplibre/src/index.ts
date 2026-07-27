import { BoundingBox, Coordinate, Viewport, type Geometry } from "@hybrid/maps-core";
import {
  createProviderCapabilities,
  type CreateMapOptions,
  type ICameraAdapter,
  type IControlAdapter,
  type ILayerAdapter,
  type IMapAdapter,
  type IMapProvider,
  type IMarkerAdapter,
  type IPopupAdapter,
  type LayerDefinition,
  type MarkerDefinition,
  type PopupDefinition,
  type ProviderMetadata,
} from "@hybrid/maps-provider-sdk";
import maplibregl, {
  type ControlPosition,
  type GeoJSONSourceSpecification,
  type IControl,
  type LngLatBoundsLike,
  type Map as MapLibreMap,
  type MapOptions,
  type StyleSpecification,
} from "maplibre-gl";

const DEFAULT_STYLE = "https://demotiles.maplibre.org/style.json";

function coordinateToLngLat(coordinate: Coordinate): [number, number] {
  return [coordinate.longitude, coordinate.latitude];
}

function viewportToCamera(viewport: Viewport) {
  return {
    center: coordinateToLngLat(viewport.center),
    zoom: viewport.zoom,
    bearing: viewport.bearing,
    pitch: viewport.pitch,
  } as const;
}

function geometryToGeoJson(geometry: Geometry): GeoJSON.Geometry {
  switch (geometry.type) {
    case "Point":
      return { type: "Point", coordinates: coordinateToLngLat(geometry.coordinates) };
    case "LineString":
      return { type: "LineString", coordinates: geometry.coordinates.map(coordinateToLngLat) };
    case "Polygon":
      return { type: "Polygon", coordinates: geometry.coordinates.map((ring) => ring.map(coordinateToLngLat)) };
  }
}

function resolveContainer(container: HTMLElement | string): HTMLElement | string {
  if (typeof container !== "string") return container;
  const selector = container.trim();
  if (!selector) throw new Error("Map container selector must not be empty.");
  return selector.startsWith("#") ? selector.slice(1) : selector;
}

function resolveStyle(options: CreateMapOptions): string | StyleSpecification {
  if (options.style?.url) return options.style.url;
  if (options.style?.data) return options.style.data as unknown as StyleSpecification;
  return DEFAULT_STYLE;
}

class MapLibreCameraAdapter implements ICameraAdapter {
  public constructor(private readonly map: MapLibreMap) {}
  public async flyTo(viewport: Viewport): Promise<void> { this.map.flyTo(viewportToCamera(viewport)); }
  public async easeTo(viewport: Viewport): Promise<void> { this.map.easeTo(viewportToCamera(viewport)); }
  public async fitBounds(bounds: BoundingBox): Promise<void> {
    const value: LngLatBoundsLike = [[bounds.west, bounds.south], [bounds.east, bounds.north]];
    this.map.fitBounds(value);
  }
}

class MapLibreLayerAdapter implements ILayerAdapter {
  readonly #ownedSources = new Map<string, string>();
  public constructor(private readonly map: MapLibreMap) {}

  public async add(layer: LayerDefinition): Promise<void> {
    if (this.exists(layer.id)) throw new Error(`Layer ${layer.id} already exists.`);
    let source: string;
    if (typeof layer.source === "string") source = layer.source;
    else {
      source = `${layer.id}--source`;
      const data = "type" in layer.source
        ? { type: "Feature", properties: {}, geometry: geometryToGeoJson(layer.source as Geometry) }
        : layer.source;
      this.map.addSource(source, {
        type: "geojson",
        data: data as GeoJSON.Feature | GeoJSON.FeatureCollection,
      } satisfies GeoJSONSourceSpecification);
      this.#ownedSources.set(layer.id, source);
    }
    this.map.addLayer({
      id: layer.id,
      type: layer.type === "custom" ? "circle" : layer.type,
      source,
      paint: layer.paint,
      layout: layer.layout,
      minzoom: layer.minZoom,
      maxzoom: layer.maxZoom,
    } as maplibregl.LayerSpecification);
  }

  public async remove(id: string): Promise<void> {
    if (this.map.getLayer(id)) this.map.removeLayer(id);
    const source = this.#ownedSources.get(id);
    if (source && this.map.getSource(source)) this.map.removeSource(source);
    this.#ownedSources.delete(id);
  }
  public exists(id: string): boolean { return Boolean(this.map.getLayer(id)); }
}

class MapLibreMarkerAdapter implements IMarkerAdapter {
  readonly #markers = new Map<string, maplibregl.Marker>();
  public constructor(private readonly map: MapLibreMap) {}
  public async add(definition: MarkerDefinition): Promise<void> {
    if (this.#markers.has(definition.id)) throw new Error(`Marker ${definition.id} already exists.`);
    const marker = new maplibregl.Marker({ element: definition.element, draggable: definition.draggable ?? false })
      .setLngLat(coordinateToLngLat(definition.coordinate)).addTo(this.map);
    this.#markers.set(definition.id, marker);
  }
  public async remove(id: string): Promise<void> { this.#markers.get(id)?.remove(); this.#markers.delete(id); }
  public async clear(): Promise<void> { for (const marker of this.#markers.values()) marker.remove(); this.#markers.clear(); }
}

class MapLibrePopupAdapter implements IPopupAdapter {
  readonly #popups = new Map<string, maplibregl.Popup>();
  public constructor(private readonly map: MapLibreMap) {}
  public async open(definition: PopupDefinition): Promise<void> {
    await this.close(definition.id);
    const popup = new maplibregl.Popup({ closeButton: definition.closeButton ?? true, closeOnClick: definition.closeOnClick ?? true })
      .setLngLat(coordinateToLngLat(definition.coordinate));
    if (typeof definition.content === "string") popup.setText(definition.content); else popup.setDOMContent(definition.content);
    popup.addTo(this.map);
    this.#popups.set(definition.id, popup);
  }
  public async close(id: string): Promise<void> { this.#popups.get(id)?.remove(); this.#popups.delete(id); }
  public async closeAll(): Promise<void> { for (const popup of this.#popups.values()) popup.remove(); this.#popups.clear(); }
}

class MapLibreControlAdapter implements IControlAdapter {
  readonly #controls = new Map<string, IControl>();
  public constructor(private readonly map: MapLibreMap) {}
  public async add(id: string, control: unknown, position?: string): Promise<void> {
    if (this.#controls.has(id)) throw new Error(`Control ${id} already exists.`);
    const typed = control as IControl;
    this.map.addControl(typed, position as ControlPosition | undefined);
    this.#controls.set(id, typed);
  }
  public async remove(id: string): Promise<void> {
    const control = this.#controls.get(id);
    if (control) this.map.removeControl(control);
    this.#controls.delete(id);
  }
}

export class MapLibreMapAdapter implements IMapAdapter {
  public readonly camera: ICameraAdapter;
  public readonly layers: ILayerAdapter;
  public readonly markers: IMarkerAdapter;
  public readonly popups: IPopupAdapter;
  public readonly controls: IControlAdapter;
  public constructor(private readonly map: MapLibreMap) {
    this.camera = new MapLibreCameraAdapter(map);
    this.layers = new MapLibreLayerAdapter(map);
    this.markers = new MapLibreMarkerAdapter(map);
    this.popups = new MapLibrePopupAdapter(map);
    this.controls = new MapLibreControlAdapter(map);
  }
  public setCenter(center: Coordinate): void { this.map.setCenter(coordinateToLngLat(center)); }
  public getCenter(): Coordinate { const center = this.map.getCenter(); return new Coordinate(center.lng, center.lat); }
  public setZoom(zoom: number): void { this.map.setZoom(zoom); }
  public getZoom(): number { return this.map.getZoom(); }
  public resize(): void { this.map.resize(); }
  public async destroy(): Promise<void> { await this.markers.clear(); await this.popups.closeAll(); this.map.remove(); }
}

export class MapLibreProvider implements IMapProvider {
  public readonly metadata: ProviderMetadata = Object.freeze({
    id: "maplibre",
    name: "MapLibre GL JS",
    version: "5",
    capabilities: createProviderCapabilities({
      rendering: true, markers: true, popups: true, vectorTiles: true,
      rasterTiles: true, terrain: true, geolocation: true,
    }),
  });
  readonly #maps = new Set<MapLibreMapAdapter>();
  #initialized = false;
  public async initialize(): Promise<void> { this.#initialized = true; }
  public async createMap(options: CreateMapOptions): Promise<IMapAdapter> {
    if (!this.#initialized) throw new Error("MapLibre provider must be initialized before creating maps.");
    const mapOptions: MapOptions = {
      container: resolveContainer(options.container), style: resolveStyle(options),
      ...viewportToCamera(options.viewport), interactive: options.interactive ?? true,
    };
    const map = new maplibregl.Map(mapOptions);
    const adapter = new MapLibreMapAdapter(map);
    this.#maps.add(adapter);
    map.once("remove", () => this.#maps.delete(adapter));
    return adapter;
  }
  public async dispose(): Promise<void> {
    for (const map of [...this.#maps]) await map.destroy();
    this.#maps.clear();
    this.#initialized = false;
  }
}

export function createMapLibreProvider(): MapLibreProvider { return new MapLibreProvider(); }

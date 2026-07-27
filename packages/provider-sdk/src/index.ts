import type { BoundingBox, Coordinate, Geometry, Viewport } from "@hybrid/maps-core";

export const PROVIDER_CAPABILITIES = [
  "rendering",
  "markers",
  "popups",
  "clustering",
  "terrain",
  "routing",
  "heatmap",
  "vectorTiles",
  "rasterTiles",
  "drawing",
  "geolocation",
  "offline",
] as const;

export type ProviderCapability = (typeof PROVIDER_CAPABILITIES)[number];
export type ProviderCapabilities = Readonly<Record<ProviderCapability, boolean>>;

export interface ProviderMetadata {
  readonly id: string;
  readonly name: string;
  readonly version: string;
  readonly capabilities: ProviderCapabilities;
}

export interface MapStyleDefinition {
  readonly id?: string;
  readonly url?: string;
  readonly data?: Readonly<Record<string, unknown>>;
}

export interface CreateMapOptions {
  readonly container: HTMLElement | string;
  readonly viewport: Viewport;
  readonly style?: MapStyleDefinition;
  readonly interactive?: boolean;
}

export interface LayerDefinition {
  readonly id: string;
  readonly type: "circle" | "line" | "fill" | "symbol" | "raster" | "custom";
  readonly source: Geometry | Readonly<Record<string, unknown>> | string;
  readonly paint?: Readonly<Record<string, unknown>>;
  readonly layout?: Readonly<Record<string, unknown>>;
  readonly minZoom?: number;
  readonly maxZoom?: number;
}

export interface MarkerDefinition {
  readonly id: string;
  readonly coordinate: Coordinate;
  readonly element?: HTMLElement;
  readonly draggable?: boolean;
  readonly metadata?: Readonly<Record<string, unknown>>;
}

export interface PopupDefinition {
  readonly id: string;
  readonly coordinate: Coordinate;
  readonly content: string | HTMLElement;
  readonly closeButton?: boolean;
  readonly closeOnClick?: boolean;
}

export interface ICameraAdapter {
  flyTo(viewport: Viewport): Promise<void>;
  easeTo(viewport: Viewport): Promise<void>;
  fitBounds(bounds: BoundingBox): Promise<void>;
}

export interface ILayerAdapter {
  add(layer: LayerDefinition): Promise<void>;
  remove(id: string): Promise<void>;
  exists(id: string): boolean;
}

export interface IMarkerAdapter {
  add(marker: MarkerDefinition): Promise<void>;
  remove(id: string): Promise<void>;
  clear(): Promise<void>;
}

export interface IPopupAdapter {
  open(popup: PopupDefinition): Promise<void>;
  close(id: string): Promise<void>;
  closeAll(): Promise<void>;
}

export interface IControlAdapter {
  add(id: string, control: unknown, position?: string): Promise<void>;
  remove(id: string): Promise<void>;
}

export interface IMapAdapter {
  readonly camera: ICameraAdapter;
  readonly layers: ILayerAdapter;
  readonly markers: IMarkerAdapter;
  readonly popups: IPopupAdapter;
  readonly controls: IControlAdapter;
  setCenter(center: Coordinate): void;
  getCenter(): Coordinate;
  setZoom(zoom: number): void;
  getZoom(): number;
  resize(): void;
  destroy(): Promise<void>;
}

export interface IMapProvider {
  readonly metadata: ProviderMetadata;
  initialize(): Promise<void>;
  createMap(options: CreateMapOptions): Promise<IMapAdapter>;
  dispose(): Promise<void>;
}

export type ProviderFactory = () => IMapProvider | Promise<IMapProvider>;

export class ProviderContractError extends Error {
  public constructor(message: string) {
    super(message);
    this.name = "ProviderContractError";
  }
}

export function createProviderCapabilities(
  overrides: Partial<Record<ProviderCapability, boolean>> = {},
): ProviderCapabilities {
  return Object.freeze(
    Object.fromEntries(
      PROVIDER_CAPABILITIES.map((capability) => [capability, overrides[capability] ?? false]),
    ) as Record<ProviderCapability, boolean>,
  );
}

export function validateProviderMetadata(metadata: ProviderMetadata): void {
  if (!metadata.id.trim()) throw new ProviderContractError("Provider id must not be empty.");
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(metadata.id)) {
    throw new ProviderContractError("Provider id must use lowercase kebab-case.");
  }
  if (!metadata.name.trim()) throw new ProviderContractError("Provider name must not be empty.");
  if (!metadata.version.trim()) throw new ProviderContractError("Provider version must not be empty.");

  for (const capability of PROVIDER_CAPABILITIES) {
    if (typeof metadata.capabilities[capability] !== "boolean") {
      throw new ProviderContractError(`Capability ${capability} must be boolean.`);
    }
  }

  if (!metadata.capabilities.rendering) {
    throw new ProviderContractError("A map provider must support the rendering capability.");
  }
}

export class ProviderRegistry {
  readonly #factories = new Map<string, ProviderFactory>();
  readonly #instances = new Map<string, IMapProvider>();
  readonly #initializing = new Map<string, Promise<IMapProvider>>();

  public register(id: string, factory: ProviderFactory): void {
    if (!id.trim()) throw new ProviderContractError("Provider id must not be empty.");
    if (this.#factories.has(id)) throw new ProviderContractError(`Provider ${id} is already registered.`);
    this.#factories.set(id, factory);
  }

  public has(id: string): boolean {
    return this.#factories.has(id);
  }

  public list(): readonly string[] {
    return Object.freeze([...this.#factories.keys()]);
  }

  public async resolve(id: string): Promise<IMapProvider> {
    const existing = this.#instances.get(id);
    if (existing) return existing;

    const pending = this.#initializing.get(id);
    if (pending) return pending;

    const factory = this.#factories.get(id);
    if (!factory) throw new ProviderContractError(`Provider ${id} is not registered.`);

    const initialization = Promise.resolve(factory()).then(async (provider) => {
      validateProviderMetadata(provider.metadata);
      if (provider.metadata.id !== id) {
        throw new ProviderContractError(
          `Registered provider id ${id} does not match metadata id ${provider.metadata.id}.`,
        );
      }
      await provider.initialize();
      this.#instances.set(id, provider);
      this.#initializing.delete(id);
      return provider;
    }).catch((error) => {
      this.#initializing.delete(id);
      throw error;
    });

    this.#initializing.set(id, initialization);
    return initialization;
  }

  public async dispose(id?: string): Promise<void> {
    const entries = id
      ? [[id, this.#instances.get(id)] as const]
      : [...this.#instances.entries()];

    for (const [providerId, provider] of entries.reverse()) {
      if (!provider) continue;
      await provider.dispose();
      this.#instances.delete(providerId);
    }
  }
}

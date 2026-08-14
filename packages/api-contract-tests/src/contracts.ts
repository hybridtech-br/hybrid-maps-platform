import {
  BoundingBox,
  Coordinate,
  Viewport,
  type CoordinateInput,
  type CrsCode,
  type Geometry as CoreGeometry,
  type Projection,
} from "@hybrid/maps-core";
import {
  GeometryFactory,
  createCoordinate,
  createLineString,
  createPolygon,
  distanceMeters,
  initialBearing,
  lineStringLength,
  type BoundingBox as SpatialBoundingBox,
  type Geometry as SpatialGeometry,
} from "@hybrid/maps-spatial-engine";
import {
  ProviderRegistry,
  createProviderCapabilities,
  type CreateMapOptions,
  type IMapAdapter,
  type IMapProvider,
  type LayerDefinition,
  type MarkerDefinition,
  type PopupDefinition,
  type ProviderMetadata,
} from "@hybrid/maps-provider-sdk";
import {
  MapLibreProvider,
  createMapLibreProvider,
} from "@hybrid/maps-provider-maplibre";

const tuple: CoordinateInput = [-43.1729, -22.9068, 0];
const coordinate = Coordinate.from(tuple);
const bounds = new BoundingBox(-44, -24, -42, -22);
const viewport = new Viewport({ center: coordinate, zoom: 12, bearing: 0, pitch: 0, bounds });
const crs: CrsCode = "EPSG:4326";

const pointGeometry: CoreGeometry = { type: "Point", coordinates: coordinate };
const lineGeometry: CoreGeometry = {
  type: "LineString",
  coordinates: [coordinate, new Coordinate(-43, -23)],
};
const polygonGeometry: CoreGeometry = {
  type: "Polygon",
  coordinates: [[coordinate, new Coordinate(-43, -23), new Coordinate(-42.9, -22.9), coordinate]],
};

const projection: Projection = {
  source: crs,
  target: "EPSG:3857",
  project(value) { return value; },
  unproject(value) { return value; },
};

const spatialCoordinate = createCoordinate(-43.1729, -22.9068);
const spatialLine = createLineString([spatialCoordinate, createCoordinate(-43, -23)]);
const spatialPolygon = createPolygon([[
  spatialCoordinate,
  createCoordinate(-43, -23),
  createCoordinate(-42.9, -22.9),
  spatialCoordinate,
]]);
const spatialPoint = GeometryFactory.point(spatialCoordinate);
const spatialGeometry: SpatialGeometry = spatialPoint;
const spatialBounds: SpatialBoundingBox = {
  minLongitude: -44,
  minLatitude: -24,
  maxLongitude: -42,
  maxLatitude: -22,
};

const capabilities = createProviderCapabilities({ rendering: true, markers: true, popups: true });
const metadata: ProviderMetadata = {
  id: "fixture",
  name: "Fixture Provider",
  version: "1",
  capabilities,
};

const layer: LayerDefinition = { id: "point", type: "circle", source: pointGeometry };
const marker: MarkerDefinition = { id: "marker", coordinate };
const popup: PopupDefinition = { id: "popup", coordinate, content: "HYBRID" };
const createOptions: CreateMapOptions = { container: "map", viewport };

class FixtureProvider implements IMapProvider {
  public readonly metadata = metadata;
  public async initialize(): Promise<void> {}
  public async createMap(_options: CreateMapOptions): Promise<IMapAdapter> {
    throw new Error("compile-time fixture only");
  }
  public async dispose(): Promise<void> {}
}

const registry = new ProviderRegistry();
registry.register("fixture", () => new FixtureProvider());

const mapLibre: MapLibreProvider = createMapLibreProvider();

void bounds;
void lineGeometry;
void polygonGeometry;
void projection;
void spatialLine;
void spatialPolygon;
void spatialGeometry;
void spatialBounds;
void distanceMeters(spatialCoordinate, spatialCoordinate);
void lineStringLength(spatialLine);
void initialBearing(spatialCoordinate, spatialCoordinate);
void layer;
void marker;
void popup;
void createOptions;
void registry;
void mapLibre;

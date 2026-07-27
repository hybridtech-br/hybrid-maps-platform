export type Position = [longitude: number, latitude: number] | [longitude: number, latitude: number, altitude: number];

export type BoundingBox = [west: number, south: number, east: number, north: number];

export interface Point {
  type: "Point";
  coordinates: Position;
}

export interface MultiPoint {
  type: "MultiPoint";
  coordinates: Position[];
}

export interface LineString {
  type: "LineString";
  coordinates: Position[];
}

export interface MultiLineString {
  type: "MultiLineString";
  coordinates: Position[][];
}

export interface Polygon {
  type: "Polygon";
  coordinates: Position[][];
}

export interface MultiPolygon {
  type: "MultiPolygon";
  coordinates: Position[][][];
}

export interface GeometryCollection {
  type: "GeometryCollection";
  geometries: Geometry[];
}

export type Geometry =
  | Point
  | MultiPoint
  | LineString
  | MultiLineString
  | Polygon
  | MultiPolygon
  | GeometryCollection;

export type FeatureId = string | number;
export type FeatureProperties = Record<string, unknown> | null;

export interface Feature<
  G extends Geometry | null = Geometry,
  P extends FeatureProperties = FeatureProperties,
> {
  type: "Feature";
  id: FeatureId;
  geometry: G;
  properties: P;
  bbox?: BoundingBox;
}

export interface FeatureCollection<
  G extends Geometry | null = Geometry,
  P extends FeatureProperties = FeatureProperties,
> {
  type: "FeatureCollection";
  features: Array<Feature<G, P>>;
  bbox?: BoundingBox;
}

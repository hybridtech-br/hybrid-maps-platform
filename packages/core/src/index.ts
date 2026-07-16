export type CoordinateInput = readonly [longitude: number, latitude: number, altitude?: number];

export class Coordinate {
  public readonly longitude: number;
  public readonly latitude: number;
  public readonly altitude?: number;

  public constructor(longitude: number, latitude: number, altitude?: number) {
    if (!Number.isFinite(longitude) || longitude < -180 || longitude > 180) {
      throw new RangeError("Longitude must be between -180 and 180 degrees.");
    }
    if (!Number.isFinite(latitude) || latitude < -90 || latitude > 90) {
      throw new RangeError("Latitude must be between -90 and 90 degrees.");
    }
    if (altitude !== undefined && !Number.isFinite(altitude)) {
      throw new RangeError("Altitude must be finite when provided.");
    }

    this.longitude = longitude;
    this.latitude = latitude;
    this.altitude = altitude;
    Object.freeze(this);
  }

  public static from(input: Coordinate | CoordinateInput): Coordinate {
    return input instanceof Coordinate ? input : new Coordinate(input[0], input[1], input[2]);
  }

  public equals(other: Coordinate): boolean {
    return this.longitude === other.longitude && this.latitude === other.latitude && this.altitude === other.altitude;
  }

  public toArray(): CoordinateInput {
    return this.altitude === undefined
      ? [this.longitude, this.latitude]
      : [this.longitude, this.latitude, this.altitude];
  }
}

export class BoundingBox {
  public readonly west: number;
  public readonly south: number;
  public readonly east: number;
  public readonly north: number;

  public constructor(west: number, south: number, east: number, north: number) {
    const southWest = new Coordinate(west, south);
    const northEast = new Coordinate(east, north);
    if (southWest.longitude > northEast.longitude || southWest.latitude > northEast.latitude) {
      throw new RangeError("Bounding box minimum values must not exceed maximum values.");
    }
    this.west = west;
    this.south = south;
    this.east = east;
    this.north = north;
    Object.freeze(this);
  }

  public contains(value: Coordinate | CoordinateInput): boolean {
    const coordinate = Coordinate.from(value);
    return coordinate.longitude >= this.west && coordinate.longitude <= this.east
      && coordinate.latitude >= this.south && coordinate.latitude <= this.north;
  }

  public intersects(other: BoundingBox): boolean {
    return !(other.west > this.east || other.east < this.west || other.south > this.north || other.north < this.south);
  }

  public union(other: BoundingBox): BoundingBox {
    return new BoundingBox(
      Math.min(this.west, other.west),
      Math.min(this.south, other.south),
      Math.max(this.east, other.east),
      Math.max(this.north, other.north),
    );
  }

  public center(): Coordinate {
    return new Coordinate((this.west + this.east) / 2, (this.south + this.north) / 2);
  }
}

export interface ViewportOptions {
  center: Coordinate | CoordinateInput;
  zoom: number;
  bearing?: number;
  pitch?: number;
  bounds?: BoundingBox;
}

export class Viewport {
  public readonly center: Coordinate;
  public readonly zoom: number;
  public readonly bearing: number;
  public readonly pitch: number;
  public readonly bounds?: BoundingBox;

  public constructor(options: ViewportOptions) {
    if (!Number.isFinite(options.zoom) || options.zoom < 0) throw new RangeError("Zoom must be a non-negative finite number.");
    const bearing = options.bearing ?? 0;
    const pitch = options.pitch ?? 0;
    if (!Number.isFinite(bearing)) throw new RangeError("Bearing must be finite.");
    if (!Number.isFinite(pitch) || pitch < 0 || pitch > 85) throw new RangeError("Pitch must be between 0 and 85 degrees.");

    this.center = Coordinate.from(options.center);
    this.zoom = options.zoom;
    this.bearing = ((bearing % 360) + 360) % 360;
    this.pitch = pitch;
    this.bounds = options.bounds;
    Object.freeze(this);
  }
}

export type CrsCode = "EPSG:4326" | "EPSG:3857" | (string & {});

export interface Projection {
  readonly source: CrsCode;
  readonly target: CrsCode;
  project(coordinate: Coordinate): Coordinate;
  unproject(coordinate: Coordinate): Coordinate;
}

export type Geometry =
  | { readonly type: "Point"; readonly coordinates: Coordinate }
  | { readonly type: "LineString"; readonly coordinates: readonly Coordinate[] }
  | { readonly type: "Polygon"; readonly coordinates: readonly (readonly Coordinate[])[] };

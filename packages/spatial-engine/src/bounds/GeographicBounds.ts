import { GeographicCoordinate } from '../coordinates/GeographicCoordinate.js';

export interface GeographicBoundsJson {
  readonly west: number;
  readonly south: number;
  readonly east: number;
  readonly north: number;
}

export class GeographicBounds {
  public readonly west: number;
  public readonly south: number;
  public readonly east: number;
  public readonly north: number;

  public constructor(west: number, south: number, east: number, north: number) {
    const southWest = new GeographicCoordinate(west, south);
    const northEast = new GeographicCoordinate(east, north);

    if (southWest.longitude > northEast.longitude) {
      throw new RangeError(
        'GeographicBounds does not represent antimeridian-crossing bounds; west must not exceed east.',
      );
    }
    if (southWest.latitude > northEast.latitude) {
      throw new RangeError('South latitude must not exceed north latitude.');
    }

    this.west = west;
    this.south = south;
    this.east = east;
    this.north = north;
    Object.freeze(this);
  }

  public contains(coordinate: GeographicCoordinate): boolean {
    return coordinate.longitude >= this.west
      && coordinate.longitude <= this.east
      && coordinate.latitude >= this.south
      && coordinate.latitude <= this.north;
  }

  public intersects(other: GeographicBounds): boolean {
    return !(other.west > this.east
      || other.east < this.west
      || other.south > this.north
      || other.north < this.south);
  }

  public center(): GeographicCoordinate {
    return new GeographicCoordinate(
      this.west / 2 + this.east / 2,
      this.south / 2 + this.north / 2,
    );
  }

  public equals(other: GeographicBounds): boolean {
    return this.west === other.west
      && this.south === other.south
      && this.east === other.east
      && this.north === other.north;
  }

  public toJSON(): GeographicBoundsJson {
    return Object.freeze({
      west: this.west,
      south: this.south,
      east: this.east,
      north: this.north,
    });
  }
}

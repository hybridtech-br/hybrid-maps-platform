export interface GeographicCoordinateJson {
  readonly longitude: number;
  readonly latitude: number;
  readonly altitude?: number;
}

export class GeographicCoordinate {
  public readonly longitude: number;
  public readonly latitude: number;
  public readonly altitude?: number;

  public constructor(longitude: number, latitude: number, altitude?: number) {
    if (!Number.isFinite(longitude) || longitude < -180 || longitude > 180) {
      throw new RangeError('Longitude must be a finite number between -180 and 180 degrees.');
    }
    if (!Number.isFinite(latitude) || latitude < -90 || latitude > 90) {
      throw new RangeError('Latitude must be a finite number between -90 and 90 degrees.');
    }
    if (altitude !== undefined && !Number.isFinite(altitude)) {
      throw new RangeError('Altitude must be finite when provided.');
    }

    this.longitude = longitude;
    this.latitude = latitude;
    this.altitude = altitude;
    Object.freeze(this);
  }

  public equals(other: GeographicCoordinate): boolean {
    return this.longitude === other.longitude
      && this.latitude === other.latitude
      && this.altitude === other.altitude;
  }

  public toJSON(): GeographicCoordinateJson {
    return Object.freeze(
      this.altitude === undefined
        ? { longitude: this.longitude, latitude: this.latitude }
        : { longitude: this.longitude, latitude: this.latitude, altitude: this.altitude },
    );
  }
}

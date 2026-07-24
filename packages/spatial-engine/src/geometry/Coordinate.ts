export interface Coordinate {
  readonly longitude: number;
  readonly latitude: number;
  readonly altitude?: number;
}

export function createCoordinate(longitude:number, latitude:number, altitude?:number): Coordinate {
  return Object.freeze({ longitude, latitude, altitude });
}

export function equalsCoordinate(a: Coordinate, b: Coordinate): boolean {
  return a.longitude === b.longitude && a.latitude === b.latitude && a.altitude === b.altitude;
}

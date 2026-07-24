import type { Coordinate } from './Coordinate.js';

export interface BoundingBox {
  readonly minLongitude:number;
  readonly minLatitude:number;
  readonly maxLongitude:number;
  readonly maxLatitude:number;
}

export function createBoundingBox(minLongitude:number,minLatitude:number,maxLongitude:number,maxLatitude:number):BoundingBox{
 return Object.freeze({minLongitude,minLatitude,maxLongitude,maxLatitude});
}

export function containsCoordinate(bbox:BoundingBox, coordinate:Coordinate):boolean{
 return coordinate.longitude>=bbox.minLongitude && coordinate.longitude<=bbox.maxLongitude && coordinate.latitude>=bbox.minLatitude && coordinate.latitude<=bbox.maxLatitude;
}

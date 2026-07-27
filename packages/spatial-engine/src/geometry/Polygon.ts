import type { Coordinate } from './Coordinate.js';
import type { BoundingBox } from './BoundingBox.js';
import { createBoundingBox } from './BoundingBox.js';

export interface Polygon {
 readonly type:'Polygon';
 readonly rings: readonly (readonly Coordinate[])[];
}

export function createPolygon(rings: readonly (readonly Coordinate[])[]): Polygon {
 if(rings.length===0) throw new Error('Polygon requires at least one ring.');
 return Object.freeze({type:'Polygon', rings:Object.freeze(rings.map(r=>Object.freeze([...r])))});
}

export function polygonBoundingBox(polygon:Polygon):BoundingBox{
 let minLon=Infinity,minLat=Infinity,maxLon=-Infinity,maxLat=-Infinity;
 for(const ring of polygon.rings){for(const c of ring){minLon=Math.min(minLon,c.longitude);minLat=Math.min(minLat,c.latitude);maxLon=Math.max(maxLon,c.longitude);maxLat=Math.max(maxLat,c.latitude);}}
 return createBoundingBox(minLon,minLat,maxLon,maxLat);
}

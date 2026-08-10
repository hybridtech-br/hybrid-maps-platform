export { EPSILON, Precision } from './precision/Precision.js';
export { Vector2, type Vector2Json } from './algebra/Vector2.js';
export { Point2, type Point2Json } from './geometry/Point2.js';
export { Envelope2, type Envelope2Json } from './geometry/Envelope2.js';
export { Segment2, type Segment2Json } from './geometry/Segment2.js';
export { LineString2, type LineString2Json } from './geometry/LineString2.js';
export { LinearRing2, type LinearRing2Json } from './geometry/LinearRing2.js';
export { Polygon2, type Polygon2Json } from './geometry/Polygon2.js';
export { MultiPoint2, type MultiPoint2Json } from './geometry/MultiPoint2.js';
export { MultiLineString2, type MultiLineString2Json } from './geometry/MultiLineString2.js';
export { MultiPolygon2, type MultiPolygon2Json } from './geometry/MultiPolygon2.js';
export {
  GeometryCollection2,
  type Geometry2,
  type Geometry2Json,
  type GeometryCollection2Json,
} from './geometry/GeometryCollection2.js';
export {
  validateGeometry2,
  type GeometryValidationCode2,
  type GeometryValidationIssue2,
  type GeometryValidationResult2,
} from './validation/GeometryValidator2.js';

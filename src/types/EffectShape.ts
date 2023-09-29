export type ConeShape = { type: "cone"; radius: number };
export type CubeShape = { type: "cube"; length: number };
export type CylinderShape = {
  type: "cylinder";
  radius: number;
  height: number;
};
export type LineShape = { type: "line"; length: number; width: number };
export type SphereShape = { type: "sphere"; radius: number };
export type WithinShape = { type: "within"; radius: number };

type EffectShape =
  | ConeShape
  | CubeShape
  | CylinderShape
  | LineShape
  | SphereShape
  | WithinShape;
export default EffectShape;

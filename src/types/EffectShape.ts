export interface ConeShape {
  type: "cone";
  radius: number;
}
export interface CubeShape {
  type: "cube";
  length: number;
}
export interface CylinderShape {
  type: "cylinder";
  radius: number;
  height: number;
}
export interface LineShape {
  type: "line";
  length: number;
  width: number;
}
export interface SphereShape {
  type: "sphere";
  radius: number;
}
export interface WithinShape {
  type: "within";
  radius: number;
}

type EffectShape =
  | ConeShape
  | CubeShape
  | CylinderShape
  | LineShape
  | SphereShape
  | WithinShape;
export default EffectShape;

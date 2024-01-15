import { Feet } from "../flavours";

export interface ConeShape {
  type: "cone";
  radius: Feet;
}
export interface CubeShape {
  type: "cube";
  length: Feet;
}
export interface CylinderShape {
  type: "cylinder";
  radius: Feet;
  height: Feet;
}
export interface LineShape {
  type: "line";
  length: Feet;
  width: Feet;
}
export interface SphereShape {
  type: "sphere";
  radius: Feet;
}
export interface WithinShape {
  type: "within";
  radius: Feet;
}

type EffectShape =
  | ConeShape
  | CubeShape
  | CylinderShape
  | LineShape
  | SphereShape
  | WithinShape;
export default EffectShape;

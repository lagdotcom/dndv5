export type CylinderShape = {
  type: "cylinder";
  radius: number;
  height: number;
};
export type SphereShape = { type: "sphere"; radius: number };
export type WithinShape = { type: "within"; radius: number };

type EffectShape = CylinderShape | SphereShape | WithinShape;
export default EffectShape;

export type SphereShape = { type: "sphere"; radius: number };
export type WithinShape = { type: "within"; radius: number };

type EffectShape = SphereShape | WithinShape;
export default EffectShape;

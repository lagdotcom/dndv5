import { SphereShape } from "./EffectShape";
import Point from "./Point";

export const AreaTags = ["heavily obscured"] as const;
export type AreaTag = (typeof AreaTags)[number];

type EffectSphere = SphereShape & { centre: Point };
export type SpecifiedEffectShape = EffectSphere;

type EffectArea = {
  id: number;
  name: string;
  tags: Set<AreaTag>;
} & SpecifiedEffectShape;
export default EffectArea;

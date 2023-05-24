import { SphereShape } from "./EffectShape";
import Point from "./Point";

export const AreaTags = ["heavily obscured"] as const;
export type AreaTag = (typeof AreaTags)[number];

type EffectSphere = SphereShape & { centre: Point };
export type SpecifiedEffectShape = EffectSphere;

export default interface EffectArea extends SpecifiedEffectShape {
  id: number;
  name: string;
  tags: Set<AreaTag>;
}

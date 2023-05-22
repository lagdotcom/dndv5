import { SphereShape } from "./EffectShape";
import Point from "./Point";

export const AreaTags = ["heavily obscured"] as const;
export type AreaTag = (typeof AreaTags)[number];

type EffectSphere = SphereShape & { centre: Point };

type EffectArea = {
  id: number;
  name: string;
  tags: Set<AreaTag>;
} & EffectSphere;
export default EffectArea;

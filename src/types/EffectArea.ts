import Combatant from "./Combatant";
import { CylinderShape, SphereShape, WithinShape } from "./EffectShape";
import Point from "./Point";
import Source from "./Source";

export const AreaTags = ["heavily obscured"] as const;
export type AreaTag = (typeof AreaTags)[number];

export type SpecifiedCylinder = CylinderShape & { centre: Point };
export type SpecifiedSphere = SphereShape & { centre: Point };
export type SpecifiedWithin = WithinShape & {
  target: Combatant;
  position: Point;
};
export type SpecifiedEffectShape =
  | SpecifiedCylinder
  | SpecifiedSphere
  | SpecifiedWithin;

export default interface EffectArea extends Source {
  id: number;
  tags: Set<AreaTag>;
  shape: SpecifiedEffectShape;
}

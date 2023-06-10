import Combatant from "./Combatant";
import {
  ConeShape,
  CylinderShape,
  LineShape,
  SphereShape,
  WithinShape,
} from "./EffectShape";
import Point from "./Point";
import Source from "./Source";

export const AreaTags = [
  "difficult terrain",
  "heavily obscured",
  "holy",
] as const;
export type AreaTag = (typeof AreaTags)[number];

export type SpecifiedCone = ConeShape & { centre: Point; target: Point };
export type SpecifiedCylinder = CylinderShape & { centre: Point };
export type SpecifiedLine = LineShape & { start: Point; target: Point };
export type SpecifiedSphere = SphereShape & { centre: Point };
export type SpecifiedWithin = WithinShape & {
  target: Combatant;
  position: Point;
};
export type SpecifiedEffectShape =
  | SpecifiedCone
  | SpecifiedCylinder
  | SpecifiedLine
  | SpecifiedSphere
  | SpecifiedWithin;

export default interface EffectArea extends Source {
  id: number;
  tags: Set<AreaTag>;
  shape: SpecifiedEffectShape;
}

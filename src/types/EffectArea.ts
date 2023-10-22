import Combatant from "./Combatant";
import {
  ConeShape,
  CubeShape,
  CylinderShape,
  LineShape,
  SphereShape,
  WithinShape,
} from "./EffectShape";
import Point from "./Point";
import Source from "./Source";

export const AreaTags = [
  "difficult terrain",
  "dim light",
  "heavily obscured",
  "holy",
  "lightly obscured",
  "plants",
  "silenced",
] as const;
export type AreaTag = (typeof AreaTags)[number];
export const arSet = (...items: AreaTag[]) => new Set(items);

export type SpecifiedCone = ConeShape & { centre: Point; target: Point };
export type SpecifiedCube = CubeShape & { centre: Point };
export type SpecifiedCylinder = CylinderShape & { centre: Point };
export type SpecifiedLine = LineShape & { start: Point; target: Point };
export type SpecifiedSphere = SphereShape & { centre: Point };
export type SpecifiedWithin = WithinShape & { who: Combatant };
export type SpecifiedEffectShape =
  | SpecifiedCone
  | SpecifiedCube
  | SpecifiedCylinder
  | SpecifiedLine
  | SpecifiedSphere
  | SpecifiedWithin;

export default interface EffectArea extends Source {
  id: number;
  tags: Set<AreaTag>;
  shape: SpecifiedEffectShape;
  tint: string;
}

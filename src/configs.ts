import Combatant from "./types/Combatant";
import { WeaponItem } from "./types/Item";
import Point from "./types/Point";

export type HasTarget = { target: Combatant };
export type HasTargets = { targets: Combatant[] };

export type HasPoint = { point: Point };
export type HasPoints = { points: Point[] };

export type HasWeapon = { weapon: WeaponItem };

export type Scales = { slot: number };

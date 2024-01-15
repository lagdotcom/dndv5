import { SpellSlot } from "./flavours";
import { Allocation } from "./resolvers/AllocationResolver";
import Combatant from "./types/Combatant";
import Item, { WeaponItem } from "./types/Item";
import Point from "./types/Point";
import SpellcastingMethod from "./types/SpellcastingMethod";

export interface HasAllocations<T extends number = number> {
  targets: Allocation<T>[];
}

export interface HasCaster {
  caster: Combatant;
  method: SpellcastingMethod;
}

export interface HasTarget {
  target: Combatant;
}
export interface HasTargets {
  targets: Combatant[];
}

export interface HasPoint {
  point: Point;
}
export interface HasPoints {
  points: Point[];
}

export interface HasWeapon {
  weapon: WeaponItem;
}

export interface Scales {
  slot: SpellSlot;
}

export interface HasItem {
  item: Item;
}

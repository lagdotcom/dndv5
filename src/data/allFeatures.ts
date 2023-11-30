import Lucky from "../feats/Lucky";
import { BoonOfVassetri } from "../features/boons";
import FightingStyleArchery from "../features/fightingStyles/Archery";
import BlindFighting from "../features/fightingStyles/BlindFighting";
import Defense from "../features/fightingStyles/Defense";
import Dueling from "../features/fightingStyles/Dueling";
import Protection from "../features/fightingStyles/Protection";

const allFeatures = {
  "Boon of Vassetri": BoonOfVassetri,
  "Fighting Style: Archery": FightingStyleArchery,
  "Fighting Style: Blind Fighting": BlindFighting,
  "Fighting Style: Defense": Defense,
  "Fighting Style: Dueling": Dueling,
  "Fighting Style: Protection": Protection,
  Lucky,
} as const;
export default allFeatures;

export type FeatureName = keyof typeof allFeatures;
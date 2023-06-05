import { notImplementedFeature } from "../features/common";

export const KeenSmell = notImplementedFeature(
  "Keen Smell",
  `This has advantage on Wisdom (Perception) checks that rely on smell.`
);

export const PackTactics = notImplementedFeature(
  "Pack Tactics",
  `This has advantage on an attack roll against a creature if at least one of its allies is within 5 feet of the creature and the ally isn't incapacitated.`
);

export function makeMultiattack(text: string) {
  return notImplementedFeature("Multiattack", text);
}

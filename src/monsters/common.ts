import { notImplementedFeature } from "../features/common";
import SimpleFeature from "../features/SimpleFeature";

export const KeenSmell = new SimpleFeature(
  "Keen Smell",
  `This has advantage on Wisdom (Perception) checks that rely on smell.`,
  (g, me) => {
    g.events.on("BeforeCheck", ({ detail: { who, tags, diceType } }) => {
      if (who === me && tags.has("smell")) diceType.add("advantage", KeenSmell);
    });
  }
);

export const PackTactics = notImplementedFeature(
  "Pack Tactics",
  `This has advantage on an attack roll against a creature if at least one of its allies is within 5 feet of the creature and the ally isn't incapacitated.`
);

export function makeMultiattack(text: string) {
  return notImplementedFeature("Multiattack", text);
}

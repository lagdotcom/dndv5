import { LanguageNames } from "../types/LanguageName";
import PCBackground from "../types/PCBackground";
import { Instruments } from "../types/ToolName";
import { gains } from "../utils/gain";

const Outlander: PCBackground = {
  name: "Outlander",
  description: `You grew up in the wilds, far from civilization and the comforts of town and technology. You've witnessed the migration of herds larger than forests, survived weather more extreme than any city-dweller could comprehend, and enjoyed the solitude of being the only thinking creature for miles in any direction. The wilds are in your blood, whether you were a nomad, an explorer, a recluse, a hunter-gatherer, or even a marauder. Even in places where you don't know the specific features of the terrain, you know the ways of the wild.`,
  feature: {
    name: "Wanderer",
    description: `You have an excellent memory for maps and geography, and you can always recall the general layout of terrain, settlements, and other features around you. In addition, you can find food and fresh water for yourself and up to five other people each day, provided that the land offers berries, small game, water, and so forth.`,
  },
  skills: gains(["Athletics", "Survival"]),
  tools: gains([], 1, Instruments),
  languages: gains([], 1, LanguageNames),
};
export default Outlander;

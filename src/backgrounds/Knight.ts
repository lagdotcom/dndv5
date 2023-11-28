import { LanguageNames } from "../types/LanguageName";
import PCBackground from "../types/PCBackground";
import { GamingSets } from "../types/ToolName";
import { gains } from "../utils/gain";

const Knight: PCBackground = {
  name: "Knight",
  description: `
  A knighthood is among the lowest noble titles in most societies, but it can be a path to higher status. If you wish to be a knight, choose the Retainers feature (see the sidebar) instead of the Position of Privilege feature. One of your commoner retainers is replaced by a noble who serves as your squire, aiding you in exchange for training on his or her own path to knighthood. Your two remaining retainers might include a groom to care for your horse and a servant who polishes your armor (and even helps you put it on).
  
  As an emblem of chivalry and the ideals of courtly love, you might include among your equipment a banner or other token from a noble lord or lady to whom you have given your heart—in a chaste sort of devotion. (This person could be your bond.)`,
  feature: {
    name: "Retainers",
    description: `A knighthood is among the lowest noble titles in most societies, but it can be a path to higher status. If you wish to be a knight, choose the Retainers feature instead of the Position of Privilege feature.

  As an emblem of chivalry and the ideals of courtly love, you might include among your equipment a banner or other token from a noble lord or lady to whom you have given your heart-in a chaste sort of devotion.`,
  },
  skills: gains(["History", "Persuasion"]),
  tools: gains([], 1, GamingSets),
  languages: gains([], 1, LanguageNames),
};
export default Knight;

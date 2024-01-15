import { addMonster } from "../data/templates";
import { DiceRoll, Feet } from "../flavours";
import { ThugConfig } from "../monsters/srd/humanoid";

export const thug = (
  x: Feet,
  y: Feet,
  initiative: DiceRoll,
  weapon: ThugConfig["weapon"] = "mace",
) => addMonster("thug", x, y, { weapon }, initiative);

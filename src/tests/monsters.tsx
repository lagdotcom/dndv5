import { addMonster } from "../data/templates";
import { ThugConfig } from "../monsters/srd/humanoid";

export const thug = (
  x: number,
  y: number,
  initiative: number,
  weapon: ThugConfig["weapon"] = "mace",
) => addMonster("thug", x, y, { weapon }, initiative);

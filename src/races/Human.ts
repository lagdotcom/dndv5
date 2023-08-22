import { laSet } from "../types/LanguageName";
import PCRace from "../types/PCRace";

const Human: PCRace = {
  name: "Human",
  size: "medium",
  abilities: new Map([
    ["str", 1],
    ["dex", 1],
    ["con", 1],
    ["int", 1],
    ["wis", 1],
    ["cha", 1],
  ]),
  movement: new Map([["speed", 30]]),
  languages: laSet("Common"),
};
export default Human;

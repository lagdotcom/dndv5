import { laSet } from "../types/LanguageName";
import PCRace from "../types/PCRace";
import { ExtraLanguage } from "./common";

const Human: PCRace = {
  name: "Human",
  abilities: new Map([
    ["str", 1],
    ["dex", 1],
    ["con", 1],
    ["int", 1],
    ["wis", 1],
    ["cha", 1],
  ]),
  size: "medium",
  movement: new Map([["speed", 30]]),
  languages: laSet("Common"),
  features: new Set([ExtraLanguage]),
};
export default Human;

import Bard from "../../classes/bard";
import Engine from "../../Engine";
import { LeatherArmor } from "../../items/armor";
import { Dagger, Rapier } from "../../items/weapons";
import PC from "../../PC";
import {
  AbilityScoreBonus,
  HalfElf,
  LanguageChoice,
  SkillVersatility,
} from "../../races/HalfElf";

export default class Shaira extends PC {
  constructor(g: Engine) {
    super(g, "Shaira", "");

    this.setAbilityScores(13, 10, 8, 14, 15, 12);
    this.setRace(HalfElf);
    this.setConfig(AbilityScoreBonus, ["int", "wis"]);
    this.setConfig(SkillVersatility, ["Persuasion", "History"]);
    this.setConfig(LanguageChoice, "Dwarvish");
    this.skills.set("Deception", 1);
    this.skills.set("Stealth", 1);
    this.toolProficiencies.set("thieves' tools", 1);
    this.toolProficiencies.set("playing card set", 1);
    this.addClassLevel(Bard);

    this.don(new LeatherArmor(g));
    this.don(new Rapier(g));
    this.inventory.add(new Dagger(g, 1));
  }
}

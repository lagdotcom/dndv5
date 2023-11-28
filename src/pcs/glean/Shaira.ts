import tokenUrl from "@img/tok/pc/shaira.png";

import Bard from "../../classes/bard";
import Engine from "../../Engine";
import { LeatherArmor } from "../../items/armor";
import { Dagger, Rapier } from "../../items/weapons";
import PC from "../../PC";
import { ExtraLanguage } from "../../races/common";
import {
  AbilityScoreBonus,
  HalfElf,
  SkillVersatility,
} from "../../races/HalfElf";
import Thunderclap from "../../spells/cantrip/Thunderclap";
import HealingWord from "../../spells/level1/HealingWord";
import HideousLaughter from "../../spells/level1/HideousLaughter";
import Sleep from "../../spells/level1/Sleep";

export default class Shaira extends PC {
  constructor(g: Engine) {
    super(g, "Shaira", tokenUrl);

    this.setAbilityScores(13, 10, 8, 14, 15, 12);
    this.setRace(HalfElf);
    this.setConfig(AbilityScoreBonus, ["int", "wis"]);
    this.setConfig(SkillVersatility, ["Persuasion", "History"]);
    this.setConfig(ExtraLanguage, "Dwarvish");
    this.addProficiency("Deception", "proficient");
    this.addProficiency("Stealth", "proficient");
    this.addProficiency("thieves' tools", "proficient");
    this.addProficiency("playing card set", "proficient");
    this.addClassLevel(Bard);

    this.don(new LeatherArmor(g));
    this.don(new Rapier(g));
    this.inventory.add(new Dagger(g, 1));

    this.addPreparedSpells(
      // DancingLights,
      Thunderclap,

      // ComprehendLanguages,
      HealingWord,
      HideousLaughter,
      Sleep,
    );
  }
}

import tokenUrl from "@img/tok/pc/galilea.png";

import Paladin, { ASI4, PaladinFightingStyle } from "../../classes/paladin";
import Devotion from "../../classes/paladin/Devotion";
import Engine from "../../Engine";
import FightingStyleProtection from "../../features/fightingStyles/Protection";
import { CrossbowBolt } from "../../items/ammunition";
import { Shield, SplintArmor } from "../../items/armor";
import { WandOfWeb } from "../../items/wands";
import { LightCrossbow, Longsword } from "../../items/weapons";
import FigurineOfWondrousPower from "../../items/wondrous/FigurineOfWondrousPower";
import RingOfAwe from "../../items/wondrous/RingOfAwe";
import SilverShiningAmulet from "../../items/wondrous/SilverShiningAmulet";
import PC from "../../PC";
import Human from "../../races/Human";
import Bless from "../../spells/level1/Bless";
import DivineFavor from "../../spells/level1/DivineFavor";
import ShieldOfFaith from "../../spells/level1/ShieldOfFaith";
import Aid from "../../spells/level2/Aid";
import MagicWeapon from "../../spells/level2/MagicWeapon";

export default class Galilea extends PC {
  constructor(g: Engine) {
    super(g, "Galilea", tokenUrl);

    this.addProficiency("playing card set", "proficient");
    this.setAbilityScores(13, 10, 15, 11, 11, 13);
    this.setRace(Human);
    this.languages.add("Sylvan");

    this.addSubclass(Devotion);
    this.addClassLevel(Paladin);
    this.addClassLevel(Paladin);
    this.addClassLevel(Paladin);
    this.addClassLevel(Paladin);
    this.addClassLevel(Paladin);
    this.addClassLevel(Paladin);
    this.addClassLevel(Paladin);

    this.setConfig(PaladinFightingStyle, FightingStyleProtection);
    this.setConfig(ASI4, { type: "ability", abilities: ["str", "str"] });

    this.addProficiency("Insight", "proficient");
    this.addProficiency("Intimidation", "proficient");
    this.addProficiency("History", "proficient");
    this.addProficiency("Persuasion", "proficient");

    this.don(new Longsword(g));
    this.don(new Shield(g));
    this.don(new SplintArmor(g));
    this.don(new RingOfAwe(g), true);
    this.don(new SilverShiningAmulet(g), true);
    this.inventory.add(new FigurineOfWondrousPower(g, "Silver Raven"));
    const wand = new WandOfWeb(g);
    this.inventory.add(wand);
    this.attunements.add(wand);
    this.inventory.add(new LightCrossbow(g));
    this.inventory.add(new CrossbowBolt(g, 20));

    this.addPreparedSpells(
      Bless,
      DivineFavor,
      ShieldOfFaith,

      Aid,
      MagicWeapon,
    );
  }
}

import Paladin, { ASI4, PaladinFightingStyle } from "../../classes/paladin";
import Devotion from "../../classes/paladin/Devotion";
import Engine from "../../Engine";
import { FightingStyleProtection } from "../../features/fightingStyles";
import { CrossbowBolt } from "../../items/ammunition";
import { Shield, SplintArmor } from "../../items/armor";
import { WandOfWeb } from "../../items/wands";
import { LightCrossbow, Longsword } from "../../items/weapons";
import {
  FigurineOfWondrousPower,
  RingOfAwe,
  SilverShiningAmulet,
} from "../../items/wondrous";
import PC from "../../PC";
import Human from "../../races/Human";
import Bless from "../../spells/level1/Bless";
import DivineFavor from "../../spells/level1/DivineFavor";
import tokenUrl from "./Galilea_token.png";

export default class Galilea extends PC {
  constructor(g: Engine) {
    super(g, "Galilea", tokenUrl);

    this.toolProficiencies.set("playing card set", 1);
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

    this.skills.set("Insight", 1);
    this.skills.set("Intimidation", 1);
    this.skills.set("History", 1);
    this.skills.set("Persuasion", 1);

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
      DivineFavor
      // TODO ShieldOfFaith,

      // TODO Aid,
      // TODO MagicWeapon
    );
  }
}

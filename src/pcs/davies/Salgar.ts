import Druid, { ASI4 } from "../../classes/druid";
import Land, { BonusCantrip, CircleSpells } from "../../classes/druid/Land";
import Engine from "../../Engine";
import { HideArmor } from "../../items/armor";
import { Handaxe, Shortsword, Spear } from "../../items/weapons";
import PC from "../../PC";
import { MountainDwarf, ToolProficiency } from "../../races/Dwarf";
import MagicStone from "../../spells/cantrip/MagicStone";
import tokenUrl from "./Salgar_token.png";

export default class Salgar extends PC {
  constructor(g: Engine) {
    super(g, "Salgar", tokenUrl);

    this.skills.set("Arcana", 1);
    this.skills.set("History", 1);
    this.setAbilityScores(10, 8, 14, 14, 15, 10);
    this.setRace(MountainDwarf);
    this.languages.add("Elvish");
    this.languages.add("Giant");

    this.addSubclass(Land);
    this.addClassLevel(Druid);
    this.addClassLevel(Druid);
    this.addClassLevel(Druid);
    this.addClassLevel(Druid);
    this.addClassLevel(Druid);
    this.addClassLevel(Druid);
    this.addClassLevel(Druid);

    this.setConfig(ToolProficiency, "mason's tools");
    this.setConfig(CircleSpells, "mountain");
    this.setConfig(BonusCantrip, MagicStone);
    this.setConfig(ASI4, { type: "ability", abilities: ["cha", "wis"] });

    this.skills.set("Insight", 1);
    this.skills.set("Survival", 1);

    // TODO this.don(new ArrowCatchingShield(g), true);
    // TODO this.don(new BootsOfTheWinterlands(g), true);
    // TODO this.don(new CloakOfElvenkind(g), true);
    this.don(new Spear(g, 1), true);
    this.don(new HideArmor(g));
    this.inventory.add(new Handaxe(g, 1));
    // TODO silvered
    this.inventory.add(new Shortsword(g));

    this
      .addPreparedSpells
      // TODO Druidcraft,
      // TODO Mending,
      // TODO MoldEarth,

      // TODO DetectMagic,
      // TODO EarthTremor,
      // TODO HealingWord,
      // TODO SpeakWithAnimals,

      // TODO LesserRestoration,
      // TODO LocateObject,
      // TODO Moonbeam,

      // TODO EruptingEarth,

      // TODO CharmMonster,
      // TODO GuardianOfNature
      ();
  }
}

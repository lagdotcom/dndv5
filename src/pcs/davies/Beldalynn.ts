import tokenUrl from "@img/tok/pc/beldalynn.png";

import Sage from "../../backgrounds/Sage";
import Wizard, { ASI4 } from "../../classes/wizard";
import Evocation from "../../classes/wizard/Evocation";
import { chaoticBurst } from "../../enchantments/weapon";
import Engine from "../../Engine";
import { Dagger, Quarterstaff } from "../../items/weapons";
import CloakOfProtection from "../../items/wondrous/CloakOfProtection";
import DragonTouchedFocus from "../../items/wondrous/DragonTouchedFocus";
import PC from "../../PC";
import { BronzeDragonborn } from "../../races/Dragonborn_FTD";
import AcidSplash from "../../spells/cantrip/AcidSplash";
import FireBolt from "../../spells/cantrip/FireBolt";
import MindSliver from "../../spells/cantrip/MindSliver";
import RayOfFrost from "../../spells/cantrip/RayOfFrost";
import IceKnife from "../../spells/level1/IceKnife";
import MagicMissile from "../../spells/level1/MagicMissile";
import Shield from "../../spells/level1/Shield";
import EnlargeReduce from "../../spells/level2/EnlargeReduce";
import HoldPerson from "../../spells/level2/HoldPerson";
import Fireball from "../../spells/level3/Fireball";
import IntellectFortress from "../../spells/level3/IntellectFortress";
import MelfsMinuteMeteors from "../../spells/level3/MelfsMinuteMeteors";
import WallOfFire from "../../spells/level4/WallOfFire";
import { enchant } from "../../utils/items";

export default class Beldalynn extends PC {
  constructor(g: Engine) {
    super(g, "Beldalynn", tokenUrl);

    this.setAbilityScores(11, 13, 13, 15, 13, 8);
    this.setRace(BronzeDragonborn);
    this.dex.score++;
    this.con.score++;
    this.str.score++;
    this.languages.add("Draconic");

    this.setBackground(Sage);
    this.addProficiency("Perception", "proficient");
    this.languages.add("Elvish");
    this.languages.add("Infernal");

    this.addClassLevel(Wizard);
    this.addProficiency("Arcana", "proficient");
    this.addProficiency("Investigation", "proficient");

    this.addSubclass(Evocation);
    this.addClassLevel(Wizard);
    this.addClassLevel(Wizard);
    this.addClassLevel(Wizard);
    this.addClassLevel(Wizard);
    this.addClassLevel(Wizard);
    this.addClassLevel(Wizard);

    this.setConfig(ASI4, { type: "ability", abilities: ["int", "wis"] });

    this.don(new CloakOfProtection(g), true);
    this.don(enchant(new Quarterstaff(g), chaoticBurst), true);
    this.don(new DragonTouchedFocus(g, "Slumbering"), true);
    this.inventory.add(new Dagger(g, 1));

    // this.addKnownSpells(
    //   ComprehendLanguages,
    //   FindFamiliar,
    //   FloatingDisk,
    //   Identify
    // );

    this.addPreparedSpells(
      AcidSplash,
      FireBolt,
      MindSliver,
      RayOfFrost,

      IceKnife,
      MagicMissile,
      Shield,

      EnlargeReduce,
      HoldPerson,
      MelfsMinuteMeteors,

      Fireball,
      IntellectFortress,
      // LeomundsTinyHut,

      WallOfFire,
    );
  }
}

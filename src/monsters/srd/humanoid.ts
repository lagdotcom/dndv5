import acolyteUrl from "@img/tok/acolyte.png";
import archmageUrl from "@img/tok/archmage.png";
import assassinUrl from "@img/tok/assassin.png";
import banditUrl from "@img/tok/bandit.png";
import banditCaptainUrl from "@img/tok/bandit-captain.png";
import berserkerUrl from "@img/tok/berserker.png";
import commonerUrl from "@img/tok/commoner.png";
import cultFanaticUrl from "@img/tok/cult-fanatic.png";
import cultistUrl from "@img/tok/cultist.png";
import druidUrl from "@img/tok/druid.png";
import gladiatorUrl from "@img/tok/gladiator.png";
import thugUrl from "@img/tok/thug.png";

import WeaponAttack, { doStandardAttack } from "../../actions/WeaponAttack";
import { RecklessAttack } from "../../classes/barbarian/RecklessAttack";
import { ClericSpellcasting } from "../../classes/cleric";
import { DruidSpellcasting } from "../../classes/druid";
import SneakAttack from "../../classes/rogue/SneakAttack";
import { WizardSpellcasting } from "../../classes/wizard";
import { HasTarget } from "../../configs";
import { Prone, Surprised } from "../../effects";
import Engine from "../../Engine";
import { bonusSpellsFeature, Brave } from "../../features/common";
import Evasion from "../../features/Evasion";
import SimpleFeature from "../../features/SimpleFeature";
import EvaluateLater from "../../interruptions/EvaluateLater";
import { CrossbowBolt } from "../../items/ammunition";
import {
  HideArmor,
  LeatherArmor,
  Shield,
  StuddedLeatherArmor,
} from "../../items/armor";
import {
  Club,
  Dagger,
  Greataxe,
  HeavyCrossbow,
  ImprovisedWeapon,
  LightCrossbow,
  Mace,
  Quarterstaff,
  Scimitar,
  Shortsword,
  Spear,
} from "../../items/weapons";
import Monster from "../../Monster";
import FireBolt from "../../spells/cantrip/FireBolt";
import ProduceFlame from "../../spells/cantrip/ProduceFlame";
import SacredFlame from "../../spells/cantrip/SacredFlame";
import Shillelagh from "../../spells/cantrip/Shillelagh";
import ShockingGrasp from "../../spells/cantrip/ShockingGrasp";
import Thaumaturgy from "../../spells/cantrip/Thaumaturgy";
import InnateSpellcasting from "../../spells/InnateSpellcasting";
import Bless from "../../spells/level1/Bless";
import Command from "../../spells/level1/Command";
import CureWounds from "../../spells/level1/CureWounds";
import Entangle from "../../spells/level1/Entangle";
import InflictWounds from "../../spells/level1/InflictWounds";
import Longstrider from "../../spells/level1/Longstrider";
import MageArmor from "../../spells/level1/MageArmor";
import MagicMissile from "../../spells/level1/MagicMissile";
import Sanctuary from "../../spells/level1/Sanctuary";
import ShieldOfFaith from "../../spells/level1/ShieldOfFaith";
import Thunderwave from "../../spells/level1/Thunderwave";
import HoldPerson from "../../spells/level2/HoldPerson";
import MirrorImage from "../../spells/level2/MirrorImage";
import MistyStep from "../../spells/level2/MistyStep";
import Counterspell from "../../spells/level3/Counterspell";
import LightningBolt from "../../spells/level3/LightningBolt";
import Stoneskin from "../../spells/level4/Stoneskin";
import ConeOfCold from "../../spells/level5/ConeOfCold";
import { atSet } from "../../types/AttackTag";
import Combatant from "../../types/Combatant";
import { coSet } from "../../types/ConditionName";
import Enchantment from "../../types/Enchantment";
import Item from "../../types/Item";
import Priority from "../../types/Priority";
import SizeCategory from "../../types/SizeCategory";
import {
  Brute,
  MagicResistance,
  PackTactics,
  SpellDamageResistance,
} from "../common";
import { makeBagMultiattack } from "../multiattack";
import Parry from "../Parry";

export class Acolyte extends Monster {
  constructor(g: Engine) {
    super(g, "acolyte", 0.25, "humanoid", SizeCategory.Medium, acolyteUrl, 9);
    this.don(new Club(g), true);
    this.setAbilityScores(10, 10, 10, 10, 14, 11);
    this.addProficiency("Medicine", "proficient");
    this.addProficiency("Religion", "proficient");
    this.languages.add("Common"); // TODO any one language (usually Common)

    this.level = 1;
    this.classLevels.set("Cleric", 1);
    this.addFeature(ClericSpellcasting.feature);
    this.addPreparedSpells(
      // TODO Light,
      SacredFlame,
      Thaumaturgy,
      Bless,
      CureWounds,
      Sanctuary,
    );
  }
}

const ArchmageSpellcastingMethod = new InnateSpellcasting(
  "Archmage Innate Spells",
  "int",
);
const ArchmageSpellcasting = bonusSpellsFeature(
  "Archmage Spellcasting",
  `The archmage can cast disguise self and invisibility at will.`,
  "Wizard",
  ArchmageSpellcastingMethod,
  [
    // TODO { level: 0, spell: DisguiseSelf },
    // TODO { level: 0, spell: Invisibility },
  ],
);

export class Archmage extends Monster {
  constructor(g: Engine) {
    super(g, "archmage", 12, "humanoid", SizeCategory.Medium, archmageUrl, 99);
    this.don(new Dagger(g), true);
    this.setAbilityScores(10, 14, 12, 20, 15, 16);
    this.addProficiency("int", "proficient");
    this.addProficiency("wis", "proficient");
    this.addProficiency("Arcana", "expertise");
    this.addProficiency("History", "expertise");
    this.languages.add("Common"); // TODO any six languages
    this.pb = 4;

    this.addFeature(SpellDamageResistance);

    this.addFeature(MagicResistance);
    this.addFeature(ArchmageSpellcasting);
    this.level = 18;
    this.classLevels.set("Wizard", 18);
    this.addFeature(WizardSpellcasting.feature);
    this.addPreparedSpells(
      FireBolt,
      // TODO Light,
      // TODO MageHand,
      // TODO Prestidigitation,
      ShockingGrasp,
      // TODO DetectMagic,
      // TODO Identify,
      MageArmor,
      MagicMissile,
      // TODO DetectThoughts,
      MirrorImage,
      MistyStep,
      Counterspell,
      // TODO Fly,
      LightningBolt,
      // TODO Banishment,
      // TODO FireShield,
      Stoneskin,
      ConeOfCold,
      // TODO Scrying,
      // TODO WallOfForce,
      // TODO GlobeOfInvulnerability,
      // TODO Teleport,
      // TODO MindBlank,
      // TODO TimeStop,
    );

    // TODO precast spells: mage armor, stoneskin, mind blank
  }
}

const Assassinate = new SimpleFeature(
  "Assassinate",
  `During its first turn, the assassin has advantage on attack rolls against any creature that hasn't taken a turn. Any hit the assassin scores against a surprised creature is a critical hit.`,
  (g, me) => {
    const hasTakenTurn = new Set<Combatant>();
    let hasEndedTurn = false;
    g.events.on("TurnStarted", ({ detail: { who } }) => hasTakenTurn.add(who));
    g.events.on("TurnEnded", ({ detail: { who } }) => {
      if (who === me) hasEndedTurn = true;
    });

    g.events.on("BeforeAttack", ({ detail: { who, target, diceType } }) => {
      if (who === me && !hasEndedTurn && !hasTakenTurn.has(target))
        diceType.add("advantage", Assassinate);
    });

    g.events.on(
      "Attack",
      ({
        detail: {
          roll: {
            type: { who, target },
          },
          outcome,
        },
      }) => {
        if (who === me && target.hasEffect(Surprised) && outcome.hits)
          outcome.add("critical", Assassinate);
      },
    );
  },
);

const AssassinMultiattack = makeBagMultiattack(
  `The assassin makes two shortsword attacks.`,
  [{ weapon: "shortsword" }, { weapon: "shortsword" }],
);

const assassinPoison: Enchantment<"weapon"> = {
  name: "poison",
  setup(g, item) {
    g.events.on(
      "CombatantDamaged",
      ({ detail: { attack, interrupt, who } }) => {
        if (attack?.roll.type.weapon === item) {
          const attacker = attack.roll.type.who;
          const critical = attack.outcome.result === "critical";

          interrupt.add(
            new EvaluateLater(
              who,
              assassinPoison,
              Priority.Normal,
              async () => {
                const damage = await g.rollDamage(7, {
                  size: 6,
                  attacker,
                  damageType: "poison",
                  source: assassinPoison,
                  tags: atSet(),
                  target: who,
                });

                const { damageResponse } = await g.save({
                  source: assassinPoison,
                  type: { type: "flat", dc: 15 },
                  attacker,
                  who,
                  ability: "con",
                  tags: ["poison"],
                });

                await g.damage(
                  assassinPoison,
                  "poison",
                  { attacker, critical, target: who },
                  [["poison", damage]],
                  damageResponse,
                );
              },
            ),
          );
        }
      },
    );
  },
};

export class Assassin extends Monster {
  constructor(g: Engine, wieldingCrossbow = false) {
    super(g, "assassin", 8, "humanoid", SizeCategory.Medium, assassinUrl, 78);
    this.don(new StuddedLeatherArmor(g), true);
    this.setAbilityScores(11, 16, 14, 13, 11, 10);
    this.addProficiency("dex", "proficient");
    this.addProficiency("int", "proficient");
    this.addProficiency("Acrobatics", "proficient");
    this.addProficiency("Deception", "proficient");
    this.addProficiency("Perception", "proficient");
    this.addProficiency("Stealth", "expertise");
    this.damageResponses.set("poison", "resist");
    this.languages.add("Thieves' Cant"); // TODO Thieves' cant plus any two languages
    this.pb = 3;

    this.addFeature(Assassinate);
    this.addFeature(Evasion);
    this.level = 8;
    this.classLevels.set("Rogue", 8);
    this.addFeature(SneakAttack);

    this.addFeature(AssassinMultiattack);

    const sword = new Shortsword(g).addEnchantment(assassinPoison);
    const crossbow = new LightCrossbow(g).addEnchantment(assassinPoison);
    this.give(sword, true);
    this.give(crossbow, true);
    this.don(wieldingCrossbow ? crossbow : sword);
    this.addToInventory(new CrossbowBolt(g), 20);
  }
}

export class Bandit extends Monster {
  constructor(g: Engine, wieldingCrossbow = false) {
    super(g, "bandit", 0.125, "humanoid", SizeCategory.Medium, banditUrl, 11);
    this.don(new LeatherArmor(g), true);
    this.setAbilityScores(11, 12, 12, 10, 10, 10);
    this.languages.add("Common"); // any one language (usually Common)

    const scimitar = new Scimitar(g);
    const crossbow = new LightCrossbow(g);
    this.give(scimitar, true);
    this.give(crossbow, true);
    this.don(wieldingCrossbow ? crossbow : scimitar);
    this.addToInventory(new CrossbowBolt(g), 20);
  }
}

const BanditCaptainMultiattack = makeBagMultiattack(
  `The captain makes three melee attacks: two with its scimitar and one with its dagger. Or the captain makes two ranged attacks with its daggers.`,
  [
    { weapon: "scimitar", range: "melee" },
    { weapon: "scimitar", range: "melee" },
    { weapon: "dagger", range: "melee" },
  ],
  [
    { weapon: "dagger", range: "ranged" },
    { weapon: "dagger", range: "ranged" },
  ],
);

export class BanditCaptain extends Monster {
  constructor(g: Engine) {
    super(
      g,
      "bandit captain",
      2,
      "humanoid",
      SizeCategory.Medium,
      banditCaptainUrl,
      65,
    );
    this.don(new StuddedLeatherArmor(g), true);
    this.setAbilityScores(15, 16, 14, 14, 11, 14);
    this.addProficiency("str", "proficient");
    this.addProficiency("dex", "proficient");
    this.addProficiency("wis", "proficient");
    this.addProficiency("Athletics", "proficient");
    this.addProficiency("Deception", "proficient");
    this.languages.add("Common"); // any two languages

    this.addFeature(BanditCaptainMultiattack);
    this.don(new Scimitar(g), true);

    const dagger = new Dagger(g);
    this.don(dagger, true);
    this.addToInventory(dagger, 9); // TODO how many

    this.addFeature(Parry);
  }
}

export class Berserker extends Monster {
  constructor(g: Engine) {
    super(g, "berserker", 2, "humanoid", SizeCategory.Medium, berserkerUrl, 67);
    this.don(new HideArmor(g), true);
    this.setAbilityScores(16, 12, 17, 9, 11, 9);
    this.languages.add("Common"); // any one language (usually Common)

    this.addFeature(RecklessAttack);
    this.don(new Greataxe(g), true);
  }
}

export class Commoner extends Monster {
  constructor(g: Engine) {
    super(g, "commoner", 0, "humanoid", SizeCategory.Medium, commonerUrl, 4);
    this.languages.add("Common"); // any one language (usually Common)

    this.don(new Club(g), true);
  }
}

const DarkDevotion = new SimpleFeature(
  "Dark Devotion",
  `The cultist has advantage on saving throws against being charmed or frightened.`,
  (g, me) => {
    g.events.on("BeforeSave", ({ detail: { who, config, diceType } }) => {
      if (
        who === me &&
        (config?.conditions?.has("Charmed") ||
          config?.conditions?.has("Frightened"))
      )
        diceType.add("advantage", DarkDevotion);
    });
  },
);

export class Cultist extends Monster {
  constructor(g: Engine) {
    super(g, "cultist", 0.125, "humanoid", SizeCategory.Medium, cultistUrl, 9);
    this.don(new LeatherArmor(g), true);
    this.setAbilityScores(11, 12, 10, 10, 11, 10);
    this.addProficiency("Deception", "proficient");
    this.addProficiency("Religion", "proficient");
    this.languages.add("Common"); // any one language (usually Common)

    this.addFeature(DarkDevotion);
    this.don(new Scimitar(g), true);
  }
}

const CultFanaticMultiattack = makeBagMultiattack(
  `The fanatic makes two melee attacks.`,
  [{ range: "melee" }, { range: "melee" }],
);

export class CultFanatic extends Monster {
  constructor(g: Engine) {
    super(
      g,
      "cult fanatic",
      2,
      "humanoid",
      SizeCategory.Medium,
      cultFanaticUrl,
      33,
    );
    this.don(new LeatherArmor(g), true);
    this.setAbilityScores(11, 14, 12, 10, 13, 14);
    this.addProficiency("Deception", "proficient");
    this.addProficiency("Persuasion", "proficient");
    this.addProficiency("Religion", "proficient");
    this.languages.add("Common"); // any one language (usually Common)

    this.addFeature(DarkDevotion);

    this.level = 4;
    this.classLevels.set("Cleric", 4);
    this.addFeature(ClericSpellcasting.feature);
    this.addPreparedSpells(
      // TODO Light,
      SacredFlame,
      Thaumaturgy,
      Command,
      InflictWounds,
      ShieldOfFaith,
      HoldPerson,
      // TODO SpiritualWeapon,
    );

    this.addFeature(CultFanaticMultiattack);
    this.don(new Dagger(g), true);
  }
}

export class Druid extends Monster {
  constructor(g: Engine) {
    super(g, "druid", 2, "humanoid", SizeCategory.Medium, druidUrl, 27);
    this.setAbilityScores(10, 12, 13, 12, 15, 11);
    this.addProficiency("Medicine", "proficient");
    this.addProficiency("Nature", "proficient");
    this.addProficiency("Perception", "proficient");
    this.languages.add("Druidic"); // TODO Druidic plus any two languages

    this.level = 4;
    this.classLevels.set("Druid", 4);
    this.addFeature(DruidSpellcasting.feature);
    this.addPreparedSpells(
      // TODO Druidcraft,
      ProduceFlame,
      Shillelagh,
      Entangle,
      Longstrider,
      // TODO SpeakWithAnimals,
      Thunderwave,
      // TODO AnimalMessenger,
      // TODO Barkskin,
    );

    this.don(new Quarterstaff(g), true);
  }
}

const GladiatorMultiattack = makeBagMultiattack(
  `The gladiator makes three melee attacks or two ranged attacks.`,
  [{ range: "melee" }, { range: "melee" }, { range: "melee" }],
  [{ range: "ranged" }, { range: "ranged" }],
);

class ShieldBashAction extends WeaponAttack {
  constructor(
    g: Engine,
    actor: Combatant,
    public item: Item,
  ) {
    super(g, "Shield Bash", actor, "melee", new ImprovisedWeapon(g, item));
  }

  async apply({ target }: HasTarget): Promise<void> {
    await super.applyCosts({ target });
    const { g, ability, actor, weapon } = this;

    const { attack } = await doStandardAttack(g, {
      ability,
      attacker: actor,
      source: this,
      target,
      weapon,
      rangeCategory: "melee",
    });

    if (attack?.hit && target.size <= SizeCategory.Medium) {
      const dc = 8 + attack.attack.pre.bonus.result;
      const config = { duration: Infinity, conditions: coSet("Prone") };
      const { outcome } = await g.save({
        who: target,
        source: this,
        type: { type: "flat", dc },
        ability: "str",
        attacker: actor,
        effect: Prone,
        config,
      });
      if (outcome === "fail") await target.addEffect(Prone, config, actor);
    }
  }
}

const ShieldBash = new SimpleFeature(
  "Shield Bash",
  `You can use your shield as a melee weapon.`,
  (g, me) => {
    g.events.on("GetActions", ({ detail: { who, actions } }) => {
      if (who === me && me.shield)
        actions.push(new ShieldBashAction(g, me, me.shield));
    });
  },
);

export class Gladiator extends Monster {
  constructor(g: Engine) {
    super(
      g,
      "gladiator",
      5,
      "humanoid",
      SizeCategory.Medium,
      gladiatorUrl,
      112,
    );
    this.don(new StuddedLeatherArmor(g), true);
    const shield = new Shield(g);
    this.don(shield, true);
    this.setAbilityScores(18, 15, 16, 10, 12, 15);
    this.addProficiency("str", "proficient");
    this.addProficiency("dex", "proficient");
    this.addProficiency("con", "proficient");
    this.addProficiency("Athletics", "expertise");
    this.addProficiency("Intimidation", "proficient");
    this.languages.add("Common"); // any one language (usually Common)
    this.pb = 3;

    this.addFeature(Brave);
    this.addFeature(Brute);

    this.addFeature(GladiatorMultiattack);
    const spear = new Spear(g);
    this.don(spear, true);
    this.addProficiency("improvised", "proficient");
    this.addFeature(ShieldBash);
    this.addFeature(Parry);
    this.addToInventory(spear, 9); // TODO how many
  }
}

const ThugMultiattack = makeBagMultiattack(
  "The thug makes two melee attacks.",
  [{ range: "melee" }, { range: "melee" }],
);

export class Thug extends Monster {
  constructor(g: Engine, wieldingCrossbow = false) {
    super(g, "thug", 0.5, "humanoid", SizeCategory.Medium, thugUrl, 32);
    this.don(new LeatherArmor(g), true);
    this.setAbilityScores(15, 11, 14, 10, 10, 11);
    this.addProficiency("Intimidation", "proficient");
    this.languages.add("Common");

    this.addFeature(PackTactics);
    this.addFeature(ThugMultiattack);

    const mace = new Mace(g);
    const crossbow = new HeavyCrossbow(g);
    this.give(mace, true);
    this.give(crossbow, true);
    this.don(wieldingCrossbow ? crossbow : mace);
    this.addToInventory(new CrossbowBolt(g), 20);
  }
}

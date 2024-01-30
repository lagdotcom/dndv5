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
import guardUrl from "@img/tok/guard.png";
import knightUrl from "@img/tok/knight.png";
import mageUrl from "@img/tok/mage.png";
import nobleUrl from "@img/tok/noble.png";
import priestUrl from "@img/tok/priest.png";
import scoutUrl from "@img/tok/scout.png";
import spyUrl from "@img/tok/spy.png";
import thugUrl from "@img/tok/thug.png";
import tribalWarriorUrl from "@img/tok/tribal-warrior.png";
import veteranUrl from "@img/tok/veteran.png";

import WeaponAttack, { doStandardAttack } from "../../actions/WeaponAttack";
import { RecklessAttack } from "../../classes/barbarian/RecklessAttack";
import { ClericSpellcasting } from "../../classes/cleric";
import { DruidSpellcasting } from "../../classes/druid";
import { CunningAction } from "../../classes/rogue";
import SneakAttack from "../../classes/rogue/SneakAttack";
import { WizardSpellcasting } from "../../classes/wizard";
import { HasTarget } from "../../configs";
import MonsterTemplate from "../../data/MonsterTemplate";
import { Prone, Surprised } from "../../effects";
import Engine from "../../Engine";
import {
  bonusSpellsFeature,
  Brave,
  notImplementedFeature,
} from "../../features/common";
import Evasion from "../../features/Evasion";
import SimpleFeature from "../../features/SimpleFeature";
import EvaluateLater from "../../interruptions/EvaluateLater";
import { makeStringChoice } from "../../interruptions/PickFromListChoice";
import { ImprovisedWeapon } from "../../items/weapons";
import ChoiceResolver from "../../resolvers/ChoiceResolver";
import InnateSpellcasting from "../../spells/InnateSpellcasting";
import { atSet } from "../../types/AttackTag";
import Combatant from "../../types/Combatant";
import { coSet } from "../../types/ConditionName";
import Enchantment from "../../types/Enchantment";
import Item from "../../types/Item";
import Priority from "../../types/Priority";
import SizeCategory from "../../types/SizeCategory";
import {
  Brute,
  KeenHearingAndSight,
  MagicResistance,
  PackTactics,
  SpellDamageResistance,
} from "../common";
import { makeBagMultiattack } from "../multiattack";
import Parry from "../Parry";

export const Acolyte: MonsterTemplate = {
  name: "acolyte",
  cr: 0.25,
  type: "humanoid",
  tokenUrl: acolyteUrl,
  hpMax: 9,
  abilities: [10, 10, 10, 10, 14, 11],
  proficiency: { Medicine: "proficient", Religion: "proficient" },
  languages: ["Common"], // TODO any one language (usually Common)
  levels: { Cleric: 1 },
  features: [ClericSpellcasting.feature],
  spells: [
    "light",
    "sacred flame",
    "thaumaturgy",
    "bless",
    "cure wounds",
    "sanctuary",
  ],
  items: [{ name: "club", equip: true }],
};

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
    { level: 0, spell: "disguise self" },
    { level: 0, spell: "invisibility" },
  ],
);

export const Archmage: MonsterTemplate = {
  name: "archmage",
  cr: 12,
  type: "humanoid",
  tokenUrl: archmageUrl,
  hpMax: 99,
  abilities: [10, 14, 12, 20, 15, 16],
  proficiency: {
    int: "proficient",
    wis: "proficient",
    Arcana: "expertise",
    History: "expertise",
  },
  languages: ["Common"], // TODO any six languages
  pb: 4,
  levels: { Wizard: 18 },
  features: [
    SpellDamageResistance,
    MagicResistance,
    ArchmageSpellcasting,
    WizardSpellcasting.feature,
  ],
  spells: [
    "fire bolt",
    "light",
    "mage hand",
    "prestidigitation",
    "shocking grasp",
    "detect magic",
    "identify",
    "mage armor",
    "magic missile",
    "detect thoughts",
    "mirror image",
    "misty step",
    "counterspell",
    "fly",
    "lightning bolt",
    "banishment",
    "fire shield",
    "stoneskin",
    "cone of cold",
    "scrying",
    "wall of force",
    "globe of invulnerability",
    "teleport",
    "mind blank",
    "time stop",
  ],
  // TODO precast spells: mage armor, stoneskin, mind blank
  items: [{ name: "dagger", equip: true }],
};

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

export interface AssassinConfig {
  weapon: "shortsword" | "light crossbow";
}
export const Assassin: MonsterTemplate<AssassinConfig> = {
  name: "assassin",
  cr: 8,
  type: "humanoid",
  tokenUrl: assassinUrl,
  hpMax: 78,
  // TODO any non-good alignment
  abilities: [11, 16, 14, 13, 11, 10],
  proficiency: {
    dex: "proficient",
    int: "proficient",
    Acrobatics: "proficient",
    Deception: "proficient",
    Perception: "proficient",
    Stealth: "expertise",
  },
  damage: { poison: "resist" },
  languages: ["Thieves' Cant"], // TODO Thieves' cant plus any two languages
  pb: 3,
  items: [
    { name: "studded leather armor", equip: true },
    { name: "shortsword" },
    { name: "light crossbow" },
    { name: "crossbow bolt", quantity: 20 },
  ],
  levels: { Rogue: 8 },
  features: [Assassinate, Evasion, SneakAttack, AssassinMultiattack],
  config: {
    initial: { weapon: "shortsword" },
    get: (g) => ({
      weapon: new ChoiceResolver(g, "Weapon", [
        makeStringChoice("shortsword"),
        makeStringChoice("light crossbow"),
      ]),
    }),
    apply({ weapon }) {
      this.don(this.getInventoryItem(weapon));
    },
  },
};

export interface BanditConfig {
  weapon: "scimitar" | "light crossbow";
}
export const Bandit: MonsterTemplate<BanditConfig> = {
  name: "bandit",
  cr: 0.125,
  type: "humanoid",
  tokenUrl: banditUrl,
  hpMax: 11,
  // TODO any non-lawful alignment
  abilities: [11, 12, 12, 10, 10, 10],
  languages: ["Common"], // any one language (usually Common)
  items: [
    { name: "leather armor", equip: true },
    { name: "scimitar" },
    { name: "light crossbow" },
    { name: "crossbow bolt", quantity: 20 },
  ],
  config: {
    initial: { weapon: "light crossbow" },
    get: (g) => ({
      weapon: new ChoiceResolver(g, "Weapon", [
        makeStringChoice("scimitar"),
        makeStringChoice("light crossbow"),
      ]),
    }),
    apply({ weapon }) {
      this.don(this.getInventoryItem(weapon));
    },
  },
};

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

export const BanditCaptain: MonsterTemplate = {
  name: "bandit captain",
  cr: 2,
  type: "humanoid",
  tokenUrl: banditCaptainUrl,
  hpMax: 65,
  // TODO any non-lawful alignment
  abilities: [15, 16, 14, 14, 11, 14],
  proficiency: {
    str: "proficient",
    dex: "proficient",
    wis: "proficient",
    Athletics: "proficient",
    Deception: "proficient",
  },
  languages: ["Common"], // any two languages
  features: [BanditCaptainMultiattack, Parry],
  items: [
    { name: "studded leather armor", equip: true },
    { name: "scimitar", equip: true },
    { name: "dagger", equip: true, quantity: 10 }, // TODO how many
  ],
};

export const Berserker: MonsterTemplate = {
  name: "berserker",
  cr: 2,
  type: "humanoid",
  tokenUrl: berserkerUrl,
  hpMax: 67,
  // TODO any Chaotic
  abilities: [16, 12, 17, 9, 11, 9],
  languages: ["Common"],
  features: [RecklessAttack],
  items: [
    { name: "hide armor", equip: true },
    { name: "greataxe", equip: true },
  ],
};

export const Commoner: MonsterTemplate = {
  name: "commoner",
  type: "humanoid",
  tokenUrl: commonerUrl,
  hpMax: 4,
  languages: ["Common"], // any one language (usually Common)
  items: [{ name: "club", equip: true }],
};

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

export const Cultist: MonsterTemplate = {
  name: "cultist",
  cr: 0.125,
  type: "humanoid",
  tokenUrl: cultistUrl,
  hpMax: 9,
  // TODO any non-good alignment
  abilities: [11, 12, 10, 10, 11, 10],
  proficiency: { Deception: "proficient", Religion: "proficient" },
  languages: ["Common"], // any one language (usually Common)
  features: [DarkDevotion],
  items: [
    { name: "leather armor", equip: true },
    { name: "scimitar", equip: true },
  ],
};

const CultFanaticMultiattack = makeBagMultiattack(
  `The fanatic makes two melee attacks.`,
  [{ range: "melee" }, { range: "melee" }],
);

export const CultFanatic: MonsterTemplate = {
  name: "cult fanatic",
  cr: 2,
  type: "humanoid",
  tokenUrl: cultFanaticUrl,
  hpMax: 33,
  // TODO any non-good alignment
  abilities: [11, 14, 12, 10, 13, 14],
  proficiency: {
    Deception: "proficient",
    Perception: "proficient",
    Religion: "proficient",
  },
  languages: ["Common"], // any one language (usually Common)
  levels: { Cleric: 4 },
  features: [DarkDevotion, ClericSpellcasting.feature, CultFanaticMultiattack],
  spells: [
    "light",
    "sacred flame",
    "thaumaturgy",
    "command",
    "inflict wounds",
    "shield of faith",
    "hold person",
    "spiritual weapon",
  ],
  items: [
    { name: "leather armor", equip: true },
    { name: "dagger", equip: true },
  ],
};

export const Druid: MonsterTemplate = {
  name: "druid",
  cr: 2,
  type: "humanoid",
  tokenUrl: druidUrl,
  hpMax: 27,
  abilities: [10, 12, 13, 12, 15, 11],
  proficiency: {
    Medicine: "proficient",
    Nature: "proficient",
    Perception: "proficient",
  },
  languages: ["Druidic"], // TODO Druidic plus any two languages
  levels: { Druid: 4 },
  features: [DruidSpellcasting.feature],
  spells: [
    "druidcraft",
    "produce flame",
    "shillelagh",
    "entangle",
    "longstrider",
    "speak with animals",
    "thunderwave",
    "animal messenger",
    "barkskin",
  ],
  items: [{ name: "quarterstaff", equip: true }],
};

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

  async applyEffect({ target }: HasTarget) {
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

export const Gladiator: MonsterTemplate = {
  name: "gladiator",
  cr: 5,
  type: "humanoid",
  tokenUrl: gladiatorUrl,
  hpMax: 112,
  abilities: [18, 15, 16, 10, 12, 15],
  proficiency: {
    str: "proficient",
    dex: "proficient",
    con: "proficient",
    Athletics: "expertise",
    Intimidation: "proficient",
    improvised: "proficient", // for Shield Bash
  },
  languages: ["Common"], // any one language (usually Common)
  pb: 3,
  features: [Brave, Brute, GladiatorMultiattack, ShieldBash, Parry],
  items: [
    { name: "studded leather armor", equip: true },
    { name: "shield", equip: true },
    { name: "spear", equip: true, quantity: 10 }, // TODO how many
  ],
};

export const Guard: MonsterTemplate = {
  name: "guard",
  cr: 0.125,
  type: "humanoid",
  tokenUrl: guardUrl,
  hpMax: 11,
  abilities: [13, 12, 12, 10, 11, 10],
  proficiency: { Perception: "proficient" },
  languages: ["Common"], // any one language (usually Common)
  items: [
    { name: "chain shirt", equip: true },
    { name: "shield", equip: true },
    { name: "spear", equip: true },
  ],
};

const KnightMultiattack = makeBagMultiattack(
  `The knight makes two melee attacks.`,
  [{ range: "melee" }, { range: "melee" }],
);

// TODO
const Leadership = notImplementedFeature(
  "Leadership",
  `(Recharges after a Short or Long Rest). For 1 minute, the knight can utter a special command or warning whenever a nonhostile creature that it can see within 30 feet of it makes an attack roll or a saving throw. The creature can add a d4 to its roll provided it can hear and understand the knight. A creature can benefit from only one Leadership die at a time. This effect ends if the knight is incapacitated.`,
);

export interface KnightConfig {
  weapon: "greatsword" | "heavy crossbow";
}
export const Knight: MonsterTemplate<KnightConfig> = {
  name: "knight",
  cr: 3,
  type: "humanoid",
  tokenUrl: knightUrl,
  hpMax: 52,
  abilities: [16, 11, 14, 11, 11, 15],
  proficiency: { con: "proficient", wis: "proficient" },
  languages: ["Common"], // any one language (usually Common)
  features: [Brave, KnightMultiattack, Leadership, Parry],
  items: [
    { name: "plate armor", equip: true },
    { name: "greatsword" },
    { name: "heavy crossbow" },
    { name: "crossbow bolt", quantity: 20 },
  ],
  config: {
    initial: { weapon: "greatsword" },
    get: (g) => ({
      weapon: new ChoiceResolver(g, "Weapon", [
        makeStringChoice("greatsword"),
        makeStringChoice("heavy crossbow"),
      ]),
    }),
    apply({ weapon }) {
      this.don(this.getInventoryItem(weapon));
    },
  },
};

export const Mage: MonsterTemplate = {
  name: "mage",
  cr: 6,
  type: "humanoid",
  tokenUrl: mageUrl,
  hpMax: 40,
  abilities: [9, 14, 11, 17, 12, 11],
  proficiency: {
    int: "proficient",
    wis: "proficient",
    Arcana: "proficient",
    History: "proficient",
  },
  languages: ["Common"], // TODO any four languages
  pb: 3,
  levels: { Wizard: 9 },
  features: [WizardSpellcasting.feature],
  items: [{ name: "dagger", equip: true }],
  spells: [
    "fire bolt",
    "light",
    "mage hand",
    "prestidigitation",
    "detect magic",
    "mage armor",
    "magic missile",
    "shield",
    "misty step",
    "suggestion",
    "counterspell",
    "fireball",
    "fly",
    "greater invisibility",
    "ice storm",
    "cone of cold",
  ],
};

export const Noble: MonsterTemplate = {
  name: "noble",
  cr: 0.125,
  type: "humanoid",
  tokenUrl: nobleUrl,
  hpMax: 9,
  abilities: [11, 12, 11, 12, 14, 16],
  proficiency: {
    Deception: "proficient",
    Insight: "proficient",
    Persuasion: "proficient",
  },
  languages: ["Common"], // TODO any two languages
  items: [
    { name: "breastplate", equip: true },
    { name: "rapier", equip: true },
  ],
};

// TODO
const DivineEminence = notImplementedFeature(
  "Divine Eminence",
  `As a bonus action, the priest can expend a spell slot to cause its melee weapon attacks to magically deal an extra 10 (3d6) radiant damage to a target on a hit. This benefit lasts until the end of the turn. If the priest expends a spell slot of 2nd level or higher, the extra damage increases by 1d6 for each level above 1st.`,
);

export const Priest: MonsterTemplate = {
  name: "priest",
  cr: 2,
  type: "humanoid",
  tokenUrl: priestUrl,
  hpMax: 27,
  abilities: [10, 10, 12, 13, 16, 13],
  proficiency: {
    Medicine: "expertise",
    Persuasion: "proficient",
    Religion: "proficient",
  },
  languages: ["Common"], // TODO any two languages
  levels: { Cleric: 5 },
  features: [DivineEminence, ClericSpellcasting.feature],
  items: [
    { name: "chain shirt", equip: true },
    { name: "mace", equip: true },
  ],
  spells: [
    "light",
    "sacred flame",
    "thaumaturgy",
    "cure wounds",
    "guiding bolt",
    "sanctuary",
    "lesser restoration",
    "spiritual weapon",
    "dispel magic",
    "spirit guardians",
  ],
};

const ScoutMultiattack = makeBagMultiattack(
  `The scout makes two melee attacks or two ranged attacks.`,
  [{ range: "melee" }, { range: "melee" }],
  [{ range: "ranged" }, { range: "ranged" }],
);

export interface ScoutConfig {
  weapon: "shortsword" | "longbow";
}
export const Scout: MonsterTemplate<ScoutConfig> = {
  name: "scout",
  cr: 0.5,
  type: "humanoid",
  tokenUrl: scoutUrl,
  hpMax: 16,
  abilities: [11, 14, 12, 11, 13, 11],
  proficiency: {
    Nature: "expertise",
    Perception: "expertise",
    Stealth: "expertise",
    Survival: "expertise",
  },
  languages: ["Common"], // TODO any one language (usually Common)
  features: [KeenHearingAndSight, ScoutMultiattack],
  items: [
    { name: "leather armor", equip: true },
    { name: "shortsword" },
    { name: "longbow" },
    { name: "arrow", quantity: 20 },
  ],
  config: {
    initial: { weapon: "longbow" },
    get: (g) => ({
      weapon: new ChoiceResolver(g, "Weapon", [
        makeStringChoice("shortsword"),
        makeStringChoice("longbow"),
      ]),
    }),
    apply({ weapon }) {
      this.don(this.getInventoryItem(weapon));
    },
  },
};

const SpyMultiattack = makeBagMultiattack("The spy makes two melee attacks.", [
  { range: "melee" },
  { range: "melee" },
]);

export interface SpyConfig {
  weapon: "shortsword" | "hand crossbow";
}
export const Spy: MonsterTemplate<SpyConfig> = {
  name: "spy",
  cr: 1,
  type: "humanoid",
  tokenUrl: spyUrl,
  hpMax: 27,
  abilities: [10, 15, 10, 12, 14, 16],
  proficiency: {
    Deception: "proficient",
    Insight: "proficient",
    Perception: "expertise",
    Persuasion: "proficient",
    "Sleight of Hand": "proficient",
    Stealth: "proficient",
  },
  languages: ["Common"], // TODO any two languages
  levels: { Rogue: 3 },
  features: [CunningAction, SneakAttack, SpyMultiattack],
  items: [
    { name: "shortsword" },
    { name: "hand crossbow" },
    { name: "crossbow bolt", quantity: 20 },
  ],
  config: {
    initial: { weapon: "hand crossbow" },
    get: (g) => ({
      weapon: new ChoiceResolver(g, "Weapon", [
        makeStringChoice("shortsword"),
        makeStringChoice("hand crossbow"),
      ]),
    }),
    apply({ weapon }) {
      this.don(this.getInventoryItem(weapon));
    },
  },
};

const ThugMultiattack = makeBagMultiattack(
  "The thug makes two melee attacks.",
  [{ range: "melee" }, { range: "melee" }],
);

export interface ThugConfig {
  weapon: "mace" | "heavy crossbow";
}
export const Thug: MonsterTemplate<ThugConfig> = {
  name: "thug",
  cr: 0.5,
  type: "humanoid",
  tokenUrl: thugUrl,
  hpMax: 32,
  abilities: [15, 11, 14, 10, 10, 11],
  proficiency: { Intimidation: "proficient" },
  languages: ["Common"], // TODO any one language (usually Common)
  features: [PackTactics, ThugMultiattack],
  items: [
    { name: "leather armor", equip: true },
    { name: "mace" },
    { name: "heavy crossbow" },
    { name: "crossbow bolt", quantity: 20 },
  ],
  config: {
    initial: { weapon: "mace" },
    get: (g) => ({
      weapon: new ChoiceResolver(g, "Weapon", [
        makeStringChoice("mace"),
        makeStringChoice("heavy crossbow"),
      ]),
    }),
    apply({ weapon }) {
      this.don(this.getInventoryItem(weapon));
    },
  },
};

export const TribalWarrior: MonsterTemplate = {
  name: "tribal warrior",
  cr: 0.125,
  type: "humanoid",
  tokenUrl: tribalWarriorUrl,
  hpMax: 11,
  abilities: [13, 11, 12, 8, 11, 8],
  languages: ["Common"],
  features: [PackTactics],
  items: [
    { name: "hide armor", equip: true },
    { name: "spear", equip: true },
  ],
};

const VeteranMultiattack = makeBagMultiattack(
  `The veteran makes two longsword attacks. If it has a shortsword drawn, it can also make a shortsword attack.`,
  [{ weapon: "longsword" }, { weapon: "longsword" }, { weapon: "shortsword" }],
);

export interface VeteranConfig {
  weapon: "swords" | "heavy crossbow";
}
export const Veteran: MonsterTemplate<VeteranConfig> = {
  name: "veteran",
  cr: 3,
  type: "humanoid",
  tokenUrl: veteranUrl,
  hpMax: 58,
  abilities: [16, 13, 14, 10, 11, 10],
  proficiency: { Athletics: "proficient", Perception: "proficient" },
  languages: ["Common"], // TODO any one language (usually Common)
  features: [VeteranMultiattack],
  items: [
    { name: "splint armor", equip: true },
    { name: "longsword" },
    { name: "shortsword" },
    { name: "heavy crossbow" },
    { name: "crossbow bolt", quantity: 20 },
  ],
  config: {
    initial: { weapon: "swords" },
    get: (g) => ({
      weapon: new ChoiceResolver(g, "Weapon", [
        makeStringChoice("swords", "longsword/shortsword"),
        makeStringChoice("heavy crossbow"),
      ]),
    }),
    apply({ weapon }) {
      if (weapon === "heavy crossbow") this.don(this.getInventoryItem(weapon));
      else {
        this.don(this.getInventoryItem("longsword"));
        this.don(this.getInventoryItem("shortsword"));
      }
    },
  },
};

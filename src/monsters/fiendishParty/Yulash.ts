import songUrl from "@img/act/song.svg";
import tokenUrl from "@img/tok/boss/yulash.png";

import AbstractAction from "../../actions/AbstractAction";
import { doStandardAttack } from "../../actions/WeaponAttack";
import ErrorCollector from "../../collectors/ErrorCollector";
import { makeIcon } from "../../colours";
import { HasTarget } from "../../configs";
import Engine from "../../Engine";
import { bonusSpellsFeature } from "../../features/common";
import SimpleFeature from "../../features/SimpleFeature";
import {
  capable,
  conscious,
  isAlly,
  isConcentrating,
  isEnemy,
} from "../../filters";
import PickFromListChoice from "../../interruptions/PickFromListChoice";
import YesNoChoice from "../../interruptions/YesNoChoice";
import { LeatherArmor } from "../../items/armor";
import { Rapier } from "../../items/weapons";
import Monster from "../../Monster";
import { getTeleportation } from "../../movement";
import TargetResolver from "../../resolvers/TargetResolver";
import InnateSpellcasting from "../../spells/InnateSpellcasting";
import HealingWord from "../../spells/level1/HealingWord";
import Combatant from "../../types/Combatant";
import { WeaponItem } from "../../types/Item";
import { checkConfig } from "../../utils/config";
import { getWeaponAbility } from "../../utils/items";
import { distance } from "../../utils/units";

function getMeleeAttackOptions(
  g: Engine,
  attacker: Combatant,
  filter: (target: Combatant, weapon: WeaponItem) => boolean,
) {
  const options = [];

  for (const weapon of attacker.weapons) {
    if (weapon.rangeCategory !== "melee") continue;

    for (const target of g.combatants) {
      if (target === attacker || !filter(target, weapon)) continue;

      const reach = attacker.reach + weapon.reach;
      if (reach >= distance(attacker, target)) options.push({ target, weapon });
    }
  }

  return options;
}

const cheerIcon = makeIcon(songUrl, "green");
const discordIcon = makeIcon(songUrl, "red");
const irritationIcon = makeIcon(songUrl, "purple");

class CheerAction extends AbstractAction<HasTarget> {
  constructor(g: Engine, actor: Combatant) {
    super(
      g,
      actor,
      "Cheer",
      "implemented",
      { target: new TargetResolver(g, 30, [isAlly, capable, conscious]) },
      {
        time: "action",
        icon: cheerIcon,
        description: `One ally within 30 ft. may make a melee attack against an enemy in range.`,
        tags: ["vocal"],
      },
    );
  }

  check({ target }: Partial<HasTarget>, ec: ErrorCollector) {
    if (target && !this.getValidAttacks(target).length)
      ec.add("no valid attack", this);

    return super.check({ target }, ec);
  }

  getValidAttacks(attacker: Combatant) {
    return getMeleeAttackOptions(
      this.g,
      attacker,
      (target) => attacker.side !== target.side,
    );
  }

  async apply({ target: attacker }: HasTarget) {
    await super.apply({ target: attacker });

    const attacks = this.getValidAttacks(attacker);
    const choice = new PickFromListChoice(
      attacker,
      this,
      "Cheer",
      `Pick an attack to make.`,
      attacks.map((value) => ({
        value,
        label: `attack ${value.target.name} with ${value.weapon.name}`,
      })),
      async ({ target, weapon }) => {
        await doStandardAttack(this.g, {
          source: this,
          ability: getWeaponAbility(attacker, weapon),
          attacker,
          target,
          weapon,
        });
      },
      true,
    );
    await choice.apply(this.g);
  }
}

const Cheer = new SimpleFeature(
  "Cheer",
  "One ally within 30 ft. may make a melee attack against an enemy in range.",
  (g, me) => {
    g.events.on("GetActions", ({ detail: { who, actions } }) => {
      if (who === me) actions.push(new CheerAction(g, me));
    });
  },
);

class DiscordAction extends AbstractAction<HasTarget> {
  constructor(g: Engine, actor: Combatant) {
    super(
      g,
      actor,
      "Discord",
      "implemented",
      { target: new TargetResolver(g, 30, [isEnemy, capable, conscious]) },
      {
        time: "action",
        icon: discordIcon,
        description: `One enemy within 30 ft. must make a Charisma save or use its reaction to make one melee attack against an ally in range.`,
        tags: ["harmful", "vocal"],
      },
    );
  }

  check({ target }: Partial<HasTarget>, ec: ErrorCollector) {
    if (target) {
      if (!target.hasTime("reaction")) ec.add("no reaction left", this);

      if (!this.getValidAttacks(target).length) ec.add("no valid attack", this);
    }

    return super.check({ target }, ec);
  }

  getValidAttacks(attacker: Combatant) {
    return getMeleeAttackOptions(
      this.g,
      attacker,
      (target) => attacker.side === target.side,
    );
  }

  async apply({ target: attacker }: HasTarget) {
    await super.apply({ target: attacker });

    const { outcome } = await this.g.save({
      source: this,
      type: { type: "ability", ability: "cha" },
      attacker: this.actor,
      who: attacker,
      ability: "cha",
      tags: ["charm", "magic"],
    });
    if (outcome === "success") return;

    const attacks = this.getValidAttacks(attacker);
    const choice = new PickFromListChoice(
      attacker,
      this,
      "Discord",
      `Pick an attack to make.`,
      attacks.map((value) => ({
        value,
        label: `attack ${value.target.name} with ${value.weapon.name}`,
      })),
      async ({ target, weapon }) => {
        await doStandardAttack(this.g, {
          source: this,
          ability: getWeaponAbility(attacker, weapon),
          attacker,
          target,
          weapon,
        });
      },
    );
    await choice.apply(this.g);
  }
}

const Discord = new SimpleFeature(
  "Discord",
  "One enemy within 30 ft. must make a DC 15 Charisma save or use its reaction to make one melee attack against an ally in range.",
  (g, me) => {
    g.events.on("GetActions", ({ detail: { who, actions } }) => {
      if (who === me) actions.push(new DiscordAction(g, me));
    });
  },
);

class IrritationAction extends AbstractAction<HasTarget> {
  constructor(g: Engine, actor: Combatant) {
    super(
      g,
      actor,
      "Irritation",
      "implemented",
      { target: new TargetResolver(g, 30, [isEnemy, isConcentrating]) },
      {
        time: "action",
        icon: irritationIcon,
        description: `One enemy within 30ft. must make a Constitution check or lose concentration.`,
        tags: ["harmful", "vocal"],
      },
    );
  }

  async apply({ target }: HasTarget) {
    await super.apply({ target });

    const { outcome } = await this.g.save({
      source: this,
      type: { type: "ability", ability: "cha" },
      attacker: this.actor,
      who: target,
      ability: "con",
      tags: ["concentration", "magic"],
    });
    if (outcome === "fail") await target.endConcentration();
  }
}
const Irritation = new SimpleFeature(
  "Irritation",
  "One enemy within 30ft. must make a DC 15 Constitution check or lose concentration.",
  (g, me) => {
    g.events.on("GetActions", ({ detail: { actions, who } }) => {
      if (who === me) actions.push(new IrritationAction(g, who));
    });
  },
);

const SpellcastingMethod = new InnateSpellcasting(
  "Spellcasting",
  "cha",
  () => undefined,
);
const Spellcasting = bonusSpellsFeature(
  "Spellcasting",
  "Yulash can cast healing word at will.",
  "level",
  SpellcastingMethod,
  [{ level: 1, spell: HealingWord }],
);

class DancingStepAction extends AbstractAction<HasTarget> {
  constructor(
    g: Engine,
    actor: Combatant,
    public distance = 20,
  ) {
    super(
      g,
      actor,
      "Dancing Step",
      "implemented",
      { target: new TargetResolver(g, 5, [isEnemy]) },
      {
        time: "reaction",
        description: `When an enemy moves within 5 ft., you may teleport to a spot within ${distance} ft. that you can see.`,
      },
    );
  }

  async apply(config: HasTarget) {
    await super.apply(config);
    await this.g.applyBoundedMove(
      this.actor,
      getTeleportation(this.distance, "Dancing Step"),
    );
  }
}

const DancingStep = new SimpleFeature(
  "Dancing Step",
  "Reaction: When an enemy moves within 5 ft., Yulash teleports to a spot within 20 ft. that she can see.",
  (g, me) => {
    g.events.on("GetActions", ({ detail: { who, actions } }) => {
      if (who === me) actions.push(new DancingStepAction(g, me));
    });

    g.events.on("CombatantMoved", ({ detail: { who, interrupt } }) => {
      const step = new DancingStepAction(g, me);
      const config: HasTarget = { target: who };

      if (checkConfig(g, step, config))
        interrupt.add(
          new YesNoChoice(
            me,
            DancingStep,
            "Dancing Step",
            `${who.name} moved with 5 ft. of ${me.name}. Teleport up to 20 ft. away?`,
            async () => {
              await g.act(step, config);
            },
          ),
        );
    });
  },
);

export default class Yulash extends Monster {
  constructor(g: Engine) {
    super(g, "Yulash", 5, "monstrosity", "medium", tokenUrl, 65);
    this.diesAtZero = false;
    this.movement.set("speed", 30);
    this.setAbilityScores(8, 16, 14, 12, 13, 18);
    this.pb = 3;
    this.level = 5; // for spellcasting

    this.saveProficiencies.add("dex");
    this.saveProficiencies.add("cha");
    this.addProficiency("Deception", "proficient");
    this.addProficiency("Perception", "proficient");
    this.damageResponses.set("poison", "immune");
    this.conditionImmunities.add("Poisoned");
    this.languages.add("Abyssal");
    this.languages.add("Common");

    this.addFeature(Cheer);
    this.addFeature(Discord);
    this.addFeature(Irritation);
    this.addFeature(Spellcasting);
    this.addFeature(DancingStep);

    this.don(new LeatherArmor(g), true);
    this.don(new Rapier(g), true);
  }
}

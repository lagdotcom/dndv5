import bullRushIconUrl from "@img/act/bull-rush.svg";
import tokenUrl from "@img/tok/boss/zafron.png";

import AbstractAction from "../../actions/AbstractAction";
import ErrorCollector from "../../collectors/ErrorCollector";
import { makeIcon } from "../../colours";
import Effect from "../../Effect";
import { Prone } from "../../effects";
import Engine from "../../Engine";
import { Listener } from "../../events/Dispatcher";
import ConfiguredFeature from "../../features/ConfiguredFeature";
import SimpleFeature from "../../features/SimpleFeature";
import EvaluateLater from "../../interruptions/EvaluateLater";
import YesNoChoice from "../../interruptions/YesNoChoice";
import { ScaleMailArmor } from "../../items/armor";
import { Greataxe } from "../../items/weapons";
import { MapSquareSize } from "../../MapSquare";
import MessageBuilder from "../../MessageBuilder";
import Monster from "../../Monster";
import { BoundedMove } from "../../movement";
import Combatant from "../../types/Combatant";
import { coSet } from "../../types/ConditionName";
import { MundaneDamageTypes } from "../../types/DamageType";
import { WeaponItem } from "../../types/Item";
import MoveDirection from "../../types/MoveDirection";
import Priority from "../../types/Priority";
import SizeCategory from "../../types/SizeCategory";
import { round } from "../../utils/numbers";
import { isA } from "../../utils/types";
import { makeMultiattack } from "../common";

const LustForBattle = new ConfiguredFeature<WeaponItem>(
  "Lust for Battle",
  "When Zafron hits with his Greataxe, he gains 5 temporary hit points.",
  (g, me, weapon) => {
    g.events.on(
      "CombatantDamaged",
      ({ detail: { attack, attacker, interrupt } }) => {
        if (attacker === me && attack?.roll.type.weapon === weapon)
          interrupt.add(
            new EvaluateLater(me, LustForBattle, Priority.Normal, async () => {
              if (await g.giveTemporaryHP(me, 5, LustForBattle))
                g.text(
                  new MessageBuilder().co(me).text(" pulses with dark energy."),
                );
            }),
          );
      },
    );
  },
);

const BullRushIcon = makeIcon(bullRushIconUrl);

const BullRushEffect = new Effect(
  "Bull Rush",
  "turnStart",
  (g) => {
    g.events.on(
      "GetDamageResponse",
      ({ detail: { who, damageType, response } }) => {
        if (
          who.hasEffect(BullRushEffect) &&
          isA(damageType, MundaneDamageTypes)
        )
          response.add("resist", BullRushEffect);
      },
    );
  },
  { icon: BullRushIcon },
);

class BullRushAction extends AbstractAction {
  constructor(g: Engine, actor: Combatant) {
    super(
      g,
      actor,
      "Bull Rush",
      "implemented",
      {},
      {
        icon: BullRushIcon,
        time: "action",
        description: `Until the beginning of your next turn, gain resistance to bludgeoning, piercing and slashing damage. Then, move up to your speed in a single direction. All enemies that you pass through must make a Dexterity save or be knocked prone.`,
        tags: ["harmful"],
      },
    );
  }

  getAffected() {
    return [this.actor];
  }
  getTargets() {
    return [];
  }

  check(config: never, ec: ErrorCollector) {
    if (this.actor.speed <= 0) ec.add("cannot move", this);
    return super.check(config, ec);
  }

  async apply() {
    await super.apply({});
    const { g, actor } = this;

    const affected = [actor];
    const promises: Promise<void>[] = [];

    await actor.addEffect(BullRushEffect, { duration: 1 });

    const maximum = actor.speed;
    let used = 0;
    let rushDirection: MoveDirection | undefined;

    await g.applyBoundedMove(actor, {
      name: "Bull Rush",
      maximum,
      turnMovement: false,
      forced: false,
      provokesOpportunityAttacks: true,
      mustUseAll: false,
      teleportation: false,
      onMove: (who, cost) => {
        for (const hit of g.getInside(
          { type: "within", who, radius: 0 },
          affected,
        )) {
          g.text(
            new MessageBuilder()
              .co(actor)
              .text(" barrels into")
              .sp()
              .co(hit)
              .text("."),
          );

          affected.push(hit);
          promises.push(this.knockOver(hit));
        }

        used += cost;
        return used >= maximum;
      },
      check: ({ detail: { direction, error } }) => {
        if (!rushDirection) rushDirection = direction;
        else if (rushDirection !== direction)
          error.add("must move in same direction", this);
      },
    });

    await Promise.all(promises);
  }

  async knockOver(who: Combatant) {
    const config = { duration: Infinity, conditions: coSet("Prone") };
    const { outcome } = await this.g.save({
      source: this,
      type: { type: "ability", ability: "str" },
      attacker: this.actor,
      who,
      ability: "dex",
      effect: Prone,
      config,
    });
    if (outcome === "fail") await who.addEffect(Prone, config, this.actor);
  }
}

const BullRush = new SimpleFeature(
  "Bull Rush",
  "Until the beginning of his next turn, Zafron gains resistance to bludgeoning, piercing and slashing damage. Then, he moves up to his speed in a single direction. All enemies that he passes through must make a DC 15 Dexterity save or be knocked prone.",
  (g, me) => {
    g.events.on("GetActions", ({ detail: { who, actions } }) => {
      if (who === me) actions.push(new BullRushAction(g, me));
    });
  },
);

const SurvivalReflex = new SimpleFeature(
  "Survival Reflex",
  "Reaction: When forced to make a skill check or saving throw, Zafron gains advantage on the roll. After the triggering action is complete, he may move up to half his speed.",
  (g, me) => {
    let activated = false;

    const useReflex: Listener<"BeforeCheck" | "BeforeSave"> = ({
      detail: { who, interrupt, diceType },
    }) => {
      // TODO make this into an actual reaction?
      if (who === me && me.hasTime("reaction"))
        interrupt.add(
          new YesNoChoice(
            me,
            SurvivalReflex,
            "Survival Reflex",
            `Use ${me.name}'s reaction to gain advantage and move half their speed?`,
            Priority.ChangesOutcome,
            async () => {
              me.useTime("reaction");
              activated = true;
              diceType.add("advantage", SurvivalReflex);
            },
          ),
        );
    };
    g.events.on("BeforeCheck", useReflex);
    g.events.on("BeforeSave", useReflex);

    g.events.on("AfterAction", ({ detail: { interrupt } }) => {
      if (activated && !me.conditions.has("Unconscious")) {
        activated = false;
        interrupt.add(
          new EvaluateLater(me, SurvivalReflex, Priority.Late, async () =>
            g.applyBoundedMove(
              me,
              new BoundedMove(
                SurvivalReflex,
                round(me.speed / 2, MapSquareSize),
              ),
            ),
          ),
        );
      }
    });
  },
);

export default class Zafron extends Monster {
  constructor(g: Engine) {
    super(g, "Zafron Halehart", 5, "fiend", SizeCategory.Medium, tokenUrl, 105);
    this.diesAtZero = false;
    this.movement.set("speed", 30);
    this.setAbilityScores(18, 14, 20, 7, 10, 13);
    this.pb = 3;

    this.saveProficiencies.add("str");
    this.saveProficiencies.add("con");
    this.addProficiency("Acrobatics", "proficient");
    this.addProficiency("Intimidation", "proficient");
    this.damageResponses.set("fire", "resist");
    this.damageResponses.set("poison", "resist");
    this.conditionImmunities.add("Poisoned");
    this.languages.add("Abyssal");

    const axe = new Greataxe(g);
    this.addFeature(LustForBattle);
    this.setConfig(LustForBattle, axe);

    this.addFeature(
      makeMultiattack(
        "Zafron attacks twice with his Greataxe.",
        (me) => me.attacksSoFar.length < 2,
      ),
    );
    this.addFeature(BullRush);
    this.addFeature(SurvivalReflex);

    this.don(new ScaleMailArmor(g), true);
    this.don(axe, true);
  }
}

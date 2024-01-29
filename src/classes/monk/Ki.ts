import { AbstractSingleTargetAction } from "../../actions/AbstractAction";
import DashAction from "../../actions/DashAction";
import DisengageAction from "../../actions/DisengageAction";
import DodgeAction from "../../actions/DodgeAction";
import { doStandardAttack } from "../../actions/WeaponAttack";
import ErrorCollector from "../../collectors/ErrorCollector";
import { HasTarget } from "../../configs";
import Engine from "../../Engine";
import SimpleFeature from "../../features/SimpleFeature";
import YesNoChoice from "../../interruptions/YesNoChoice";
import TargetResolver from "../../resolvers/TargetResolver";
import { ShortRestResource } from "../../resources";
import Combatant from "../../types/Combatant";
import { WeaponItem } from "../../types/Item";
import Priority from "../../types/Priority";
import { checkConfig } from "../../utils/config";
import { getWeaponAbility, getWeaponRange } from "../../utils/items";
import { getMonkUnarmedWeapon } from "./MartialArts";

export const KiResource = new ShortRestResource("Ki", 2);

class FlurryOfBlows extends AbstractSingleTargetAction {
  constructor(
    g: Engine,
    actor: Combatant,
    private weapon: WeaponItem,
    private available: boolean,
    private ability = getWeaponAbility(actor, weapon),
  ) {
    super(
      g,
      actor,
      "Flurry of Blows",
      "implemented",
      {
        target: new TargetResolver(
          g,
          getWeaponRange(actor, weapon, "melee"),
          [],
        ),
      },
      {
        resources: [[KiResource, 1]],
        time: "bonus action",
        description: `Immediately after you take the Attack action on your turn, you can spend 1 ki point to make two unarmed strikes as a bonus action.`,
        tags: ["attack", "harmful"],
      },
    );
  }

  check({ target }: Partial<HasTarget>, ec: ErrorCollector) {
    if (!this.available)
      ec.add("must use immediately after Attack action", this);
    return super.check({ target }, ec);
  }

  async applyEffect({ target }: HasTarget) {
    const { g, actor: attacker, weapon, ability } = this;
    await doStandardAttack(g, {
      ability,
      attacker,
      source: this,
      rangeCategory: "melee",
      target,
      weapon,
    });
    await doStandardAttack(g, {
      ability,
      attacker,
      source: this,
      rangeCategory: "melee",
      target,
      weapon,
    });
  }
}

class PatientDefense extends DodgeAction {
  constructor(g: Engine, actor: Combatant) {
    super(g, actor);

    this.name += " (Patient Defense)";
    this.time = "bonus action";
    this.resources.set(KiResource, 1);
  }
}

class StepDisengage extends DisengageAction {
  constructor(g: Engine, actor: Combatant) {
    super(g, actor);

    this.name += " (Step of the Wind)";
    this.time = "bonus action";
    this.resources.set(KiResource, 1);
  }
}

class StepDash extends DashAction {
  constructor(g: Engine, actor: Combatant) {
    super(g, actor);

    // TODO ...and your jump distance is doubled for the turn.
    this.status = "incomplete";
    this.name += " (Step of the Wind)";
    this.time = "bonus action";
    this.resources.set(KiResource, 1);
  }
}

const Ki = new SimpleFeature(
  "Ki",
  `Starting at 2nd level, your training allows you to harness the mystic energy of ki. Your access to this energy is represented by a number of ki points. Your monk level determines the number of points you have, as shown in the Ki Points column of the Monk table.

You can spend these points to fuel various ki features. You start knowing three such features: Flurry of Blows, Patient Defense, and Step of the Wind. You learn more ki features as you gain levels in this class.

When you spend a ki point, it is unavailable until you finish a short or long rest, at the end of which you draw all of your expended ki back into yourself. You must spend at least 30 minutes of the rest meditating to regain your ki points.

Some of your ki features require your target to make a saving throw to resist the feature's effects. The saving throw DC is calculated as follows:

Ki save DC = 8 + your proficiency bonus + your Wisdom modifier`,
  (g, me) => {
    const charges = me.getClassLevel("Monk", 2);
    me.initResource(KiResource, charges);

    g.events.on("GetActions", ({ detail: { who, actions } }) => {
      if (who === me) {
        const weapon = getMonkUnarmedWeapon(g, me);
        if (weapon) actions.push(new FlurryOfBlows(g, me, weapon, false));

        actions.push(
          new PatientDefense(g, me),
          new StepDisengage(g, me),
          new StepDash(g, me),
        );
      }
    });

    g.events.on("AfterAction", ({ detail: { action, config, interrupt } }) => {
      // TODO this is not technically correct; should be the Attack action
      if (action.actor === me && action.tags.has("costs attack")) {
        const target = (config as HasTarget).target;
        const weapon = getMonkUnarmedWeapon(g, me);

        if (target && weapon) {
          const action = new FlurryOfBlows(g, me, weapon, true);
          const config: HasTarget = { target };

          if (checkConfig(g, action, config))
            interrupt.add(
              new YesNoChoice(
                me,
                Ki,
                "Flurry of Blows",
                `Spend 1 ki to activate Flurry of Blows?`,
                Priority.Normal,
                () => g.act(action, config),
              ),
            );
        }
      }
    });
  },
);
export default Ki;

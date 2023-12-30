import AbstractAction from "../actions/AbstractAction";
import ErrorCollector from "../collectors/ErrorCollector";
import { HasTarget } from "../configs";
import Engine from "../Engine";
import { AttackDetail } from "../events/AttackEvent";
import SimpleFeature from "../features/SimpleFeature";
import { canSee } from "../filters";
import YesNoChoice from "../interruptions/YesNoChoice";
import TargetResolver from "../resolvers/TargetResolver";
import Combatant from "../types/Combatant";
import Priority from "../types/Priority";
import { sieve } from "../utils/array";
import { checkConfig } from "../utils/config";

export class ParryAction extends AbstractAction<HasTarget> {
  constructor(
    g: Engine,
    actor: Combatant,
    private detail?: AttackDetail,
  ) {
    super(
      g,
      actor,
      "Parry",
      "implemented",
      {
        target: new TargetResolver(g, Infinity, [
          canSee,
          {
            name: "wielding a melee weapon",
            message: "no melee weapon",
            check: (g, action, value) =>
              !!value.weapons.find((w) => w.rangeCategory === "melee"),
          },
        ]),
      },
      {
        description: `You add ${actor.pb} to your AC against one melee attack that would hit you. To do so, you must see the attacker and be wielding a melee weapon.`,
        time: "reaction",
      },
    );
  }

  check(config: HasTarget, ec: ErrorCollector) {
    const melee = this.actor.weapons.find((w) => w.rangeCategory === "melee");
    if (!melee) ec.add("not wielding a melee weapon", this);

    return super.check(config, ec);
  }

  getTargets({ target }: HasTarget) {
    return sieve(target);
  }
  getAffected() {
    return [this.actor];
  }

  async apply(config: HasTarget) {
    await super.apply(config);

    if (!this.detail) throw new Error(`Parry.apply() without AttackDetail`);

    this.detail.ac += this.actor.pb;
  }
}

const Parry = new SimpleFeature(
  "Parry",
  `Reaction: You add your proficiency bonus to your AC against one melee attack that would hit you. To do so, you must see the attacker and be wielding a melee weapon.`,
  (g, me) => {
    g.events.on("GetActions", ({ detail: { who, actions } }) => {
      if (who === me) actions.push(new ParryAction(g, me));
    });

    g.events.on("Attack", ({ detail }) => {
      const { target, who } = detail.pre;

      const parry = new ParryAction(g, me, detail);
      const config = { target: who };

      if (
        target === me &&
        detail.roll.type.tags.has("melee") &&
        detail.outcome.hits &&
        checkConfig(g, parry, config)
      )
        detail.interrupt.add(
          new YesNoChoice(
            me,
            Parry,
            "Parry",
            `${who.name} is about to hit ${target.name} in melee (${detail.total} vs. AC ${detail.ac}). Should they use Parry to add ${who.pb} AC for this attack?`,
            Priority.ChangesOutcome,
            async () => {
              await g.act(parry, config);
            },
          ),
        );
    });
  },
);
export default Parry;

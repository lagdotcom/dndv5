import AbstractAction from "../../actions/AbstractAction";
import Engine from "../../Engine";
import SimpleFeature from "../../features/SimpleFeature";
import { Modifier } from "../../flavours";
import { ShortRestResource } from "../../resources";
import Combatant from "../../types/Combatant";

const SecondWindResource = new ShortRestResource("Second Wind", 1);

class SecondWindAction extends AbstractAction {
  constructor(
    g: Engine,
    actor: Combatant,
    public bonus: Modifier,
  ) {
    super(
      g,
      actor,
      "Second Wind",
      "implemented",
      {},
      {
        time: "bonus action",
        resources: new Map([[SecondWindResource, 1]]),
        heal: [
          { type: "dice", amount: { count: 1, size: 10 } },
          { type: "flat", amount: bonus },
        ],
        description: `You have a limited well of stamina that you can draw on to protect yourself from harm. On your turn, you can use a bonus action to regain hit points equal to 1d10 + your fighter level.`,
      },
    );
  }

  getAffected() {
    return [this.actor];
  }
  getTargets() {
    return [];
  }

  async apply(): Promise<void> {
    await super.apply({});

    const { actor, bonus } = this;
    const roll = await this.g.rollHeal(1, { actor, size: 10, source: this });

    await this.g.heal(this, roll + bonus, { actor, target: actor });
  }
}

const SecondWind = new SimpleFeature(
  "Second Wind",
  `You have a limited well of stamina that you can draw on to protect yourself from harm. On your turn, you can use a bonus action to regain hit points equal to 1d10 + your fighter level.

Once you use this feature, you must finish a short or long rest before you can use it again.`,
  (g, me) => {
    const bonus = me.getClassLevel("Fighter", 1) as Modifier;
    me.initResource(SecondWindResource);

    g.events.on("GetActions", ({ detail: { who, actions } }) => {
      if (who === me) actions.push(new SecondWindAction(g, me, bonus));
    });
  },
);
export default SecondWind;

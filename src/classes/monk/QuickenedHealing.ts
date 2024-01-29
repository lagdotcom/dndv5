import { AbstractSelfAction } from "../../actions/AbstractAction";
import Engine from "../../Engine";
import SimpleFeature from "../../features/SimpleFeature";
import { DiceSize } from "../../flavours";
import Combatant from "../../types/Combatant";
import { KiResource } from "./Ki";
import { getMartialArtsDie } from "./MartialArts";

class QuickenedHealingAction extends AbstractSelfAction {
  constructor(
    g: Engine,
    actor: Combatant,
    private size: DiceSize,
  ) {
    super(
      g,
      actor,
      "Quickened Healing",
      "implemented",
      {},
      {
        description: `As an action, you can spend 2 ki points and roll a Martial Arts die. You regain a number of hit points equal to the number rolled plus your proficiency bonus.`,
        heal: [
          { type: "dice", amount: { count: 1, size } },
          { type: "flat", amount: actor.pb },
        ],
        resources: [[KiResource, 2]],
        time: "action",
      },
    );
  }

  async applyEffect() {
    const { g, actor, size } = this;
    const amount = await g.rollHeal(1, {
      source: this,
      actor,
      size,
      target: actor,
    });

    await g.heal(this, amount + actor.pb, {
      action: this,
      actor,
      target: actor,
    });
  }
}

const QuickenedHealing = new SimpleFeature(
  "Quickened Healing",
  `As an action, you can spend 2 ki points and roll a Martial Arts die. You regain a number of hit points equal to the number rolled plus your proficiency bonus.`,
  (g, me) => {
    const size = getMartialArtsDie(me.getClassLevel("Monk", 4));

    g.events.on("GetActions", ({ detail: { who, actions } }) => {
      if (who === me) actions.push(new QuickenedHealingAction(g, me, size));
    });
  },
);
export default QuickenedHealing;

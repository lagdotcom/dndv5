import AbstractAction from "../../actions/AbstractAction";
import ErrorCollector from "../../collectors/ErrorCollector";
import Effect from "../../Effect";
import Engine from "../../Engine";
import SimpleFeature from "../../features/SimpleFeature";
import { ShortRestResource } from "../../resources";
import Combatant from "../../types/Combatant";

const ActionSurgeResource = new ShortRestResource("Action Surge", 1);

function getActionSurgeCount(level: number) {
  return level < 17 ? 1 : 2;
}

const UsedActionSurgeThisTurn = new Effect(
  "Action Surged",
  "turnEnd",
  undefined,
  { quiet: true },
);

class ActionSurgeAction extends AbstractAction {
  constructor(g: Engine, actor: Combatant) {
    super(
      g,
      actor,
      "Action Surge",
      "implemented",
      {},
      {
        description: `On your turn, you can take one additional action.`,
        resources: new Map([[ActionSurgeResource, 1]]),
      },
    );
  }

  check(config: never, ec: ErrorCollector) {
    if (this.actor.hasEffect(UsedActionSurgeThisTurn))
      ec.add("already used this turn", this);
    if (this.actor.hasTime("action")) ec.add("still has action", this);

    return super.check({}, ec);
  }

  async apply() {
    await super.apply({});

    this.actor.regainTime("action");
    await this.actor.addEffect(UsedActionSurgeThisTurn, {
      duration: 1,
    });
  }
}

const ActionSurge = new SimpleFeature(
  "Action Surge",
  `Starting at 2nd level, you can push yourself beyond your normal limits for a moment. On your turn, you can take one additional action.

Once you use this feature, you must finish a short or long rest before you can use it again. Starting at 17th level, you can use it twice before a rest, but only once on the same turn.`,
  (g, me) => {
    const charges = getActionSurgeCount(me.classLevels.get("Fighter") ?? 2);
    me.initResource(ActionSurgeResource, charges);

    g.events.on("GetActions", ({ detail: { who, actions } }) => {
      if (who === me) actions.push(new ActionSurgeAction(g, me));
    });
  },
);
export default ActionSurge;

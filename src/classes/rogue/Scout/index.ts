import AbstractAction from "../../../actions/AbstractAction";
import ErrorCollector from "../../../collectors/ErrorCollector";
import { HasTarget } from "../../../configs";
import Engine from "../../../Engine";
import { notImplementedFeature } from "../../../features/common";
import SimpleFeature from "../../../features/SimpleFeature";
import { isEnemy } from "../../../filters";
import YesNoChoice from "../../../interruptions/YesNoChoice";
import { MapSquareSize } from "../../../MapSquare";
import { BoundedMove } from "../../../movement";
import TargetResolver from "../../../resolvers/TargetResolver";
import Combatant from "../../../types/Combatant";
import PCSubclass from "../../../types/PCSubclass";
import { checkConfig } from "../../../utils/config";
import { round } from "../../../utils/numbers";

class SkirmisherAction extends AbstractAction<HasTarget> {
  constructor(g: Engine, actor: Combatant) {
    super(
      g,
      actor,
      "Skirmisher",
      "implemented",
      { target: new TargetResolver(g, 5, [isEnemy]) },
      {
        time: "reaction",
        description: `You can move up to half your speed as a reaction when an enemy ends its turn within 5 feet of you. This movement doesn't provoke opportunity attacks.`,
      },
    );
  }

  getAffected() {
    return [this.actor];
  }
  getTargets() {
    return [];
  }

  check({ target }: Partial<HasTarget>, ec: ErrorCollector) {
    if (this.actor.speed <= 0) ec.add("cannot move", this);
    return super.check({ target }, ec);
  }

  async apply({ target }: HasTarget) {
    await super.apply({ target });
    await this.g.applyBoundedMove(
      this.actor,
      new BoundedMove(Skirmisher, round(this.actor.speed / 2, MapSquareSize), {
        provokesOpportunityAttacks: false,
      }),
    );
  }
}

const Skirmisher = new SimpleFeature(
  "Skirmisher",
  `Starting at 3rd level, you are difficult to pin down during a fight. You can move up to half your speed as a reaction when an enemy ends its turn within 5 feet of you. This movement doesn't provoke opportunity attacks.`,
  (g, me) => {
    g.events.on("GetActions", ({ detail: { who, actions } }) => {
      if (who === me) actions.push(new SkirmisherAction(g, me));
    });

    g.events.on("TurnEnded", ({ detail: { who, interrupt } }) => {
      const action = new SkirmisherAction(g, me);
      const config: HasTarget = { target: who };
      if (checkConfig(g, action, config))
        interrupt.add(
          new YesNoChoice(
            me,
            Skirmisher,
            "Skirmisher",
            `Use ${me.name}'s reaction to move half their speed?`,
            async () => {
              await g.act(action, config);
            },
          ),
        );
    });
  },
);

const Survivalist = new SimpleFeature(
  "Survivalist",
  `When you choose this archetype at 3rd level, you gain proficiency in the Nature and Survival skills if you don't already have it. Your proficiency bonus is doubled for any ability check you make that uses either of those proficiencies.`,
  (g, me) => {
    me.addProficiency("Nature", "expertise");
    me.addProficiency("Survival", "expertise");
  },
);

// TODO [TERRAIN]
const SuperiorMobility = notImplementedFeature(
  "Superior Mobility",
  `At 9th level, your walking speed increases by 10 feet. If you have a climbing or swimming speed, this increase applies to that speed as well.`,
);

// TODO
const AmbushMaster = notImplementedFeature(
  "Ambush Master",
  `Starting at 13th level, you excel at leading ambushes and acting first in a fight.

You have advantage on initiative rolls. In addition, the first creature you hit during the first round of a combat becomes easier for you and others to strike; attack rolls against that target have advantage until the start of your next turn.`,
);

// TODO
const SuddenStrike = notImplementedFeature(
  "Sudden Strike",
  `Starting at 17th level, you can strike with deadly speed. If you take the Attack action on your turn, you can make one additional attack as a bonus action. This attack can benefit from your Sneak Attack even if you have already used it this turn, but you can't use your Sneak Attack against the same target more than once in a turn.`,
);

const Scout: PCSubclass = {
  name: "Scout",
  className: "Rogue",
  features: new Map([
    [3, [Skirmisher, Survivalist]],
    [9, [SuperiorMobility]],
    [13, [AmbushMaster]],
    [17, [SuddenStrike]],
  ]),
};
export default Scout;

import AbstractAction from "../actions/AbstractAction";
import DiceTypeCollector from "../collectors/DiceTypeCollector";
import ErrorCollector from "../collectors/ErrorCollector";
import { HasTarget } from "../configs";
import Engine from "../Engine";
import YesNoChoice from "../interruptions/YesNoChoice";
import TargetResolver from "../resolvers/TargetResolver";
import Combatant from "../types/Combatant";
import { checkConfig } from "../utils/config";
import SimpleFeature from "./SimpleFeature";

class ProtectionAction extends AbstractAction<HasTarget> {
  constructor(
    g: Engine,
    actor: Combatant,
    private diceType: DiceTypeCollector,
  ) {
    super(
      g,
      actor,
      "Fighting Style: Protection",
      "implemented",
      { target: new TargetResolver(g, 5) },
      {
        time: "reaction",
        description: `When a creature you can see attacks a target other than you that is within 5 feet of you, you can use your reaction to impose disadvantage on the attack roll. You must be wielding a shield.`,
      },
    );
  }

  // TODO [SIGHT] creature you can see
  check({ target }: Partial<HasTarget>, ec: ErrorCollector) {
    if (target && target.side !== this.actor.side) ec.add("only allies", this);
    if (!this.actor.shield) ec.add("need shield", this);

    return super.check({ target }, ec);
  }

  async apply({ target }: HasTarget) {
    await super.apply({ target });
    this.diceType.add("disadvantage", this);
  }
}

export const FightingStyleProtection = new SimpleFeature(
  "Fighting Style: Protection",
  `When a creature you can see attacks a target other than you that is within 5 feet of you, you can use your reaction to impose disadvantage on the attack roll. You must be wielding a shield.`,
  (g, me) => {
    g.events.on("GetActions", ({ detail: { who, actions } }) => {
      if (who === me)
        actions.push(new ProtectionAction(g, me, new DiceTypeCollector()));
    });

    g.events.on(
      "BeforeAttack",
      ({ detail: { who, target, interrupt, diceType } }) => {
        if (who !== me) return;

        const action = new ProtectionAction(g, me, diceType);
        const config = { target };
        if (checkConfig(g, action, config))
          interrupt.add(
            new YesNoChoice(
              me,
              FightingStyleProtection,
              "Fighting Style: Protection",
              `${target.name} is being attacked. Use ${me.name}'s reaction to impose disadvantage?`,
              async () => await action.apply(config),
            ),
          );
      },
    );
  },
);

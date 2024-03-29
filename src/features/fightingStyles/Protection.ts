import protectionUrl from "@img/act/protection.svg";

import { AbstractSingleTargetAction } from "../../actions/AbstractAction";
import DiceTypeCollector from "../../collectors/DiceTypeCollector";
import ErrorCollector from "../../collectors/ErrorCollector";
import { makeIcon } from "../../colours";
import Engine from "../../Engine";
import { canSee, isAlly, isEnemy, notSelf } from "../../filters";
import YesNoChoice from "../../interruptions/YesNoChoice";
import TargetResolver from "../../resolvers/TargetResolver";
import Combatant from "../../types/Combatant";
import Priority from "../../types/Priority";
import { checkConfig } from "../../utils/config";
import SimpleFeature from "../SimpleFeature";

interface HasAttacker {
  attacker: Combatant;
}

const ProtectionIcon = makeIcon(protectionUrl);

class ProtectionAction extends AbstractSingleTargetAction<HasAttacker> {
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
      {
        target: new TargetResolver(g, 5, [isAlly, notSelf]),
        attacker: new TargetResolver(g, Infinity, [isEnemy, canSee]),
      },
      {
        time: "reaction",
        icon: ProtectionIcon,
        description: `When a creature you can see attacks a target other than you that is within 5 feet of you, you can use your reaction to impose disadvantage on the attack roll. You must be wielding a shield.`,
      },
    );
  }

  check(config: never, ec: ErrorCollector) {
    if (!this.actor.shield) ec.add("need shield", this);
    return super.check(config, ec);
  }

  async applyEffect() {
    this.diceType.add("disadvantage", this);
  }
}

const FightingStyleProtection = new SimpleFeature(
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
        if (who === me) return;

        const action = new ProtectionAction(g, me, diceType);
        const config = { attacker: who, target };
        if (checkConfig(g, action, config))
          interrupt.add(
            new YesNoChoice(
              me,
              FightingStyleProtection,
              "Fighting Style: Protection",
              `${target.name} is being attacked by ${who.name}. Use ${me.name}'s reaction to impose disadvantage?`,
              Priority.ChangesOutcome,
              () => g.act(action, config),
            ),
          );
      },
    );
  },
);
export default FightingStyleProtection;

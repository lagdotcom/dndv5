import AbstractAction from "../../actions/AbstractAction";
import BonusCollector from "../../collectors/BonusCollector";
import InterruptionCollector from "../../collectors/InterruptionCollector";
import { HasTarget } from "../../configs";
import Engine from "../../Engine";
import SimpleFeature from "../../features/SimpleFeature";
import { canSee } from "../../filters";
import YesNoChoice from "../../interruptions/YesNoChoice";
import TargetResolver from "../../resolvers/TargetResolver";
import { LongRestResource } from "../../resources";
import Combatant from "../../types/Combatant";
import { sieve } from "../../utils/array";
import { checkConfig } from "../../utils/config";
import { describeCheck, describeSave } from "../../utils/text";

const FlashOfGeniusResource = new LongRestResource("Flash of Genius", 1);

class FlashOfGeniusAction extends AbstractAction<HasTarget> {
  constructor(
    g: Engine,
    actor: Combatant,
    private bonus: BonusCollector,
  ) {
    super(
      g,
      actor,
      "Flash of Genius",
      "implemented",
      { target: new TargetResolver(g, 30, [canSee]) },
      {
        time: "reaction",
        resources: [[FlashOfGeniusResource, 1]],
        description: `When you or another creature you can see within 30 feet of you makes an ability check or a saving throw, you can use your reaction to add your Intelligence modifier to the roll.`,
      },
    );
  }

  getTargets({ target }: Partial<HasTarget>) {
    return sieve(target);
  }
  getAffected({ target }: HasTarget) {
    return [target];
  }

  async apply({ target }: HasTarget) {
    await super.apply({ target });
    this.bonus.add(this.actor.int.modifier, FlashOfGenius);
  }
}

const FlashOfGenius = new SimpleFeature(
  "Flash of Genius",
  `Starting at 7th level, you gain the ability to come up with solutions under pressure. When you or another creature you can see within 30 feet of you makes an ability check or a saving throw, you can use your reaction to add your Intelligence modifier to the roll.

You can use this feature a number of times equal to your Intelligence modifier (minimum of once). You regain all expended uses when you finish a long rest.`,
  (g, me) => {
    const charges = Math.max(1, me.int.modifier);
    me.initResource(FlashOfGeniusResource, charges);

    const doFlash = (
      description: string,
      target: Combatant,
      interrupt: InterruptionCollector,
      bonus: BonusCollector,
    ) => {
      const action = new FlashOfGeniusAction(g, me, bonus);
      const config = { target };

      if (checkConfig(g, action, config))
        interrupt.add(
          new YesNoChoice(
            me,
            FlashOfGenius,
            "Flash of Genius",
            `Use ${me.name}'s reaction to give +${me.int.modifier} to ${description}?`,
            async () => {
              await g.act(action, config);
            },
          ),
        );
    };

    g.events.on(
      "BeforeCheck",
      ({ detail: { who, ability, skill, interrupt, bonus } }) =>
        doFlash(
          `${who.name}'s ${describeCheck(ability, skill)} check`,
          who,
          interrupt,
          bonus,
        ),
    );
    g.events.on(
      "BeforeSave",
      ({ detail: { who, tags, ability, interrupt, bonus } }) =>
        doFlash(
          `${who.name}'s ${describeSave(tags, ability)} save`,
          who,
          interrupt,
          bonus,
        ),
    );
  },
);
export default FlashOfGenius;

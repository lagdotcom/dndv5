import AbstractAction from "../../actions/AbstractAction";
import ErrorCollector from "../../collectors/ErrorCollector";
import { Scales } from "../../configs";
import Engine from "../../Engine";
import SimpleFeature from "../../features/SimpleFeature";
import ChoiceResolver from "../../resolvers/ChoiceResolver";
import { LongRestResource } from "../../resources";
import {
  getSpellSlotResourceName,
  SpellSlotResources,
} from "../../spells/NormalSpellcasting";
import Combatant from "../../types/Combatant";
import { enumerate, ordinal } from "../../utils/numbers";
import { ChannelDivinityResource } from "./ChannelDivinity";

const HarnessDivinePowerResource = new LongRestResource(
  "Harness Divine Power",
  1,
);

class HarnessDivinePowerAction extends AbstractAction<Scales> {
  constructor(g: Engine, actor: Combatant) {
    super(
      g,
      actor,
      "Harness Divine Power",
      "implemented",
      {
        slot: new ChoiceResolver(
          g,
          enumerate(1, 9)
            .filter((slot) =>
              actor.resources.has(getSpellSlotResourceName(slot)),
            )
            .map((value) => {
              const resource = SpellSlotResources[value];

              return {
                label: ordinal(value),
                value,
                disabled:
                  actor.getResourceMax(resource) <= actor.getResource(resource),
              };
            }),
        ),
      },
      {
        time: "bonus action",
        resources: [
          [ChannelDivinityResource, 1],
          [HarnessDivinePowerResource, 1],
        ],
        description: `You can expend a use of your Channel Divinity to fuel your spells. As a bonus action, you touch your holy symbol, utter a prayer, and regain one expended spell slot, the level of which can be no higher than half your proficiency bonus (rounded up). The number of times you can use this feature is based on the level you've reached in this class: 3rd level, once; 7th level, twice; and 15th level, thrice. You regain all expended uses when you finish a long rest.`,
      },
    );
  }

  check({ slot }: Partial<Scales>, ec: ErrorCollector): ErrorCollector {
    if (slot) {
      const resource = SpellSlotResources[slot];

      if (
        this.actor.getResource(resource) >= this.actor.getResourceMax(resource)
      )
        ec.add(`full on ${resource.name}`, this);
    }

    return super.check({ slot }, ec);
  }

  async apply({ slot }: Scales) {
    await super.apply({ slot });
    this.actor.giveResource(SpellSlotResources[slot], 1);
  }
}

function getHarnessCount(level: number) {
  if (level < 6) return 1;
  if (level < 18) return 2;
  return 3;
}

const HarnessDivinePower = new SimpleFeature(
  "Channel Divinity: Harness Divine Power",
  `You can expend a use of your Channel Divinity to fuel your spells. As a bonus action, you touch your holy symbol, utter a prayer, and regain one expended spell slot, the level of which can be no higher than half your proficiency bonus (rounded up). The number of times you can use this feature is based on the level you've reached in this class: 3rd level, once; 7th level, twice; and 15th level, thrice. You regain all expended uses when you finish a long rest.`,
  (g, me) => {
    me.initResource(
      HarnessDivinePowerResource,
      getHarnessCount(me.classLevels.get("Cleric") ?? 2),
    );

    g.events.on("GetActions", ({ detail: { actions, who } }) => {
      if (who === me) actions.push(new HarnessDivinePowerAction(g, me));
    });
  },
);
export default HarnessDivinePower;

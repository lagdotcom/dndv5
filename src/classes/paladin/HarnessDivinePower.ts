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
import Action, { ActionConfig } from "../../types/Action";
import ActionTime from "../../types/ActionTime";
import Combatant from "../../types/Combatant";
import { enumerate, ordinal } from "../../utils/numbers";
import { ChannelDivinityResource } from "./common";

const HarnessDivinePowerResource = new LongRestResource(
  "Harness Divine Power",
  1
);

class HarnessDivinePowerAction implements Action<Scales> {
  config: ActionConfig<Scales>;
  name: string;
  time: ActionTime;

  constructor(public g: Engine, public actor: Combatant) {
    this.name = "Harness Divine Power";
    this.time = "bonus action";
    this.config = {
      slot: new ChoiceResolver(
        g,
        enumerate(1, 9)
          .filter((slot) => actor.resources.has(getSpellSlotResourceName(slot)))
          .map((value) => {
            const resource = SpellSlotResources[value];

            return {
              label: ordinal(value),
              value,
              disabled:
                actor.getResourceMax(resource) <= actor.getResource(resource),
            };
          })
      ),
    };
  }

  getAffectedArea() {
    return undefined;
  }

  getConfig() {
    return this.config;
  }

  getDamage() {
    return undefined;
  }

  check({ slot }: Partial<Scales>, ec = new ErrorCollector()): ErrorCollector {
    if (!this.actor.hasResource(HarnessDivinePowerResource))
      ec.add("no Harness Divine Power left", this);

    if (slot) {
      const resource = SpellSlotResources[slot];

      if (
        this.actor.getResource(resource) === this.actor.getResourceMax(resource)
      )
        ec.add(`full on ${resource.name}`, this);
    }

    return ec;
  }

  async apply({ slot }: Scales) {
    this.actor.spendResource(ChannelDivinityResource);
    this.actor.time.delete("bonus action");

    this.actor.giveResource(SpellSlotResources[slot], 1);
  }
}

function getHarnessCount(level: number) {
  if (level < 7) return 1;
  if (level < 15) return 2;
  return 3;
}

const HarnessDivinePower = new SimpleFeature(
  "Channel Divinity: Harness Divine Power",
  `You can expend a use of your Channel Divinity to fuel your spells. As a bonus action, you touch your holy symbol, utter a prayer, and regain one expended spell slot, the level of which can be no higher than half your proficiency bonus (rounded up). The number of times you can use this feature is based on the level you've reached in this class: 3rd level, once; 7th level, twice; and 15th level, thrice. You regain all expended uses when you finish a long rest.`,
  (g, me) => {
    me.initResource(
      HarnessDivinePowerResource,
      getHarnessCount(me.classLevels.get("Paladin") ?? 3)
    );

    g.events.on("getActions", ({ detail: { actions, who } }) => {
      if (who === me) actions.push(new HarnessDivinePowerAction(g, me));
    });
  }
);
export default HarnessDivinePower;

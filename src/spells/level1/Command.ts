import { HasTargets } from "../../configs";
import {
  canBeHeardBy,
  canSee,
  notOfCreatureType,
  withinRangeOfEachOther,
} from "../../filters";
import MultiTargetResolver from "../../resolvers/MultiTargetResolver";
import { poSet, poWithin } from "../../utils/ai";
import { combinationsMulti } from "../../utils/combinatorics";
import { scalingSpell } from "../common";

const Command = scalingSpell<HasTargets>({
  name: "Command",
  level: 1,
  school: "Enchantment",
  v: true,
  lists: ["Cleric", "Paladin"],
  description: `You speak a one-word command to a creature you can see within range. The target must succeed on a Wisdom saving throw or follow the command on its next turn. The spell has no effect if the target is undead, if it doesn't understand your language, or if your command is directly harmful to it.

  Some typical commands and their effects follow. You might issue a command other than one described here. If you do so, the DM determines how the target behaves. If the target can't follow your command, the spell ends.
  
  Approach. The target moves toward you by the shortest and most direct route, ending its turn if it moves within 5 feet of you.
  Drop. The target drops whatever it is holding and then ends its turn.
  Flee. The target spends its turn moving away from you by the fastest available means.
  Grovel. The target falls prone and then ends its turn.
  Halt. The target doesn't move and takes no actions. A flying creature stays aloft, provided that it is able to do so. If it must move to stay aloft, it flies the minimum distance needed to remain in the air.
  
  At Higher Levels. When you cast this spell using a spell slot of 2nd level or higher, you can affect one additional creature for each slot level above 1st. The creatures must be within 30 feet of each other when you target them.`,
  isHarmful: true,

  getConfig: (g, actor, method, { slot }) => ({
    targets: new MultiTargetResolver(
      g,
      1,
      slot ?? 1,
      60,
      [canSee, canBeHeardBy, notOfCreatureType("undead")], // TODO if it doesn't understand your language
      [withinRangeOfEachOther(30)],
    ),
  }),

  generateAttackConfigs: (slot, allTargets) =>
    combinationsMulti(allTargets, 1, slot).map((targets) => ({
      config: { targets },
      positioning: poSet(...targets.map((target) => poWithin(60, target))),
    })),

  getTargets: (g, caster, { targets }) => targets ?? [],
  getAffected: (g, caster, { targets }) => targets,

  async apply() {
    // TODO
  },
});
export default Command;

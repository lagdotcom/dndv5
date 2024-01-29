import { HasTargets } from "../../configs";
import { canSee, withinRangeOfEachOther } from "../../filters";
import MultiTargetResolver from "../../resolvers/MultiTargetResolver";
import { scalingSpell } from "../common";
import { targetsMany } from "../helpers";

const CharmPerson = scalingSpell<HasTargets>({
  name: "Charm Person",
  level: 1,
  school: "Enchantment",
  v: true,
  lists: ["Bard", "Druid", "Sorcerer", "Warlock", "Wizard"],
  description: `You attempt to charm a humanoid you can see within range. It must make a Wisdom saving throw, and does so with advantage if you or your companions are fighting it. If it fails the saving throw, it is charmed by you until the spell ends or until you or your companions do anything harmful to it. The charmed creature regards you as a friendly acquaintance. When the spell ends, the creature knows it was charmed by you.

  At Higher Levels. When you cast this spell using a spell slot of 2nd level or higher, you can target one additional creature for each slot level above 1st. The creatures must be within 30 feet of each other when you target them.`,
  isHarmful: true,

  ...targetsMany(1, 1, 60, [canSee]),
  getConfig: (g, actor, method, { slot }) => ({
    targets: new MultiTargetResolver(
      g,
      1,
      slot ?? 1,
      60,
      [canSee],
      [withinRangeOfEachOther(30)],
    ),
  }),

  // TODO generateAttackConfigs,

  async apply() {
    // TODO
  },
});
export default CharmPerson;

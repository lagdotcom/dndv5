import SimpleFeature from "../../features/SimpleFeature";
import { ChannelDivinityResource } from "../common";

function getChannelCount(level: number) {
  if (level < 6) return 1;
  if (level < 18) return 2;
  return 3;
}

const ChannelDivinity = new SimpleFeature(
  "Channel Divinity",
  `Your oath allows you to channel divine energy to fuel magical effects. Each Channel Divinity option provided by your oath explains how to use it.
When you use your Channel Divinity, you choose which option to use. You must then finish a short or long rest to use your Channel Divinity again.
Some Channel Divinity effects require saving throws. When you use such an effect from this class, the DC equals your paladin spell save DC.`,
  (g, me) => {
    me.initResource(
      ChannelDivinityResource,
      getChannelCount(me.classLevels.get("Cleric") ?? 1),
    );
  },
);
export default ChannelDivinity;

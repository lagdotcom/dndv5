import { notImplementedFeature } from "../../features/common";
import { PCClassLevel } from "../../flavours";
import { LongRestResource } from "../../resources";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const IndomitableResource = new LongRestResource("Indomitable", 1);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getIndomitableCount(level: PCClassLevel) {
  if (level < 13) return 1;
  if (level < 17) return 2;
  return 3;
}

// TODO [REROLLSAVE]
const Indomitable = notImplementedFeature(
  "Indomitable",
  `Beginning at 9th level, you can reroll a saving throw that you fail. If you do so, you must use the new roll, and you can't use this feature again until you finish a long rest.

You can use this feature twice between long rests starting at 13th level and three times between long rests starting at 17th level.`,
);
export default Indomitable;

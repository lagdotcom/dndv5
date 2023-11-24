import { notImplementedFeature } from "../../features/common";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getDestroyUndeadCR(level: number) {
  if (level < 5) return -Infinity;
  if (level < 8) return 0.5;
  if (level < 11) return 1;
  if (level < 14) return 2;
  if (level < 17) return 3;
  return 4;
}

// TODO
const TurnUndead = notImplementedFeature(
  "Turn Undead",
  `As an action, you present your holy symbol and speak a prayer censuring the undead. Each undead that can see or hear you within 30 feet of you must make a Wisdom saving throw. If the creature fails its saving throw, it is turned for 1 minute or until it takes any damage.

A turned creature must spend its turns trying to move as far away from you as it can, and it can't willingly move to a space within 30 feet of you. It also can't take reactions. For its action, it can use only the Dash action or try to escape from an effect that prevents it from moving. If there's nowhere to move, the creature can use the Dodge action.`,
);
export default TurnUndead;

import Combatant from "../types/Combatant";
import Feature from "../types/Feature";

declare const MODE: "build" | "watch" | "test";

export function implementationWarning(
  type: string,
  status: string,
  name: string,
  who: string,
) {
  if (MODE !== "test") console.warn(`[${type} ${status}] ${name} (on ${who})`);
}

export function featureNotComplete(feature: Feature, who: Combatant) {
  implementationWarning("Feature", "Not Complete", feature.name, who.name);
}

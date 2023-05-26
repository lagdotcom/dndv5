import SimpleFeature from "./SimpleFeature";

export function darkvisionFeature(range = 60) {
  return new SimpleFeature(
    "Darkvision",
    `You can see in dim light within ${range} feet of you as if it were bright light and in darkness as if it were dim light. You can’t discern color in darkness, only shades of gray.`,
    (_, me) => {
      me.senses.set("darkvision", range);
    }
  );
}

export function nonCombatFeature(name: string, text: string) {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  return new SimpleFeature(name, text, () => {});
}

export function notImplementedFeat(name: string, text: string) {
  return new SimpleFeature(name, text, (_, me) => {
    console.warn(`[Feat Missing] ${name} (on ${me.name})`);
  });
}

export function notImplementedFeature(name: string, text: string) {
  return new SimpleFeature(name, text, (_, me) => {
    console.warn(`[Feature Missing] ${name} (on ${me.name})`);
  });
}

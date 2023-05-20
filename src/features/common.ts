import SimpleFeature from "./SimpleFeature";

export function darkvisionFeature(range = 60) {
  return new SimpleFeature("Darkvision", (_, me) => {
    me.senses.set("darkvision", range);
  });
}

export function notImplementedFeature(name: string) {
  return new SimpleFeature(name, () => {
    console.warn(`[Feature Missing] ${name}`);
  });
}

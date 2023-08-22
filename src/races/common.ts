import SimpleFeature from "../features/SimpleFeature";
import DamageType from "../types/DamageType";

export function poisonResistance(name: string, text: string) {
  const feature = new SimpleFeature(name, text, (g, me) => {
    g.events.on("BeforeSave", ({ detail: { who, diceType, tags } }) => {
      if (who === me && tags.has("poison")) diceType.add("advantage", feature);
    });

    g.events.on(
      "GetDamageResponse",
      ({ detail: { who, damageType, response } }) => {
        if (who === me && damageType === "poison")
          response.add("resist", feature);
      },
    );
  });

  return feature;
}

export function resistanceFeature(
  name: string,
  text: string,
  types: DamageType[],
) {
  const feature = new SimpleFeature(name, text, (g, me) => {
    g.events.on(
      "GetDamageResponse",
      ({ detail: { who, damageType, response: result } }) => {
        if (who === me && types.includes(damageType))
          result.add("resist", feature);
      },
    );
  });

  return feature;
}

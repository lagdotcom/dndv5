import ConfiguredFeature from "../features/ConfiguredFeature";
import SimpleFeature from "../features/SimpleFeature";
import DamageType from "../types/DamageType";
import LanguageName from "../types/LanguageName";

export function poisonResistanceFeature(name: string, text: string) {
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

export const ExtraLanguage = new ConfiguredFeature<LanguageName>(
  "Extra Language",
  `You can speak, read, and write one extra language of your choice.`,
  (g, me, language) => {
    me.languages.add(language);
  },
);

export const FeyAncestry = new SimpleFeature(
  "Fey Ancestry",
  `You have advantage on saving throws against being charmed, and magic can't put you to sleep.`,
  (g, me) => {
    g.events.on("BeforeSave", ({ detail: { who, config, diceType } }) => {
      if (who === me && config?.conditions?.has("Charmed"))
        diceType.add("advantage", FeyAncestry);
    });

    g.events.on("BeforeEffect", ({ detail: { who, effect, success } }) => {
      if (who === me && effect.tags.has("magic") && effect.tags.has("sleep"))
        success.add("fail", FeyAncestry);
    });
  },
);

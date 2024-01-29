import Effect from "../../Effect";
import MessageBuilder from "../../MessageBuilder";
import ChoiceResolver from "../../resolvers/ChoiceResolver";
import AbilityName from "../../types/AbilityName";
import DamageAmount from "../../types/DamageAmount";
import { EffectConfig } from "../../types/EffectType";
import { WeaponItem } from "../../types/Item";
import { _dd } from "../../utils/dice";
import { minutes } from "../../utils/time";
import { simpleSpell } from "../common";
import { selfTarget } from "../helpers";

const shillelaghWeapons = new Set(["club", "quarterstaff"]);

interface Config {
  item: WeaponItem;
  name: string;
  magical?: boolean;
  damage: DamageAmount;
  forceAbilityScore?: AbilityName;
  versatile: boolean;
}

const ShillelaghEffect = new Effect<Config>(
  "Shillelagh",
  "turnStart",
  (g) => {
    g.events.on("EffectRemoved", ({ detail: { effect, config } }) => {
      if (effect === ShillelaghEffect) {
        const { item, name, magical, damage, forceAbilityScore, versatile } =
          config as EffectConfig<Config>;

        item.name = name;
        item.magical = magical;
        item.damage = damage;
        item.forceAbilityScore = forceAbilityScore;
        if (versatile) item.properties.add("versatile");
      }
    });
  },
  { tags: ["magic"] },
);

const Shillelagh = simpleSpell<{ item: WeaponItem }>({
  status: "implemented",
  name: "Shillelagh",
  level: 0,
  school: "Transmutation",
  time: "bonus action",
  v: true,
  s: true,
  m: "mistletoe, a shamrock leaf, and a club or quarterstaff",
  lists: ["Druid"],
  description: `The wood of a club or quarterstaff you are holding is imbued with nature's power. For the duration, you can use your spellcasting ability instead of Strength for the attack and damage rolls of melee attacks using that weapon, and the weapon's damage die becomes a d8. The weapon also becomes magical, if it isn't already. The spell ends if you cast it again or if you let go of the weapon.`,

  ...selfTarget,

  getConfig: (g, caster) => ({
    item: new ChoiceResolver(
      g,
      Array.from(caster.equipment)
        .filter(
          (it) =>
            it.itemType === "weapon" && shillelaghWeapons.has(it.weaponType),
        )
        .map((value) => ({ label: value.name, value })),
    ),
  }),

  async apply({ g, caster, method }, { item }) {
    const { name, magical, damage, forceAbilityScore } = item;
    const versatile = item.properties.has("versatile");

    g.text(
      new MessageBuilder()
        .co(caster)
        .text(" transforms their ")
        .it(item)
        .text(" into a shillelagh."),
    );

    item.name = `shillelagh (${item.name})`;
    item.magical = true;
    item.damage = _dd(1, 8, "bludgeoning");
    item.forceAbilityScore = method.ability;
    item.properties.delete("versatile");

    await caster.addEffect(ShillelaghEffect, {
      duration: minutes(1),
      item,
      name,
      magical,
      damage,
      forceAbilityScore,
      versatile,
    });
  },
});
export default Shillelagh;

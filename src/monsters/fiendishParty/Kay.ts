import wreathedInShadowUrl from "@img/act/wreathed-in-shadow.svg";
import tokenUrl from "@img/tok/boss/kay.png";

import { makeIcon } from "../../colours";
import MonsterTemplate from "../../data/MonsterTemplate";
import Effect from "../../Effect";
import Evasion from "../../features/Evasion";
import SimpleFeature from "../../features/SimpleFeature";
import EvaluateLater from "../../interruptions/EvaluateLater";
import { atSet } from "../../types/AttackTag";
import { MundaneDamageTypes } from "../../types/DamageType";
import Priority from "../../types/Priority";
import { isA } from "../../utils/types";
import { makeBagMultiattack } from "../multiattack";

const hiddenName = "Shrouded Figure";
const realName = "Kay of the Abyss";

const ScreamingInside = new SimpleFeature(
  "Screaming Inside",
  "Kay does an extra 4 (1d6) psychic damage when he hits with a weapon attack.",
  (g, me) => {
    g.events.on(
      "GatherDamage",
      ({ detail: { attacker, attack, interrupt, target, critical, map } }) => {
        if (attacker === me && attack?.roll.type.tags.has("weapon"))
          interrupt.add(
            new EvaluateLater(
              me,
              ScreamingInside,
              Priority.Normal,
              async () => {
                const amount = await g.rollDamage(
                  1,
                  {
                    source: ScreamingInside,
                    attacker,
                    target,
                    size: 6,
                    damageType: "psychic",
                    tags: atSet("magical"),
                  },
                  critical,
                );
                map.add("psychic", amount);
              },
            ),
          );
      },
    );
  },
);

const WreathedInShadowEffect = new Effect(
  "Wreathed in Shadow",
  "turnStart",
  (g) => {
    g.events.on("BeforeAttack", ({ detail: { target, diceType } }) => {
      if (target.hasEffect(WreathedInShadowEffect))
        diceType.add("disadvantage", WreathedInShadowEffect);
    });

    g.events.on("CombatantDamaged", ({ detail: { who, total, interrupt } }) => {
      if (who.hasEffect(WreathedInShadowEffect) && total >= 10)
        interrupt.add(
          new EvaluateLater(
            who,
            WreathedInShadowEffect,
            Priority.Late,
            async () => {
              await who.removeEffect(WreathedInShadowEffect);
              who.name = realName;
            },
          ),
        );
    });
  },
  { icon: makeIcon(wreathedInShadowUrl) },
);

const WreathedInShadow = new SimpleFeature(
  "Wreathed in Shadow",
  "Kay's appearance is hidden from view by a thick black fog that whirls about him. Only a DC 22 Perception check can reveal his identity. All attacks against him are at disadvantage. This effect is dispelled until the beginning of his next turn if he takes more than 10 damage in one hit.",
  (g, me) => {
    // TODO Only a DC 22 Perception check can reveal his identity.
    const wreathe = new EvaluateLater(
      me,
      WreathedInShadow,
      Priority.Normal,
      async () => {
        await me.addEffect(WreathedInShadowEffect, { duration: Infinity });
        me.name = hiddenName;
      },
    );

    g.events.on("BattleStarted", ({ detail: { interrupt } }) => {
      interrupt.add(wreathe);
    });

    g.events.on("TurnStarted", ({ detail: { who, interrupt } }) => {
      if (who === me && !who.hasEffect(WreathedInShadowEffect))
        interrupt.add(wreathe);
    });
  },
);

const SmoulderingRage = new SimpleFeature(
  "Smouldering Rage",
  "Kay resists bludgeoning, piercing, and slashing damage from nonmagical attacks.",
  (g, me) => {
    g.events.on(
      "GetDamageResponse",
      ({ detail: { who, damageType, attack, response } }) => {
        if (
          who === me &&
          !attack?.roll.type.tags.has("magical") &&
          isA(damageType, MundaneDamageTypes)
        )
          response.add("resist", SmoulderingRage);
      },
    );
  },
);

const KayMultiattack = makeBagMultiattack(
  "Kay attacks twice with his Spear or Longbow.",
  [{ weapon: "spear" }, { weapon: "spear" }],
  [{ weapon: "longbow" }, { weapon: "longbow" }],
);

const Kay: MonsterTemplate = {
  name: realName,
  cr: 6,
  type: "humanoid",
  tokenUrl,
  hpMax: 75,
  align: ["Chaotic", "Neutral"],
  makesDeathSaves: true,
  abilities: [14, 18, 16, 10, 8, 14],
  pb: 3,
  proficiency: {
    str: "proficient",
    dex: "proficient",
    Athletics: "proficient",
    Stealth: "expertise",
  },
  immunities: ["Frightened"],
  languages: ["Common", "Orc", "Abyssal"],
  features: [
    ScreamingInside,
    WreathedInShadow,
    KayMultiattack,
    Evasion,
    SmoulderingRage,
  ],
  items: [
    { name: "studded leather armor", equip: true },
    { name: "longbow", equip: true },
    { name: "spear" },
    { name: "arrow", quantity: 20 },
  ],
};
export default Kay;

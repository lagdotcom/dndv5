import { Dead } from "../../effects";
import SimpleFeature from "../../features/SimpleFeature";
import YesNoChoice from "../../interruptions/YesNoChoice";
import MessageBuilder from "../../MessageBuilder";
import { ShortRestResource } from "../../resources";
import { RageEffect } from "./Rage";

const RelentlessRageResource = new ShortRestResource(
  "Relentless Rage DC",
  Infinity,
);

const RelentlessRage = new SimpleFeature(
  "Relentless Rage",
  `Starting at 11th level, your rage can keep you fighting despite grievous wounds. If you drop to 0 hit points while you're raging and don't die outright, you can make a DC 10 Constitution saving throw. If you succeed, you drop to 1 hit point instead.

Each time you use this feature after the first, the DC increases by 5. When you finish a short or long rest, the DC resets to 10.`,
  (g, me) => {
    me.initResource(RelentlessRageResource, 10, Infinity);

    g.events.on("CombatantDamaged", ({ detail: { who, interrupt } }) => {
      if (
        who === me &&
        me.hasEffect(RageEffect) &&
        !me.hasEffect(Dead) &&
        me.hp <= 0
      )
        interrupt.add(
          new YesNoChoice(
            me,
            RelentlessRage,
            "Relentless Rage",
            `${me.name} is about to fall unconscious. Try to stay conscious with Relentless Rage?`,
            async () => {
              const dc = me.getResource(RelentlessRageResource) ?? 10;
              who.giveResource(RelentlessRageResource, 5);

              const { outcome } = await g.save({
                source: RelentlessRage,
                type: { type: "flat", dc },
                who,
                ability: "con",
              });
              if (outcome === "success") {
                g.text(
                  new MessageBuilder()
                    .co(who)
                    .text(" refuses to fall unconscious!"),
                );
                who.hp = 1;
              }
            },
          ),
        );
    });
  },
);
export default RelentlessRage;

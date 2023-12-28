import { injectTestPC } from "../../data/allPCs";
import { SaveEventDetail } from "../../events/SaveEvent";
import setupBattleTest from "../../tests/setupBattleTest";
import { enumerate } from "../../utils/numbers";
import { RageEffect } from "./Rage";

const Conan = injectTestPC({
  name: "Conan",
  tokenUrl: "",
  abilities: [10, 10, 10, 10, 10, 10],
  race: { name: "Human", configs: { "Extra Language": "Orc" } },
  background: { name: "Folk Hero" },
  levels: enumerate(1, 11).map(() => ({ class: "Barbarian" })),
  configs: {
    "Primal Knowledge": [],
    "Ability Score Improvement (Barbarian 4)": {
      type: "ability",
      abilities: ["con", "con"],
    },
    "Ability Score Improvement (Barbarian 8)": {
      type: "ability",
      abilities: ["con", "con"],
    },
  },
  items: [],
});

describe("Relentless Rage", () => {
  it("should trigger when reduced below 1hp", async () => {
    const {
      g,
      combatants: [me, enemy],
    } = await setupBattleTest([Conan, 0, 0, 10], ["thug", 5, 0, 20]);

    me.hp = 2;
    await me.addEffect(RageEffect, { duration: Infinity });

    // always say Yes to Relentless Rage
    g.events.on("YesNoChoice", ({ detail: { interruption, resolve } }) => {
      if (interruption.title === "Relentless Rage") resolve(true);
    });

    g.dice.force(19, { type: "attack", who: enemy });
    g.dice.force(6, { type: "damage", attacker: enemy });
    g.dice.force(10, { type: "save", who: me });

    let lastSave: SaveEventDetail;
    g.events.on("Save", ({ detail }) => (lastSave = detail));

    const attack = g.getActions(enemy).find((a) => a.name === "Attack (mace)");
    expect(attack).toBeDefined();
    await g.act(attack!, { target: me });
    expect(lastSave!.dc).toBe(10);
    expect(me.hp).toBe(1);

    g.dice.force(19, { type: "attack", who: enemy });
    g.dice.force(1, { type: "save", who: me });

    const secondAttack = g
      .getActions(enemy)
      .find((a) => a.name === "Attack (mace)");
    expect(secondAttack).toBeDefined();
    await g.act(secondAttack!, { target: me });
    expect(lastSave!.dc).toBe(15);
    expect(me.hp).toBe(0);
  });
});

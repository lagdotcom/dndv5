import allPCs, { PCName } from "../data/allPCs";
import PCTemplate from "../data/PCTemplate";
import { AttackDetail } from "../events/AttackEvent";
import setupBattleTest from "../tests/setupBattleTest";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
allPCs.Stabby = {
  name: "Stabby",
  tokenUrl: "",
  abilities: [10, 11, 10, 10, 10, 10],
  background: { name: "Criminal" },
  race: { name: "Human", configs: { "Extra Language": "Gnomish" } },
  levels: [],
  items: [
    { name: "dagger", equip: true },
    { name: "dagger", equip: true },
  ],
  proficiencies: ["simple"],
} satisfies PCTemplate;

describe("TwoWeaponAttack", () => {
  it("should allow a two-weapon attack", async () => {
    const {
      g,
      combatants: [me, target],
    } = await setupBattleTest(
      ["Stabby" as PCName, 0, 5, 20],
      ["thug", 0, 0, 10],
    );

    let thing: AttackDetail | undefined;
    g.events.on("Attack", (event) => (thing = event.detail));

    const actions = g.getActions(me);
    const attack = actions.find((a) => a.name === "Attack (dagger)");

    expect(attack).toBeDefined();
    await g.act(attack!, { target });
    expect(thing?.pre.bonus.result).toBe(3);

    const actionsAfter = g.getActions(me);
    const second = actionsAfter.find(
      (a) => a.name === "Two-Weapon Attack (dagger)",
    );

    expect(second).toBeDefined();
    await g.act(second!, { target });
    expect(thing?.pre.bonus.result).toBe(2);
  });
});

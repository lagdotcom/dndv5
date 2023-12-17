import { injectTestPC } from "../data/allPCs";
import { AttackDetail } from "../events/AttackEvent";
import setupBattleTest from "../tests/setupBattleTest";

const Stabby = injectTestPC({
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
});

describe("TwoWeaponAttack", () => {
  it("should allow a two-weapon attack", async () => {
    const {
      g,
      combatants: [me, target],
    } = await setupBattleTest([Stabby, 0, 5, 20], ["thug", 0, 0, 10]);

    let detail: AttackDetail | undefined;
    g.events.on("Attack", (event) => (detail = event.detail));

    const actions = g.getActions(me);
    const attack = actions.find((a) => a.name === "Attack (dagger)");

    expect(attack).toBeDefined();
    await g.act(attack!, { target });
    expect(detail?.pre.bonus.result).toBe(3);

    const actionsAfter = g.getActions(me);
    const second = actionsAfter.find(
      (a) => a.name === "Two-Weapon Attack (dagger)",
    );

    expect(second).toBeDefined();
    await g.act(second!, { target });
    expect(detail?.pre.bonus.result).toBe(2);
  });
});

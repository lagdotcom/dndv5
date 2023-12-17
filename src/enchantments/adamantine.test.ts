import { injectTestPC } from "../data/allPCs";
import { AttackDetail } from "../events/AttackEvent";
import setupBattleTest from "../tests/setupBattleTest";

const Tank = injectTestPC({
  name: "Tank",
  tokenUrl: "",
  abilities: [10, 10, 10, 10, 10, 10],
  background: { name: "Soldier" },
  race: { name: "Human", configs: { "Extra Language": "Dwarven" } },
  levels: [],
  items: [{ name: "chain mail", equip: true, enchantments: ["adamantine"] }],
  proficiencies: ["heavy"],
});

describe("adamantine armor", () => {
  it("should prevent critical hits", async () => {
    const {
      g,
      combatants: [target, thug],
    } = await setupBattleTest([Tank, 0, 0, 0], ["thug", 0, 5, 20]);

    g.dice.force(20, { type: "attack", who: thug });
    const attack = g.getActions(thug).find((a) => a.name === "Attack (mace)");

    let detail: AttackDetail | undefined;
    g.events.on("Attack", (event) => (detail = event.detail));

    expect(attack).toBeDefined();
    await g.act(attack!, { target });

    expect(detail?.outcome.result).toBe("hit");
  });
});

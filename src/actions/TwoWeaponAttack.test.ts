import Engine from "../Engine";
import { AttackDetail } from "../events/AttackEvent";
import { Dagger } from "../items/weapons";
import Thug from "../monsters/Thug";
import PC from "../PC";
import setupBattleTest from "../tests/setupBattleTest";

class Stabby extends PC {
  constructor(g: Engine) {
    super(g, "Stabby", "");

    this.dex.score = 12;
    this.don(new Dagger(g, 1));
    this.don(new Dagger(g, 1));
    this.addProficiency("simple", "proficient");
  }
}

describe("TwoWeaponAttack", () => {
  it("should allow a two-weapon attack", async () => {
    const {
      g,
      combatants: [me, target],
    } = await setupBattleTest([Stabby, 0, 5, 20], [Thug, 0, 0, 10]);

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

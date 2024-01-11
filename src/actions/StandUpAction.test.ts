import ErrorCollector from "../collectors/ErrorCollector";
import BattleTemplate from "../data/BattleTemplate";
import Effect from "../Effect";
import { Prone } from "../effects";
import { thug } from "../tests/monsters";
import setupBattleTest from "../tests/setupBattleTest";
import { coSet } from "../types/ConditionName";
import StandUpAction from "./StandUpAction";

const stun = new Effect("Stunned", "turnStart", (g) => {
  g.events.on("GetConditions", ({ detail: { who, conditions } }) => {
    if (who.hasEffect(stun)) conditions.add("Stunned", stun);
  });
});

describe("StandUpAction", () => {
  const plan: BattleTemplate = {
    combatants: [thug(0, 0, 10)],
  };

  it("should calculate the correct cost based on actor's speed", async () => {
    const {
      g,
      combatants: [me],
    } = await setupBattleTest(plan);
    const action = new StandUpAction(g, me);

    expect(action.cost).toBe(15);
  });

  it("should check prerequisites for standing up", async () => {
    const {
      g,
      combatants: [me],
    } = await setupBattleTest(plan);
    const action = new StandUpAction(g, me);

    // not prone
    const ecStanding = action.check({}, new ErrorCollector());
    expect(ecStanding.result).toBeFalsy();

    // prone, should be ok
    await me.addEffect(Prone, { duration: Infinity });
    const ecProne = action.check({}, new ErrorCollector());
    expect(ecProne.result).toBeTruthy();

    // stunned prevents movement
    await me.addEffect(stun, {
      conditions: coSet("Stunned"),
      duration: Infinity,
    });
    const ecStunned = action.check({}, new ErrorCollector());
    expect(ecStunned.result).toBeFalsy();

    // already used too much movement
    await me.removeEffect(stun);
    me.movedSoFar += 20;
    const ecMoved = action.check({}, new ErrorCollector());
    expect(ecMoved.result).toBeFalsy();
  });

  it("should apply the Stand Up action", async () => {
    const {
      g,
      combatants: [me],
    } = await setupBattleTest(plan);
    await me.addEffect(Prone, { duration: Infinity });

    const action = new StandUpAction(g, me);
    await action.apply();

    expect(me.movedSoFar).toBe(15);
    expect(me.conditions.has("Prone")).toBe(false);
  });
});

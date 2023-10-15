import HealingRule from "../ai/HealingRule";
import { HasTargets } from "../configs";
import OGonrit from "../monsters/fiendishParty/OGonrit";
import Yulash from "../monsters/fiendishParty/Yulash";
import Zafron from "../monsters/fiendishParty/Zafron";
import { AIEvaluation } from "../types/AIRule";
import Combatant from "../types/Combatant";
import { isCombatantArray } from "../utils/types";
import setupBattleTest from "./setupBattleTest";

function matchConfig(evaluations: AIEvaluation[], targets: Combatant[]) {
  return evaluations.find((e) => {
    const config = e.config as HasTargets;

    if (!isCombatantArray(config.targets)) return false;
    if (config.targets.length !== targets.length) return false;
    for (const item of targets)
      if (!config.targets.includes(item)) return false;

    return true;
  });
}

describe("HealingRule", () => {
  const h = new HealingRule();

  it("O Gonrit shouldn't want to heal himself at full hp", async () => {
    const {
      g,
      combatants: [me],
    } = await setupBattleTest([OGonrit, 0, 0, 10]);

    const v = h.evaluate(g, me, g.getActions(me));
    expect(v).toHaveLength(1);
    expect(v[0].score.result).toBeLessThan(0);
  });

  it("O Gonrit prefers healing others, or healing more", async () => {
    const {
      g,
      combatants: [me, ally],
    } = await setupBattleTest([OGonrit, 0, 0, 10], [Zafron, 5, 0, 1]);
    me.hp -= 20;
    ally.hp -= 30;

    const v = h.evaluate(g, me, g.getActions(me));

    const healMe = matchConfig(v, [me]);
    const healBoth = matchConfig(v, [me, ally]);
    const healThem = matchConfig(v, [ally]);
    expect(healMe).toBeDefined();
    expect(healBoth).toBeDefined();
    expect(healThem).toBeDefined();

    expect(healMe!.score.result).toBeLessThan(healThem!.score.result);
    expect(healThem!.score.result).toBeLessThan(healBoth!.score.result);
  });

  it("O Gonrit prefers effective healing to over healing", async () => {
    const {
      g,
      combatants: [me, ally, hurt],
    } = await setupBattleTest(
      [OGonrit, 0, 0, 10],
      [Zafron, 5, 0, 1],
      [Yulash, 10, 0, 1],
    );
    ally.hp -= 2;
    hurt.hp -= 20;

    const v = h.evaluate(g, me, g.getActions(me));

    const healLess = matchConfig(v, [ally]);
    const healMore = matchConfig(v, [hurt]);
    const healBoth = matchConfig(v, [ally, hurt]);
    expect(healLess).toBeDefined();
    expect(healMore).toBeDefined();
    expect(healBoth).toBeDefined();

    expect(healLess!.score.result).toBeLessThan(healMore!.score.result);
    expect(healMore!.score.result).toBeLessThan(healBoth!.score.result);
  });
});

import WeaponAttack from "../actions/WeaponAttack";
import DamageRule from "../ai/DamageRule";
import HealingRule from "../ai/HealingRule";
import { HasTarget, HasTargets } from "../configs";
import Engine from "../Engine";
import Badger from "../monsters/Badger";
import Kay from "../monsters/fiendishParty/Kay";
import OGonrit from "../monsters/fiendishParty/OGonrit";
import Yulash from "../monsters/fiendishParty/Yulash";
import Zafron from "../monsters/fiendishParty/Zafron";
import Aura from "../pcs/davies/Aura";
import Beldalynn from "../pcs/davies/Beldalynn";
import Hagrond from "../pcs/davies/Hagrond";
import AIRule, { ActionEvaluation } from "../types/AIRule";
import Combatant from "../types/Combatant";
import { getAllEvaluations } from "../utils/ai";
import { checkConfig } from "../utils/config";
import { isCombatantArray } from "../utils/types";
import { distanceTo } from "../utils/units";
import setupBattleTest from "./setupBattleTest";

function getRuleActions(g: Engine, rule: AIRule, me: Combatant) {
  return rule.evaluateActions!(g, me, g.getActions(me)).filter((o) =>
    checkConfig(g, o.action, o.config),
  );
}

function matchConfigTargets(
  evaluations: ActionEvaluation[],
  targets: Combatant[],
) {
  return evaluations.find((e) => {
    const config = e.config as HasTargets;

    if (!isCombatantArray(config.targets)) return false;
    if (config.targets.length !== targets.length) return false;
    for (const item of targets)
      if (!config.targets.includes(item)) return false;

    return true;
  });
}

function matchConfigTarget(evaluations: ActionEvaluation[], target: Combatant) {
  return evaluations.find((e) => (e.config as HasTarget).target === target);
}

describe("HealingRule", () => {
  const R = new HealingRule();

  it("O Gonrit shouldn't want to heal himself at full hp", async () => {
    const {
      g,
      combatants: [me],
    } = await setupBattleTest([OGonrit, 0, 0, 10]);

    const v = getRuleActions(g, R, me);
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

    const v = getRuleActions(g, R, me);

    const healMe = matchConfigTargets(v, [me]);
    const healBoth = matchConfigTargets(v, [me, ally]);
    const healThem = matchConfigTargets(v, [ally]);
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

    const v = getRuleActions(g, R, me);

    const healLess = matchConfigTargets(v, [ally]);
    const healMore = matchConfigTargets(v, [hurt]);
    const healBoth = matchConfigTargets(v, [ally, hurt]);
    expect(healLess).toBeDefined();
    expect(healMore).toBeDefined();
    expect(healBoth).toBeDefined();

    expect(healLess!.score.result).toBeLessThan(healMore!.score.result);
    expect(healMore!.score.result).toBeLessThan(healBoth!.score.result);
  });
});

describe("DamageRule", () => {
  const R = new DamageRule();

  it("O Gonrit finds enemies he can damage", async () => {
    const {
      g,
      combatants: [me, far, close],
    } = await setupBattleTest(
      [OGonrit, 0, 0, 10],
      [Aura, 140, 0, 1],
      [Hagrond, 10, 10, 1],
    );

    const v = getRuleActions(g, R, me);

    const hitAura = matchConfigTarget(v, far);
    const hitHagrond = matchConfigTarget(v, close);
    expect(hitAura).toBeUndefined();
    expect(hitHagrond).toBeDefined();
  });

  it("Hagrond prefers causing more damage", async () => {
    const {
      g,
      combatants: [me, badger, oGonrit],
    } = await setupBattleTest(
      [Hagrond, 0, 0, 10],
      [Badger, 5, 0, 1],
      [OGonrit, 0, 5, 1],
    );
    me.movedSoFar = me.speed;

    const v = getRuleActions(g, R, me);

    const weaponName = "spear of the dark sun";
    const hitBadger = v.find(
      ({ action, config }) =>
        (action as WeaponAttack).weapon?.name === weaponName &&
        (config as HasTarget).target === badger,
    );
    const hitFiend = v.find(
      ({ action, config }) =>
        (action as WeaponAttack).weapon?.name === weaponName &&
        (config as HasTarget).target === oGonrit,
    );
    expect(hitBadger).toBeDefined();
    expect(hitFiend).toBeDefined();

    expect(hitBadger!.score.result).toBeLessThan(hitFiend!.score.result);
  });
});

describe("getAllEvaluations", () => {
  it("O Gonrit wants to stay near allies", async () => {
    const {
      g,
      combatants: [me, zafron, kay],
    } = await setupBattleTest(
      [OGonrit, 0, 0, 10],
      [Zafron, 35, 0, 1],
      [Kay, 60, 0, 1],
      [Hagrond, 10, 0, 1],
      [Beldalynn, 0, 10, 1],
    );

    const { bestPositions } = Array.from(getAllEvaluations(g, me)).sort(
      (a, b) => b.best - a.best,
    )[0];

    const allies = [zafron, kay];
    for (const point of bestPositions) {
      for (const ally of allies) {
        expect(distanceTo(ally, point)).toBeLessThanOrEqual(30);
      }
    }
  });
});

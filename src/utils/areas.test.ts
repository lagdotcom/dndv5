import { aimCone, aimLine } from "../aim";
import PointSet from "../PointSet";
import Combatant from "../types/Combatant";
import Point from "../types/Point";
import { getBoundingBox, resolveArea } from "./areas";

const p = (x: number, y: number): Point => ({ x, y });

const sh = (raw: string) => raw.slice(1);

function convertToShape(set: PointSet) {
  const { x: left, y: top, w, h } = getBoundingBox(set);

  const lines: string[] = [];
  for (let y = 0; y <= top + h; y += 5) {
    let line = "";
    for (let x = 0; x <= left + w; x += 5) line += set.has(p(x, y)) ? "x" : ".";

    lines.push(line);
  }

  return lines.join("\n");
}

const sphere10 = sh(`
.xx.
xxxx
xxxx
.xx.`);
it("can calculate a 10' sphere properly", () => {
  const actual = resolveArea({ type: "sphere", radius: 10, centre: p(10, 10) });
  expect(convertToShape(actual)).toEqual(sphere10);
});

const sphere15 = sh(`
.xxxx.
xxxxxx
xxxxxx
xxxxxx
xxxxxx
.xxxx.`);
it("can calculate a 15' sphere properly", () => {
  const actual = resolveArea({ type: "sphere", radius: 15, centre: p(15, 15) });
  expect(convertToShape(actual)).toEqual(sphere15);
});

const within5m = sh(`
.xxx
.xxx
.xxx`);
it("can calculate a 5' within medium properly", () => {
  const actual = resolveArea({
    type: "within",
    radius: 5,
    who: { position: p(10, 5), sizeInUnits: 5 } as Combatant,
  });
  expect(convertToShape(actual)).toEqual(within5m);
});

const within5l = sh(`
.xxxx
.xxxx
.xxxx
.xxxx`);
it("can calculate a 5' within large properly", () => {
  const actual = resolveArea({
    type: "within",
    radius: 5,
    who: { position: p(10, 5), sizeInUnits: 10 } as Combatant,
  });
  expect(convertToShape(actual)).toEqual(within5l);
});

const cone15s = sh(`
...
.x.
.x.
xxx`);
it("can calculate a 15' cone properly", () => {
  const actual = resolveArea(aimCone(p(5, 0), 5, p(5, 10), 15));
  expect(convertToShape(actual)).toEqual(cone15s);
});

const cone25n = sh(`
xxxxx
.xxx.
.xxx.
..x..
..x..`);
it("can calculate a 25' cone properly", () => {
  const actual = resolveArea(aimCone(p(10, 25), 5, p(10, 0), 25));
  expect(convertToShape(actual)).toEqual(cone25n);
});

const line1 = sh(`
.
x
x
x
x`);
it("can calculate a 20' cardinal line properly", () => {
  const actual = resolveArea(aimLine(p(0, 0), 5, p(0, 10), 20, 5));
  expect(convertToShape(actual)).toEqual(line1);
});

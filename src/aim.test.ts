import { getAimOffset } from "./aim";
import Point from "./types/Point";

const p = (x: number, y: number): Point => ({ x, y });

it("calculates each octant properly", () => {
  const a = p(10, 10);

  expect(getAimOffset(a, p(20, 10))).toMatchObject(p(1, 0.5));
  expect(getAimOffset(a, p(20, 20))).toMatchObject(p(1, 1));
  expect(getAimOffset(a, p(10, 20))).toMatchObject(p(0.5, 1));
  expect(getAimOffset(a, p(0, 20))).toMatchObject(p(0, 1));
  expect(getAimOffset(a, p(0, 10))).toMatchObject(p(0, 0.5));
  expect(getAimOffset(a, p(0, 0))).toMatchObject(p(0, 0));
  expect(getAimOffset(a, p(10, 0))).toMatchObject(p(0.5, 0));
  expect(getAimOffset(a, p(20, 0))).toMatchObject(p(1, 0));
});

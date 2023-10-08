import Point from "../types/Point";
import { convertSizeToUnit, getDistanceBetween } from "./units";

const p = (x: number, y: number): Point => ({ x, y });

const Medium = convertSizeToUnit("medium");
const Large = convertSizeToUnit("large");
const Huge = convertSizeToUnit("huge");

it("can calculate distances between units correctly", () => {
  expect(getDistanceBetween(p(0, 0), Medium, p(5, 0), Medium)).toBe(5);
  expect(getDistanceBetween(p(0, 0), Medium, p(5, 5), Medium)).toBe(5);

  expect(getDistanceBetween(p(0, 0), Medium, p(15, 0), Medium)).toBe(15);

  expect(getDistanceBetween(p(0, 0), Large, p(15, 0), Medium)).toBe(10);
  expect(getDistanceBetween(p(10, 0), Huge, p(15, 15), Large)).toBe(5);
});

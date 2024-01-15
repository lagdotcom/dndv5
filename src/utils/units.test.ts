import { Feet } from "../flavours";
import Point from "../types/Point";
import SizeCategory from "../types/SizeCategory";
import { convertSizeToUnit, getDistanceBetween } from "./units";

const p = (x: Feet, y: Feet): Point => ({ x, y });

const Medium = convertSizeToUnit(SizeCategory.Medium);
const Large = convertSizeToUnit(SizeCategory.Large);
const Huge = convertSizeToUnit(SizeCategory.Huge);

it("can calculate distances between units correctly", () => {
  expect(getDistanceBetween(p(0, 0), Medium, p(5, 0), Medium)).toBe(5);
  expect(getDistanceBetween(p(0, 0), Medium, p(5, 5), Medium)).toBe(5);

  expect(getDistanceBetween(p(0, 0), Medium, p(15, 0), Medium)).toBe(15);

  expect(getDistanceBetween(p(0, 0), Large, p(15, 0), Medium)).toBe(10);
  expect(getDistanceBetween(p(10, 0), Huge, p(15, 15), Large)).toBe(5);
});

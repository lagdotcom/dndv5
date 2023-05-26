import { ordinal } from "./numbers";

it("can do ordinals properly", () => {
  const data = new Map([
    [1, "1st"],
    [2, "2nd"],
    [3, "3rd"],
    [4, "4th"],
    [5, "5th"],
    [0, "0th"],
    [10, "10th"],
    [11, "11th"],
    [12, "12th"],
    [13, "13th"],
    [21, "21st"],
    [22, "22nd"],
    [23, "23rd"],
    [100, "100th"],
  ]);

  for (const [value, want] of data) expect(ordinal(value)).toBe(want);
});

import { Feet } from "../flavours";

const FEET_PER_MILE: Feet = 5280;

export const miles = (n: Feet) => n * FEET_PER_MILE;

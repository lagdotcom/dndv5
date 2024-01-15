import { Turns } from "../flavours";

const TURNS_PER_MINUTE: Turns = 10;

export const minutes = (n: number): Turns => n * TURNS_PER_MINUTE;
export const hours = (n: number) => minutes(n * 60);

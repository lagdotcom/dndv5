const TURNS_PER_MINUTE = 10;

export const minutes = (n: number) => n * TURNS_PER_MINUTE;
export const hours = (n: number) => minutes(n * 60);

export function getAbilityBonus(ability: number) {
  return Math.floor((ability - 10) / 2);
}

export function getDiceAverage(count: number, size: number) {
  return ((size + 1) / 2) * count;
}

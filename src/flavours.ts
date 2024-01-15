// https://spin.atomicobject.com/typescript-flexible-nominal-typing/
interface Flavoring<FlavorT> {
  _type?: FlavorT;
}
type Flavor<T, FlavorT> = T & Flavoring<FlavorT>;

export type ClassName = Flavor<string, "ClassName">;
export type Color = Flavor<string, "Color">;
export type Description = Flavor<string, "Description">;
export type ErrorMessage = Flavor<string, "ErrorMessage">;
export type Html = Flavor<string, "Html">;
export type Url = Flavor<string, "Url">;

export type ArmorClass = Flavor<number, "ArmorClass">;
export type ChallengeRating = Flavor<number, "ChallengeRating">;
export type CombatantID = Flavor<number, "CombatantID">;
export type DiceCount = Flavor<number, "DiceCount">;
export type DiceRoll = Flavor<number, "DiceRoll">;
export type DiceSize = Flavor<number, "DiceSize">;
export type DifficultyClass = Flavor<number, "DifficultyClass">;
export type EffectID = Flavor<number, "EffectID">;
export type Exhaustion = Flavor<number, "Exhaustion">;
export type Feet = Flavor<number, "Feet">;
export type Hands = Flavor<number, "Hands">;
export type HitPoints = Flavor<number, "HitPoints">;
export type ModifiedDiceRoll = Flavor<number, "ModifiedDiceRoll">;
export type Modifier = Flavor<number, "Modifier">;
export type Multiplier = Flavor<number, "Multiplier">;
export type PCClassLevel = Flavor<number, "PCClassLevel">;
export type PCLevel = Flavor<number, "PCLevel">;
export type Pixels = Flavor<number, "Pixels">;
export type Quantity = Flavor<number, "Quantity">;
export type Score = Flavor<number, "Score">;
export type SideID = Flavor<number, "SideID">;
export type SpellSlot = Flavor<number, "SpellSlot">;
export type Turns = Flavor<number, "Turns">;

import Engine from "./Engine";
import Combatant from "./types/Combatant";
import CreatureType from "./types/CreatureType";
import SizeCategory from "./types/SizeCategory";
import { getAbilityBonus } from "./utils/dnd";
import { convertSizeToUnit } from "./utils/units";

export default abstract class AbstractCombatant implements Combatant {
  hp: number;
  strScore: number;
  dexScore: number;
  conScore: number;
  intScore: number;
  wisScore: number;
  chaScore: number;

  constructor(
    public g: Engine,
    public name: string,
    public type: CreatureType,
    public size: SizeCategory,
    public img: string,
    public side: number,
    public diesAtZero: boolean
  ) {
    this.strScore = 10;
    this.dexScore = 10;
    this.conScore = 10;
    this.intScore = 10;
    this.wisScore = 10;
    this.chaScore = 10;
    this.hp = 0;
  }

  get str() {
    return getAbilityBonus(this.strScore);
  }
  get dex() {
    return getAbilityBonus(this.dexScore);
  }
  get con() {
    return getAbilityBonus(this.conScore);
  }
  get int() {
    return getAbilityBonus(this.intScore);
  }
  get wis() {
    return getAbilityBonus(this.wisScore);
  }
  get cha() {
    return getAbilityBonus(this.chaScore);
  }

  get ac() {
    return 10 + this.dex;
  }

  get sizeInUnits() {
    return convertSizeToUnit(this.size);
  }
}

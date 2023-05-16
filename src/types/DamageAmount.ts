import Amount from "./Amount";
import DamageType from "./DamageType";

type DamageAmount = Amount & { damage: DamageType };
export default DamageAmount;

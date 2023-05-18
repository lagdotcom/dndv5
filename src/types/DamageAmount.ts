import Amount from "./Amount";
import DamageType from "./DamageType";

type DamageAmount = Amount & { damageType: DamageType };
export default DamageAmount;

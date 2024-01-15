import { ArmorClass } from "../flavours";
import Item from "./Item";
import Source from "./Source";

export default interface ACMethod extends Source {
  ac: ArmorClass;
  uses: Set<Item>;
}

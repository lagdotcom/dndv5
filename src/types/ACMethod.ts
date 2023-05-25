import Item from "./Item";
import Source from "./Source";

export default interface ACMethod extends Source {
  ac: number;
  uses: Set<Item>;
}

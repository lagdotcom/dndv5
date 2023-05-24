import Item from "./Item";

export default interface ACMethod {
  name: string;
  ac: number;
  uses: Set<Item>;
}

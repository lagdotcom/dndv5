import Item from "./Item";

interface ACMethod {
  name: string;
  ac: number;
  uses: Set<Item>;
}
export default ACMethod;

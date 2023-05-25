import Feature from "./Feature";
import PCClassName from "./PCClassName";
import Source from "./Source";

export default interface PCSubclass extends Source {
  className: PCClassName;
  features: Map<number, Feature[]>;
}

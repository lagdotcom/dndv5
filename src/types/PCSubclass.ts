import Feature from "./Feature";
import PCClassName from "./PCClassName";

export default interface PCSubclass {
  className: PCClassName;
  name: string;
  features: Map<number, Feature[]>;
}

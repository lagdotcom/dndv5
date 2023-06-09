import Source from "./Source";

export default interface SumCollector<T> {
  add(value: T, source: Source): void;
  ignore(source: Source): void;
  involved(source: Source): boolean;

  result: T;
}

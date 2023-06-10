import Source from "./Source";

export default interface Collector<TValue, TResult = TValue> {
  add(value: TValue, source: Source): void;
  ignore(source: Source): void;
  ignoreValue(value: TValue): void;
  isInvolved(source: Source): boolean;

  result: TResult;
}

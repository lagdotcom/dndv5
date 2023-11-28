type Gain<T> =
  | { type: "static"; value: T }
  | { type: "choice"; amount: number; set: Set<T> };
export default Gain;

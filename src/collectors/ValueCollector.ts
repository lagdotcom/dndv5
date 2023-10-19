type Prefer = "higher" | "lower";

type Comparator = (oldValue: number, newValue: number) => boolean;

const comparators: Record<Prefer, Comparator> = {
  higher: (o, n) => n > o,
  lower: (o, n) => n < o,
};

export default class ValueCollector {
  others: number[];

  constructor(public final: number) {
    this.others = [];
  }

  add(value: number, prefer: Prefer) {
    const comparator = comparators[prefer];

    if (comparator(this.final, value)) {
      this.others.push(this.final);
      this.final = value;
    } else this.others.push(value);
  }
}

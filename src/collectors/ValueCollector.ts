type Prefer = "higher" | "lower";

type Comparator = (oldValue: number, newValue: number) => boolean;

const comparators: Record<Prefer, Comparator> = {
  higher: (o, n) => n > o,
  lower: (o, n) => n < o,
};

export default class ValueCollector<T extends number = number> {
  others: T[];

  constructor(public final: T) {
    this.others = [];
  }

  add(value: T, prefer: Prefer) {
    const comparator = comparators[prefer];

    if (comparator(this.final, value)) this.replace(value);
    else this.others.push(value);
  }

  replace(value: T) {
    this.others.push(this.final);
    this.final = value;
  }
}

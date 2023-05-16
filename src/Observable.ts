type ChangedCallback<T> = (value: T) => void;

export default class Observable<T> {
  private listeners: Set<ChangedCallback<T>>;

  constructor(private _value: T) {
    this.listeners = new Set();
  }

  on(cb: ChangedCallback<T>) {
    this.listeners.add(cb);
  }

  off(cb: ChangedCallback<T>) {
    this.listeners.delete(cb);
  }

  get value() {
    return this._value;
  }

  set(value: T) {
    this._value = value;
    for (const l of this.listeners) l(value);
  }

  setter(value: T) {
    return () => this.set(value);
  }
}

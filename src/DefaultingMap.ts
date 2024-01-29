import { MapInitialiser } from "./utils/map";

export default class DefaultingMap<K, V> extends Map<K, V> {
  constructor(
    private makeDefault: (key: K) => V,
    data?: MapInitialiser<K, V>,
  ) {
    super(data);
  }

  /**
   * @returns {V} Returns the element associated with the specified key. If no element is associated with the specified key, a new one is generated.
   */
  get(key: K): V {
    const value = super.get(key);
    if (typeof value !== "undefined") return value;

    const replacement = this.makeDefault(key);
    this.set(key, replacement);
    return replacement;
  }
}

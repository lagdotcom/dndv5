import Observable from "./Observable";
import { getStylePropertyNumber, px } from "./utils/dom";

export default class CssSizeVariable extends Observable<number> {
  constructor(public key: string, defaultValue: number) {
    super(getStylePropertyNumber(key, defaultValue));
  }

  set(value: number): void {
    document.documentElement.style.setProperty(this.key, px(value));
    super.set(value);
  }
}

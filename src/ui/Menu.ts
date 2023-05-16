import Engine from "../Engine";
import { configure, make, px } from "../utils/dom";
import styles from "./Menu.module.scss";

export default class Menu<T> {
  element: HTMLMenuElement;
  empty: HTMLDivElement;
  list: HTMLLIElement[];

  constructor(public g: Engine, private onClick: (value: T) => void) {
    this.element = configure(make("menu"), { className: styles.main });
    this.empty = this.element.appendChild(
      configure(make("div"), { textContent: "(empty)" })
    );
    this.list = [];
    this.hide();

    g.container.appendChild(this.element);
  }

  show(x: number, y: number) {
    this.element.style.display = "";
    this.element.style.left = px(x);
    this.element.style.top = px(y);
  }

  hide() {
    this.element.style.display = "none";
  }

  clear() {
    for (const el of this.list) this.element.removeChild(el);
    this.list = [];
    this.empty.style.display = "block";
  }

  add(label: string, value: T) {
    const li = this.element.appendChild(make("li"));
    li.appendChild(
      configure(
        make("button"),
        { textContent: label },
        { click: () => this.onClick(value) }
      )
    );

    this.list.push(li);
    this.empty.style.display = "none";
  }
}

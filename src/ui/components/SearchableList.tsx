import { JSXInternal } from "preact/src/jsx";

import { useMemo, useState } from "../lib";
import classnames from "../utils/classnames";
import buttonStyles from "./button.module.scss";
import styles from "./SearchableList.module.scss";

export interface ListItem<T extends string> {
  component: JSXInternal.Element;
  value: T;
}

interface Props<T extends string> {
  items: ListItem<T>[];
  value?: T;
  setValue(value: T): void;
  maxResults?: number;
}

export default function SearchableList<T extends string>({
  items,
  value,
  setValue,
  maxResults = 40,
}: Props<T>) {
  const [search, setSearch] = useState("");

  const { matches, message } = useMemo(() => {
    const found = search
      ? items.filter((x) => x.value.includes(search))
      : items;
    const matches = found.slice(0, maxResults);
    const message =
      matches.length < found.length
        ? `...and ${found.length - matches.length} more...`
        : undefined;
    return { matches, message };
  }, [items, maxResults, search]);

  return (
    <div>
      <input
        type="search"
        value={search}
        onInput={(e) => setSearch(e.currentTarget.value)}
      />
      <ul className={styles.list}>
        {matches.map((item) => (
          <li key={item.value}>
            <button
              className={classnames({
                [buttonStyles.active]: item.value === value,
              })}
              onClick={() => setValue(item.value)}
            >
              {item.component}
            </button>
          </li>
        ))}
      </ul>
      {message && <div>{message}</div>}
    </div>
  );
}

import { useMemo, useState } from "../lib";
import classnames from "../utils/classnames";
import buttonStyles from "./button.module.scss";

interface Props<T extends string> {
  items: T[];
  value?: T;
  setValue(value: T): void;
  maxResults?: number;
}

export default function SearchableList<T extends string>({
  items,
  value,
  setValue,
  maxResults = 10,
}: Props<T>) {
  const [search, setSearch] = useState("");

  const { matches, message } = useMemo(() => {
    const found = search ? items.filter((x) => x.includes(search)) : items;
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
      <ul>
        {matches.map((item) => (
          <li key={item}>
            <button
              className={classnames({ [buttonStyles.active]: item === value })}
              onClick={() => setValue(item)}
            >
              {item}
            </button>
          </li>
        ))}
        {message && <li>{message}</li>}
      </ul>
    </div>
  );
}

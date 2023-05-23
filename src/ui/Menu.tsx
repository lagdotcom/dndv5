import Labelled from "./Labelled";
import styles from "./Menu.module.scss";

export type MenuItem<T> = { label: string; value: T; disabled?: boolean };

interface Props<T> {
  caption: string;
  items: MenuItem<T>[];
  onClick(item: T): void;
  x: number;
  y: number;
}

export default function Menu<T>({ caption, items, onClick, x, y }: Props<T>) {
  return (
    <menu className={styles.main} style={{ left: x, top: y }}>
      <Labelled label={caption}>
        {items.length === 0 ? (
          <div>(empty)</div>
        ) : (
          items.map(({ label, value, disabled }) => (
            <button
              role="menuitem"
              key={label}
              disabled={disabled}
              onClick={() => onClick(value)}
            >
              {label}
            </button>
          ))
        )}
      </Labelled>
    </menu>
  );
}

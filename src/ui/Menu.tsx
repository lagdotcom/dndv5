import styles from "./Menu.module.scss";

export type MenuItem<T> = { label: string; value: T; disabled?: boolean };

interface Props<T> {
  items: MenuItem<T>[];
  onClick(item: T): void;
  x: number;
  y: number;
}

export default function Menu<T>({ items, onClick, x, y }: Props<T>) {
  return (
    <menu className={styles.main} style={{ left: x, top: y }}>
      {items.length === 0 ? (
        <div>(empty)</div>
      ) : (
        items.map(({ label, value, disabled }) => (
          <li key={label}>
            <button disabled={disabled} onClick={() => onClick(value)}>
              {label}
            </button>
          </li>
        ))
      )}
    </menu>
  );
}

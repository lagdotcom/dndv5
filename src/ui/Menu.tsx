import styles from "./Menu.module.scss";

interface Props<T> {
  items: { label: string; value: T }[];
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
        items.map(({ label, value }) => (
          <li key={label}>
            <button onClick={() => onClick(value)}>{label}</button>
          </li>
        ))
      )}
    </menu>
  );
}

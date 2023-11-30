import Labelled from "./Labelled";
import styles from "./Menu.module.scss";

export interface MenuItem<T> {
  label: string;
  value: T;
  disabled?: boolean;
  className?: string;
}

export interface MenuProps<T> {
  caption: string;
  items: MenuItem<T>[];
  onClick(item: T): void;
  x: number;
  y: number;
}

export default function Menu<T>({
  caption,
  items,
  onClick,
  x,
  y,
}: MenuProps<T>) {
  return (
    <menu className={styles.main} style={{ left: x, top: y }}>
      <Labelled label={caption} contentsClass={styles.sub}>
        {items.length === 0 ? (
          <div>(empty)</div>
        ) : (
          items.map(({ label, value, disabled, className }) => (
            <button
              role="menuitem"
              key={label}
              disabled={disabled}
              className={className}
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

import { ActionIcon } from "../types/Action";
import styles from "./IconButton.module.scss";

interface Props {
  alt: string;
  icon: ActionIcon;
  size?: number;
  sub?: ActionIcon;
  subSize?: number;

  onClick(): void;
}

export default function IconButton({
  onClick,
  alt,
  icon,
  size = 48,
  sub,
  subSize = 24,
}: Props) {
  return (
    <button
      className={styles.main}
      style={{ width: size, height: size }}
      onClick={onClick}
      title={alt}
      aria-label={alt}
    >
      <div
        className={styles.image}
        aria-hidden={true}
        style={{
          width: size,
          height: size,
          backgroundImage: `url(${icon.url})`,
          filter: icon.colour,
        }}
      />
      {sub && (
        <div
          className={styles.sub}
          aria-hidden={true}
          style={{
            width: subSize,
            height: subSize,
            backgroundImage: `url(${sub.url})`,
            filter: sub.colour,
          }}
        />
      )}
    </button>
  );
}

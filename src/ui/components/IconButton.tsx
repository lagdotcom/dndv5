import Icon from "../../types/Icon";
import styles from "./IconButton.module.scss";
import SVGIcon from "./SVGIcon";

interface Props {
  alt: string;
  disabled?: boolean;
  icon: Icon;
  size?: number;
  sub?: Icon;
  subSize?: number;

  onClick(): void;
}

export default function IconButton({
  onClick,
  alt,
  disabled,
  icon,
  size = 48,
  sub,
  subSize = 24,
}: Props) {
  return (
    <button
      className={styles.main}
      disabled={disabled}
      style={{ width: size, height: size }}
      onClick={onClick}
      title={alt}
      aria-label={alt}
    >
      <SVGIcon
        className={styles.image}
        src={icon.url}
        size={size}
        color={icon.colour}
      />
      {sub && (
        <SVGIcon
          className={styles.sub}
          src={sub.url}
          size={subSize}
          color={sub.colour}
        />
      )}
    </button>
  );
}

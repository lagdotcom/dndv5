import { Url } from "../../flavours";
import styles from "./CombatantTile.module.scss";

interface Props {
  name: string;
  tokenUrl: Url;
}

export default function CombatantTile({ name, tokenUrl }: Props) {
  return (
    <figure className={styles.tile}>
      <img className={styles.image} src={tokenUrl} alt={name} />
      <figcaption className={styles.caption}>{name}</figcaption>
    </figure>
  );
}

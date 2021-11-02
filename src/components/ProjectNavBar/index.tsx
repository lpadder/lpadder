import styles from "./index.module.scss";
import { Link } from "react-router-dom";

export default function ProjectNavBar () {
  return (
    <div className={styles.container}>
      <Link to="edit">
        <button className={styles.button}>Edit</button>
      </Link>
      <Link to="play">
        <button className={styles.button}>Play</button>
      </Link>
      <Link to="informations">
        <button className={styles.button}>Infomations</button>
      </Link>
    </div>
  );
}
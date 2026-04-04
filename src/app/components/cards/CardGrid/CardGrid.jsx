
import CardItem from "../CardItem/CardItems";
import styles from "./CardGrid.module.css";

export default function CardGrid({ cards }) {
  return (
    <div className={styles.grid}>
      {cards.map((card) => (
        <CardItem key={card.id} card={card} />
      ))}
    </div>
  );
}
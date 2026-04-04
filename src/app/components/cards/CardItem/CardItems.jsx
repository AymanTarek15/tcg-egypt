import Link from "next/link";
import styles from "./CardItem.module.css";

export default function CardItem({ card }) {
  return (
    <article className={styles.card}>
      <div className={styles.imageWrap}>
        <img
          src={card.main_image || card.images?.[0]?.image_url}
          alt={card.name}
          className={styles.image}
        />
      </div>

      <div className={styles.info}>
        <h3>{card.name}</h3>
        <p>{card.human_readable_card_type || card.card_type}</p>

        <small className={styles.rarity}>
          Listed: {card.listing_count || 0} times
        </small>

        {card.avg_price && (
          <div>
            <small>Avg: {card.avg_price} EGP</small>
          </div>
        )}

        <div className={styles.bottom}>
          <Link href={`/cards/${card.slug}`}>View</Link>
        </div>
      </div>
    </article>
  );
}
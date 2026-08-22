import Link from "next/link";
import styles from "./CardItem.module.css";

export default function CardItem({ card }) {
  const count = card.listing_count || 0;
  const hasListings = count > 0;

  return (
    <article className={styles.card}>
      <Link href={`/cards/${card.slug}`} className={styles.imageLink}>
        <div className={styles.imageWrap}>
          <img
            src={card.main_image || card.images?.[0]?.image_url}
            alt={card.name}
            className={styles.image}
            loading="lazy"
          />
        </div>
      </Link>

      <div className={styles.info}>
        <h3 className={styles.name} title={card.name}>
          {card.name}
        </h3>
        <p className={styles.type}>
          {card.human_readable_card_type || card.card_type}
        </p>

        <div className={styles.meta}>
          {hasListings ? (
            <span className={styles.forSale}>
              {count} for sale
            </span>
          ) : (
            <span className={styles.none}>Not listed yet</span>
          )}

          {hasListings && card.avg_price && (
            <span className={styles.price}>~{card.avg_price} EGP</span>
          )}
        </div>

        <Link href={`/cards/${card.slug}`} className={styles.viewBtn}>
          {hasListings ? "View listings" : "View card"}
        </Link>
      </div>
    </article>
  );
}

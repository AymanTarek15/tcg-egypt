import Container from "../components/layout/Container/Container";
import Link from "next/link";
import styles from "./ListingsPage.module.css";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

async function getListings() {
  try {
    const res = await fetch(`${API_BASE}/api/cards/listings/?is_sold=false`, {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Failed to fetch listings");
    }

    return await res.json();
  } catch (error) {
    console.error("Listings fetch error:", error);
    return null;
  }
}

export default async function ListingsPage() {
  const data = await getListings();

  const listings = data?.results || data || [];

  return (
    <section className={styles.page}>
      <Container>
        <div className={styles.header}>
          <h1>Listed Cards</h1>
          <p>Browse Yu-Gi-Oh cards listed by sellers on TCG Egypt.</p>
        </div>

        {!listings.length ? (
          <div className={styles.empty}>
            <h2>No listings yet</h2>
            <p>Be the first to list a card.</p>
            <Link href="/sell" className={styles.sellBtn}>
              List a Card
            </Link>
          </div>
        ) : (
          <div className={styles.grid}>
            {listings.map((listing) => (
              <Link
                href={`/listings/${listing.slug}`}
                key={listing.id}
                className={styles.card}
              >
                <div className={styles.imageWrap}>
                  <img
                    src={listing.image_url}
                    alt={listing.name}
                    className={styles.image}
                  />
                </div>

                <div className={styles.content}>
                  <h2>{listing.name}</h2>

                  <div className={styles.meta}>
                    <span>{listing.set_code}</span>
                    <span>{listing.rarity || "Unknown rarity"}</span>
                    <span>{listing.condition}</span>
                  </div>

                  <div className={styles.footer}>
                    <strong>{listing.price} EGP</strong>
                    <small>Seller: {listing.seller_username}</small>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </Container>
    </section>
  );
}